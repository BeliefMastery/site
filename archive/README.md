# Site archive (2026 cutover)

- **`v3-engines/`** — Eleven interactive assessment HTML pages moved from `v3/`; served at **`/site/archive/v3-engines/`** and embedded in the SPA.
- **`legacy-root-html/`** — Former repository root `index.html` (full legacy home) and root-level copies of engine pages (for reference / diff).
- **Repository root** — `index.html` is the Vite-built SPA; root-level `*.html` stubs redirect old engine URLs to `/site/#/engines/:id`. **`v3/app/index.html`** holds a short redirect for old **`/site/v3/app/`** bookmarks.
