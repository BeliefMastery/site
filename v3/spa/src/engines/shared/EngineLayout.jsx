export default function EngineLayout({ label, lead, children }) {
  return (
    <section className="stack bm-engine v3-engine-native">
      <article className="surface v3-engine-route__intro">
        <p className="kicker">Tool</p>
        <h1 className="v3-hero-title">{label}</h1>
        {lead ? <p className="v3-muted">{lead}</p> : null}
        <p className="v3-muted v3-engine-disclaimer">
          <a href="#/">Disclaimers and notices</a> are on the home page.
        </p>
      </article>
      <div className="v3-engine-native__body">{children}</div>
    </section>
  );
}
