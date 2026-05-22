# Engine SPA Host Contract

React routes under `#/engines/:id` host assessment logic from repo-root `*-engine.js` files via **`externalUI: true`** and **`onNotify(event, payload?)`**.

## Constructor options

```javascript
new SomeEngine({
  externalUI: true,
  onNotify: (event, payload) => { /* update React state */ }
});
```

When `externalUI` is true:

- Do not call `attachEventListeners()` or `EngineUIController` DOM transitions.
- Emit events at phase boundaries instead of toggling legacy sections.

## Events

| Event | When | Typical payload |
|-------|------|-----------------|
| `init` | After `init()` / data load | — |
| `phase` | Idle, assessment, or results | `{ phase }` |
| `selection` | Selection changed | `{ selectedIds: string[] }` |
| `question` | Question ready | — (read `getQuestionSnapshot()`) |
| `refinement-offer` | Comorbidity refinement (diagnosis) | `{ groups }` |
| `results` | Results rendered or ready | — |

## Required host API (questionnaire engines)

| Method | Purpose |
|--------|---------|
| `getPhase()` | `'idle' \| 'assessment' \| 'results'` |
| `getQuestionSnapshot()` | Current question + progress |
| `getSelectionModel()` | Cards for idle selection (optional) |
| `toggleSelection(id)` | Toggle section/category |
| `startAssessment()` | Begin questionnaire |
| `nextQuestionFromExternal(value)` | Advance with answer |
| `prevQuestionFromExternal(value)` | Back with answer |
| `setExternalResultsMount(el)` | DOM mount for results HTML |
| `hydrateResultsView(el)` / `showResults()` | Render results |
| `resetAssessment()` | Return to idle |
| `exportReportHtml()` | Export (when implemented) |

## Legacy boot

Engines must not auto-boot when loaded from the Vite SPA bundle. Gate module-level boot on `document.body.dataset.bmLegacyPage === 'true'` (set only on archived HTML pages).

## Allocation questions (paradigm Phase 2 pilot)

- Engine emits `question.type === 'allocation'` with `allocationMembers[]`.
- Snapshot includes `allocationWeights` (sum to 100).
- React: [`AllocationSliders.jsx`](../v3/spa/src/engines/shared/AllocationSliders.jsx).
- Helpers: [`shared/allocation-scales.js`](../shared/allocation-scales.js).
- `nextQuestionFromExternal({ weights, sum })` — engine maps to per-member 1–7 for legacy scoring.

## React kit

See `v3/spa/src/engines/shared/`.
