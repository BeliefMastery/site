# Engine proofing blueprint

Portable pattern for validating **assessment engines**: interactive flows, results UI, export artifacts, scoring logic, and data consistency. Use neutral placeholders (*Surface A*, *Engine 1*, *scoring module*) when copying this doc into other projects.

---

## Purpose

A single user-facing “engine” usually spans:

- **UI wiring** (phases, buttons, visibility of results region)
- **Client state** (including persistence, if any)
- **Export pipeline** (HTML, PDF, JSON, etc.)
- **Deterministic scoring** (ideally testable without a browser)
- **Data catalogs** (questions, weights, taxonomies) staying in sync

Proofing only in the browser misses pure-logic bugs; proofing only in Node misses DOM and download behavior. This blueprint uses **stacked layers** so each class of failure has a home.

---

## Reference architecture (generic)

```mermaid
flowchart LR
  subgraph client [Client]
    Surface[AssessmentSurface]
    Runtime[EngineRuntime]
    Results[ResultsView]
    Export[ExportPipeline]
  end
  subgraph artifacts [Outputs]
    Artifact[Artifact_HTML_or_other]
  end
  subgraph optional [Optional headless]
    ScoringCore[ScoringCore_module]
  end
  Surface --> Runtime --> Results --> Export --> Artifact
  Runtime -.->|imports or mirrors| ScoringCore
```

- **AssessmentSurface** — Page or route hosting the questionnaire (static HTML, SPA route, etc.).
- **EngineRuntime** — Class or module that advances phases, holds answers, computes or requests scores.
- **ResultsView** — DOM region shown when the flow completes (often toggled with a `hidden` class or router).
- **ExportPipeline** — Function that builds an artifact and triggers download or share.
- **ScoringCore** — Pure functions importable from Node (recommended); if logic lives only in bundled UI, add a thin extraction or duplicate minimal fixtures for Layer B.

---

## Layer A — End-to-end UI smoke (browser)

**Tool class:** Browser automation (e.g. Playwright, Cypress).

**What it proves**

- The app serves correctly from a static or dev server.
- A **fast path** to results exists where the product supports it (e.g. “sample / demo report”); otherwise automate a capped number of steps.
- The **results region** becomes visible and is not stuck behind a broken transition.
- **Save / export** runs without throwing; the **artifact** downloads and meets minimal shape checks (e.g. `DOCTYPE` or `<html`, minimum size, stable title or heading substrings).

**Typical setup**

| Concern | Pattern |
|--------|---------|
| Server | `webServer` in config or separate `serve` step on a fixed port |
| Isolation | Clear `localStorage` / `sessionStorage` before each run if engines restore state |
| Export | `waitForEvent('download')`, read file from temp path or `saveAs` |
| CI | Install **browser + OS dependencies**; use a **project-local `PLAYWRIGHT_BROWSERS_PATH`** if hosted runners or sandboxes shadow the default cache |
| Failure artifacts | Traces, screenshots on failure, HTML report upload |

**Coverage matrix (fill per project)**

| Surface ID | Entry URL | Results selector | Export trigger selector | Invariant strings (non-secret) |
|------------|-----------|------------------|-------------------------|--------------------------------|
| *Surface_1* | `/path/to/surface1` | `#resultsRegion` | `#saveResults` | *Heading A*, *section B* |
| *Surface_2* | … | … | … | … |

Use **stable, user-visible** strings; avoid brittle full-page snapshots for copy that still changes often.

---

## Layer B — Scoring / logic regression (Node, no DOM)

**Tool class:** Small Node script (`.mjs` / `.cjs`) run via `npm run …`.

**What it proves**

- Outputs stay finite (no `NaN` / `Infinity` where invalid).
- **Monotonicity** or **ordering** invariants where the domain expects them (e.g. raising one input bucket does not lower a headline score without reason).
- **Weight / ID drift**: when question IDs or weights change, the script fails loudly if assumptions break.

**Pattern**

1. Import **ScoringCore** from the same module the UI uses, *or* duplicate a **minimal** weight table in the script that must be kept in sync (document the coupling).
2. Generate a **grid** or **sweep** of synthetic responses.
3. Assert invariants; exit non-zero on violation.

This layer is cheap to run in CI and does not require browsers.

---

## Layer C — Data / taxonomy integrity (static)

**Tool class:** Node script or one-off checker that **reads files only** (no browser).

**What it proves**

- Every **ID referenced** in question definitions exists in the **canonical taxonomy** (and vice versa where required).
- No orphaned option keys, duplicate IDs, or broken imports between data files.

**Pattern**

- Parse or regex-extract identifiers from **bank A** and **bank B**; diff sets; print symmetric difference and exit non-zero.

Run on demand or in CI when data churn is high.

---

## Layer D (optional) — Build / deploy parity

**Tool class:** Copy or build step (e.g. “sync source tree → packaged `www/` or app bundle”).

**What it proves**

- What you **test in CI** (served root) matches what **ships** in a wrapper (Capacitor, Tauri, embedded WebView).

**Pattern**

- Document a single canonical command (e.g. “CI serves directory X after sync”).
- Optionally run Layer A **twice** (pre-sync and post-sync) if two trees must both stay valid.

---

## How to adopt in another project

1. **Inventory surfaces** — List each URL/route with its own engine runtime and export type.
2. **Add Layer A** — One automated test per surface: open → reach results → export → assert invariants.
3. **Prefer a fast path** — If you add “sample report,” wire it consistently (`#generateSampleReport` or equivalent).
4. **Extract or mirror ScoringCore** — Enable Layer B without headless browser cost.
5. **Add Layer C when** — You maintain parallel JSON/JS question and taxonomy files.
6. **Wire npm scripts** — e.g. `test` / `test:e2e`, `playwright:install`, domain-specific `logic:check`, `data:audit`.
7. **CI** — Run Layer A + B (+ C if present) on push/PR; upload Playwright report on failure.

---

## Appendix (optional): internal mapping

If this file lives in a concrete repo, you may add one column mapping placeholders to real paths **below this line**. For a **clean export** to other projects, delete the table or leave it empty.

| Surface (HTML) | Engine module | Results region | Primary HTML export control | Layer A hint |
|----------------|---------------|----------------|----------------------------|--------------|
| [coaching.html](../coaching.html) | [coaching-engine.js](../coaching-engine.js) | `#resultsSection` (+ optional `#deeperInquirySection` when populated) | `#exportReportHtml` | `?sample=1`; deeper via `#startDeeperInquiry` |
| [channels.html](../channels.html) | [channels-engine.js](../channels-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [manipulation.html](../manipulation.html) | [manipulation-engine.js](../manipulation-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [needs-dependency.html](../needs-dependency.html) | [needs-dependency-engine.js](../needs-dependency-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [paradigm.html](../paradigm.html) | [paradigm-engine.js](../paradigm-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [sovereignty.html](../sovereignty.html) | [sovereignty-engine.js](../sovereignty-engine.js) | `#resultsContainer` (section) | `#exportReportHtml` | `?sample=1` |
| [sovereignty-spectrum.html](../sovereignty-spectrum.html) | [sovereignty-spectrum-engine.js](../sovereignty-spectrum-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [diagnosis.html](../diagnosis.html) | [diagnosis-engine.js](../diagnosis-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [entities.html](../entities.html) | [entities-engine.js](../entities-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [outlier-aptitude.html](../outlier-aptitude.html) | [outlier-aptitude-engine.js](../outlier-aptitude-engine.js) | `#resultsSection` | `#exportReportHtml` | `?sample=1` |
| [character-sheet.html](../character-sheet.html) | [character-sheet-engine.js](../character-sheet-engine.js) | `#characterSheetResults` | `#exportReportHtml` | Generate sheet first |

**Layer A (manual smoke):** From each entry URL, reach the results state (sample or shortest path), click **Download report (HTML)** (or **Download sheet (HTML)**), open the file locally and confirm headings and body text match the on-screen report. JSON/CSV live under **Advanced export** where present.

**Shared utilities:** [shared/export-utils.js](../shared/export-utils.js) — `downloadReportHtml`, `downloadFile`, `exportForAIAgent` (CSV; uses `normalizeSystemType` for engine-specific type strings), `exportJSON`, `exportExecutiveBrief`.

| Placeholder | Implementation notes |
|-------------|------------------------|
| *ScoringCore* | Not yet extracted to a standalone Node module; logic remains in `*-engine.js` files. Consider Layer B after extraction. |
