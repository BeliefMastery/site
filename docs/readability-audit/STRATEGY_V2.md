# Readability audit strategy v2.0 (operational)

This document **operationalizes** the first-pass readability strategy (Layers A–D, inventory, heuristics). It does not replace [TOOL_CONTENT_INVENTORY.md](./TOOL_CONTENT_INVENTORY.md), [ISSUE_LOG.md](./ISSUE_LOG.md), or [STYLE_ADDENDUM.md](./STYLE_ADDENDUM.md); it adds **Pass 2 verification**, **cadence**, and **closure rules**.

## Relationship to v1 assets

| Asset | Role |
|-------|------|
| [TOOL_CONTENT_INVENTORY.md](./TOOL_CONTENT_INVENTORY.md) | What to audit (tool → HTML → engine → data) |
| [ISSUE_LOG.md](./ISSUE_LOG.md) | Findings + severity; add **Status** / Pass 2 fields per v2 |
| [STYLE_ADDENDUM.md](./STYLE_ADDENDUM.md) | Copy rules; links [GLOSSARY.md](./GLOSSARY.md) for shared terms |
| [scripts/readability-scan.mjs](../../scripts/readability-scan.mjs) | Pass 1 triage; use `--engines` for template heuristics |

## Two-pass workflow

1. **Pass 1 — Discovery** — Run Layers A–D, `node scripts/readability-scan.mjs`, and optionally `node scripts/readability-scan.mjs --engines`. Log issues in [ISSUE_LOG.md](./ISSUE_LOG.md) with the **issue template** below. Assign each item to a **backlog bucket** (see Backlog hygiene).
2. **Backlog prioritize** — Score **impact × effort** (1–3 each). Ship **P0/P1** before P2 unless effort is trivial.
3. **Implement** — Copy or structure changes in HTML, engines, data modules, or [shared/export-utils.js](../../shared/export-utils.js).
4. **Pass 2 — Verification** — Apply **verification gates**; only then set Status to `verified` or `waived`.
5. **Close** — Update ISSUE_LOG, refresh “Latest run” scan output if copy changed.

## Pass 2 verification gates

An issue is **not closed** until every **applicable** row is satisfied (mark N/A with a one-line reason on the issue).

| Gate | Verify |
|------|--------|
| **Intent** | A neutral reader answers in **≤20 seconds**: “What is the main result?” from the **top** of the on-screen report (or the first expanded section if that is an intentional design—document which). |
| **Order** | Narrative order matches [STYLE_ADDENDUM.md](./STYLE_ADDENDUM.md) unless a **legal exception** is noted on the issue. |
| **Parity** | **On-screen results** and **Download HTML** show the **same headline order** and no conclusions that exist only in one channel. Uses [shared/export-utils.js](../../shared/export-utils.js) / per-tool `exportReportHtml`. |
| **Jargon** | Framework terms in scope for this fix have a **first-use gloss** or link; prefer linking [GLOSSARY.md](./GLOSSARY.md) for shared definitions. |
| **Regression** | `node scripts/readability-scan.mjs` (and `--engines` if engine templates changed) shows **no new** regressions vs. baseline, or waiver documented. |
| **Legal** | If **disclaimer or scope** text changed: tag `legal-review` and record sign-off or **“editorial only / no legal change”**. |

## Issue template (copy into ISSUE_LOG or GitHub)

```text
- ID: (e.g. D-1)
- Surface: engine | html_shell | data | export
- Files: (paths + function or section name)
- Bucket: shared_boilerplate | single_engine | single_html | data_modules | export_pipeline
- Problem type: wall | jargon | repeat | structure | parity
- Severity: P0 | P1 | P2 | P3
- Pass 1 evidence: (screenshot path or 1–3 line quote)
- Proposed fix (one line):
- Pass 2 verification:
  [ ] 20s intent test
  [ ] export parity
  [ ] scan clean (or waiver)
  [ ] legal tag if needed
- Status: open | in_progress | verified | waived
```

## Second-pass considerations (operational detail)

1. **Task-based testing** — For each engine change, run one **fixed scenario** (saved answers, mock, or smoke script). Record where the “main result” appears (above fold / inside collapse).
2. **Exported HTML semantics** — Open downloaded report; check **heading ladder** (e.g. `h2` → `h3`) for skimming and assistive tech. Flag skipped levels or missing headings on the issue.
3. **Mobile / collapse** — If the primary finding is **collapsed by default**, Pass 2 requires either **auto-expand** for that block or an **always-visible summary strip**; document the chosen pattern on the issue.
4. **Boilerplate centralization** — Repeated sentences across shells (see scan “duplicates”) should converge on **one canonical source** (shared snippet doc, single HTML partial, or build include). Track under bucket `shared_boilerplate`.
5. **Glossary** — Add terms to [GLOSSARY.md](./GLOSSARY.md) when you introduce or standardize definitions (especially DSM / framework jargon reused across engines).
6. **Cadence** — **Quarterly:** full Pass 1 over all tools in the inventory. **Monthly:** `readability-scan.mjs` + spot-check any `*-engine.js` / tool HTML touched since last release tag.
7. **Tooling** — `node scripts/readability-scan.mjs --engines` flags **large** template literals in root `*-engine.js` for manual long-sentence review (heuristic only).

## Backlog hygiene

Group work before opening PRs:

| Bucket | Examples |
|--------|----------|
| `shared_boilerplate` | Same disclaimer on 8+ tool pages |
| `single_engine` | One `renderResults` / report builder |
| `single_html` | One marketing or tool shell page |
| `data_modules` | Question or option text in `*-data*` |
| `export_pipeline` | [shared/export-utils.js](../../shared/export-utils.js), `exportReportHtml` |

**Target:** one PR per **bucket slice** (e.g. “disclaimer centralization” vs. “diagnosis renderResults only”) to reduce merge conflicts.

## Example Pass 2 note (for ISSUE_LOG or PR)

```text
D-1 Pass 2: Added purpose line + primary pattern strip above category accordion.
20s test: OK (primary pattern visible without expand).
Export HTML: matched order (manual compare diagnosis export).
Scan: clean. Legal: editorial only.
Status: verified.
```

## Out of scope

- Formal legal workflow beyond tagging and owner note  
- Full i18n  
- Entire [books.html](../../books.html) rewrite as a single ticket (split by section)
