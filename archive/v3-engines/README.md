# Archived V3 static engine HTML (retired)

Standalone engine HTML pages that previously lived here have been **retired** (SPA-only, 2026).

Use the React SPA as the only supported surface:

- **Site:** [`/site/`](https://beliefmastery.github.io/site/)
- **Engine routes:** `#/engines/<engineId>` (see [`v3/spa/src/routes.js`](../../v3/spa/src/routes.js))

Engine logic remains in the repo root `*-engine.js` modules, hosted by native SPA views (`externalUI: true`).
