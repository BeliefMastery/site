# Question Inventory

## Purpose
This inventory maps each engine's question sources, scale formats, and scoring entry points so suitability review can be executed consistently.

## Engine Inventory
| Engine | Primary question sources | Approx question unit count | Question key/id pattern | Response format(s) | Scoring entry points |
|---|---|---:|---|---|---|
| Pathology Assessment | `dsm5-data/refined-questions.js`, `dsm5-data/question-templates.js`, `dsm5-data/category-guide.js`, disorder modules in `dsm5-data/*.js` | ~164 ids in DSM question modules | `q_category_*`, `${category}_${disorder}_${criterion}_${symptom}` + refinement ids | `0-10` scaled, `true/false/unsure` guide | `calculateResults()`, `calculateValidationAdjustment()`, `detectComorbidity()` in `diagnosis-engine.js` |
| Manipulation Defense Decoder | `manipulation-data/manipulation-questions-v2.js`, `symptom-questions.js`, `effect-questions.js`, `consequence-questions.js` | ~56 ids/objects | `p1_*`, `p2_prioritization`, `p3_${vectorId}_*` | `three_point`, `multiselect`, `frequency`, `binary_unsure` | `analyzePhase1Results()`, `processPhase2Results()`, `processPhase3Results()`, `calculateResults()` in `manipulation-engine.js` |
| Dependency Loop Tracer | `needs-dependency-data/dependency-loop-questions.js` | ~201 ids/keys | `p0_*` to `p4_*` phases, loop-specific keys | `scenario`, `multiselect`, `scaled`, `need_chain` | `processPhase0Results()`, `analyzePhase1Results()`, `analyzePhase2Results()`, `analyzePhase3Results()`, `analyzePhase4Results()` in `needs-dependency-engine.js` |
| Life Domain Review | `coaching-data/sovereignty-obstacles.js`, `coaching-data/satisfaction-domains.js` | 15 obstacle questions + 10 domain overview + domain aspects | `obstacle_${key}`, `domain_${key}_overview`, `domain_${key}_aspect_${n}` | `0-10` scaled | `calculateProfile()`, `calculatePriorities()`, `generateCoachingProfile()` in `coaching-engine.js` |
| Logos Structure | `paradigm-data/paradigm-questions.js` | ~36 ids | `p1_*`, `p2_*`, `p3_*` | `binary`, `multiselect`, `ranked`, `scenario`, `scaled` | `analyzePhase1Results()`, `analyzePhase2Results()`, `analyzePhase3Results()`, `identifyParadigms()`, `calculateIntegrationScores()` in `paradigm-engine.js` |
| Channel Flow Diagnostics | `channel-data/channel-questions.js` (+ supporting sets in `stage-questions.js`, `channel-symptoms.js`) | ~19 core ids in channel questions | `p1_${node}_${cat}`, `p2_prioritization`, `p3_${channelId}_*` | `three_point`, `multiselect`, `binary_unsure`, `scenario`, `frequency` | `analyzePhase1Results()`, `processPhase2Results()`, `processPhase3Results()`, `processPhase4Results()`, `calculateResults()` in `channels-engine.js` |
| Cognitive Resistance Capacity | `sovereignty-data/sovereignty-questions.js` | ~57 ids | Section keys `u*`, `c*`, `a*`, `s*`, `r*` | `multiple_choice`, `likert`, `multiple_response`, `frequency`, `frequency_grid`, `scenario` | `processAnswer()`, `analyzeSection1Results()` ... `analyzeSection5Results()`, `finalizeResults()`, `computeLayerScores()` in `sovereignty-engine.js` |
| Sovereignty Paradigm | `sovereignty-spectrum-data/questions.js`, `paradigms.js`, `derailers.js` | ~155 ids/structures | `phase2_${paradigmId}_*`, derailer ids | `0-100` sliders, `likert`, `text`, `select` | `rateParadigm()`, `calculateDerailerPenalties()`, `calculateSpectrumPosition()`, `resolveParadigmConflicts()` in `sovereignty-spectrum-engine.js` |
| Will Anomaly Mapping | `entities-data.js` | ~72 scoring/intake keys | tiered prompt ids (for tier1/2/3 scoring) + intake selects | `select`, `radio`, `checkbox` | `scoreTiers()`, `deriveContract()`, `buildStrategySteps()`, `completeAssessment()` in `entities-engine.js` |
| Aptitude Mapping | `outlier-aptitude-data.js` | ~100 ids | `q1..q37`, acuity slider ids, archetype/market keys | `select`, `checkbox`, `likert`, `0-10` sliders | `scoreDimensions()`, `blendQuestionnaireAndAcuity()`, `buildMarketProjection()`, `completeAssessment()` in `outlier-aptitude-engine.js` |

## Standardized Suitability Rubric (applies to all question units)
Score each item 1-5 on:
1. Clarity/readability
2. Single-construct focus (non-double-barrel)
3. Construct validity (does it measure target trait)
4. Context fairness (culture/life-stage sensitivity)
5. Neutrality (not leading/shaming/alarmist)

Severity mapping:
- `P0`: any score `<=2` on construct validity or neutrality
- `P1`: any score `<=2` on clarity/single-construct/context
- `P2`: all dimensions `>=3` with wording polish opportunity

## Engine-Level Suitability Snapshot
| Engine | Clarity | Construct alignment | Bias/leading risk | Notes |
|---|---:|---:|---:|---|
| Pathology | 3 | 3 | 2 | High content density; some clinical framing over-certainty in labels and summaries |
| Manipulation | 3 | 3 | 2 | Good taxonomy coverage; some deterministic and disempowering wording |
| Dependency Loop | 3 | 3 | 2 | Structurally strong phases; occasional absolutist guidance language |
| Coaching | 4 | 3 | 3 | Generally readable; some deficit-heavy framing and rigid directives |
| Logos | 3 | 3 | 3 | Multi-format items are useful; some overgeneralized interpretive language |
| Channels | 3 | 3 | 2 | Actionable prompts; blockage labels read as categorical certainty |
| Sovereignty | 3 | 3 | 2 | Broad coverage; vulnerability terminology can read alarmist |
| Sovereignty Spectrum | 3 | 3 | 2 | Rich model; dominance and penalty language can overstate certainty |
| Entities | 3 | 2 | 3 | Short additive structure can overfit to few choices; language moderate |
| Aptitude | 4 | 3 | 3 | Clear scales; output labels can imply stronger prediction than supported |

## Immediate Inventory Follow-up
- Add per-question row exports from each data module into a machine-readable `csv` for future delta audits.
- Add a stable `questionVersion` field to each engine dataset to support regression tracking across rewrites.
