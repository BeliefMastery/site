import { Link } from "react-router-dom";
import { engineRoutes } from "@/routes";
import { toolMeta, SITE_IMAGES } from "@/data/toolsCatalog";
import { generalDisclaimer, toolDisclaimerSections } from "@/data/homeDisclaimers";
import { homeBridge, homeHero } from "@/data/homeCopy";
import HomeEngageSlider from "@/components/HomeEngageSlider";
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

export default function HomePage() {
  return (
    <div className="stack v3-home">
      <section
        className="surface v3-home-hero v3-hero--statement v3-section-band--solid"
        aria-labelledby="home-hero-thesis"
      >
        <div className="v3-home-hero__frame">
          <div className="v3-hero__inner">
            <h1 id="home-hero-thesis" className="v3-hero-title v3-hero-title--single">
              {homeHero.thesis}
            </h1>
            <div className="v3-hero__subtitle-stack">
              <h2 className="v3-hero__subtitle v3-hero__subtitle--works">{homeHero.subtitleWorks}</h2>
              <h3 className="v3-hero__subtitle v3-hero__subtitle--pivot">{homeHero.subtitlePivot}</h3>
              <h3 className="v3-hero__subtitle v3-hero__subtitle--promise">
                <em>{homeHero.subtitlePromise}</em>
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="surface v3-section--breathable v3-section-band--gradient">
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

      <section
        className="surface v3-section--breathable v3-bridge v3-section-band--solid"
        aria-labelledby="engage-section-title"
      >
        <div className="v3-section-head">
          <h2 id="engage-section-title" className="v3-section-title">
            Where to start
          </h2>
        </div>
        <HomeEngageSlider slides={homeBridge.engageSlides} />
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

      <section className="surface v3-disclosures v3-section--breathable v3-section-band--solid" aria-label="How these works fit together">
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
      </section>

      <TestimonialStack />

      <section className="surface v3-disclosures v3-section--breathable v3-section-band--solid" aria-label="Disclaimers and privacy">
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
