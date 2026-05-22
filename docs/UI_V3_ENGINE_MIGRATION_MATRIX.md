# UI V3 Engine Migration Matrix

Static engine HTML remains at **`/site/archive/v3-engines/*.html`** for standalone/deep links (`data-bm-legacy-page="true"` gates auto-boot). In-app routes use the React SPA (`/site/#/engines/:id`) via **`nativeEngineViews`** in [`v3/spa/src/routes.js`](../v3/spa/src/routes.js) (see [`EngineRoutePage.jsx`](../v3/spa/src/pages/EngineRoutePage.jsx) and [`docs/ENGINE_SPA_HOST_CONTRACT.md`](ENGINE_SPA_HOST_CONTRACT.md)).

| Engine | Legacy page | V3 route | SPA status | Notes |
|---|---|---|---|---|
| Pathology | `archive/v3-engines/diagnosis.html` | `/engines/diagnosis` | **Native** | `DiagnosisEngineView` — selection, slider flow, results bridge |
| Life Domain Review | `archive/v3-engines/coaching.html` | `/engines/coaching` | **Native** | `CoachingEngineView` — default both sections |
| Dependency Loop | `archive/v3-engines/needs-dependency.html` | `/engines/needs-dependency` | **Native** | DOM question host (multiphase) |
| Sovereignty Spectrum | `archive/v3-engines/sovereignty-spectrum.html` | `/engines/sovereignty-spectrum` | **Native** | DOM question host |
| Logos Structure | `archive/v3-engines/paradigm.html` | `/engines/paradigm` | **Native** | DOM question host |
| Manipulation | `archive/v3-engines/manipulation.html` | `/engines/manipulation` | **Native** | DOM question host |
| Cognitive Resistance | `archive/v3-engines/sovereignty.html` | `/engines/sovereignty` | **Native** | Shell + DOM questions |
| Channels | `archive/v3-engines/channels.html` | `/engines/channels` | **Native** | DOM question host |
| Character Sheet | `archive/v3-engines/character-sheet.html` | `/engines/character-sheet` | **Native** | `CharacterSheetEngineView` form shell |
| Entities | `archive/v3-engines/entities.html` | `/engines/entities` | **Native** | Intake + tier shell |
| Aptitude | `archive/v3-engines/outlier-aptitude.html` | `/engines/outlier-aptitude` | **Native** | Early input + acuity shell |

**Follow-up (optional):** Replace `ResultsHtmlBridge` / DOM question hosts with full React result and question components per engine.
