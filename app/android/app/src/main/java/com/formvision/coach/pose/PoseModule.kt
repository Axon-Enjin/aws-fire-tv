package com.formvision.coach.pose

import androidx.camera.view.PreviewView
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManager
import com.facebook.react.uimanager.annotations.ReactProp

/** JS contract: TECH-SPEC §4.3. Events: `onPose` (PoseFrame), `onCameraError` ({ code, message }). */
class PoseModule(private val ctx: ReactApplicationContext) : ReactContextBaseJavaModule(ctx), PoseListener {
  override fun getName() = "FormVisionPose"

  @ReactMethod
  fun listCameras(promise: Promise) {
    PoseCamera.listCameras(ctx) { cameras ->
      val out = Arguments.createArray()
      cameras.forEach { (id, label) ->
        out.pushMap(Arguments.createMap().apply {
          putString("id", id)
          putString("label", label)
          putString("kind", "usb")
        })
      }
      promise.resolve(out)
    }
  }

  @ReactMethod
  fun start(@Suppress("UNUSED_PARAMETER") cameraId: String, opts: ReadableMap, promise: Promise) {
    val owner = ctx.currentActivity as? LifecycleOwner
    if (owner == null) {
      promise.reject("NO_ACTIVITY", "No foreground activity to bind the camera to")
      return
    }
    val maxFps = if (opts.hasKey("maxFps")) opts.getInt("maxFps") else 30
    val contentRotationDeg = if (opts.hasKey("contentRotationDeg")) opts.getInt("contentRotationDeg") else 0
    PoseCamera.start(ctx, owner, maxFps, contentRotationDeg, this)
    promise.resolve(null)
  }

  @ReactMethod
  fun stop(promise: Promise) {
    PoseCamera.stop(ctx)
    promise.resolve(null)
  }

  // Required by NativeEventEmitter on Android.
  @ReactMethod fun addListener(@Suppress("UNUSED_PARAMETER") eventName: String) {}
  @ReactMethod fun removeListeners(@Suppress("UNUSED_PARAMETER") count: Double) {}

  override fun onPose(frame: PoseFrameData) {
    if (!ctx.hasActiveReactInstance()) return
    val kp = Arguments.createArray()
    frame.kp.forEach { kp.pushDouble(it.toDouble()) }
    val event = Arguments.createMap().apply {
      putDouble("t", frame.t.toDouble())
      putInt("w", frame.w)
      putInt("h", frame.h)
      putArray("kp", kp)
      putDouble("inferMs", frame.inferMs.toDouble())
    }
    ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("onPose", event)
  }

  override fun onError(code: String, message: String) {
    if (!ctx.hasActiveReactInstance()) return
    val event = Arguments.createMap().apply {
      putString("code", code)
      putString("message", message)
    }
    ctx.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("onCameraError", event)
  }
}

/**
 * Hosts the CameraX PreviewView. PreviewView adds its TextureView child after React has laid it
 * out, and React Native does not lay out native children, so re-run measure/layout on request.
 */
class PreviewContainer(context: android.content.Context) : android.widget.FrameLayout(context) {
  val preview = PreviewView(context).apply {
    implementationMode = PreviewView.ImplementationMode.COMPATIBLE
    scaleType = PreviewView.ScaleType.FIT_CENTER
  }

  private var mirrored = true
  private var contentRotationDeg = 0

  init {
    addView(preview, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT))
  }

  fun configure(mirrored: Boolean = this.mirrored, contentRotationDeg: Int = this.contentRotationDeg) {
    this.mirrored = mirrored
    this.contentRotationDeg = contentRotationDeg
    preview.rotation = contentRotationDeg.toFloat()
    // View scale applies before rotation, so scaleX mirrors the source horizontally at any rotation.
    preview.scaleX = if (mirrored) -1f else 1f
    requestLayout()
  }

  override fun onLayout(changed: Boolean, l: Int, t: Int, r: Int, b: Int) {
    val w = r - l
    val h = b - t
    // A quarter-turned child gets swapped dimensions so it fills the box after rotating.
    val (cw, ch) = if (contentRotationDeg % 180 != 0) h to w else w to h
    preview.measure(MeasureSpec.makeMeasureSpec(cw, MeasureSpec.EXACTLY), MeasureSpec.makeMeasureSpec(ch, MeasureSpec.EXACTLY))
    val x = (w - cw) / 2
    val y = (h - ch) / 2
    preview.layout(x, y, x + cw, y + ch)
  }

  override fun requestLayout() {
    super.requestLayout()
    // Not a field: requestLayout runs during the FrameLayout constructor, before fields exist.
    post {
      measure(
        MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
        MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY),
      )
      layout(left, top, right, bottom)
    }
  }
}

/** Native camera preview; the JS overlay draws the skeleton on top. */
class CameraPreviewManager : SimpleViewManager<PreviewContainer>() {
  override fun getName() = "FormVisionCameraPreview"

  override fun createViewInstance(context: ThemedReactContext): PreviewContainer =
    PreviewContainer(context).also { PoseCamera.attachPreview(it) }

  @ReactProp(name = "mirrored", defaultBoolean = true)
  fun setMirrored(view: PreviewContainer, mirrored: Boolean) {
    view.configure(mirrored = mirrored)
  }

  override fun onDropViewInstance(view: PreviewContainer) {
    PoseCamera.detachPreview(view)
    super.onDropViewInstance(view)
  }
}

class PosePackage : ReactPackage {
  override fun createNativeModules(ctx: ReactApplicationContext): List<NativeModule> = listOf(PoseModule(ctx))
  override fun createViewManagers(ctx: ReactApplicationContext): List<ViewManager<*, *>> = listOf(CameraPreviewManager())
}
