/** Frame emitted by a pose source (native module or replay). Coordinates are normalised to [0,1]. */
export interface PoseFrame {
  /** Monotonic timestamp, ms. */
  t: number;
  /** Source frame size in pixels; used to compute angles in true aspect ratio. */
  w: number;
  h: number;
  /** Flat [x, y, z, vis] × N keypoints in model order. */
  kp: number[];
  inferMs: number;
}

export type PoseModel = 'movenet_lightning' | 'blazepose_lite';

export const JOINTS = [
  'leftShoulder',
  'rightShoulder',
  'leftElbow',
  'rightElbow',
  'leftWrist',
  'rightWrist',
  'leftHip',
  'rightHip',
  'leftKnee',
  'rightKnee',
  'leftAnkle',
  'rightAnkle',
] as const;
export type Joint = (typeof JOINTS)[number];

const KEYPOINT_STRIDE = 4;

/** Model keypoint index per canonical joint (TECH-SPEC §4.4). */
export const KEYPOINT_INDEX: Record<PoseModel, Record<Joint, number>> = {
  movenet_lightning: {
    leftShoulder: 5,
    rightShoulder: 6,
    leftElbow: 7,
    rightElbow: 8,
    leftWrist: 9,
    rightWrist: 10,
    leftHip: 11,
    rightHip: 12,
    leftKnee: 13,
    rightKnee: 14,
    leftAnkle: 15,
    rightAnkle: 16,
  },
  blazepose_lite: {
    leftShoulder: 11,
    rightShoulder: 12,
    leftElbow: 13,
    rightElbow: 14,
    leftWrist: 15,
    rightWrist: 16,
    leftHip: 23,
    rightHip: 24,
    leftKnee: 25,
    rightKnee: 26,
    leftAnkle: 27,
    rightAnkle: 28,
  },
};

export interface Keypoint {
  x: number;
  y: number;
  vis: number;
}

/** Reads a canonical joint from a frame; missing data reads as invisible. */
export function readKeypoint(frame: PoseFrame, model: PoseModel, joint: Joint): Keypoint {
  const i = KEYPOINT_INDEX[model][joint] * KEYPOINT_STRIDE;
  const x = frame.kp[i];
  const y = frame.kp[i + 1];
  const vis = frame.kp[i + 3];
  if (x === undefined || y === undefined || vis === undefined) return { x: 0, y: 0, vis: 0 };
  return { x, y, vis };
}

/** Smoothed joint state. `lastSeen` is the last time the joint was visible (-Infinity if never). */
export interface TrackedPoint extends Keypoint {
  stale: boolean;
  lastSeen: number;
}

export type Pose = Record<Joint, TrackedPoint>;
