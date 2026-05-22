# UI V3 Route Map

## App entry
- V3 root: `v3/index.html`
- Router basename: `/site/v3`

## Top-level routes
- `/` -> Home
- `/tools` -> Tools hub
- `/books` -> Books surface
- `/about` -> About surface

## Engine routes
- `/engines/diagnosis`
- `/engines/coaching`
- `/engines/needs-dependency`
- `/engines/sovereignty-spectrum`
- `/engines/paradigm`
- `/engines/manipulation`
- `/engines/sovereignty`
- `/engines/channels`
- `/engines/character-sheet`
- `/engines/entities`
- `/engines/outlier-aptitude`

## Native assessment hosts
All engine routes above resolve through `nativeEngineViews` in `v3/spa/src/routes.js` (no iframe, no “Open full page”). Standalone HTML remains at `/site/archive/v3-engines/*.html` with `data-bm-legacy-page="true"` for legacy auto-boot only.
