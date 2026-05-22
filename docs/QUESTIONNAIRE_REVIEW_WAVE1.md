# Questionnaire Review — Wave 1

Engines: coaching, diagnosis, sovereignty-spectrum. Rubric: [`QUESTIONNAIRE_REVIEW_RUBRIC.md`](QUESTIONNAIRE_REVIEW_RUBRIC.md).

## Coaching (Life Domain Review)

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Obstacle / domain sliders (0–10 each) | **Keep** — independent salience per item | [`coaching-data/question-weightings.js`](../coaching-data/question-weightings.js) fixed weights; `weightedScore = raw × weight` |
| User priority across sections | **Keep** multiselect for sections only | Section inclusion gates question sequence |
| Relative priority within obstacles | **Defer** — would need allocation or ranked multiselect | Would override catalog weights; product decision |
| `userWeightAdjustment` | **Keep** — global multiplier on results | Does not change per-question UX |

## Diagnosis (Pathology Assessment)

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Per-symptom / criterion slider | **Keep** — DSM-weighted salience | `normalized = answer/10`; threshold ≥0.6 |
| Category multiselect (idle) | **Keep** | Gates disorder set |
| Comorbidity refinement | **Keep** multiselect + follow-up sliders | Refinement groups in `diagnosis-engine.js` |
| Symptom multiselect for weighting | **Not recommended** — weights are clinical catalog, not user allocation | N/A |

## Sovereignty Spectrum

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Phase 0: independent 0–100 paradigm sliders | **Keep** for v1; optional **Linked allocation** (P2) before top-N | Top 3–5 by rating; cosmetic gradient only today |
| Phase 2–3 likert | **Keep** — 1–5 radio | `(likert-1)/4 × paradigm.weight` |
| Normalize paradigms to 100% before top-N | **Defer** — changes who enters Phase 2 | Would alter `dominantParadigm` selection |

## Wave 1 summary

No mandatory scoring changes in Wave 1. Coaching and diagnosis UX validated for SPA slider flow. Sovereignty-spectrum optional normalize is P2 product scope.
