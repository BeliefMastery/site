# Regression Validation Plan

## Goal
Define reproducible golden-profile and threshold-edge tests for every engine so wording and weighting changes can be validated safely.

## Golden Profiles (per engine)
For each engine, maintain three canonical answer sets:
- `low_risk_balanced`
- `mid_mixed_signals`
- `high_risk_concentrated`

Each profile must persist:
- raw answers
- intermediate score breakdown (where available)
- final labels, bands, and top recommendations
- export output checksum (or stable snapshot)

## Threshold Edge Cases
| Engine | Edge cases to test |
|---|---|
| Pathology | Just below/above high/moderate disorder thresholds; high inconsistency validation pairs; comorbidity threshold crossing |
| Manipulation | Vector score at `2.49/2.5` and `0.49/0.5`; activation at `2.99/3` and `5.99/6` |
| Dependency Loop | Loop ranking ties; confidence at `3.99/4` and `5.99/6`; need-chain depth transitions |
| Coaching | Obstacle and domain near-tie ordering; volatility trigger boundaries (`>=7`, `>=5`) |
| Logos | Co-dominance gap near `1.5`; tension boundary near `3`; integration variance boundary effects |
| Channels | Node state at `1.49/1.5` and `2.49/2.5`; blocked/unblocked transitions with same average |
| Sovereignty | Split boundaries at `39/40` and `74/75`; adaptive section filter thresholds (dependency and cognitive complexity) |
| Sovereignty Spectrum | Quartile selection boundary; paradigm set clamp behavior (3 vs 5); derailer penalty accumulation boundaries |
| Entities | Tier tie behavior; one-answer flip sensitivity checks |
| Aptitude | Fit reordering near mismatch cap and acuity blend boundary; shortlist diversity cap effects |

## Assertions
1. **Monotonicity**: Higher adverse input must not reduce adverse classification unless explicitly explained.
2. **Label stability**: Minor input changes near non-threshold ranges should not produce major label shifts.
3. **Export parity**: Report text labels match computed scores and category assignments.
4. **Copy safety**: No banned deterministic phrases in output (regex gate from language risk log).
5. **Version traceability**: Export includes engine version and question set version.

## Minimal Automation Backlog
- Add a `tests/engine-golden/` suite with fixtures per engine.
- Add a text safety matcher for known high-risk terms.
- Add a score decomposition snapshot serializer for all engines.
- Add CI job to run golden + edge tests on any change touching:
  - `*-engine.js`
  - `*-data/*.js`
  - report/export utilities.
