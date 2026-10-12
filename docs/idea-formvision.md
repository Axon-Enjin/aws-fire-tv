# Idea Brief (IDEA)

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A
**Event / context:** Amazon Developer Hackathon, Fire TV track. Submission closes Sat Oct 24, 2026, 3:00 AM PHT.

---

## 1. The Spark

**One-line pitch:** FormVision turns a Fire TV into a coach that sees your form and tells you the one fix.

**Problem:** People follow workout videos on the biggest screen in the house and get no feedback when their form breaks.

**Insight (why us, why now):** The pose can be judged on the device. Only joint numbers need to leave, so the cue can be phrased without sending video. The track already names a camera fitness app as a creative example.

**Riskiest assumption:** A camera path we can actually run (on the device, or from a phone) produces a stable skeleton in time for the demo.

---

## 2. Who It's For

**Primary user (named, specific):** A US home-gym owner who follows a workout video on the living-room TV and trains alone.

**Their moment of pain:** Mid-set, the knees cave in on a squat, or the hips sag in a plank, and the video keeps going.

**Success in their words:** "It caught my knees and told me what to fix before I finished the set."

---

## 3. Scope & Cut Line

| # | Capability | Core to the one thing? |
|---|------------|------------------------|
| 1 | Live skeleton and a spoken or on-screen cue when a joint angle is off | yes |
| 2 | Automatic rep, set, and rest tracking | yes |
| 3 | Swap the next exercise when the user states a constraint | yes for the target demo |
| 4 | On-device camera or phone bridge | yes, which one is [FILL] |
| 5 | Profiles, history charts, store payments | no |

**Explicitly out of scope (v0):** Branching instructor video, gated voice-logging add-ons, multi-user profiles, history charts, and store payments.

**If we only ship one thing:** One squat set on a Fire TV or emulator: the skeleton tracks the user, one fault turns the joint marker from safe to fault and back, and the set ends on its own.

---

## 4. Success & Judging Criteria

**How we know it worked:** A reviewer can watch one set and see the fault, the cue, and the correction without a remote press to log the rep.

| Criterion | How we hit it |
|-----------|---------------|
| Tech implementation | Pose on the device, cue from joint state |
| Design | Split screen, readable from the couch, D-pad to pick the exercise |
| Potential impact | Uses a TV the person already has |
| Quality of the idea | The rules cite a computer-vision fitness app as a creative example |

---

## 5. Concept Visuals

No image files exist yet.

| Screen / section | Asset path | Decision |
|------------------|------------|----------|
| Split screen: live skeleton and target form | [FILL] | red marker on the bad joint, green after the user corrects |

---

## 6. Open Questions

| Question | Owner | Resolve by |
|----------|-------|------------|
| On-device camera or phone bridge first? | Aidan | first spike |
| Emulator recording or a Cube plus webcam? | Aidan | [FILL] |
| Which cue model, Haiku or Nova Micro? | Aidan | [FILL] |

**Spike plan (optional):** A disposable spike that opens one camera path and prints a skeleton. Not built in this docs pass. Result would feed Scrutiny. Effort: UNCALIBRATED.

---

## Self-Check

- [x] Lock bar fields are real, specific, and not placeholders
- [x] Riskiest assumption named; a spike is planned if code is the cheapest test
- [x] Cut line explicit; "If we only ship one thing" named
