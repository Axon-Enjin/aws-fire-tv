# Request for Comments (RFC) / Tech Spec

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A
**Decision:** [FILL]

---

## 1. Context & Objective

PRD-F4 needs landmarks. Two paths are in IDEA.md. Sticks have no camera. A Vega frame-access limit is an unresolved research note, not a test result. The demo needs one path that works. Choosing wrong wastes the only spike window. Effort to try a path: UNCALIBRATED.

This RFC does not decide. Aidan decides.

---

## 2. Proposed Solution

Recommendation, not a decision: build a thin landmark interface first, then try the on-device camera and the phone bridge in that order only if the first attempt fails quickly. IDEA.md already says to ship whichever works first and to keep the phone bridge as the fallback.

The interface:

- Input to the rest of the app is landmarks and a timestamp.
- Frames never cross the interface.
- The UI and the angle rules do not import a camera SDK.

---

## 3. Technical Details & Contracts

| Field | Contract |
|-------|----------|
| Landmark | A named joint and an x, y, and optional z, plus a confidence |
| Frame image | Not part of the contract |
| Failure | Adapter returns no body, and the UI uses the error state |
| First exercise | Squat, then plank |

SDK choice, ports, and the phone discovery method are [FILL].

---

## 4. Alternatives Considered

| Option | Why it might win | Why it might lose |
|--------|------------------|-------------------|
| On-device camera on a Cube or emulator | One device in the demo video | Stick has no camera. Frame access is unproven |
| Phone runs pose and sends numbers | Works for Stick owners. Numbers only | Needs a second device and a same-network link |
| Wait for Vega camera docs | Avoids a throwaway path | The deadline does not wait. UNCALIBRATED delay |

---

## 6. Security, Privacy & Performance

Both options keep frames on the device that captured them. The phone path must not send JPEG or video. A LAN socket without auth is acceptable only on a trusted home network for the demo, and that assumption is [FILL] if the demo network is shared.

---

## 7. Execution Plan

1. Aidan marks one path as the first spike.
2. The spike prints a skeleton or fails. It is disposable and is not the submission build.
3. Update this Draft with the result. Do not lock it before that.

---

## Self-Check

- [x] The decision is explicitly [FILL]
- [x] Both paths are written down
- [x] The contract forbids frames on the wire
