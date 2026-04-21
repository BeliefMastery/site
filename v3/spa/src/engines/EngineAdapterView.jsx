export default function EngineAdapterView({ label, legacyPage }) {
  return (
    <section className="stack">
      <article className="surface">
        <p className="kicker">Assessment</p>
        <h1 className="v3-hero-title">{label}</h1>
        <p>
          This V3 route is a staging entry point. The full interactive engine, scoring, exports, and persistence currently run in the parallel legacy page under <code>/site/v3/</code>—the same implementation as the
          classic site, hosted beside the new shell.
        </p>
        <p>
          <a className="v3-btn v3-btn--primary" href={legacyPage}>
            Open full assessment
          </a>
        </p>
        <p className="v3-muted">Your progress and exports remain in browser storage when you use the legacy UI for that engine.</p>
      </article>
    </section>
  );
}
