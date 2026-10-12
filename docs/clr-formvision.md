# User Protection & Regulatory Posture Register (CLR)

**Project:** FormVision
**Date:** 2026-10-12
**Version:** 0.1
**Owner:** Aidan
**Status:** Draft
**Last reconciled:** N/A

Regulatory awareness only. This is not legal advice.

---

## 0. Target Markets

| Market | In this slice? | Why |
|--------|----------------|-----|
| United States | Yes, as the launch market named in the research | Demo may be filmed there or described for that user |
| Philippines | Yes, as the builder's location | A real person on camera during development may be the builder |
| Children | No | No child mode, no child account |
| Other countries | [FILL] | Not selected |

---

## 1. Data Inventory / Record of Processing

| Activity | Data | Who | Where it goes | Retention | Purpose |
|----------|------|-----|---------------|-----------|---------|
| Pose | Camera frames | The person in frame | Stays on the capturing device | Not stored in this design | Draw the skeleton. PRD-F1 |
| Cue | Joint angles, exercise id, rep count | Same person | Cue model | Provider retention is [FILL] | Phrase one cue |
| Constraint | Short text the user types or speaks | Same person | Cue model | [FILL] | Pick the next exercise. PRD-F3 |
| Secrets | API credentials | The builder | Environment, not the repo | Until rotated | Call the model |

No account email. No payment card. No precise location. No ad profile.

---

## 3. User-Protection Bars

| Flag | Present? | Bar we meet | Met? | Evidence |
|------|----------|-------------|------|----------|
| Any personal data | Yes | Minimize what leaves; no secrets in the repo; delete by ending the process because nothing is stored | Met for this demo slice | SDD §3 and §5. A stored history would reopen this |
| Any personal data | Yes | Breach runbook | Met only because there is no store to breach | Revisit before any durable store. OPS is not written yet |
| Children's data | No | Age gate if a child mode appears | Not applicable | PRD-F5 and child features are out |
| Health / biometric | Yes, body pose | Camera permission as the opt-in. Frames not stored. Cue payload is numbers. No diagnosis | Met for the demo design. Access logs are [FILL] if a store is added | SDD §5. Production release stays blocked until a deletion path exists for anything stored |
| Payments | No | Do not store cards | Not applicable | PRD-F5 |
| Precise location | No | Do not collect it | Not applicable | Not in the PRD |
| Automated decisions with significant effect | No | A form cue is advice the user can ignore. It does not grant or deny anything | Not applicable | AIA |
| Tracking / ads | No | No ad SDK | Not applicable | Not in the stack |

---

## 7. Regulatory Posture Register

| ID | Obligation | Applies because | Exposure | Enforcement reality | Posture | Rationale | Revisit when | Kill switch / fallback | Owner | Counsel before |
|----|-----------|-----------------|----------|---------------------|---------|-----------|--------------|------------------------|-------|----------------|
| CLR-P1 | Data-protection duties for camera and body data in the US and the Philippines | A person is on camera and numbers may be sent to a model | Civil or regulatory, not assessed here | [FILL] | COMPLY | Not uploading frames is the cheap protection. Filings and notices are [FILL] | Before any store listing or any recording of someone other than the builder | Stop the cue call and keep the demo fully on device | Aidan, 2026-10-12 | [FILL] |
| CLR-P2 | Health or medical-device rules if the copy claims to treat or diagnose | The product talks about form and injury risk in the research, not yet in UI copy | [FILL] | [FILL] | DEFER | Demo copy must not diagnose. No priced exposure because we are not making the claim | Before any health claim in a listing | Delete the claim. Ship the joint marker only | Aidan, 2026-10-12 | [FILL] |

No CONTEST row. No personal-criminal finding is asserted. If counsel later names one, add a row with the accountable person and a date.

---

## Self-Check

- [x] Markets declared
- [x] Processing rows have a retention note
- [x] Present flags have a demo-slice reading
- [x] Posture rows have an owner and a revisit
- [ ] Founder has not signed beyond this Draft
- [ ] Counsel not consulted
