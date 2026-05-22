# Questionnaire Inventory (All Engines)

Storage: `engine.answers[questionId]` unless noted. Scoring entry points are primary analysis methods.

| Engine | Phase / section | `question.type` (or UI) | Answer shape | Scoring entry |
|--------|-----------------|---------------------------|--------------|---------------|
| **diagnosis** | questionnaire | `symptom`, `criterion`, `validation`, refinement types | number 0–10 | `calculateProfile`, disorder weights in DSM data |
| **coaching** | obstacles / domains | `obstacle`, `domain_overview`, `domain_aspect` | number 0–10 | `calculateProfile`, [`question-weightings.js`](../coaching-data/question-weightings.js) |
| **paradigm** | 1 | `binary`, `scenario`, `ranked`, `multiselect` | bool / option / array / ranked array | `analyzePhase1Results` |
| **paradigm** | 2 | `scaled`, **`allocation`** (SPA) | number 1–7 or `{ weights, sum, version }` | `calculateParadigmScores`, dimension keys `p2_dimension_*` |
| **paradigm** | 3 | `scaled`, `multiselect` | number / array | `analyzePhase3Results` |
| **needs-dependency** | 0–4 | `scenario`, `multiselect`, `scaled`, `need_chain` | mixed | Phase analyzers, 20% blend Phase 2 |
| **manipulation** | 1 | `three_point` | option + mapsTo.weight | `calculateResults`, vector averages |
| **manipulation** | 2 | `multiselect` | string[] (max 3) | prioritization — equal weight today |
| **manipulation** | 3 | `multiselect`, `frequency`, `binary_unsure` | conditional branch | tactic frequency weights |
| **channels** | 1–4 | same family as manipulation | mixed | node/channel scoring |
| **sovereignty-spectrum** | 0 | paradigm sliders | number 0–100 per paradigm | top-N + likert phases |
| **sovereignty-spectrum** | 2–3 | `likert` | 1–5 | alignment × paradigm.weight |
| **sovereignty** | sections | usage, cognitive, attachment, grids | mixed | `displayResults`, `frequency_grid` delta |
| **entities** | tier / taste | radio, checkbox | number / array | tier + contract scoring |
| **outlier-aptitude** | questionnaire + acuity | radio, checkbox, acuity sliders | mixed | [`outlier-aptitude-scoring.js`](../outlier-aptitude-scoring.js) |
| **character-sheet** | form | fields (not questionnaire) | form object | `buildCharacterSheet` |

## SPA host mode

| Engine | Host | Question UI |
|--------|------|-------------|
| diagnosis, coaching | `QuestionFlow` | Slider snapshot |
| paradigm (most), needs-dependency, manipulation, channels, … | `QuestionHtmlBridge` | Legacy DOM |
| paradigm Phase 2 dimensions (SPA) | `QuestionFlow` + `AllocationSliders` | Linked allocation |
| sovereignty, entities, outlier, character-sheet | `mountExternalShell` | Full DOM shell |

See [`ENGINE_SPA_HOST_CONTRACT.md`](ENGINE_SPA_HOST_CONTRACT.md).
