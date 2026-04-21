# Language Risk Log

## Purpose
Track high-impact certainty/safety language risks in report and export layers, and provide safer rewrite patterns.

## High-Priority Findings
| Priority | Engine | Current pattern | Risk type | Safer pattern | File |
|---|---|---|---|---|---|
| P0 | Pathology | "Pathology Assessment Results" / "High pathology indicators detected" | Clinical overreach and alarm framing | "Self-report symptom pattern results" / "Higher symptom-pattern intensity indicated" | `diagnosis-engine.js` |
| P0 | Manipulation | "manipulation vectors identified" / "How it controls you" | Deterministic and disempowering | "patterns consistent with manipulation vectors" / "How this pattern can influence choices" | `manipulation-engine.js` |
| P0 | Channels | "Identified Channel Blockages" | Deterministic category label | "Possible channel friction points" | `channels-engine.js` |
| P0 | Sovereignty Spectrum | "[CRITICAL] ... remediation" | Alarmist escalation | "[High priority] ... potential remediation path" | `sovereignty-spectrum-engine.js` |
| P1 | Sovereignty | "Top Vulnerability Risks" + critical styling | Alarm-focused framing | "Top areas to strengthen" with "high-priority/medium-priority" | `sovereignty-engine.js` |
| P1 | Dependency Loop | "This must be resolved." | Absolutist directive | "This is an important area to work on over time." | `needs-dependency-engine.js` |
| P1 | Coaching | "Do not re-run this assessment immediately" | Rigid directive | "Consider applying one cycle (e.g., 30 days) before reassessing." | `coaching-engine.js` |
| P1 | Logos | "dominant framing... naturally supports" | Overgeneralization | "current pattern appears to support" | `paradigm-engine.js` |
| P2 | Aptitude | "Top Career Fits" | Over-precision prediction claim | "Potential career matches to explore" | `outlier-aptitude-engine.js` |

## Rewrite Policy (to standardize all engines)
1. Prefer **probabilistic** phrasing: "suggests", "may indicate", "is consistent with".
2. Prefer **agency-preserving** framing over deterministic labels.
3. Avoid clinical diagnosis tone unless explicitly a clinical instrument and accompanied by clear scope limits.
4. Replace urgency labels (`critical`) with calibrated priority labels tied to explicit criteria.
5. Add confidence qualifier sentence to each result summary:
   - "This estimate is based on self-report patterns and should be interpreted as directional, not definitive."

## Engine-Level Residual Risk After Rewrites
| Engine | Residual risk |
|---|---|
| Pathology | Medium (clinical ontology remains inherently sensitive) |
| Manipulation | Medium |
| Dependency Loop | Low-Medium |
| Coaching | Low |
| Logos | Low-Medium |
| Channels | Low-Medium |
| Sovereignty | Medium |
| Sovereignty Spectrum | Medium |
| Entities | Low |
| Aptitude | Low-Medium |
