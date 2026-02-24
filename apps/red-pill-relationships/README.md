# Red Pill & Relationships — Standalone App

Self-contained copy of the four relational tools for use as a separable app (e.g. future repo or in-app purchase build).

**Tools:** Relationships, Polarity (Temperament), Modern Archetype, Attraction / Status & Selection.

All assets and dependencies are under this folder so it can be moved to its own repo or deployed independently.

## Separability

- **No references to parent site.** Navigation is app-only (Home + the four tools). All script/style paths are relative within this folder.
- **Shared code is copied**, not linked: `shared/` (data-loader, debug-reporter, utils, export-utils, engine-ui-controller, performance-monitor, background) and `style.css` live inside this folder.
- **To extract:** Copy the entire `red-pill-relationships` folder into a new repo. Serve `index.html` as the app entry; the four tool pages and engines work as-is.

## Files included

| Category | Contents |
|----------|----------|
| **HTML** | `index.html` (hub), `relationship.html`, `temperament.html`, `archetype.html`, `attraction.html` |
| **Engines** | `relationship-engine.js`, `temperament-engine.js`, `archetype-engine.js`, `attraction-engine.js`, `attraction-data.js` |
| **Data** | `relationship-data/`, `temperament-data/`, `archetype-data/` (all JS + BRUTAL-TRUTH.js, etc.) |
| **Shared** | `shared/` — data-loader, debug-reporter, utils, export-utils, engine-ui-controller, performance-monitor, background.js, background.css |
| **Styles** | `style.css` (full site styles; can be trimmed later for app-only rules) |
| **Images** | `images/` — relationship-optimization-cover.jpg, temperament-analysis-cover.jpg, redpill-cover.jpg, attraction-cover.jpg |
