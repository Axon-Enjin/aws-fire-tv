import { angleDeg, signedOffsetBelow, tiltFromHorizontalDeg, type Vec2 } from './geometry';
import type { Joint, Pose } from './pose';

export type PlankFault = 'HIP_SAG' | 'HIP_PIKE';
export type PlankState = 'GOOD' | PlankFault | 'UNKNOWN';
export type Side = 'left' | 'right';

/** Starting thresholds (TECH-SPEC §6.2). Tune against labelled replay clips. */
export const PLANK_THRESHOLDS = {
  /** Body line at or above this is GOOD; also the exit threshold for faults. */
  goodMinDeg: 167,
  /** Body line below this enters a fault. Between the two, the previous state holds. */
  faultBelowDeg: 160,
  /** Shoulder–ankle line steeper than this is not a plank. */
  maxTorsoTiltDeg: 35,
  /** A required joint unseen for longer than this means tracking is lost. */
  lostAfterMs: 1000,
  /** Minimum time between body-side re-selections. */
  sideReselectMs: 1000,
} as const;

export interface PlankFeatures {
  side: Side;
  /** Shoulder–hip–ankle angle; 180 is a straight line. */
  bodyLineDeg: number;
  /** Hip distance from the shoulder–ankle line / line length; positive = sagging below. */
  hipOffset: number;
  torsoTiltDeg: number;
  /** 180 − bodyLineDeg. */
  severityDeg: number;
}

export interface PlankReading {
  state: PlankState;
  trackingLost: boolean;
  /** Null when tracking is lost. */
  features: PlankFeatures | null;
}

const SIDE_JOINTS: Record<Side, { shoulder: Joint; hip: Joint; ankle: Joint }> = {
  left: { shoulder: 'leftShoulder', hip: 'leftHip', ankle: 'leftAnkle' },
  right: { shoulder: 'rightShoulder', hip: 'rightHip', ankle: 'rightAnkle' },
};

/** Classifies each smoothed pose as GOOD / HIP_SAG / HIP_PIKE / UNKNOWN with hysteresis. */
export class PlankClassifier {
  private side: Side | null = null;
  private sideSelectedAt = -Infinity;
  private state: PlankState = 'UNKNOWN';

  /** `w`/`h` are the source frame size, so angles use the true aspect ratio. */
  update(pose: Pose, t: number, w: number, h: number): PlankReading {
    const side = this.selectSide(pose, t);
    const joints = SIDE_JOINTS[side];
    const required = [pose[joints.shoulder], pose[joints.hip], pose[joints.ankle]];
    if (required.some((p) => t - p.lastSeen > PLANK_THRESHOLDS.lostAfterMs)) {
      this.state = 'UNKNOWN';
      return { state: 'UNKNOWN', trackingLost: true, features: null };
    }

    const [shoulder, hip, ankle] = required.map((p): Vec2 => ({ x: p.x * w, y: p.y * h })) as [Vec2, Vec2, Vec2];
    const bodyLineDeg = angleDeg(shoulder, hip, ankle);
    const features: PlankFeatures = {
      side,
      bodyLineDeg,
      hipOffset: signedOffsetBelow(shoulder, hip, ankle),
      torsoTiltDeg: tiltFromHorizontalDeg(shoulder, ankle),
      severityDeg: 180 - bodyLineDeg,
    };
    this.state = this.classify(features);
    return { state: this.state, trackingLost: false, features };
  }

  private classify(f: PlankFeatures): PlankState {
    if (f.torsoTiltDeg >= PLANK_THRESHOLDS.maxTorsoTiltDeg) return 'UNKNOWN';
    if (f.bodyLineDeg >= PLANK_THRESHOLDS.goodMinDeg) return 'GOOD';
    if (f.bodyLineDeg < PLANK_THRESHOLDS.faultBelowDeg) return f.hipOffset > 0 ? 'HIP_SAG' : 'HIP_PIKE';
    // Hysteresis band: keep the previous classification; a fresh start in the band counts as GOOD.
    return this.state === 'UNKNOWN' ? 'GOOD' : this.state;
  }

  /** Uses the body side the camera sees best; re-evaluated at most once per `sideReselectMs`. */
  private selectSide(pose: Pose, t: number): Side {
    if (this.side !== null && t - this.sideSelectedAt < PLANK_THRESHOLDS.sideReselectMs) return this.side;
    const meanVis = (side: Side): number => {
      const j = SIDE_JOINTS[side];
      return (pose[j.shoulder].vis + pose[j.hip].vis + pose[j.ankle].vis) / 3;
    };
    this.side = meanVis('right') > meanVis('left') ? 'right' : 'left';
    this.sideSelectedAt = t;
    return this.side;
  }
}
