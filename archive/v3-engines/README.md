# Archived V3 static engine HTML

These files were moved from `v3/*.html` (2026 cutover) so the React SPA at **[`/site/`](https://beliefmastery.github.io/site/)** is the canonical site. Engines are still loaded in-app via **iframe** from here.

| Old URL (GitHub Pages) | New URL |
|------------------------|---------|
| `/site/v3/diagnosis.html` | `/site/archive/v3-engines/diagnosis.html` |
| … (same pattern for each engine file) | `/site/archive/v3-engines/<file>` |

In-repo path: `archive/v3-engines/<file>.html`

SPA routes are unchanged: `#/engines/<engineId>` (see [`v3/spa/src/routes.js`](../../v3/spa/src/routes.js)).
