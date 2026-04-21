# Prioritized Remediation Plan

## P0 (Immediate)
| Engine(s) | Issue | Change | Verification |
|---|---|---|---|
| Pathology | Clinical over-certainty labels | Replace diagnosis-like wording in headers/conclusions with self-report language | Snapshot tests of report headers and executive export text |
| Manipulation | Deterministic/disempowering wording | Rewrite key headings and summaries to non-deterministic phrasing | Golden export diff + manual UX copy review |
| Channels | Absolute blockage labels | Rename blockage sections to probabilistic friction wording | Rendered results regression check |
| Sovereignty Spectrum | Alarmist "CRITICAL" tags | Replace with priority levels with explicit scoring rationale | Unit tests on severity mapping labels |

## P1 (Next Sprint)
| Engine(s) | Issue | Change | Verification |
|---|---|---|---|
| Sovereignty | Alarm-heavy risk framing | Rename vulnerability sections and severity labels; preserve score math | HTML export parity + UI text snapshots |
| Dependency Loop | Absolutist directives | Rewrite recommendations to guidance language with optionality | Recommendation string snapshots |
| Coaching | Rigid post-assessment directives | Convert to suggestion windows and context-sensitive guidance | Content checks + UX review |
| Logos | Overgeneralized interpretation text | Add confidence qualifiers and reduce universal claims | Rendered interpretation snapshots |
| Aptitude | Over-precise fit semantics | Replace deterministic ranking wording with exploratory framing | Export and summary text diff |

## P2 (Polish / Consistency)
| Engine(s) | Issue | Change | Verification |
|---|---|---|---|
| All engines | Inconsistent severity terminology | Standardize severity lexicon (`high-priority`, `moderate`, `watch`) | Cross-engine grep-based lint gate |
| All engines | Inconsistent uncertainty disclaimers | Add shared disclaimer snippet in each results summary | Shared text inclusion assertion |
| All engines | Confidence transparency | Add confidence/source notes where score decomposition exists | Report footer/metadata checks |

## Implementation Order
1. Copy-only P0 rewrites (no scoring changes).
2. Add shared language guardrails/utilities where practical.
3. Execute P1 rewrites per engine.
4. Run full regression pack and export parity checks.
5. Apply P2 consistency pass and lock with text lint checks.

## Expected Impact
- Reduced user harm from deterministic/alarmist interpretations.
- Improved legal/scope posture for self-report tools.
- Better interpretability without changing validated score mechanics in first pass.
