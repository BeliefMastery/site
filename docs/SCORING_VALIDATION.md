# Scoring Validation (Allocation Pilot)

Validation steps for questionnaire UX changes that affect [`engine.answers`](../shared/allocation-scales.js) shape.

## Automated

```bash
node scripts/test-allocation-scales.mjs
```

Checks: `normalizeAllocation`, `redistributeOnChange`, `allocationWeightToScale7`, `buildAllocationAnswer`.

## Paradigm Phase 2 allocation parity

| Case | Independent sliders (legacy) | SPA allocation |
|------|---------------------------|----------------|
| All 25% each | four answers = 4 on 1–7 scale (if user sets mid) | weights 25/25/25/25 → scale7 ≈ 2.5 each |
| Literal 100% | `p2_dimension_literal` = 7 | literal weight 100 → 7 |
| Export | per-id keys in `answers` | same keys + `p2_*_dimension_allocation` object |

**Bridge formula:** `allocationWeightToScale7(p) = 1 + (p/100)×6` so scoring reading `answers['p2_dimension_literal']` remains numeric 1–7.

### Manual smoke

1. `#/engines/paradigm` — complete Phase 1 (or `?sample=1` if configured)
2. Phase 2 — confirm single allocation screen per track (Good Life / God)
3. Sliders sum to 100%; Next enabled only at 100%
4. Results render; export HTML/JSON includes dimension answers

### Archived HTML

Legacy [`archive/v3-engines/paradigm.html`](../archive/v3-engines/paradigm.html) still shows four independent sliders (`data-bm-legacy-page="true"`). No scoring regression expected on legacy path.

## Future changes

For each new allocation or multiselect-weight feature:

1. Add row to [`QUESTIONNAIRE_INVENTORY.md`](QUESTIONNAIRE_INVENTORY.md)
2. Extend `scripts/test-allocation-scales.mjs` or engine-specific fixture
3. Document export field in [`shared/export-utils.js`](../shared/export-utils.js) if JSON shape changes
