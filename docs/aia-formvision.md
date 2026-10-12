# AI Assurance Dossier (AIA)

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A

---

## 0. Trigger and Scope

| Field | Value |
|-------|-------|
| AI component | Cue phrasing and next-exercise choice from joint state |
| Realizing feature ID(s) | PRD-F1, PRD-F3 |
| System boundary | On-device rules decide the fault. The model writes text and may choose a library exercise id |
| Autonomy level | Generates a sentence and a library id. Calls no tools. User can ignore it |
| Provisional risk classification | Not assessed against a statute. Posture is CLR-P2. Awareness only |

---

## 1. Model / System Card

### 1.1 Intended use

| Field | Value |
|-------|-------|
| Intended use | One short form cue, and a swap inside a fixed exercise list |
| Intended users | The person exercising, and judges watching the demo |
| Out-of-scope / prohibited uses | Diagnosis, treatment, dosage, training plans for a medical condition, anything about children |
| Human-in-the-loop points | The person sees the joint marker even if they ignore the sentence |

### 1.2 Model(s) and data

| Model / stage | Identifier + version | Role | Data it sees |
|---------------|----------------------|------|--------------|
| Cue | [FILL] | Phrase the cue | Joint name, angle, exercise id, rep count |
| Swap | [FILL] | Pick a library id | Constraint text plus the current plan |

- **Training / tuning data:** Provider base model. No fine-tune. [FILL] which provider contract applies.
- **Run-time input:** Untrusted: constraint text and any string derived from it. Trusted relative to the user: angles computed on device.
- **Output contract:** One sentence, or one id from the exercise list. Anything else is discarded.
- **Provider data terms:** [FILL]. Do not assume the provider forgets the prompt.

### 1.3 Limitations and performance caveats

- The model does not see the body. A wrong angle rule produces a confident wrong sentence.
- **Known failure modes:** generic advice, an exercise outside the list, a delayed reply.
- **Fallback behavior:** keep the joint marker. Skip speech if the reply misses the timeout. Timeout is [FILL]. Measured latency: UNCALIBRATED.

---

## 2. NIST AI RMF Risk Register

| ID | Risk | Control | Residual |
|----|------|---------|----------|
| AIA-R1 | Cue contradicts the angle rule | Rule stays in code | Marker is still right if the sentence is wrong |
| AIA-R2 | Unsafe or medical language | Prohibited-use list. Exact prompt is [FILL] | [FILL] until QAD Q6 is run |
| AIA-R3 | Frames sent by mistake | Adapter contract forbids frames | Needs Q4 before the demo |
| AIA-R4 | Latency makes the cue useless | Fallback to the marker | UNCALIBRATED until measured |

---

## 4. Cross-links and Escalation

| Topic | Where |
|-------|-------|
| Product behavior | PRD §7 |
| Architecture | SDD §8 and §8.1 |
| Tests | QAD §7 |
| Privacy posture | CLR-P1 and CLR-P2 |
| Escalation | Aidan stops the demo if a cue gives a dangerous instruction (QAD P0) |

No external assessment is scheduled.

---

## Self-Check

- [x] Scope names what the model may not do
- [x] Model id is [FILL], not a guess presented as chosen
- [x] Fallback does not depend on the model
