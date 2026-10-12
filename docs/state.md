# Project State: FormVision

**Project slug:** `formvision`
**Owner:** Aidan
**Last updated:** 2026-10-12

---

## 1. Position

| Field | Value |
|-------|-------|
| **Current milestone** | Specify |
| **Entered on** | 2026-10-12 |
| **Exit condition** | Aidan accepts the Draft PRD must-haves, and the camera path is chosen |
| **Next milestone** | Shape |
| **Current blocker** | Camera path is [FILL] |
| **Owner of the next step** | Aidan |

**What we are building, in one line:** A Fire TV that watches a workout and speaks a short cue when a joint angle drifts.

**Engagement type:** product-led

**Vault status:** none

---

## 2. Active signals

| Signal | True? | Evidence | Requires |
|--------|-------|----------|----------|
| S1 Frontend will exist | yes | Split-screen TV UI in IDEA.md | DSD |
| S2 Integration and security boundary | yes | Landmark numbers may leave the device for cue phrasing | SDD |
| S3 Material trade-off | yes | On-device camera or a phone bridge, both still open | RFC |
| S4 Non-trivial behavior | yes | Form cue, rep counting, and a constraint swap | PRD |
| S5 Agents or a team will implement | yes | Hackathon build, track main plus coding agents | BUILD |
| S7 Demo date, not a production deploy | yes | Submission Sat Oct 24, 2026, 3:00 AM PHT | QAD now; OPS only before a production release |
| S9 User data | yes | Camera view of the body; joint numbers | CLR |
| S10 Sensitive class | yes | Body pose is biometric-adjacent; health context | CLR bars |
| S11 Public repo intended | yes | Devpost requires a public repo with an OSS license later | README already exists; license file not added |
| S12 AI in the product | yes | Cue phrasing and session re-plan from joint state | AIA |
| S20 External APIs | yes | Cue model and on-device pose library | failure modes in SDD and QAD |
| S22 Judges and a demo | yes | Fire TV track demo video | PITCH |
| S27 Time box | yes | Hackathon deadline above | compression only |
| S29 Data-protection rules plausibly apply | yes | Camera and body data, US and Philippines | CLR posture, not a blocker |
| S30 Riskiest assumption is testable in code | yes | Which camera path runs first | spike not built; no app code this slice |

**Deliberate absences:**

- No production deploy and no uptime dependency, so no OPS.
- No money changes hands in the hackathon slice, so no UES. Price figures stay in the existing research files and are not copied here.
- No funding ask and the direction is already chosen, so no BRD.
- No user acquisition this cycle, so no GTM.
- No named buyer, so no OPP or PROP.
- Fewer than three specialist spawns, so no SAD.
- The event has not ended, so no WRAP.
- No second human contributor confirmed, so engineering level stays L0.
- Not a repo the team does not own, so not External Mode.

---

## 3. Operating frameworks

| Dimension | Choice | Why |
|-----------|--------|-----|
| **Project management** | milestones | Hackathon with one demo gate |
| **Engineering maturity** | L0 | Solo track main; no repeated regression class yet |
| **Subagents** | none | Nothing has been spawned three times |

---

## 4. Open assumptions

| ID | Assumption | Risk if wrong | Reversible? | Owner | Resolve by |
|----|-----------|---------------|-------------|-------|------------|
| A1 | A camera path can show a live skeleton on a Fire TV or emulator before the deadline | The demo cannot be filmed | yes, by switching path | Aidan | first spike |
| A2 | Joint angles alone are enough for the cue model to phrase a safe correction | Cues are wrong or late | yes | Aidan | first scripted set |
| A3 | The hackathon slice does not take payment or keep accounts | A later accounts decision reopens CLR | yes | Aidan | [FILL] |
| A4 | Pose viewing is not a licensed medical device for this demo | A health-claim reading would add counsel | [FILL] | Aidan | before any health claim in the store listing |

**Open questions for the user:**

1. Which camera path ships in the demo: on-device, or the phone bridge? [FILL]
2. Is an emulator recording enough, or is a Fire TV Cube and webcam required? [FILL]

---

## 5. Decisions

| ID | Question | Decision | Evidence class | Review when |
|----|----------|----------|----------------|-------------|
| D1 | Which pitch | FormVision, not FitFlow or GymClock+ as the core | Project Canonical | if A1 fails |
| D2 | Video off device | Do not send camera frames off the device | Project Canonical | if the cue design changes |
| D3 | License file | Not added in this change | Human Decision | when the repo is made public |

---

## 6. Context exclusions

| Excluded | Reason | Where it lives now |
|----------|--------|--------------------|
| Engine source tree | Must not be committed | not in this repo |
| Price and revenue figures | Leave them in the research files | Fire-TV-Hackathon-Research.md, README.md, IDEA.md |

---

## 7. Next actions

1. Aidan picks the camera path. Until then it stays [FILL].
2. Spike the chosen path. Effort: UNCALIBRATED. No measured rate is in the repo.
3. Do not add a license file or change visibility until asked.

**Artifact plan for this slice:**

| Artifact | Why it is justified now | Status |
|----------|-------------------------|--------|
| STATE | First orchestrated build | done |
| IDEA | Frame artifact for the chosen direction | done |
| SCRUTINY | Required before any plan from an IDEA | done |
| VALIDATION | External users and a real opportunity cost | done |
| PRD | Several features to agree on | done |
| DSD | A TV UI will exist | done |
| SDD | A model integration and a data boundary exist; written so both camera paths still fit | done |
| RFC | Two camera paths, choice not made | done |
| QAD | Demo must-haves need tests | done |
| CLR | Camera and body data | done |
| AIA | A model phrases the cue | done |
| PITCH | Judges and a demo | done |
| BUILD | Agents will implement from the specs | done |
| INDEX, LOG | Bookkeeping | done |

---

## 8. Self-Check

| Check | Done |
|-------|------|
| Milestone and exit condition are current | [x] |
| Every listed signal has real evidence | [x] |
| Every assumption made this session is in §4 | [x] |
| Artifact plan contains no untriggered artifact | [x] |
| Context exclusions updated after any pivot | [x] |
