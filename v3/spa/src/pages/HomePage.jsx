import { useState } from "react";
import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import { toolMeta, SITE_IMAGES } from "@/data/toolsCatalog";
import { generalDisclaimer, toolDisclaimerSections } from "@/data/homeDisclaimers";
import SuiteProgressCard from "@/components/SuiteProgressCard";

const UNLOCKED_GPT = {
  href: "https://chatgpt.com/g/g-684212ba47e081918d000ec3f9cf8f69-simulacrum-exorcist-edition",
  label: "Unlocked GPT",
  thumb: "simulacra.jpg",
  alt: "Unlocked GPT AI Agent",
};

const BOOK_LINKS = [
  { hash: "belief-mastery", cover: "BM-cover.jpg", alt: "Belief Mastery cover" },
  { hash: "sovereign-of-mind", cover: "SoM-cover.jpg", alt: "Sovereign of Mind cover" },
  { hash: "distortion-codex", cover: "SDC-cover.jpg", alt: "Sovereignty-Distortion Codex cover" },
  { hash: "unspeakables-grimoire", cover: "U-cover.jpg", alt: "The Unspeakables Grimoire cover" },
  { hash: "sovereign-integral-devotionalism", cover: "SID-cover.jpg", alt: "Sovereign Integral Devotionalism cover" },
  { hash: "peer-counseling-manual", cover: "PC-cover.jpg", alt: "The Peer-Counseling Manual cover" },
];

function ToolCoverLink({ to, src, alt }) {
  return (
    <Link to={to} className="v3-cover-tile">
      <img src={`${SITE_IMAGES}/${src}`} alt={alt} width={378} height={605} loading="lazy" />
    </Link>
  );
}

function PortalCard({ quote, children, href, cta }) {
  const [open, setOpen] = useState(false);
  return (
    <article className={`v3-portal-card ${open ? "v3-portal-card--open" : ""}`}>
      <button type="button" className="v3-portal-card__summary" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <blockquote className="v3-portal-quote">{quote}</blockquote>
      </button>
      <div className="v3-portal-card__body" hidden={!open}>
        {children}
        <Link className="v3-btn v3-btn--primary" to={href}>
          {cta}
        </Link>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="stack v3-home">
      <section className="surface v3-hero">
        <p className="kicker">Sovereign of Mind</p>
        <h1 className="v3-hero-title">Structure Your Mind — Author Your Life.</h1>
        <p className="v3-lead">Excavate your hidden rules and fortify your cognitive defenses.</p>
      </section>

      <section className="surface">
        <div className="v3-section-head">
          <h2 className="v3-section-title">
            <Link to="/tools">Online Sovereignty Tools and Analysis</Link>
          </h2>
        </div>
        <div className="v3-cover-grid">
          {engineRoutes.map((tool) => {
            const meta = toolMeta[tool.id];
            if (!meta) return null;
            return <ToolCoverLink key={tool.id} to={tool.path} src={meta.thumb} alt={tool.label} />;
          })}
          <a className="v3-cover-tile" href={UNLOCKED_GPT.href} target="_blank" rel="noreferrer">
            <img src={`${SITE_IMAGES}/${UNLOCKED_GPT.thumb}`} alt={UNLOCKED_GPT.alt} width={378} height={605} loading="lazy" />
          </a>
        </div>
      </section>

      <section className="surface">
        <div className="v3-section-head">
          <h2 className="v3-section-title">
            <Link to="/books">Books</Link>
          </h2>
        </div>
        <div className="v3-cover-grid">
          {BOOK_LINKS.map((b) => (
            <Link key={b.hash} to={`/books#${b.hash}`} className="v3-cover-tile">
              <img src={`${SITE_IMAGES}/${b.cover}`} alt={b.alt} width={378} height={605} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>

      <section className="surface v3-disclosures">
        <details className="v3-details">
          <summary>How these works connect</summary>
          <div className="v3-details__body">
            <p>These works operate as a <strong>coherent suite</strong>, not isolated products.</p>
            <p>
              <strong>Belief Mastery</strong> excavates the subconscious logic that shapes choices and reorders behavior through a disciplined inference and dismantling process.
            </p>
            <p>
              <strong>Sovereign of Mind</strong> fortifies perception and supplies tools for resisting cognitive hijack.
            </p>
            <p>
              The <strong>Codex</strong> exposes recurring structural deformations so readers can recognize systemic pressure early and respond with clarity and agency.
            </p>
          </div>
        </details>

        <details className="v3-details" open>
          <summary>Introductory portals</summary>
          <div className="v3-details__body">
            <div className="grid v3-portal-grid">
              <PortalCard
                quote="The reason you're not full of joy is because your subconscious is wired to get you to do things you don't want to do."
                href="/books#belief-mastery"
                cta="Explore Inner Architecture"
              >
                <p>
                  Subconscious beliefs form in moments of overwhelm—protecting the child but limiting the adult. They distort perception, drive hidden dependency, and repeat emotional loops.{" "}
                  <strong>Belief Mastery</strong> rewrites those buried rules through a precise step-by-step inference and transformation process.
                </p>
              </PortalCard>
              <PortalCard quote="Your thoughts may not always be your own." href="/books#sovereign-of-mind" cta="Fortify Cognitive Structure">
                <p>
                  In a world built for persuasion, mimicry, and dependency, most minds operate on borrowed scaffolding—trauma, culture, ideology. <strong>Sovereign of Mind</strong> is the structural antidote.
                  Part field manual, part philosophical defense, it fortifies the architecture that thinking stands on—securing authorship against systems and interests that seek to claim it.
                </p>
              </PortalCard>
            </div>
          </div>
        </details>

        <details className="v3-details">
          <summary>{generalDisclaimer.title}</summary>
          <div className="v3-details__body">
            <p className="v3-form-help">{generalDisclaimer.general}</p>
            <div className="v3-ack">
              <p>{generalDisclaimer.privacy}</p>
            </div>
            <p className="v3-form-help">{generalDisclaimer.aptitudeNote}</p>

            <div className="v3-nested-disclosures" role="group" aria-label="Per-tool disclaimers">
              {toolDisclaimerSections.map((section) => (
                <details key={section.key} className="v3-details v3-details--nested">
                  <summary>{section.summary}</summary>
                  <div className="v3-details__body" dangerouslySetInnerHTML={{ __html: section.body }} />
                </details>
              ))}
            </div>
          </div>
        </details>
      </section>

      <SuiteProgressCard />
    </div>
  );
}
