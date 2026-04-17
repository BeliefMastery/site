# Readability audit — issue log

Use **P0** (blocks comprehension / wrong order), **P1** (high friction), **P2** (polish), **P3** (nice-to-have).  
Locations use repo-relative paths. Add rows as you fix or discover items.

## Pass 2 and v2 workflow

Operational closure rules, verification gates, backlog buckets, and cadence: **[STRATEGY_V2.md](./STRATEGY_V2.md)**.

**New issues:** use the issue template in STRATEGY_V2 (ID, Surface, Bucket, Pass 2 checkboxes, Status).

**Status values:** `open` | `in_progress` | `verified` | `waived` (waived requires a one-line reason in the PR or here).

**Optional:** add a **Status** column to the tables below as you remediate (e.g. `open` → `verified`). If you prefer not to widen tables, track Status only in GitHub issues or STRATEGY_V2 example notes.

## Layer D — Assessment report coherence (sampled engines)

### Diagnosis — [diagnosis-engine.js](../../diagnosis-engine.js) `renderResults`

| ID | Sev | Finding |
|----|-----|---------|
| D-1 | P1 | **No single purpose line** at top; flow starts with optional validation banner, then **Scale Translation** (methodology), then **category accordion**. User must read methodology before seeing headline pattern match. |
| D-2 | P1 | **Primary verdict** is inside collapsed category groups (`category-group-content hidden`); scanning does not surface “your primary pattern is X” above the fold without expanding. |
| D-3 | P2 | **DSM / Likert jargon** appears early; scale translation helps but could follow a one-sentence “what this report shows” lead. |
| D-4 | P2 | **Redundancy risk** between inline pattern cards, comorbidity block, sub-inquiry block, and **Important Reminders** — all necessary for safety but dense; consider tightening prose in reminders. |
| D-5 | P3 | **Explore further** paragraph is strong; aligns with actionability. |
| D-6 | P1 | **Dual-layer symptom UI** — plain-language hint + collapsible clinical reference for scored stem (`diagnosis-engine.js`, `dsm5-data/plain-language-hints.js`). Status: **verified** (this slice). |

### Coaching — [coaching-engine.js](../../coaching-engine.js) `renderResults` + `getClosureSection`

| ID | Sev | Finding |
|----|-----|---------|
| C-1 | P2 | **Opening line** (“lightly combed over the scope of human life”) is metaphorical — may read as vague vs. a direct purpose sentence (“This report highlights your lowest-satisfaction life domains and suggested first steps”). |
| C-2 | P1 | **Good structure:** “Greatest Impact Focus” and domains appear before `<details>` full ratings — supports scan path. |
| C-3 | P2 | **Closure block** (`Orientation → Selection → Application`) adds length after main findings; valuable for boundaries but repeats “map / orientation” concepts — consider shortening or moving to collapsible. |
| C-4 | P2 | **Deeper inquiry** ([`renderDeeperInquiry`](../../coaching-engine.js)) front-loads a generic intro paragraph before headings — acceptable; watch for repetition with main results. |

### Manipulation — [manipulation-engine.js](../../manipulation-engine.js) `renderResults`

| ID | Sev | Finding |
|----|-----|---------|
| M-1 | P2 | **Purpose** is implicit in title + first `<p>`; could add one explicit sentence (“This report names the dominant manipulation pattern in your answers and lists related tactics”). |
| M-2 | P1 | **Strong scan path:** summary heading → **Primary Vector** with description → supporting → tactics with plain-language labels (“How it works”, “When it happens”). |
| M-3 | P3 | **Tactics section** can become a **text wall** if many tactics fire — consider progressive disclosure (e.g. `<details>` per tactic) in a future pass. |

## Layer A — Static pages (structural / text walls)

| ID | Sev | Page | Finding |
|----|-----|------|-----------|
| S-1 | P2 | [books.html](../../books.html) | Long book sections (grids of `.card` / `.extended`) are inherently dense; ensure each book hero + first paragraph carry the message; extended blocks are optional expand. |
| S-2 | P2 | [tools.html](../../tools.html) | Many tool cards with dual intro lines + privacy panel — acceptable if panel stays collapsed by default. |
| S-3 | P3 | [index.html](../../index.html) | Tools strip + books grid + “How These Works Connect” — hierarchy is clear; connect section is short paragraphs (good). |
| S-4 | P2 | [about-the-author.html](../../about-the-author.html) | Likely narrative wall — apply paragraph word-count triage from script output. |

## Cross-cutting

| ID | Sev | Finding |
|----|-----|---------|
| X-1 | P2 | **Disclaimer / privacy** copy may repeat across tool pages — centralize short canonical text in one include or shared doc to reduce drift (see [STYLE_ADDENDUM.md](./STYLE_ADDENDUM.md)). |
| X-2 | P1 | **Inline `style=`** in engine-generated HTML** (e.g. diagnosis results) complicates theme consistency — readability of *content* is separate, but contrast/spacing issues often live here; prefer CSS classes in a future refactor. |

## Heuristic triage

Run from repo root:

```bash
node scripts/readability-scan.mjs
node scripts/readability-scan.mjs --engines
```

`--engines` runs a **heuristic** pass on root `*-engine.js` (large template literals); triage only—see script header.

Attach or paste output into a dated subsection below when re-auditing.

### Latest run (automated)

Command: `node scripts/readability-scan.mjs` (repo root).

- **Long paragraphs (>150 words) in `<p>`:** 0 across scanned tool + marketing HTML.  
- **Long sentences (>30 words):** 2 — `books.html` (~36 words, peer-counseling copy); `channels.html` (~31 words, hero/intro).  
- **Duplicate normalized sentences:** Expected duplicates include footer copyright/social lines across many pages; **tool disclaimers** repeat across 8–9 assessment shells (see **X-1**) — good candidate for one shared snippet. Notable: “Understanding manipulation patterns…” appears on both `manipulation.html` and `channels.html` (review for intentional vs accidental overlap).

Re-run after large copy edits and paste a fresh summary here.

### Latest run — 2026-04-17 (full audit slice)

Commands (repo root, PowerShell): `node scripts/readability-scan.mjs` ; `node scripts/readability-scan.mjs --engines`

**HTML `<p>` scan:** Long paragraphs 0. Long sentences **0** after `books.html` peer-counseling paragraph split (`S-1` follow-up).

**`--engines` heuristic:** `coaching-engine.js` (7 large templates, 2 long sentences); `needs-dependency-engine.js` (10 / 7); `outlier-aptitude-engine.js` (6 / 1); `sovereignty-engine.js` (11 / 3). Triage for next copy PRs per STRATEGY_V2.

**Shipped in this slice**

- **D-PLAIN** — Dual-layer pathology items: `dsm5-data/plain-language-hints.js`, `diagnosis-engine.js` (hint + clinical `<details>`), `style.css`, `GLOSSARY.md` rows.
- **C-1** — Coaching report lead sentence clarified (`coaching-engine.js`).
- **SOV-U4** — Cognitive Resistance multi-select stem simplified (`sovereignty-data/sovereignty-questions.js`).
- **M-P1** — Manipulation phase-1 fear screen stem simplified (`manipulation-data/manipulation-questions-v2.js`).
- **CH-P1** — Channels intro paragraph split/simplified (`channels.html`); Phase 1 root vitality question shortened (`channel-data/channel-questions.js`).

## Q-2026 — Pass 1 question-copy audit (inventory)

| Tool | Surface | Pass 1 status | Notes |
|------|---------|---------------|--------|
| Pathology | data + engine | Partial | Hints for mood, anxiety, trauma, substance, schizophrenia; extend `PLAIN_LANGUAGE_HINTS` for remaining DSM categories. |
| Life Domain Review | engine report | Partial | C-1 addressed; deeper pass on `coaching-data/` strings deferred. |
| Dependency Loop | engine templates | Open | Scan flags long sentences in `needs-dependency-engine.js` — data + templates pass. |
| Sovereignty Paradigm | data | Open | Not edited this slice. |
| Logos Structure | data | Open | Not edited this slice. |
| Manipulation | data | Partial | One screening question revised; full `manipulation-data/` pass open. |
| Cognitive Resistance | data | Partial | u4 revised; `sovereignty-questions.js` full pass open. |
| Channel Flow | data + html | Partial | One question + intro; remainder of `channel-questions.js` open. |
| Character Sheet | data | Open | Label pass only when scheduled. |
| Will Anomaly | data | Open | Cross-engine copy depends on upstream clarity. |
| Aptitude | data + engine | Open | Scan flags engine template — review `outlier-aptitude-data.js` + engine UI strings. |

## Pass 2 — Verification notes (this slice)

| ID | 20s intent | Export parity | Jargon | Scan | Legal |
|----|------------|---------------|--------|------|-------|
| D-PLAIN | Main stem still the scored Likert prompt; hint is auxiliary. | On-screen only; exports use existing question text fields — no new divergence introduced. | Glossary updated. | Re-run scan after pull. | No disclaimer change. |
| C-1 | Opening line states domain scan + start with weakest area. | Same string in downloaded HTML report block. | N/A | OK | Editorial only. |
| SOV-U4 | Stem asks for multi-select “ways AI changed you.” | Export uses same `question` field. | N/A | OK | N/A |
| M-P1 | Clear frequency-style stem for fear/anxiety. | Same `question` in data export path. | N/A | OK | N/A |
| CH-P1 | Shorter intro + shorter vitality question. | HTML shell + data; export if channel report embeds these strings — spot-check on next channel export test. | N/A | Re-run | N/A |
| S-1b | Peer-counseling block uses shorter sentences. | Static page only. | N/A | HTML scan clean | Editorial only. |
