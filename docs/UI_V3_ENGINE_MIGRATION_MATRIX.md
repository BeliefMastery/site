# UI V3 Engine Migration Matrix

Static engine HTML is published at **`/site/archive/v3-engines/*.html`** (archived from `v3/`). In-app routes use the React SPA (`/site/v3/app/#/engines/:id`) with an iframe adapter until a row is ported to **`nativeEngineViews`** in [`v3/spa/src/routes.js`](../v3/spa/src/routes.js) (see [`EngineRoutePage.jsx`](../v3/spa/src/pages/EngineRoutePage.jsx)).

**Suggested port order** (same as table): Pathology → Life Domain Review → Dependency Loop → Sovereignty Spectrum → Logos Structure → Manipulation → Cognitive Resistance → Channels → Character Sheet → Entities → Aptitude.

| Engine | Legacy page | V3 route | Adapter status | Next migration step |
|---|---|---|---|---|
| Pathology | `archive/v3-engines/diagnosis.html` | `/engines/diagnosis` | Bridged | Extract render templates into React components |
| Life Domain Review | `archive/v3-engines/coaching.html` | `/engines/coaching` | Bridged | Port results cards and phase flow controls |
| Dependency Loop | `archive/v3-engines/needs-dependency.html` | `/engines/needs-dependency` | Bridged | Port loop/chain components and recommendation blocks |
| Sovereignty Spectrum | `archive/v3-engines/sovereignty-spectrum.html` | `/engines/sovereignty-spectrum` | Bridged | Port slider/rating flow and remediation rendering |
| Logos Structure | `archive/v3-engines/paradigm.html` | `/engines/paradigm` | Bridged | Port category cards and integration panel |
| Manipulation | `archive/v3-engines/manipulation.html` | `/engines/manipulation` | Bridged | Port vector/tactics views |
| Cognitive Resistance | `archive/v3-engines/sovereignty.html` | `/engines/sovereignty` | Bridged | Port section flow + risk/action panels |
| Channels | `archive/v3-engines/channels.html` | `/engines/channels` | Bridged | Port node/channel result cards |
| Character Sheet | `archive/v3-engines/character-sheet.html` | `/engines/character-sheet` | Bridged | Port generator form and profile table |
| Entities | `archive/v3-engines/entities.html` | `/engines/entities` | Bridged | Port tier output cards and strategy section |
| Aptitude | `archive/v3-engines/outlier-aptitude.html` | `/engines/outlier-aptitude` | Bridged | Port projection matrix and acuity panels |
