# IDEA Scrutiny Gate (SCRUTINY)

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A
**IDEA:** [idea-formvision.md](idea-formvision.md)

---

## 1. Verdict

**Decision:** PROCEED WITH FIXES

**One-line rationale:** The lock bar is specific, nothing in the repo contradicts the load-bearing camera assumption, and the product does not need to upload video. The camera path and several cited research claims are still unchecked.

**If PROCEED WITH FIXES, items carried into the build:**

- PRD: camera source stays [FILL] until a spike, and both paths must still satisfy the same cue behavior.
- RFC: record both camera paths and do not pretend a choice was made.
- CLR and AIA: body pose and the cue model are in scope; founder posture sign-off is [FILL].
- VALIDATION: market and price claims in the research file were not re-checked.

---

## 2. Claim & Reference Audit

**Coverage:** Claims extracted: 6; load-bearing: 4; verified: 2; unverified: 4; contradicted: 0.

| # | Category | Claim (from IDEA) | Finding | Source (required if Verified) | Severity if wrong |
|---|----------|-------------------|---------|-------------------------------|-------------------|
| FC-1 | Problem | Home workouts on a TV get no form feedback | Unverified; needs check | Fire-TV-Hackathon-Research.md §2, not re-fetched | Significant |
| FC-2 | Solution | A pose model can track a body as a skeleton on device | Verified | https://developers.google.com/edge/mediapipe/solutions/vision/pose_landmarker (2024 landmark model, 33 landmarks) | Significant |
| FC-3 | Technical | Only joint numbers need to leave the device for a cue | Unverified; needs check | Design intent in IDEA.md; no spike yet | Significant |
| FC-4 | Technical | Some camera path will run on a Fire TV or emulator in time | Unverified; needs check | No spike result in the repo | Fatal if it stays false |
| FC-5 | Insight | The Fire TV track names a camera fitness app as a creative example | Verified | https://amazonappdev2026.devpost.com/ rules, Fire TV creative examples, retrieved via HACKATHON.md | Minor |
| FC-6 | Market | Published price and revenue figures in the research file | Unverified; needs check | Left in the research file; not used as a build input | Minor |

### 2.1 References Integrity

| # | Reference | Backs claim | Resolves? | Supports it? | Finding |
|---|-----------|-------------|-----------|--------------|---------|
| R-1 | IDEA.md (root narrative) | FC-3 | Yes, in repo | Partly | Unverified |
| R-2 | Fire-TV-Hackathon-Research.md | FC-1, FC-6 | Yes, in repo | Partly | Unverified |
| R-3 | HACKATHON.md | FC-5 | Yes, in repo | Yes | Matches the cited page |
| R-4 | PROMPT.md | research method only | Yes, in repo | No product claim | Unverified |
| R-5 | ORG.md | sponsor context | Yes, in repo | No load-bearing product claim | Unverified |

---

## 3. Gap Analysis

| # | Missing input | Needed by (doc) | Blocker or TBD |
|---|---------------|-----------------|----------------|
| G-1 | Which camera path works first | RFC, SDD, QAD | TBD, marked [FILL] |
| G-2 | Whether a Cube and webcam exist for the video | PITCH | TBD, marked [FILL] |
| G-3 | Measured cue latency | SDD | TBD. Stated target only. Measured rate: UNCALIBRATED |
| G-4 | Founder sign-off on health and biometric posture | CLR | TBD, marked [FILL] |
| G-5 | OSS license choice | release checklist | TBD. File not added |

---

## 4. Assumption Stress-Test

**Load-bearing assumption:** A camera path we can run produces a stable skeleton before the submission deadline.

**Strongest argument against it:** Fire TV Sticks have no camera, Vega may not expose raw frames, and no device spike is in the repo.

**Does it hold?** At risk. The idea names a phone bridge as a fallback, and that fallback is not proven either.

**Cheapest test:** A disposable spike on one path that draws a skeleton. Effort: UNCALIBRATED.

### 4.1 Audience / 10-second stress

| Check | Finding |
|-------|---------|
| Stranger hook: who hurts and why, in 10 seconds, without slides | Pass. A person training from a TV video is corrected mid-set. |
| Named user and pain present in IDEA §2 | Pass. Home-gym owner, knees or hips breaking form. |
| One-liner repeatable (not generic SaaS) | Pass. A Fire TV that sees form and speaks one fix. |
| Why not keep coping with the status quo? | Pass. The status quo is a video that cannot see you, or hardware the idea treats as out of reach. |

**Audience verdict:** Holds. The pain scene is concrete. The unproven part is the camera, not the story.

---

## 5. Feasibility & Scope

| Check | Finding |
|-------|---------|
| "If we ship only one thing" is shippable in the window | At risk. One squat set is a small slice. The camera spike is the unknown. Effort: UNCALIBRATED |
| Production-grade reachable (security, data, rollback) | Holds for the demo bar: no video upload, no accounts. Production store release is later |
| Cut line honest, not hiding work | Pass. Profiles, history, and payments are out |

---

## 6. Risk & Regulatory Pre-flight

| Flag | Present? | Pulls in |
|------|----------|----------|
| Collects user data / PII | Yes | CLR §1, §3 |
| Children, health, payment, biometric, or precise-location data | Yes, body pose. Children features are out. Payments are out | CLR §3 |
| Regulated activity (license, franchise, permit, sector rule) | Possible data-protection duties. Medical-device status is [FILL] | CLR §7 |
| AI component with untrusted input or tools | Yes. A typed or spoken constraint and joint state reach a model | SDD §8.1, QAD, AIA |
| Security-critical paths (auth, money, deletes) | No accounts and no payments this slice | none beyond input checks |
| Public deploy | The repo is intended to become public. No production service yet | README stays; OPS later |

---

## 7. Blocking Questions

None. The verdict is not DO NOT BUILD YET.

---

## Self-Check

- [x] Verdict matches the findings; DO NOT BUILD YET names a fatal flaw (1, 2, or 3)
- [x] Coverage line filled; every load-bearing claim has a row
- [x] No Verified row without a source
- [x] §2.1 audits every reference cited in the IDEA (or states there are none)
- [x] §4.1 filled, even in Quick Mode
- [x] §6 flags name the docs they pull in; regulatory flags route to CLR §7, not to §7 here
