/** Design tokens from BRANDING.md §4–6. */
export const colors = {
  ink: '#0B0F14',
  surface: '#151B23',
  surface2: '#1F2732',
  text: '#F2F5F8',
  muted: '#8A96A3',
  focus: '#3D8BFF',
  good: '#2EE59D',
  fault: '#FF6B4A',
  warn: '#FFB020',
} as const;

export const type = {
  display: { fontSize: 120, fontWeight: '700' },
  h1: { fontSize: 56, fontWeight: '700' },
  h2: { fontSize: 40, fontWeight: '600' },
  body: { fontSize: 30, fontWeight: '400' },
  caption: { fontSize: 24, fontWeight: '500' },
} as const;

/** Title-safe inset at 1080p (BRANDING §6). Layout runs in dp; the TV maps 1920×1080 px to 960×540 dp at xhdpi. */
export const safeArea = { horizontalPct: 5, verticalPct: 5 } as const;
