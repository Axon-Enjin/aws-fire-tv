import {
  NativeEventEmitter,
  NativeModules,
  requireNativeComponent,
  type ViewProps,
} from 'react-native';
import type { PoseFrame } from '@formvision/core';

/** Contract of the Kotlin module in android/.../pose/PoseModule.kt (TECH-SPEC §4.3). */
export type CameraInfo = { id: string; label: string; kind: 'builtin' | 'usb' };
export type CameraError = { code: 'NOT_FOUND' | 'DENIED' | 'DISCONNECTED'; message: string };

interface PoseNativeModule {
  listCameras(): Promise<CameraInfo[]>;
  start(cameraId: string, opts: { maxFps: number; contentRotationDeg: number }): Promise<void>;
  stop(): Promise<void>;
}

const PoseNative: PoseNativeModule = NativeModules.FormVisionPose;
const emitter = new NativeEventEmitter(NativeModules.FormVisionPose);

/** Model emitted by the native module: MediaPipe Pose Landmarker Lite (33 BlazePose keypoints). */
export const LIVE_MODEL = 'blazepose_lite' as const;

/** Live webcam pose source. Pixels never reach JS; only PoseFrames do. */
export const livePoseSource = {
  listCameras: () => PoseNative.listCameras(),
  start: (cameraId: string, maxFps: number, contentRotationDeg: number) =>
    PoseNative.start(cameraId, { maxFps, contentRotationDeg }),
  stop: () => PoseNative.stop(),
  onPose(cb: (frame: PoseFrame) => void) {
    const sub = emitter.addListener('onPose', cb);
    return () => sub.remove();
  },
  onError(cb: (err: CameraError) => void) {
    const sub = emitter.addListener('onCameraError', cb);
    return () => sub.remove();
  },
};

export const CameraPreview = requireNativeComponent<ViewProps & { mirrored?: boolean }>(
  'FormVisionCameraPreview',
);
