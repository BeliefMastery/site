# Weighting Map

## Purpose
This file consolidates weighting, threshold, multiplier, and penalty mechanics across engines, plus calibration risk.

## Cross-Engine Weighting Matrix
| Engine | Weight fields/constants | Threshold/penalty behavior | Calibration risk |
|---|---|---|---|
| Pathology | `symptom.weight`, `criterion.weight`, validation pair weights, refinement constants (`0.9`, `0.8`, `0.85`) | Banding from `SCORING_THRESHOLDS`; validation dampener (`avgInconsistency * 0.3`) | Fixed dampener may under-correct contradictory responses; severe single-symptom cases can be smoothed away |
| Manipulation | `mapsTo.weight`, vector `weight`, question weights in symptom/effect/consequence sets | Activation thresholds (`>=6` high, `>=3` medium) + phase averaging | Mixed scales can let vector multipliers dominate weak evidence |
| Dependency Loop | `scoringWeight` + hardcoded blends (`0.25`, `0.2`, depth multipliers) | Confidence bands (`>=6`, `>=4`), rank-based top loops | Stacked hand-tuned constants create ranking instability around ties |
| Coaching | Obstacle/domain `weight`, `QUESTION_WEIGHTINGS`, runtime `userWeightAdjustment` | Priority chosen from weighted rank and domain lows | Near-tie rank ordering may lock users into unstable primary axis conclusions |
| Logos | `mapsTo.weight`, paradigm `weight`, confidence gap `<1.5`, tension `>=3` | Co-dominance + translation/integration heuristics | Question-density imbalance across paradigms can overweight better-covered paradigms |
| Channels | `mapsTo.weight`, state map (`open=3`, `neutral=2`, `blocked=1`) | State cutoffs (`>=2.5`, `>=1.5`), heuristic priority selection | Coarse 3-state mapping can hide nuanced partial blockage patterns |
| Sovereignty | Section score additions + constants (`+0.5`, `-0.3`, `-0.2`), frequency-grid scaling, split thresholds (`>=75`, `>=40`) | Filtered/adaptive question flow plus clamped 0-100 outputs | Path-dependent scoring from adaptive flow reduces comparability between users |
| Sovereignty Spectrum | Dominance blend (`0.6/0.4`), derailer penalties (`-10` to `-20`) | Quartile selection + clamp to 3-5 paradigms + bucketed final labels | Flat distributions can produce unstable selected set and dominance labels |
| Entities | Tier additive scoring (`tier1`, `tier2`, `tier3`) | Winner-take-max tier without uncertainty interval | Single-answer swings can flip final tier without confidence safeguards |
| Aptitude | Dimension weights, `acuityWeight=0.28`, mismatch penalty (`0.22`, cap `0.45`), qualifier multipliers | Composite fit ranking and shortlist diversity cap | Early multipliers can overshadow response-based aptitude signal |

## Risk Grading
| Risk level | Engines | Why |
|---|---|---|
| High | Sovereignty, Sovereignty Spectrum, Dependency Loop, Aptitude | Multiple interacting constants and path/selection effects |
| Medium | Pathology, Manipulation, Logos, Channels | Threshold and weighting interactions mostly manageable but sensitive near cutoffs |
| Medium-Low | Coaching, Entities | Fewer moving parts; primary risk is rank tie behavior and additive fragility |

## Required Calibration Tests
1. **Threshold edge sweeps**: values immediately below/above each major cutoff.
2. **Monotonicity checks**: stronger adverse input should not reduce severity unexpectedly.
3. **Coverage normalization**: paradigms/vectors with more mapped items should not auto-dominate.
4. **Path consistency**: adaptive filters should not produce materially different outputs for equivalent latent profiles.

## Hardening Recommendations (pre-remediation)
- Externalize hardcoded constants into versioned config for each engine.
- Add per-engine score decomposition output (`raw`, `weighted`, `penalty`, `final`) for audits.
- Add tie-handling and confidence intervals where winner-take-all ranking is used.
