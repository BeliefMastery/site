import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import { toolCategories, toolMeta, toolkitListItemIds, SITE_IMAGES } from "@/data/toolsCatalog";

const byId = Object.fromEntries(engineRoutes.map((r) => [r.id, r]));

function suiteAttrs(gate) {
  if (gate == null) return {};
  return { "data-suite-gate": String(gate) };
}

function ToolkitRow({ id }) {
  const meta = toolMeta[id];
  if (!meta) return null;
  const rowId = toolkitListItemIds[id];
  const gateProps = suiteAttrs(meta.suiteGate);

  if (meta.externalHref) {
    const href = meta.externalHref;
    return (
      <li key={id} className="v3-tool-row" id={rowId}>
        <a
          href={href}
          className="v3-tool-row__thumb-wrap"
          target="_blank"
          rel="noopener noreferrer"
          aria-hidden="true"
          tabIndex={-1}
        >
          <img className="v3-tool-row__thumb" src={`${SITE_IMAGES}/${meta.thumb}`} alt="" width={120} height={160} loading="lazy" />
        </a>
        <div className="v3-tool-row__main">
          <a className="v3-tool-row__title" href={href} target="_blank" rel="noopener noreferrer">
            Unlocked GPT
          </a>
          <p className="v3-tool-row__desc">{meta.description}</p>
        </div>
        <a className="v3-btn v3-btn--primary v3-tool-row__cta" href={href} target="_blank" rel="noopener noreferrer">
          {meta.cta}
        </a>
      </li>
    );
  }

  const route = byId[id];
  if (!route) return null;

  return (
    <li key={id} className="v3-tool-row" id={rowId}>
      <Link to={route.path} className="v3-tool-row__thumb-wrap" aria-hidden="true" tabIndex={-1}>
        <img className="v3-tool-row__thumb" src={`${SITE_IMAGES}/${meta.thumb}`} alt="" width={120} height={160} loading="lazy" />
      </Link>
      <div className="v3-tool-row__main">
        <Link className="v3-tool-row__title" to={route.path} {...gateProps}>
          {route.label}
        </Link>
        <p className="v3-tool-row__desc">{meta.description}</p>
      </div>
      <Link className="v3-btn v3-btn--primary v3-tool-row__cta" to={route.path} {...gateProps}>
        {meta.cta}
      </Link>
    </li>
  );
}

/** Body matches v3/tools.html: title, category blocks, toolkit rows (incl. Unlocked GPT in tech). */
export default function ToolsHubPage() {
  return (
    <div className="stack v3-tools-page">
      <section className="surface v3-tools-page-section" id="tools" aria-labelledby="tools-title">
        <h1 id="tools-title" className="v3-hero-title v3-tools-page-title">
          Sovereignty Tools
        </h1>

        <nav className="tools-toolkit v3-tools-nav" aria-label="Tools by category">
          {toolCategories.map((cat) => (
            <section
              key={cat.id}
              className={`v3-tool-category tools-toolkit-group tools-toolkit-group--${cat.id}`}
              aria-labelledby={`tools-cat-${cat.id}`}
            >
              <header className="v3-tool-category__head tools-toolkit-group__head">
                <span className="v3-tool-category__eyebrow tools-toolkit-group__eyebrow">{cat.eyebrow}</span>
                <h2 id={`tools-cat-${cat.id}`} className="v3-tool-category__title tools-toolkit-group__title">
                  {cat.title}
                </h2>
                <p className="v3-tool-category__lede tools-toolkit-group__lede">{cat.lede}</p>
              </header>
              <ol className="v3-tool-list tools-toolkit-list">
                {cat.toolIds.map((toolId) => (
                  <ToolkitRow key={toolId} id={toolId} />
                ))}
              </ol>
            </section>
          ))}
        </nav>
      </section>
    </div>
  );
}
