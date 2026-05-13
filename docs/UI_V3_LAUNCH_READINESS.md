# UI V3 Launch Readiness

## Launch gates
1. V3 build completes with no errors.
2. Route map and engine bridge links validated.
3. Theme persistence validated across all variants.
4. Accessibility smoke check complete.
5. Legacy engine flows and exports still accessible.

## Rollback
- Keep legacy static pages unchanged at root.
- Deploy V3 SPA at `/site/v3/app/` as the canonical site; static engine HTML is served from `/site/archive/v3-engines/` (iframe embed).
- If release issue occurs, disable V3 entry links and retain legacy routing.

## Post-launch hardening
- Replace bridge adapters with fully componentized engine views.
- Add automated parity assertions for route coverage and storage compatibility.
- Move duplicated legacy copy into shared content modules.
