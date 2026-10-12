# Project Build Guide

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A

---

## 1. How to Build From These Docs

Read in this order before writing app code:

1. [state.md](state.md)
2. [idea-formvision.md](idea-formvision.md)
3. [prd-formvision.md](prd-formvision.md)
4. [rfc-formvision-camera-path.md](rfc-formvision-camera-path.md)
5. [sdd-formvision.md](sdd-formvision.md)
6. [qad-formvision.md](qad-formvision.md)

Do not implement PRD-F5. Do not send camera frames off the device.

The root `AGENTS.md` stays the engine pointer. This file is the build guide. It was not copied over that pointer.

**Trace:** PRD-F1 and PRD-F4 share the landmark contract. PRD-F2 uses the same stream. PRD-F3 may call the cue model only with text and ids.

---

## 3. Stack Currency & Deprecations

Stack is not pinned. IDEA.md allows a Fire OS app in a TV React Native sample or in Kotlin, and a pose library on device or in the phone browser. Choosing among those is [FILL] after the camera RFC.

Do not treat training-memory versions as current. When a stack is chosen, record the version, the date checked, and the doc URL in this table.

| Use | Not | Reason |
|-----|-----|--------|
| [FILL] | [FILL] | No stack chosen, so no deprecation row is honest yet |

---

## 4. Golden-Path Patterns

Landmark adapter:

- Return joints and a timestamp.
- Do not return pixels.
- If there is no body, return an empty result. The UI already has an error state.

Cue call:

- Send exercise id, joint, angle, rep count, and optional constraint text.
- Discard any model output that is not one sentence or one library exercise id.
- On timeout, update the joint marker and skip speech.

Secrets come from the environment. Effort to stand up the first path: UNCALIBRATED.

---

## 5. Conventions & Guardrails

- No app code in the docs pass.
- No license file until Aidan asks.
- Tests for US-01 through US-04 before calling the demo done.
- Engineering level: L0. A CI pipeline is not required until a second contributor or a repeated bug class shows up.

## 5.2 Public Surface & Crawler Policy

The public surface this cycle is the git repo once it is made public, plus a demo video. There is no product website.

- Search and training crawlers of a website: not applicable. No site, so no robots file.
- Training-bot posture for a future site: [FILL], same revisit as CLR-P1.
- Demo video: no third-party music or footage. English. Under three minutes.
- Repo license file: [FILL]. Not added here.

---

## 5.3 Engineering Maturity Level

L0. Evidence: one track main, no production deploy, no repeated regression class.

---

## Self-Check

- [x] Pointer file at the repo root was not replaced
- [x] Stack versions are not invented
- [x] Frame ban is explicit
