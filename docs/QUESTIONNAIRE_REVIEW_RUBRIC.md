# Questionnaire Review Rubric

Use this rubric when evaluating whether an assessment item should stay **single-slider**, use **multiselect**, **ranked**, or **linked allocation** (sum-to-100%).

## Dimensions

### 1. Cardinality

| Pattern | When to use |
|---------|-------------|
| Single salience (one slider) | One construct per item; magnitude is independent (e.g. symptom severity) |
| Many independent magnitudes | Each item measured on its own scale without a budget |
| Ranked set | Order matters more than absolute values |
| Allocation set | User distributes a fixed budget (100%) across competing priorities |

### 2. User allocation

- **Independent magnitude:** “How much X?” — sliders do not constrain each other.
- **Linked allocation:** “How much of your emphasis goes to X vs Y?” — changing one affects others; sum must hold.

### 3. Catalog weight

- **Fixed catalog weight:** `mapsTo.weight`, DSM weights, domain weights — user does not set priority.
- **User-stated priority:** User assigns relative importance; scoring must read allocation or ranked order.

### 4. Conditional flow

- Multiselect triggers follow-up items (manipulation/channels frequency pattern).
- Document max selections and whether selected items need **priority weights**.

### 5. Export parity

- Answer shape must be versioned (`scoringVersion`, `allocation.version`).
- Document in [`shared/export-utils.js`](../shared/export-utils.js) when shape changes.
- Legacy archived HTML may keep old UI until dual-host is retired.

## Recommendation labels

| Label | Meaning |
|-------|---------|
| **Keep** | Current UX matches mental model and scoring |
| **Multiselect** | Select multiple; equal or follow-up weighting |
| **Linked allocation** | Sum-to-100% sliders via [`shared/allocation-scales.js`](../shared/allocation-scales.js) |
| **Ranked** | Drag/order priority (already used in paradigm Phase 1) |
| **Defer** | Change desirable but blocked on data/scoring refactor |

## Scoring impact note (required)

For every **Change** recommendation, state:

- Which function computes scores (engine method + data file)
- Whether legacy 1–7 answers remain (allocation → `allocationWeightToScale7` bridge)
- Sample URL path for regression (`?sample=1` if available)
