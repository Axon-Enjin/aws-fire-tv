# FormVision — Branding and Visual System

Rules for name, voice, colour, type, and motion on a TV viewed from 2–4 m by someone who is mid-exercise. Screen layouts are in [SITEMAP.md](SITEMAP.md).

---

## 1. Name and positioning

- **Name:** FormVision (one word, capital F and V). Never "Form Vision" or "FORMVISION" in running text.
- **Tagline:** *Your TV, now a form coach.*
- **Positioning line:** Live form coaching on the screen you already own: no mirror, no subscription hardware, and no video leaving your home.
- **Three brand pillars**

| Pillar | Means | Shows up as |
|---|---|---|
| **Precise** | Feedback is specific and measurable | "Hips up two inches", not "Good job!" |
| **Private** | Camera data never leaves the device | Privacy line on first run; privacy screen; payload shown literally |
| **Calm** | A coach, not a drill sergeant | Short cues, generous cooldowns, no flashing alarms |

**Trademark hygiene:** don't use Amazon, Fire TV, Alexa, Peloton, or other marks in the logo or name. Describe compatibility in plain text only ("Runs on Fire TV"). Follow the hackathon rule against third-party trademarks and copyrighted media in the video (HACKATHON.md).

## 2. Voice and tone

### Spoken cues (the most important copy in the app)
- **≤ 10 words. Imperative. One fix per cue.** The body part comes first so the user knows where to look.
- Give a target ("two inches", "flat line") rather than only naming the fault.
- About one cue in three may add encouragement, and only after a fix: "That's it — hold that line."
- Never shame, never use medical words ("injury", "damage"), never use the user's weight or body shape.

| Fault | ✅ Good | ❌ Avoid |
|---|---|---|
| Hip sag | "Hips up a little — squeeze your glutes." | "Your hips are sagging badly." |
| Hip pike | "Lower your hips into a straight line." | "Wrong! Hips too high." |
| Tracking lost | "Step back so I can see all of you." | "Error: landmarks not detected." |
| Fixed | "That's it. Hold right there." | "Correct posture detected." |

These lines are the **local fallback cues** (TECH-SPEC §6.4). Bedrock output must match this style: the system prompt quotes these rules.

### UI copy
- Sentence case everywhere ("Try again", not "Try Again").
- Numbers over adjectives: "78% good form", not "Great form!".
- Error states name the cause and the next action: "Camera disconnected. Plug it back in, or use Replay."

## 3. Logo

- **Concept:** a wordmark plus a mark. The mark is three dots joined by two line segments into a straight line, like shoulder, hip, and ankle in a perfect plank. It reads as "a body in good form" and "a tracking skeleton" at once.
- The mark is drawn with the `--fv-good` stroke on `--fv-ink`. It must still read at 48 px (launcher tile).
- Clear space around the logo = the height of one dot on every side.
- Required assets: launcher icon / app tile at the sizes the Appstore asks for **[VERIFY sizes in Vega SDK docs]**, a splash mark, and the demo-video title card.

```svg
<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
  <line x1="30" y1="78" x2="80" y2="62" stroke="var(--c3)" stroke-width="6" stroke-linecap="round"/>
  <line x1="80" y1="62" x2="130" y2="46" stroke="var(--c3)" stroke-width="6" stroke-linecap="round"/>
  <circle cx="30" cy="78" r="9" fill="var(--c3)"/>
  <circle cx="80" cy="62" r="9" fill="var(--c3)"/>
  <circle cx="130" cy="46" r="9" fill="var(--c3)"/>
  <text x="155" y="72" font-size="34" font-weight="700" fill="var(--fg)" font-family="Inter, sans-serif">FormVision</text>
</svg>
```

## 4. Colour

The UI is dark-first: TVs in gyms run bright, dark backgrounds reduce glare, and a dark UI makes the camera feed and skeleton stand out.

| Token | Hex | Use |
|---|---|---|
| `--fv-ink` | `#0B0F14` | App background |
| `--fv-surface` | `#151B23` | Cards, panels, right column of Session |
| `--fv-surface-2` | `#1F2732` | Raised/focused card fill |
| `--fv-text` | `#F2F5F8` | Primary text (not pure white; avoids blooming) |
| `--fv-muted` | `#8A96A3` | Secondary text, labels |
| `--fv-focus` | `#3D8BFF` | Focus ring, primary button |
| `--fv-good` | `#2EE59D` | Good form: skeleton, meter fill, success |
| `--fv-fault` | `#FF6B4A` | Fault: skeleton segment, fault counts |
| `--fv-warn` | `#FFB020` | Tracking lost, warnings, Replay badge |

Rules:
- **Never encode form state by colour alone.** About 8% of men have red–green colour vision deficiency, and good-vs-fault is exactly that pair. Each state is encoded three ways:

| State | Colour | Line | Extra |
|---|---|---|---|
| Good | `--fv-good` | 6 px solid | — |
| Fault | `--fv-fault` | 10 px solid, 1 Hz pulse in width | ▲ marker on the faulty joint |
| Unknown / low visibility | `--fv-muted` | 4 px dashed | — |

- Text contrast: `--fv-text` and `--fv-muted` on `--fv-ink` / `--fv-surface` meet WCAG AA at the type sizes in §5.
- Avoid fully saturated `#FF0000`/`#00FF00`: they bloom and crush on many TV panels.
- Nothing important uses large solid bright fills. Brightness belongs to the skeleton and the focus ring.

## 5. Typography (10-foot)

- **Typeface:** Inter (SIL Open Font License), bundled with the app. Use tabular numerals (`font-variant-numeric: tabular-nums` or the platform equivalent) for timers and percentages so digits don't jitter.
- Don't use Amazon Ember: it's an Amazon brand font and its licence for third-party apps is unclear.

| Role | Size @1080p | Weight | Example |
|---|---|---|---|
| Display (timer) | 120 px | 700 | `00:42` |
| H1 (screen title) | 56 px | 700 | "Plank" |
| H2 (card title, cue card) | 40 px | 600 | "Hips up a little" |
| Body | 30 px | 400 | Descriptions, settings rows |
| Caption (minimum) | 24 px | 500 | Status bar, HUD |

- Nothing smaller than 24 px. Maximum ~40 characters per line on the right column.
- Line height 1.25 for headings, 1.4 for body.

## 6. Layout and focus

- Canvas 1920×1080. Title-safe inset 96 px left/right, 54 px top/bottom; all text and focusable items stay inside it.
- 8 px spacing grid. Common steps: 16 / 24 / 32 / 48 / 64.
- Corner radius: 16 px cards, 12 px buttons, 999 px badges.
- **Focus state:**
  - 4 px `--fv-focus` ring with 4 px offset.
  - Card scales to 1.05 and its fill changes to `--fv-surface-2`.
  - 150 ms ease-out.
  - Focus must be obvious from 3 m without relying on colour alone; the scale and the ring both carry it.
- Primary button: `--fv-focus` fill, `--fv-ink` label, 600 weight.

## 7. Motion

| Motion | Duration | Curve | Notes |
|---|---|---|---|
| Focus move | 150 ms | ease-out | Scale + ring |
| Screen transition | 250 ms | ease-in-out | Crossfade + 24 px slide |
| Skeleton state change | ≤ 100 ms | linear | Must feel instant; it is feedback |
| Fault pulse | 1 Hz | sine | Width only, never flashing colour (seizure safety: stay well under 3 flashes/s) |
| Cue card in | 200 ms | ease-out | Slide up + fade |

- Respect the platform's reduce-motion setting if Vega exposes one **[VERIFY]**. When it is on, the fault pulse becomes a static thick line.

## 8. Sound

- **Voice:** one consistent coach voice across Bedrock cues and local fallback cues, so the fallback is indistinguishable. Use Amazon Polly with a single neural voice chosen at build time (candidates: Ruth, Matthew; pick after a listening test). The local cues are pre-rendered with the same voice (TECH-SPEC §6.4).
- **Earcons:**
  - Short, soft, and in the same key.
  - Generated or original; no third-party samples.
  - The success chime is the brand sound and is reused in the video title card.
- Ducking: cues lower other app audio by ~50% while speaking.

## 9. Demo video style (submission)

- **0:00–0:25:** the hero moment, cold open, with no title card first. Plank, sag, cue, fix, chime.
- **0:25–2:30:**
  - How it works: architecture diagram and the privacy payload on screen.
  - Setup flow.
  - Results screen.
- **2:30–2:55:** impact and why Fire TV, then the tagline and title card.
- Shoot from behind and beside the user so both the TV and the person are in frame. Also screen-capture the TV output for crisp UI.
- Only original or royalty-free music, credited in the description. No brand logos visible in the room.
