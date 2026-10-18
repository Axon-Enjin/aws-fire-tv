/** Point in pixel space, y grows downward (image coordinates). */
export interface Vec2 {
  x: number;
  y: number;
}

const RAD_TO_DEG = 180 / Math.PI;

/** Interior angle at `b` formed by a–b–c, in degrees [0, 180]. 0 if a segment is degenerate. */
export function angleDeg(a: Vec2, b: Vec2, c: Vec2): number {
  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const len = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
  if (len === 0) return 0;
  const cos = Math.min(1, Math.max(-1, (v1x * v2x + v1y * v2y) / len));
  return Math.acos(cos) * RAD_TO_DEG;
}

/**
 * Perpendicular distance of `p` from line a–c, divided by |ac|.
 * Positive when `p` lies below the line on screen, negative above. 0 if a === c.
 */
export function signedOffsetBelow(a: Vec2, p: Vec2, c: Vec2): number {
  const dx = c.x - a.x;
  const dy = c.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return 0;
  // Unit-free normal of a→c, oriented to point down the screen (+y).
  let nx = -dy;
  let ny = dx;
  if (ny < 0 || (ny === 0 && nx < 0)) {
    nx = -nx;
    ny = -ny;
  }
  return ((p.x - a.x) * nx + (p.y - a.y) * ny) / lenSq;
}

/** Angle of segment a–c from horizontal, in degrees [0, 90]. */
export function tiltFromHorizontalDeg(a: Vec2, c: Vec2): number {
  return Math.atan2(Math.abs(c.y - a.y), Math.abs(c.x - a.x)) * RAD_TO_DEG;
}
