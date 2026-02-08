# New Tool Template & Checklist

Use this template when adding a new **tool HTML page** and/or **JS engine**. The goal is to prevent small inconsistencies and make future additions fast and predictable.

---

## 1) Planning Snapshot
- **Tool name:**
- **Purpose / user outcome:**
- **Primary data sources:** (existing data files, new data, external links)
- **Related tools:** (reuse results, cross-navigation)
- **Primary UI elements:** (buttons, grids, inputs, reports)
- **Accessibility considerations:** (labels, headings, contrast)

---

## 2) File & Folder Placement
**Follow existing patterns and keep new files in the expected locations.**

- **HTML:** root (same level as other tool pages)
- **JS engine:** root (same level as other engines)
- **Data files:** `*-data/` or `*-data.js` as established by similar tools
- **Images:** `images/` with clear, consistent naming
- **Shared assets:** `shared/` when reusable across tools

> **Naming guidance**
> - Use kebab-case for filenames.
> - Avoid ambiguous names like `final` or `new`.
> - If adding images, include tool prefix (e.g., `diagnosis-cover.jpg`).

---

## 3) HTML Template Structure
Keep structure consistent with existing pages. Avoid inline styles.

- **Metadata**
  - `<title>` follows existing site pattern.
  - `<meta name="description">` relevant to the tool.
  - Open Graph/Twitter tags if consistent with other pages.
  - Use correct `<base href>` if required by hosting.

- **CSS**
  - Reference **central CSS** (`style.css`).
  - Avoid inline CSS; use shared `style.css` and reuse existing classes.
  - If a new class is needed, add it to `style.css`.

- **Layout**
  - Consistent header/nav (match other tools).
  - Use existing grid/section patterns where applicable.
  - Standard button class names & placement.
  - Include report/download areas if the tool outputs results.

- **Inputs**
  - Include clear labels & helper text.
  - If assessment uses external results, include an **entry field** for cross-tool tabulation.
  - Prefer dropdowns for cross-reference selection when possible to reduce formatting errors.
  - Ensure IDs are unique and predictable.

- **Footer**
  - Keep consistent with other pages.

---

## 4) JS Engine Template Expectations
Keep engines consistent and modular.

- **Structure**
  - Separate data from logic (use data files when possible).
  - Use clear, named functions (avoid giant anonymous blocks).
  - Provide initialization entry point and explicit DOM hooks.

- **State + Results**
  - Store results in a predictable format for export & cross-tool use.
  - If relevant, include an **auto-generated example report** for users who want a quick preview.
  - Keep report generation consistent with other tools.

- **Cross-tool hooks**
  - Accept pasted results from other tools in an entry field.
  - Provide optional parsing/normalization logic.

- **Error handling**
  - Guard for missing DOM nodes and data shape issues.
  - Provide user-readable messages on errors.

---

## 5) Buttons, Grids, and Reports
Use consistent UI components.

- **Buttons**
  - Primary action button (consistent class names).
  - Secondary button for reset or export.
  - If report generation exists, ensure a “Generate Example Report” button.

- **Grids**
  - Follow existing grid structure (rows/columns).
  - Avoid inline CSS; use shared grid classes.

- **Reports**
  - Ensure report output area exists and is easy to copy.
  - Keep formatting consistent with existing reports.

---

## 6) Example Report Generation
If the tool generates reports, include an **auto example**.

- A button or toggle that inserts sample data.
- Use a consistent template so users see what a completed report looks like.
- Make sure the sample output is representative and not misleading.

---

## 7) Metadata & SEO Checks
- Page description and title updated.
- `robots.txt` and `sitemap.xml` updated if required.
- Update `README.md` if the tool is a major addition.
- If there’s a content index or list page, add the tool there.

---

## 8) Image & Asset Rules
- Use descriptive, tool-specific filenames.
- Keep file sizes optimized (avoid oversized images).
- Prefer existing site style (colors, look).

---

## 9) Bug Prevention Checklist
- [ ] All new IDs/classes match JS selectors.
- [ ] JS does not assume DOM nodes that don’t exist.
- [ ] No duplicate IDs.
- [ ] All buttons have event handlers.
- [ ] No inline style exceptions (unless documented).
- [ ] Output reports render without console errors.

---

## 10) Cross-Tool Data Integration
If the tool references other assessments:
- Provide an **entry field** for pasting results.
- Clarify expected format in helper text.
- Add parsing logic with clear error messaging.
- Prefer dropdowns for cross-reference selection when possible (fall back to free-form input when needed).

---

## 10.1) Tool Report Summaries (for Cross-Reference Relevance)
Use this section when evaluating which results should be surfaced or accepted as inputs. Keep this list updated when tools change.

1. **Pathology Assessment** (`diagnosis.html`) — DSM-5 educational pattern clarity results and related indicators. (Engine: `diagnosis-engine.js`)
2. **Life Domain Review** (`coaching.html`) — life domain obstacles/satisfaction mapping. (Engine: `coaching-engine.js`)
3. **Dependency Loop Tracer** (`needs-dependency.html`) — needs/dependency tracing output. (Engine: `needs-dependency-engine.js`)
4. **Manipulation Defense Decoder** (`manipulation.html`) — manipulation vector/tactics mapping results. (Engine: `manipulation-engine.js`)
5. **Technical Title for your Sovereignty Paradigm** (`sovereignty-spectrum.html`) — philosophical paradigm alignment. (Engine: `sovereignty-spectrum-engine.js`)
6. **Logos Structure** (`paradigm.html`) — worldview foundation mapping (Good Life/God lenses). (Engine: `paradigm-engine.js`)
7. **Relationships** (`relationship.html`) — compatibility assessment with polarity and selection/attraction markers. (Engine: `relationship-engine.js`)
8. **Polarity Position Mapping** (`temperament.html`) — temperament spectrum with selection criteria. (Engine: `temperament-engine.js`)
9. **Modern Archetype Identification** (`archetype.html`) — archetype phase output with status/selection markers. (Engine: `archetype-engine.js`)
10. **Channel Flow Diagnostics** (`channels.html`) — energy channel blockage identification. (Engine: `channels-engine.js`)
11. **Astrological Character Sheet** (`character-sheet.html`) — multi-system (Western/Chinese/Mayan) + numerology profile output. (Engine: `character-sheet-engine.js`)
12. **Will Anomaly Mapping** (`entities.html`) — will-anomaly mapping with reclamation protocols. (Engine: `entities-engine.js`)
13. **Aptitude Mapping** (`outlier-aptitude.html`) — aptitude signal mapping with market projection matrix. (Engine: `outlier-aptitude-engine.js`)
14. **Cognitive Resistance Capacity Assessment** (`sovereignty.html`) — AI dependency resistance assessment output. (Engine: `sovereignty-engine.js`)

---

## 11) Testing & Validation
- Load the page locally and verify:
  - No console errors.
  - All buttons work.
  - Example report generates.
  - Cross-tool input can be parsed.

---

## 12) Final Review
- [ ] File names and locations consistent.
- [ ] CSS centralized.
- [ ] HTML structure consistent with other pages.
- [ ] JS engine modular and readable.
- [ ] Example report present where relevant.
- [ ] Metadata and sitemap/robots updated.
- [ ] README updated if needed.

---

## 13) Starter Skeleton (Optional)
Use this as a starting base and customize.

```
<!-- tool-name.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <base href="https://beliefmastery.github.io/site/">
  <title>Tool Name — Sovereign of Mind</title>
  <meta name="description" content="Short description.">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <!-- consistent site header/nav -->
  </header>

  <main>
    <section class="tool-intro">
      <h1>Tool Name</h1>
      <p>Short intro.</p>
    </section>

    <section class="tool-inputs">
      <label for="assessment-input">Paste prior assessment (optional)</label>
      <textarea id="assessment-input"></textarea>
    </section>

    <section class="tool-actions">
      <button id="run-tool" class="button-primary">Run Tool</button>
      <button id="example-report" class="button-secondary">Generate Example Report</button>
    </section>

    <section class="tool-report">
      <h2>Report</h2>
      <pre id="report-output"></pre>
    </section>
  </main>

  <footer>
    <!-- consistent footer -->
  </footer>

  <script src="tool-name-engine.js"></script>
</body>
</html>
```

```
// tool-name-engine.js
(() => {
  const runButton = document.getElementById('run-tool');
  const exampleButton = document.getElementById('example-report');
  const reportOutput = document.getElementById('report-output');

  const generateExampleReport = () => {
    reportOutput.textContent = 'Example report...';
  };

  const runTool = () => {
    reportOutput.textContent = 'Generated report...';
  };

  if (runButton) {
    runButton.addEventListener('click', runTool);
  }

  if (exampleButton) {
    exampleButton.addEventListener('click', generateExampleReport);
  }
})();
```
## 14) Cross-Tool Output Registry & Integration Map
**Purpose:** Track what data each tool produces and which tools can consume it.

### Tool Output Specification
For each tool, document:
- **Tool ID:** (short machine-readable name)
- **Output Keys:** (what fields appear in `assessmentData`)
- **Feeds Into:** (list of tools that can use this data)
- **Consumes From:** (list of tools this can import from)
- **Example Output Structure:**
```json
{
  "exportVersion": "1.0",
  "systemType": "assessment",
  "systemName": "toolName",
  "assessmentData": {
    "exampleKey": "exampleValue"
  }
}
```

### Cross-Reference Dropdown Implementation
- When a tool accepts input from others, use a **dropdown selector** rather than only free-text paste.
- Dropdown should list compatible tools based on this registry.
- Include parsing logic for each compatible input format.

---

## 15) Validation & Input Rules Per Tool
For each tool, document:
- **Input constraints:** (min/max values, required fields, formats)
- **Contradiction checks:** (like DSM-5 pairs)
- **Scoring thresholds:** (what ranges mean what)
- **Cross-tool validation:** (when importing from another tool)

Use shared validation utilities where possible. If tool-specific, document clearly in engine comments.

---

## 16) Import Standards
**When a tool accepts data from another tool:**
- [ ] Use dropdown to select source tool (from registry).
- [ ] Parse using shared `ImportUtils.parse(toolId, jsonData)`.
- [ ] Validate structure matches expected format.
- [ ] Show clear error if format incompatible.
- [ ] Provide “paste JSON” fallback if dropdown fails.

**ImportUtils should:**
- Accept raw JSON string.
- Validate against known schemas.
- Return normalized data or throw descriptive error.

---

## 17) External Link Security
All external links with `target="_blank"` must include:
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">External Link</a>
```
This prevents security issues and performance problems.

---

## 18) Storage Lifecycle Per Tool
Document for each tool:
- **What gets saved:** (progress, results, preferences)
- **Storage key names:** (for consistency)
- **When to clear:** (on completion? on exit? on error?)
- **Session vs. persistent:** (what uses each)
- **Export before clear:** (remind user to save)

Example:

| Tool | Key Pattern | Cleared When | Persistent? |
|------|-------------|--------------|-------------|
| DSM-5 | `dsm5_progress` | On submit or manual clear | No (session) |

---

## 19) Performance Constraints
- **Max assessment data size:** (e.g., 5MB JSON)
- **Max results to display:** (e.g., 1000 entries before pagination)
- **Debounce timing:** (300ms for search, 1000ms for auto-save)
- **Timeout for external loads:** (5s for astronomy engine, etc.)

Include performance monitoring for tools with heavy computation.

---

## 20) Security Checklist
- [ ] CSP headers match external dependencies.
- [ ] All user input sanitized via `SecurityUtils`.
- [ ] External links use `rel="noopener noreferrer"`.
- [ ] No `eval()` or `Function()` constructors.
- [ ] External module sources pinned to version.

---

## 21) Testing Checklist (Expanded)
- [ ] Test in stated browsers (Chrome/Firefox/Safari/Edge).
- [ ] Test with keyboard only.
- [ ] Test with screen reader.
- [ ] Test with 200% zoom.
- [ ] Test with slow network (throttling).
- [ ] Test cross-tool import from each compatible tool.
