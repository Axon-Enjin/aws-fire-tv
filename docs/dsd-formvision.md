# Design System Document (DSD)

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A

---

## 0. Brand Stance

### The Three Rules

- **Make it relatable:** The screen is a workout, not a dashboard. The person should recognize their own limbs.
- **Make it human:** The cue sounds like a coach in the room, one fix, not a report.
- **Make them part of the branding:** Copy speaks to someone mid-set, ten feet from a TV, not to a generic fitness subscriber.

### Mode

**Selected mode:** `Product (task-first)`

### Aesthetic Provenance

**Cultural or aesthetic reference:** `A gym whiteboard and a coach standing beside you. High contrast, large type, no chrome.`

**Line AI slop would never write:** `Knees out.`

**Archetypical user:** `A home-gym owner mid-squat, alone, looking at the TV instead of a phone.`

**Category slop default:** `Purple gradient, glass cards, a floating orb, tiny text.`

**How users appear in the brand:** `As a live skeleton on their own camera, not as a stock athlete.`

### Anti-References

Must not resemble: `a streaming poster grid` · `a smart-mirror luxury ad` · `a phone fitness app shrunk onto a TV`

---

## 0.5 Concept Visuals (from IDEA)

No image files. The intended frame is a split screen: live skeleton on one side, target pose on the other. A bad joint is marked as a fault. A corrected joint is marked safe. Asset path: [FILL].

---

## 1. Design Philosophy & Vision

The UI is a 10-foot display. The D-pad picks an exercise. During the set the eyes should land on the joint marker and one line of cue text. Nothing else competes.

---

## 2. Brand Primitives

Colors, type, and logo files are [FILL]. Until they exist, use the largest type the TV template allows, a fault color and a safe color that differ without relying on red versus green alone (add a label: "fix" or "ok"), and no decorative illustration.

### 2.1 Color

| Token | Value |
|-------|-------|
| background | [FILL] |
| text | [FILL] |
| fault | [FILL] |
| safe | [FILL] |

### 2.2 Logo System

No logo file. Clear space, minimum size, and don'ts are [FILL].

### 2.3 Typography

| Role | Font | Weight / size / line height |
|------|------|-----------------------------|
| Cue line | [FILL] | Large enough to read from a couch. Exact px [FILL] |
| Exercise name | [FILL] | [FILL] |
| Rep count | [FILL] | [FILL] |

**Loading / license / fallback:** [FILL]. Do not ship an unlicensed font.

---

## 3. Layout & Spatial System

Two columns on a 16:9 TV: live pose, target pose. Rep count and cue sit in a band that does not cover the joints. Focus order follows the D-pad: exercise list, then start. Spacing scale is [FILL].

Empty: picker with no camera yet, one line that says to start when ready.
Loading: "Finding you" while landmarks are absent.
Error: camera denied or no body in frame, with the action to retry.
Success: joint marked ok after a fault.

---

## Self-Check

- [x] Stance is specific to a TV workout
- [x] Tokens that are unknown are [FILL], not invented hex
- [ ] Visuals not drawn
