import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import { toolMeta, SITE_IMAGES } from "@/data/toolsCatalog";
import { generalDisclaimer, toolDisclaimerSections } from "@/data/homeDisclaimers";
import { homeBridge, homeHero } from "@/data/homeCopy";
import SuiteProgressCard from "@/components/SuiteProgressCard";
import TestimonialStack from "@/components/TestimonialStack";

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

const bridgeCtaClass = (variant) => {
  const base = "v3-btn";
  switch (variant) {
    case "primary":
      return `${base} v3-btn--primary`;
    case "ghost":
      return `${base} v3-btn--ghost`;
    case "soft":
      return `${base} v3-btn--soft`;
    case "outline":
    default:
      return `${base} v3-btn--outline`;
  }
};


export default function HomePage() {
  return (
    <div className="stack v3-home">
      <section className="surface v3-hero--statement v3-section-band--gradient">
        <div className="v3-hero__inner">
          <h1 className="v3-hero-title v3-hero-title--single">{homeHero.thesis}</h1>
        </div>
      </section>

      <section className="surface v3-section--breathable v3-bridge v3-section-band--solid" aria-label="Introduction">
        <p className="v3-lead v3-bridge__intro v3-bridge__intro--center">{homeBridge.intro}</p>
        <ul className="v3-bridge-list v3-bridge-list--layered">
          {homeBridge.bullets.map((item, i) => (
            <li key={item.label} style={{ "--v3-bridge-layer": i }}>
              <strong>{item.label}.</strong> {item.text}
            </li>
          ))}
        </ul>
        <div className="v3-bridge-cta">
          {homeBridge.ctas.map((cta) => (
            <Link key={cta.label} className={bridgeCtaClass(cta.variant)} to={cta.to}>
              {cta.label}
            </Link>
          ))}
        </div>
      </section>

      <TestimonialStack />

      <section className="surface v3-section--breathable v3-section-band--solid">
        <div className="v3-section-head">
          <h2 className="v3-section-title">
            <Link to="/tools">Tools you can use online</Link>
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

      <section className="surface v3-section--breathable v3-section-band--gradient">
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

      <section className="surface v3-disclosures v3-section--breathable v3-section-band--solid">
        <details className="v3-details">
          <summary>How these works fit together</summary>
          <div className="v3-details__body">
            <p>They are meant to work as one family—not separate fixes.</p>
            <p>
              <strong>Belief Mastery</strong> focuses on the beliefs and patterns underneath daily life.
            </p>
            <p>
              <strong>Sovereign of Mind</strong> focuses on clear thinking when the world pushes hard.
            </p>
            <p>
              The <strong>Codex</strong> names common distortions so you can spot them early and respond with steadiness.
            </p>
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
