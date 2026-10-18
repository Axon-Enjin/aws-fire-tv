package com.formvision.coach.pose

import android.content.Context
import android.content.pm.PackageManager
import android.view.Surface
import android.os.SystemClock
import android.util.Log
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.core.resolutionselector.ResolutionSelector
import androidx.camera.core.resolutionselector.ResolutionStrategy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.google.mediapipe.framework.image.BitmapImageBuilder
import com.google.mediapipe.tasks.core.BaseOptions
import com.google.mediapipe.tasks.core.Delegate
import com.google.mediapipe.tasks.vision.core.ImageProcessingOptions
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarker
import com.google.mediapipe.tasks.vision.poselandmarker.PoseLandmarkerResult
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/** One emitted pose: normalised keypoints, flat [x, y, z, visibility] × 33 (BlazePose order). */
class PoseFrameData(val t: Long, val w: Int, val h: Int, val kp: FloatArray, val inferMs: Long)

interface PoseListener {
  fun onPose(frame: PoseFrameData)
  fun onError(code: String, message: String)
}

/**
 * Owns the camera and the pose model. Frames stay inside this class: only landmarks leave it.
 * Single process-wide instance because there is one camera and one preview surface.
 */
object PoseCamera {
  private const val TAG = "FormVisionPose"
  private const val MODEL_ASSET = "pose_landmarker_lite.task"

  private val analysisExecutor: ExecutorService = Executors.newSingleThreadExecutor()
  private var provider: ProcessCameraProvider? = null
  private var landmarker: PoseLandmarker? = null
  private var previewContainer: PreviewContainer? = null
  private var preview: Preview? = null
  private var listener: PoseListener? = null
  private var running = false
  private var minFrameIntervalMs = 0L
  private var lastSubmittedMs = 0L

  /** Extra clockwise rotation for sources that deliver pre-rotated pixels (the emulator webcam bridge). */
  @Volatile private var contentRotationDeg = 0

  /** The frame currently in the model (LIVE_STREAM runs one at a time). */
  @Volatile private var inFlight: InFlight? = null

  /** Main thread. The container takes the rotation from here so preview and landmarks always agree. */
  fun attachPreview(container: PreviewContainer) {
    previewContainer = container
    container.configure(contentRotationDeg = contentRotationDeg)
    preview?.surfaceProvider = container.preview.surfaceProvider
  }

  fun detachPreview(container: PreviewContainer) {
    if (previewContainer === container) {
      previewContainer = null
      preview?.surfaceProvider = null
    }
  }

  /** `contentRotationDeg` (0/90/180/270, clockwise) is applied to model input on top of the camera's rotation. */
  fun start(context: Context, owner: LifecycleOwner, maxFps: Int, contentRotationDeg: Int, poseListener: PoseListener) {
    listener = poseListener
    minFrameIntervalMs = if (maxFps > 0) 1000L / maxFps else 0L
    this.contentRotationDeg = contentRotationDeg
    if (landmarker == null) landmarker = createLandmarker(context)
    val future = ProcessCameraProvider.getInstance(context)
    future.addListener({
      try {
        val cameraProvider = future.get()
        provider = cameraProvider
        previewContainer?.configure(contentRotationDeg = contentRotationDeg)
        val selector = pickCamera(cameraProvider)
        if (selector == null) {
          poseListener.onError("NOT_FOUND", "No camera found")
          return@addListener
        }
        fun resolution(w: Int, h: Int) = ResolutionSelector.Builder()
          .setResolutionStrategy(
            ResolutionStrategy(android.util.Size(w, h), ResolutionStrategy.FALLBACK_RULE_CLOSEST_HIGHER_THEN_LOWER),
          )
          .build()
        val rotation = uprightTargetRotation(context, cameraProvider, selector)
        val previewUseCase = Preview.Builder()
          .setResolutionSelector(resolution(640, 480))
          .setTargetRotation(rotation)
          .build()
        previewContainer?.let { previewUseCase.surfaceProvider = it.preview.surfaceProvider }
        val analysis = ImageAnalysis.Builder()
          // The pose model resizes input to 256 px, so larger analysis frames only cost conversion time.
          .setResolutionSelector(resolution(320, 240))
          .setTargetRotation(rotation)
          .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
          .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
          .build()
        analysis.setAnalyzer(analysisExecutor, ::analyze)
        cameraProvider.unbindAll()
        cameraProvider.bindToLifecycle(owner, selector, previewUseCase, analysis)
        preview = previewUseCase
        running = true
      } catch (e: Exception) {
        Log.e(TAG, "Camera start failed", e)
        poseListener.onError("DISCONNECTED", e.message ?: "Camera start failed")
      }
    }, ContextCompat.getMainExecutor(context))
  }

  /**
   * TVs never rotate and their USB/webcam cameras deliver upright frames, but camera HALs (e.g. the
   * emulator's webcam bridge reports 90°) can claim a sensor orientation. On TV, pick the target
   * rotation at which CameraX applies no rotation; elsewhere keep the display default.
   */
  private fun uprightTargetRotation(context: Context, p: ProcessCameraProvider, selector: CameraSelector): Int {
    if (!context.packageManager.hasSystemFeature(PackageManager.FEATURE_LEANBACK)) return Surface.ROTATION_0
    val info = selector.filter(p.availableCameraInfos).firstOrNull() ?: return Surface.ROTATION_0
    return listOf(Surface.ROTATION_0, Surface.ROTATION_90, Surface.ROTATION_180, Surface.ROTATION_270)
      .firstOrNull { info.getSensorRotationDegrees(it) == 0 } ?: Surface.ROTATION_0
  }

  fun stop(context: Context) {
    running = false
    ContextCompat.getMainExecutor(context).execute {
      provider?.unbindAll()
      preview = null
    }
  }

  /** Camera labels for listCameras(); TVs normally expose a single USB/emulated camera. */
  fun listCameras(context: Context, callback: (List<Pair<String, String>>) -> Unit) {
    val future = ProcessCameraProvider.getInstance(context)
    future.addListener({
      val infos = future.get().availableCameraInfos
      callback(infos.mapIndexed { i, info ->
        val facing = when (info.lensFacing) {
          CameraSelector.LENS_FACING_FRONT -> "front"
          CameraSelector.LENS_FACING_BACK -> "back"
          else -> "external"
        }
        Pair(i.toString(), "Camera $i ($facing)")
      })
    }, ContextCompat.getMainExecutor(context))
  }

  private fun pickCamera(p: ProcessCameraProvider): CameraSelector? = listOf(
    CameraSelector.DEFAULT_FRONT_CAMERA,
    CameraSelector.DEFAULT_BACK_CAMERA,
  ).firstOrNull { p.hasCamera(it) } ?: p.availableCameraInfos.firstOrNull()?.cameraSelector

  private fun createLandmarker(context: Context): PoseLandmarker {
    val options = PoseLandmarker.PoseLandmarkerOptions.builder()
      .setBaseOptions(BaseOptions.builder().setModelAssetPath(MODEL_ASSET).setDelegate(Delegate.CPU).build())
      .setRunningMode(RunningMode.LIVE_STREAM)
      .setNumPoses(1)
      .setMinPoseDetectionConfidence(0.5f)
      .setMinPosePresenceConfidence(0.5f)
      .setMinTrackingConfidence(0.5f)
      .setResultListener(::onResult)
      .setErrorListener { e -> Log.e(TAG, "Pose model error", e); inFlight = null }
      .build()
    return PoseLandmarker.createFromOptions(context, options)
  }

  private fun analyze(image: ImageProxy) {
    image.use {
      val now = SystemClock.uptimeMillis()
      val model = landmarker
      if (!running || model == null || inFlight != null || now - lastSubmittedMs < minFrameIntervalMs) return
      val rotation = (it.imageInfo.rotationDegrees + contentRotationDeg) % 360
      val bitmap = it.toBitmap()
      val upright = rotation % 180 == 0
      inFlight = InFlight(
        w = if (upright) bitmap.width else bitmap.height,
        h = if (upright) bitmap.height else bitmap.width,
        submittedMs = now,
        rotationDeg = rotation,
      )
      lastSubmittedMs = now
      // MediaPipe rotates internally (cheap, and the detector needs an upright person) but reports
      // landmarks in the unrotated frame; onResult maps them to upright coordinates.
      val options = ImageProcessingOptions.builder().setRotationDegrees(rotation).build()
      model.detectAsync(BitmapImageBuilder(bitmap).build(), options, now)
    }
  }

  private fun onResult(result: PoseLandmarkerResult, @Suppress("UNUSED_PARAMETER") input: com.google.mediapipe.framework.image.MPImage) {
    val frame = inFlight ?: return
    inFlight = null
    val pose = result.landmarks().firstOrNull()
    val kp = FloatArray(33 * 4)
    pose?.forEachIndexed { i, lm ->
      if (i >= 33) return@forEachIndexed
      // Clockwise rotation of normalised coordinates into the upright frame.
      val (x, y) = when (frame.rotationDeg) {
        90 -> 1f - lm.y() to lm.x()
        180 -> 1f - lm.x() to 1f - lm.y()
        270 -> lm.y() to 1f - lm.x()
        else -> lm.x() to lm.y()
      }
      kp[i * 4] = x
      kp[i * 4 + 1] = y
      kp[i * 4 + 2] = lm.z()
      kp[i * 4 + 3] = lm.visibility().orElse(0f)
    }
    val now = SystemClock.uptimeMillis()
    listener?.onPose(PoseFrameData(result.timestampMs(), frame.w, frame.h, kp, now - frame.submittedMs))
  }

  /** The frame currently in the model: upright size, submit time, and the rotation MediaPipe applied. */
  private class InFlight(val w: Int, val h: Int, val submittedMs: Long, val rotationDeg: Int)
}
