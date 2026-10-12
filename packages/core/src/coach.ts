import type { PlankFault, PlankReading } from './plank';

export const COACH_TIMING = {
  /** A fault must persist this long before it is confirmed (FR-10). */
  faultConfirmMs: 600,
  /** GOOD must persist this long before a fix is confirmed (FR-10). */
  fixConfirmMs: 500,
} as const;

export type CoachEvent =
  | { type: 'FaultConfirmed'; fault: PlankFault; severityDeg: number; t: number }
  | { type: 'FixConfirmed'; fault: PlankFault; t: number }
  | { type: 'TrackingLost'; t: number }
  | { type: 'TrackingRestored'; t: number };

/** What the skeleton overlay should show: changes only on confirmed transitions. */
export type DisplayState = 'GOOD' | PlankFault | 'UNKNOWN';

type MachineState =
  | { kind: 'Tracking' }
  | { kind: 'FaultPending'; fault: PlankFault; since: number }
  | { kind: 'FaultActive'; fault: PlankFault }
  | { kind: 'FixPending'; fault: PlankFault; since: number }
  | { kind: 'Lost' };

/** Debounced coaching state machine (TECH-SPEC §6.3). Feed one reading per pose frame. */
export class CoachMachine {
  private s: MachineState = { kind: 'Tracking' };

  get displayState(): DisplayState {
    switch (this.s.kind) {
      case 'FaultActive':
      case 'FixPending':
        return this.s.fault;
      case 'Lost':
        return 'UNKNOWN';
      default:
        return 'GOOD';
    }
  }

  update(reading: PlankReading, t: number): CoachEvent[] {
    const events: CoachEvent[] = [];
    if (reading.trackingLost) {
      if (this.s.kind !== 'Lost') {
        this.s = { kind: 'Lost' };
        events.push({ type: 'TrackingLost', t });
      }
      return events;
    }
    if (this.s.kind === 'Lost') {
      this.s = { kind: 'Tracking' };
      events.push({ type: 'TrackingRestored', t });
    }

    const state = reading.state;
    const severityDeg = reading.features?.severityDeg ?? 0;
    const s = this.s;
    switch (s.kind) {
      case 'Tracking':
        if (state === 'HIP_SAG' || state === 'HIP_PIKE') this.s = { kind: 'FaultPending', fault: state, since: t };
        break;
      case 'FaultPending':
        if (state === 'GOOD' || state === 'UNKNOWN') this.s = { kind: 'Tracking' };
        else if (state !== s.fault) this.s = { kind: 'FaultPending', fault: state, since: t };
        else if (t - s.since >= COACH_TIMING.faultConfirmMs) {
          this.s = { kind: 'FaultActive', fault: s.fault };
          events.push({ type: 'FaultConfirmed', fault: s.fault, severityDeg, t });
        }
        break;
      case 'FaultActive':
        if (state === 'GOOD') this.s = { kind: 'FixPending', fault: s.fault, since: t };
        else if (state !== 'UNKNOWN' && state !== s.fault) this.s = { kind: 'FaultPending', fault: state, since: t };
        break;
      case 'FixPending':
        if (state === 'GOOD') {
          if (t - s.since >= COACH_TIMING.fixConfirmMs) {
            this.s = { kind: 'Tracking' };
            events.push({ type: 'FixConfirmed', fault: s.fault, t });
          }
        } else if (state === s.fault || state === 'UNKNOWN') this.s = { kind: 'FaultActive', fault: s.fault };
        else this.s = { kind: 'FaultPending', fault: state, since: t };
        break;
    }
    return events;
  }
}

export const CUE_POLICY = {
  /** Minimum gap between any two spoken cues (FR-12). */
  cooldownMs: 4000,
  /** The same fault is not repeated within this window… */
  sameFaultMs: 8000,
  /** …unless it got worse by at least this much. */
  worsenedByDeg: 10,
} as const;

/** Decides whether a confirmed fault earns a spoken cue (FR-12). */
export class CuePolicy {
  private last: { t: number; fault: PlankFault; severityDeg: number } | null = null;

  /** Returns true and records the cue if one should be spoken now. */
  allow(fault: PlankFault, severityDeg: number, t: number): boolean {
    const last = this.last;
    if (last) {
      const since = t - last.t;
      if (since < CUE_POLICY.cooldownMs) return false;
      if (
        last.fault === fault &&
        since < CUE_POLICY.sameFaultMs &&
        severityDeg < last.severityDeg + CUE_POLICY.worsenedByDeg
      )
        return false;
    }
    this.last = { t, fault, severityDeg };
    return true;
  }
}
