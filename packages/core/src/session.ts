import type { CoachEvent, DisplayState } from './coach';
import type { PlankFault } from './plank';

export interface SessionSummary {
  heldSec: number;
  /** Percent of held time in GOOD, 0–100, rounded. */
  goodPct: number;
  faults: Record<PlankFault, number>;
  worstSeverityDeg: number;
}

/** Frame gaps longer than this (stalls, app backgrounded) are not counted as held time. */
const MAX_FRAME_GAP_MS = 250;

/** Accumulates the numbers shown on Results (FR-16, FR-17). */
export class SessionStats {
  private prevT: number | null = null;
  private heldMs = 0;
  private goodMs = 0;
  private worstSeverityDeg = 0;
  private readonly faults: Record<PlankFault, number> = { HIP_SAG: 0, HIP_PIKE: 0 };

  /** Call once per frame with the displayed state and the coach events emitted for that frame. */
  update(display: DisplayState, events: readonly CoachEvent[], t: number, paused: boolean): void {
    const dt = this.prevT === null ? 0 : t - this.prevT;
    this.prevT = t;
    if (!paused && display !== 'UNKNOWN' && dt > 0 && dt <= MAX_FRAME_GAP_MS) {
      this.heldMs += dt;
      if (display === 'GOOD') this.goodMs += dt;
    }
    for (const e of events) {
      if (e.type !== 'FaultConfirmed') continue;
      this.faults[e.fault] += 1;
      this.worstSeverityDeg = Math.max(this.worstSeverityDeg, e.severityDeg);
    }
  }

  summary(): SessionSummary {
    return {
      heldSec: Math.round(this.heldMs / 1000),
      goodPct: this.heldMs === 0 ? 0 : Math.round((this.goodMs / this.heldMs) * 100),
      faults: { ...this.faults },
      worstSeverityDeg: Math.round(this.worstSeverityDeg),
    };
  }
}
