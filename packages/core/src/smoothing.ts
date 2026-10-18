import { type Joint, JOINTS, type Pose, type PoseFrame, type PoseModel, readKeypoint } from './pose';

export interface OneEuroParams {
  minCutoff: number;
  beta: number;
  dCutoff: number;
}

/** Starting values from TECH-SPEC §5.2; tune on replay clips. */
export const DEFAULT_ONE_EURO: OneEuroParams = { minCutoff: 1.0, beta: 0.01, dCutoff: 1.0 };

function smoothingAlpha(cutoffHz: number, dtSec: number): number {
  const tau = 1 / (2 * Math.PI * cutoffHz);
  return 1 / (1 + tau / dtSec);
}

/** One Euro filter (Casiez et al. 2012) for a single scalar signal. */
export class OneEuroFilter {
  private prevX: number | undefined;
  private prevDx = 0;
  private prevT = 0;

  constructor(private readonly params: OneEuroParams = DEFAULT_ONE_EURO) {}

  filter(x: number, tMs: number): number {
    if (this.prevX === undefined) {
      this.prevX = x;
      this.prevT = tMs;
      return x;
    }
    const dt = Math.max((tMs - this.prevT) / 1000, 1e-3);
    const dx = (x - this.prevX) / dt;
    const dxSmoothed = this.prevDx + smoothingAlpha(this.params.dCutoff, dt) * (dx - this.prevDx);
    const cutoff = this.params.minCutoff + this.params.beta * Math.abs(dxSmoothed);
    const out = this.prevX + smoothingAlpha(cutoff, dt) * (x - this.prevX);
    this.prevX = out;
    this.prevDx = dxSmoothed;
    this.prevT = tMs;
    return out;
  }

  reset(): void {
    this.prevX = undefined;
    this.prevDx = 0;
  }
}

export interface SmootherOptions {
  params?: OneEuroParams;
  /** Keypoints below this visibility are treated as not seen. */
  minVisibility?: number;
  /** After a gap this long, a reappearing joint restarts its filter instead of sliding in. */
  resetAfterGapMs?: number;
}

/**
 * Smooths every canonical joint. Invisible joints hold their last position and are
 * flagged `stale`; consumers decide how long a stale joint is acceptable.
 */
export class PoseSmoother {
  private readonly filters: Record<Joint, { x: OneEuroFilter; y: OneEuroFilter }>;
  private readonly pose: Pose;
  private readonly minVisibility: number;
  private readonly resetAfterGapMs: number;

  constructor(
    private readonly model: PoseModel,
    options: SmootherOptions = {},
  ) {
    this.minVisibility = options.minVisibility ?? 0.5;
    this.resetAfterGapMs = options.resetAfterGapMs ?? 500;
    const params = options.params ?? DEFAULT_ONE_EURO;
    const pose = {} as Pose;
    const filters = {} as Record<Joint, { x: OneEuroFilter; y: OneEuroFilter }>;
    for (const joint of JOINTS) {
      pose[joint] = { x: 0, y: 0, vis: 0, stale: true, lastSeen: -Infinity };
      filters[joint] = { x: new OneEuroFilter(params), y: new OneEuroFilter(params) };
    }
    this.pose = pose;
    this.filters = filters;
  }

  update(frame: PoseFrame): Pose {
    for (const joint of JOINTS) {
      const kp = readKeypoint(frame, this.model, joint);
      const point = this.pose[joint];
      point.vis = kp.vis;
      if (kp.vis < this.minVisibility) {
        point.stale = true;
        continue;
      }
      const filter = this.filters[joint];
      if (frame.t - point.lastSeen > this.resetAfterGapMs) {
        filter.x.reset();
        filter.y.reset();
      }
      point.x = filter.x.filter(kp.x, frame.t);
      point.y = filter.y.filter(kp.y, frame.t);
      point.stale = false;
      point.lastSeen = frame.t;
    }
    return this.pose;
  }
}
