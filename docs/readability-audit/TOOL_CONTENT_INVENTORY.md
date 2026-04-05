# Tool content inventory (readability audit)

Maps each live assessment tool to its **HTML shell**, **engine module**, and **primary data sources** for questions and report copy.

**How to run audits:** Pass 1/2 process and verification gates — [STRATEGY_V2.md](./STRATEGY_V2.md).

| Tool (page) | HTML | Engine | Data / copy sources |
|-------------|------|--------|---------------------|
| Pathology Assessment | [diagnosis.html](../../diagnosis.html) | [diagnosis-engine.js](../../diagnosis-engine.js) | [dsm5-data/index.js](../../dsm5-data/index.js), [dsm5-data/category-guide.js](../../dsm5-data/category-guide.js), [treatment-database.js](../../treatment-database.js) |
| Life Domain Review | [coaching.html](../../coaching.html) | [coaching-engine.js](../../coaching-engine.js) | [coaching-data/sovereignty-obstacles.js](../../coaching-data/sovereignty-obstacles.js), [satisfaction-domains.js](../../coaching-data/satisfaction-domains.js), [satisfaction-domain-examples.js](../../coaching-data/satisfaction-domain-examples.js), [question-weightings.js](../../coaching-data/question-weightings.js), [coaching-prompts.js](../../coaching-data/coaching-prompts.js), [deeper-inquiry.js](../../coaching-data/deeper-inquiry.js) |
| Dependency Loop Tracer | [needs-dependency.html](../../needs-dependency.html) | [needs-dependency-engine.js](../../needs-dependency-engine.js) | [needs-dependency-data/](../../needs-dependency-data/) (loops, vocab, glossaries, mappings, [need-actions.js](../../needs-dependency-data/need-actions.js)) |
| Your Sovereignty Paradigm | [sovereignty-spectrum.html](../../sovereignty-spectrum.html) | [sovereignty-spectrum-engine.js](../../sovereignty-spectrum-engine.js) | [sovereignty-spectrum-data/index.js](../../sovereignty-spectrum-data/index.js) |
| Logos Structure | [paradigm.html](../../paradigm.html) | [paradigm-engine.js](../../paradigm-engine.js) | [paradigm-data/](../../paradigm-data/) (good-life, god-perspectives, mapping, questions) |
| Manipulation Defense Decoder | [manipulation.html](../../manipulation.html) | [manipulation-engine.js](../../manipulation-engine.js) | [manipulation-data/](../../manipulation-data/) (vectors, tactics, symptom/effect/consequence questions, mapping, [manipulation-questions-v2.js](../../manipulation-data/manipulation-questions-v2.js)) |
| Cognitive Resistance Capacity | [sovereignty.html](../../sovereignty.html) | [sovereignty-engine.js](../../sovereignty-engine.js) | [sovereignty-data/cognitive-bands.js](../../sovereignty-data/cognitive-bands.js), [sovereignty-questions.js](../../sovereignty-data/sovereignty-questions.js), [sovereignty-layers.js](../../sovereignty-data/sovereignty-layers.js) |
| Channel Flow Diagnostics | [channels.html](../../channels.html) | [channels-engine.js](../../channels-engine.js) | [channel-data/nodes.js](../../channel-data/nodes.js), [channels.js](../../channel-data/channels.js), [remediation-strategies.js](../../channel-data/remediation-strategies.js), [channel-questions.js](../../channel-data/channel-questions.js) |
| Astrological Character Sheet | [character-sheet.html](../../character-sheet.html) | [character-sheet-engine.js](../../character-sheet-engine.js) | [character-sheet-data/western-astrology.js](../../character-sheet-data/western-astrology.js), [chinese-astrology.js](../../character-sheet-data/chinese-astrology.js), [mayan-astrology.js](../../character-sheet-data/mayan-astrology.js) |
| Will Anomaly Mapping | [entities.html](../../entities.html) | [entities-engine.js](../../entities-engine.js) | [entities-data.js](../../entities-data.js), [dsm5-data.js](../../dsm5-data.js) (bundle), [channel-data/](../../channel-data/), [needs-dependency-data/needs-vocabulary.js](../../needs-dependency-data/needs-vocabulary.js) |
| Aptitude Mapping | [outlier-aptitude.html](../../outlier-aptitude.html) | [outlier-aptitude-engine.js](../../outlier-aptitude-engine.js) | [outlier-aptitude-data.js](../../outlier-aptitude-data.js) |

## Shared infrastructure (all engines)

- [shared/data-loader.js](../../shared/data-loader.js) — lazy `import()` of data modules  
- [shared/export-utils.js](../../shared/export-utils.js) — HTML/JSON/CSV export wrappers  
- [shared/utils.js](../../shared/utils.js) — `SecurityUtils.safeInnerHTML`, sanitization  

## Marketing / reference (no engine)

| Page | Path |
|------|------|
| Home | [index.html](../../index.html) |
| Books | [books.html](../../books.html) |
| Tools catalog | [tools.html](../../tools.html) |
| About the author | [about-the-author.html](../../about-the-author.html) |
| Framework Atlas | [framework-atlas.html](../../framework-atlas.html) |

## Excluded from default audit scope

- `_archive/` HTML (legacy coaching exports)  
- `coaching/astrology-cheat-sheet.html` (supplementary)  

Update this table when adding a new `*-engine.js` + page pair.
