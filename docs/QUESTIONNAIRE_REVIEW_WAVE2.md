# Questionnaire Review — Wave 2

Engines: paradigm, needs-dependency, manipulation, channels.

## Paradigm (Logos Structure)

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Phase 1 `ranked` / `multiselect` | **Keep** | Order and mapsTo weights in Phase 1 analysis |
| Phase 2 four `p2_dimension_*` sliders | **Linked allocation** in SPA (pilot shipped) | `applyAllocationAnswer` writes per-id 1–7 via `allocationWeightToScale7`; legacy HTML keeps four sliders |
| Phase 2 god `p2_god_dimension_*` | **Linked allocation** in SPA (same) | Same bridge for god track |
| Phase 3 integration sliders | **Keep** independent 1–7 | Integration / gap logic unchanged |

**Pilot:** [`paradigm-engine.js`](../paradigm-engine.js) `collapsePhase2DimensionBlocks()`, React [`AllocationSliders.jsx`](../v3/spa/src/engines/shared/AllocationSliders.jsx).

## Needs Dependency

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Phase 1 vice `multiselect` | **Keep** (max 3) | Vice mapping |
| Phase 2 five `scaled` items per loop | **Defer** linked allocation | Today fixed 20% blend each; changing requires `analyzePhase2` refactor |
| `need_chain` | **Keep** single-select chain | Structural, not weight split |

## Manipulation / Channels

| Area | Recommendation | Scoring impact |
|------|----------------|----------------|
| Phase 1 `three_point` | **Keep** | Option weight 0–3 |
| Phase 2 `multiselect` (max 3 vectors/channels) | **Multiselect + optional priority weights** (future) | Selected items treated equally today |
| Phase 3 conditional `frequency` | **Keep** | Branch inserts frequency questions; weight table unchanged |

## Wave 2 priority

| Priority | Item | Status |
|----------|------|--------|
| P1 | Paradigm Phase 2 allocation (SPA) | Implemented |
| P1 | Manipulation/channels priority among 3 picks | Documented — future |
| P3 | Needs Phase 2 relative blend | Defer |
