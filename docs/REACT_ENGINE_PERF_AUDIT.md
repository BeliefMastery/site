# React Engine SPA — Performance Audit Log

Append-only log for Track A optimizations (native assessment hosts).

## Baseline (pre-optimization, commit `77ed61a`)

| Check | Notes |
|-------|--------|
| Bundle | Single `index-*.js` ~324 KB (gzip ~102 KB); all 11 engine views eagerly imported |
| Re-renders | `onNotify` called `bump()` twice per event |
| StrictMode | No engine teardown on unmount; bridges re-hydrated without cleanup |
| Route split | None — full view bundle on first engine route |

## Batch 1 — Host + views + code split (this initiative)

| Change | Expected impact |
|--------|-----------------|
| Deduped `bump()` in `useEngineHost` | ~50% fewer tick-driven re-renders per notify |
| Engine teardown + `initGeneration` guard | StrictMode-safe; fewer duplicate listeners |
| Bridge cleanup + `questionKey` / `phase` deps | DOM re-render only on question/phase change |
| Selection toggle without double bump | One state sync per click |
| `memo` on SelectionGrid, QuestionFlow, ExportActions | Fewer child re-renders |
| `React.lazy` per `nativeEngineViews` + Suspense | Smaller initial engine route chunk |

### Post-batch build metrics (Batch 1 complete)

After `npm run v3:build`:

```
index-DIDOkbLI.js (gzip): 97.69 kB  (was ~101.77 kB)
index-CAKu1aQj.css (gzip): 6.17 kB
Per-engine view chunks: 0.28–3.25 kB each (lazy)
paradigm-engine-DUbMBcc3.js: 11.52 kB gzip (allocation pilot)
```

### Manual smoke routes

- `#/engines/coaching` — slider QuestionFlow
- `#/engines/paradigm` — DOM bridge + Phase 2 allocation (SPA)
- `#/engines/diagnosis` — refinement + slider

### Profiler checklist (DevTools)

1. Toggle one selection card — expect 1–2 commits (not 4+)
2. Next question — QuestionFlow or bridge once
3. Navigate away — no console errors; engine teardown
