import {
  angleDeg,
  CoachMachine,
  type CoachEvent,
  CuePolicy,
  KEYPOINT_INDEX,
  type PlankState,
  PlankClassifier,
  type PoseFrame,
  PoseSmoother,
  SessionStats,
  signedOffsetBelow,
} from '../src';

const W = 1280;
const H = 720;

/**
 * Side-on plank seen from the left: shoulder and ankle on a horizontal line, hip displaced
 * so the shoulder–hip–ankle angle equals `bodyLineDeg`. `hip` picks sag (below) or pike (above).
 */
function plankFrame(t: number, bodyLineDeg: number, hip: 'sag' | 'pike' = 'sag', vis = 0.9): PoseFrame {
  const kp = new Array(17 * 4).fill(0);
  const set = (idx: number, xPx: number, yPx: number) => kp.splice(idx * 4, 4, xPx / W, yPx / H, 0, vis);
  const shoulder = { x: 300, y: 400 };
  const ankle = { x: 1000, y: 400 };
  const half = (ankle.x - shoulder.x) / 2;
  const drop = half * Math.tan(((180 - bodyLineDeg) / 2) * (Math.PI / 180));
  const idx = KEYPOINT_INDEX.movenet_lightning;
  set(idx.leftShoulder, shoulder.x, shoulder.y);
  set(idx.leftHip, shoulder.x + half, shoulder.y + (hip === 'sag' ? drop : -drop));
  set(idx.leftAnkle, ankle.x, ankle.y);
  return { t, w: W, h: H, kp, inferMs: 20 };
}

/** Runs frames every `stepMs` through the full pipeline and collects per-frame output. */
function run(frames: Array<(t: number) => PoseFrame>, durations: number[], stepMs = 33) {
  const smoother = new PoseSmoother('movenet_lightning');
  const classifier = new PlankClassifier();
  const machine = new CoachMachine();
  const stats = new SessionStats();
  const states: PlankState[] = [];
  const events: CoachEvent[] = [];
  let t = 0;
  frames.forEach((make, i) => {
    const end = t + durations[i]!;
    for (; t < end; t += stepMs) {
      const frame = make(t);
      const reading = classifier.update(smoother.update(frame), t, frame.w, frame.h);
      const ev = machine.update(reading, t);
      stats.update(machine.displayState, ev, t, false);
      states.push(reading.state);
      events.push(...ev);
    }
  });
  return { states, events, machine, stats };
}

describe('geometry', () => {
  it('measures a straight line as 180° and a right angle as 90°', () => {
    expect(angleDeg({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 })).toBeCloseTo(180);
    expect(angleDeg({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 })).toBeCloseTo(90);
  });

  it('signs hip offset by screen direction regardless of which way the user faces', () => {
    const below = { x: 1, y: 0.2 };
    expect(signedOffsetBelow({ x: 0, y: 0 }, below, { x: 2, y: 0 })).toBeGreaterThan(0);
    expect(signedOffsetBelow({ x: 2, y: 0 }, below, { x: 0, y: 0 })).toBeGreaterThan(0);
    expect(signedOffsetBelow({ x: 0, y: 0 }, { x: 1, y: -0.2 }, { x: 2, y: 0 })).toBeLessThan(0);
  });
});

describe('PlankClassifier', () => {
  it('distinguishes sag from pike at the same angle', () => {
    expect(run([(t) => plankFrame(t, 150, 'sag')], [200]).states.at(-1)).toBe('HIP_SAG');
    expect(run([(t) => plankFrame(t, 150, 'pike')], [200]).states.at(-1)).toBe('HIP_PIKE');
    expect(run([(t) => plankFrame(t, 178)], [200]).states.at(-1)).toBe('GOOD');
  });

  it('holds the previous state inside the 160–167° hysteresis band', () => {
    const { states } = run([(t) => plankFrame(t, 150), (t) => plankFrame(t, 164)], [500, 2000]);
    expect(states.at(-1)).toBe('HIP_SAG');
    const recovered = run([(t) => plankFrame(t, 150), (t) => plankFrame(t, 170)], [500, 2000]);
    expect(recovered.states.at(-1)).toBe('GOOD');
  });

  it('reports UNKNOWN when the body is not horizontal enough to be a plank', () => {
    const steep = (t: number): PoseFrame => {
      const f = plankFrame(t, 178);
      const ankle = KEYPOINT_INDEX.movenet_lightning.leftAnkle * 4;
      f.kp[ankle + 1] = 700 / H + 0.6; // drop the ankle far below the shoulder
      return f;
    };
    expect(run([steep], [200]).states.at(-1)).toBe('UNKNOWN');
  });

  it('declares tracking lost only after required joints are unseen for over 1 s', () => {
    const hidden = (t: number) => plankFrame(t, 178, 'sag', 0.1);
    const brief = run([(t) => plankFrame(t, 178), hidden], [500, 900]);
    expect(brief.events.some((e) => e.type === 'TrackingLost')).toBe(false);
    const long = run([(t) => plankFrame(t, 178), hidden, (t) => plankFrame(t, 178)], [500, 1500, 300]);
    expect(long.events.map((e) => e.type)).toEqual(['TrackingLost', 'TrackingRestored']);
  });
});

describe('CoachMachine', () => {
  it('ignores a fault shorter than the 600 ms debounce', () => {
    const { events } = run([(t) => plankFrame(t, 178), (t) => plankFrame(t, 145), (t) => plankFrame(t, 178)], [500, 400, 1000]);
    expect(events).toEqual([]);
  });

  it('confirms a sustained fault once, then confirms the fix after 500 ms of good form', () => {
    const { events, machine } = run(
      [(t) => plankFrame(t, 178), (t) => plankFrame(t, 145), (t) => plankFrame(t, 178)],
      [500, 2000, 1000],
    );
    expect(events.map((e) => e.type)).toEqual(['FaultConfirmed', 'FixConfirmed']);
    const fault = events[0] as Extract<CoachEvent, { type: 'FaultConfirmed' }>;
    expect(fault.fault).toBe('HIP_SAG');
    expect(fault.severityDeg).toBeGreaterThan(25);
    expect(fault.t).toBeGreaterThanOrEqual(500 + 600);
    expect(machine.displayState).toBe('GOOD');
  });

  it('keeps the fault displayed when good form flickers for less than 500 ms', () => {
    const { events, machine } = run(
      [(t) => plankFrame(t, 145), (t) => plankFrame(t, 178), (t) => plankFrame(t, 145)],
      [1000, 300, 500],
    );
    expect(events.map((e) => e.type)).toEqual(['FaultConfirmed']);
    expect(machine.displayState).toBe('HIP_SAG');
  });
});

describe('CuePolicy', () => {
  it('enforces the 4 s cooldown across all faults', () => {
    const p = new CuePolicy();
    expect(p.allow('HIP_SAG', 20, 0)).toBe(true);
    expect(p.allow('HIP_PIKE', 20, 3999)).toBe(false);
    expect(p.allow('HIP_PIKE', 20, 4000)).toBe(true);
  });

  it('suppresses the same fault within 8 s unless it worsened by 10°', () => {
    const p = new CuePolicy();
    p.allow('HIP_SAG', 20, 0);
    expect(p.allow('HIP_SAG', 25, 5000)).toBe(false);
    expect(p.allow('HIP_SAG', 30, 5000)).toBe(true);
    expect(p.allow('HIP_SAG', 30, 9000)).toBe(false);
    expect(p.allow('HIP_SAG', 30, 13000)).toBe(true);
  });
});

describe('SessionStats', () => {
  it('counts held time and good-form share, excluding time with tracking lost', () => {
    const hidden = (t: number) => plankFrame(t, 178, 'sag', 0.1);
    const { stats } = run(
      [(t) => plankFrame(t, 178), (t) => plankFrame(t, 145), hidden, (t) => plankFrame(t, 178)],
      [3000, 3000, 3000, 3000],
    );
    const s = stats.summary();
    expect(s.faults).toEqual({ HIP_SAG: 1, HIP_PIKE: 0 });
    // ~1 s of the hidden stretch still counts before tracking is declared lost.
    expect(s.heldSec).toBeGreaterThanOrEqual(9);
    expect(s.heldSec).toBeLessThanOrEqual(11);
    expect(s.goodPct).toBeGreaterThan(40);
    expect(s.goodPct).toBeLessThan(80);
  });
});
