import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import { toolCategories, toolMeta, SITE_IMAGES } from "@/data/toolsCatalog";

export default function ToolsHubPage() {
  const byId = Object.fromEntries(engineRoutes.map((r) => [r.id, r]));

  return (
    <div className="stack">
      <section className="surface v3-tools-hero">
        <p className="kicker">Toolkit</p>
        <h1 className="v3-hero-title">Tools for reflection</h1>
        <p className="v3-lead">
          Pick a tool below—life review, pattern maps, gentle check-ins, and more. Everything saves in your browser the same way as on the main site.
        </p>
      </section>

      <nav className="tools-toolkit v3-tools-nav" aria-label="Tools by category">
        {toolCategories.map((cat) => (
          <section key={cat.id} className="v3-tool-category">
            <header className="v3-tool-category__head">
              <span className="v3-tool-category__eyebrow">{cat.eyebrow}</span>
              <h2 className="v3-tool-category__title">{cat.title}</h2>
              <p className="v3-tool-category__lede">{cat.lede}</p>
            </header>
            <ol className="v3-tool-list">
              {cat.toolIds.map((id) => {
                const route = byId[id];
                const meta = toolMeta[id];
                if (!route || !meta) return null;
                return (
                  <li key={id} className="v3-tool-row">
                    <Link to={route.path} className="v3-tool-row__thumb-wrap" aria-hidden="true" tabIndex={-1}>
                      <img className="v3-tool-row__thumb" src={`${SITE_IMAGES}/${meta.thumb}`} alt="" width={120} height={160} loading="lazy" />
                    </Link>
                    <div className="v3-tool-row__main">
                      <Link className="v3-tool-row__title" to={route.path}>
                        {route.label}
                      </Link>
                      <p className="v3-tool-row__desc">{meta.description}</p>
                    </div>
                    <Link className="v3-btn v3-btn--primary v3-tool-row__cta" to={route.path}>
                      {meta.cta}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </nav>

      <section className="surface">
        <h2 className="v3-section-title">Elsewhere</h2>
        <p className="v3-muted">Unlocked GPT opens in a new tab so you can keep this page open.</p>
        <a className="v3-btn v3-btn--ghost" href="https://chatgpt.com/g/g-684212ba47e081918d000ec3f9cf8f69-simulacrum-exorcist-edition" target="_blank" rel="noreferrer">
          Open Unlocked GPT
        </a>
      </section>
    </div>
  );
}
