# Style addendum — readable assessments & marketing copy

Companion to the site’s visual CSS themes. Use for **new** report templates, tool intros, and marketing edits.

**Operational workflow:** [STRATEGY_V2.md](./STRATEGY_V2.md) (Pass 1 / Pass 2, verification gates, cadence). **Shared definitions:** [GLOSSARY.md](./GLOSSARY.md).

## Report order (generated output)

1. **Purpose line** — One sentence: what the user is looking at and what to do with it.  
2. **Top takeaways** — Up to three bullets or a short paragraph with the main findings **before** methodology, tables, or collapsed sections.  
3. **Headline finding** — Name the primary pattern/vector/domain in plain language.  
4. **Interpretation** — One short paragraph tying the finding to lived experience.  
5. **Evidence / detail** — Scores, bands, categories, tactics — collapsible where long.  
6. **Methodology note** — Scale translation, validation consistency, weight provenance — **after** or beside findings, not before, unless legally required.  
7. **Action / next step** — What to try, what to watch, or where to go next (including internal links).  
8. **Safety / scope** — Disclaimers, “not therapy/diagnosis,” professional care — keep concise and consistent across tools.

## Paragraphs and sentences

- Aim for **≤ 120–150 words** per visible paragraph** in marketing and report intros; break longer explanations with headings or bullets.  
- Treat **sentences over ~28–30 words** as candidates to split (clinical lists excepted).  
- Prefer **one idea per question** in questionnaires; avoid double-barreled items unless scored separately.

## Jargon and frameworks

- On **first use in a given report**, spell out acronyms and framework terms, or add a **one-line gloss** (e.g. “Likert 0–10 = how much this applied to you”).  
- **DSM**, **comorbidity**, **differential diagnosis** — keep accurate; pair with a short plain-language clause where space allows.
- Reuse wording from [GLOSSARY.md](./GLOSSARY.md) for terms that appear across multiple tools; add new rows there when you standardize a definition.

## Repetition

- Do not paste the same **intro disclaimer** on every screen variant inside one tool; say it once in the shell + once in export if needed.  
- Shared boilerplate (privacy, “no data leaves your device”) should use **one canonical** string per surface (footer vs. questionnaire vs. export).

## Tone

- **Marketing:** direct, benefit-led, minimal repetition of full methodology.  
- **Tool UI:** calm, instructive, neutral on outcomes.  
- **Reports:** precise, skimmable, compassionate; avoid mixed metaphors in the same section.

## Implementation preference

- Prefer **CSS classes** over inline `style` for report HTML so themes and readability (contrast, spacing) stay consistent.  
- Large dynamic lists (tactics, symptoms) should use **`<details>` / accordions** when count is unbounded.

## Review checklist (quick)

- [ ] Purpose line present  
- [ ] Top findings before methodology  
- [ ] Terms defined on first use in this report  
- [ ] Action or “what next” where appropriate  
- [ ] No duplicate boilerplate without intent  
- [ ] Major sections skimmable via headings  
