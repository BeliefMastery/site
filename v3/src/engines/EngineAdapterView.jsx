import { useMemo } from "react";

export default function EngineAdapterView({ label, legacyPage }) {
  const checklist = useMemo(
    () => [
      "Scoring parity with legacy engine outputs",
      "DataStore and progress restore compatibility",
      "Export/report parity validation",
      "Accessibility and keyboard flow",
    ],
    []
  );

  return (
    <section className="stack">
      <article className="surface">
        <h2>{label}</h2>
        <p>
          This V3 route uses an adapter migration pattern that preserves legacy engine behavior while enabling phased
          component rewrite.
        </p>
        <a className="inline-link" href={legacyPage}>
          Open legacy page
        </a>
      </article>
      <article className="surface">
        <h3>Migration Adapter Checklist</h3>
        <ul>
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
