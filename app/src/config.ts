/**
 * Extra clockwise rotation (0/90/180/270) for cameras that deliver pre-rotated pixels. Applied to
 * both the pose model input and the preview. The Android TV Emulator's webcam bridge delivers
 * frames upside down (verified against a raw host capture of /dev/video0); real TV webcams need 0.
 */
export const CAMERA_CONTENT_ROTATION_DEG = 180;
