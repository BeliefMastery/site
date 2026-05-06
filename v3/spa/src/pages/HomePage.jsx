import { useEffect, useMemo, useState } from "react";
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

const PORTAL_SLIDES = [
  {
    id: "belief-mastery",
    statement: "When old beliefs run the show, joy and real choice can feel out of reach.",
    supporting: "Belief Mastery walks you through seeing those beliefs clearly—and updating them at a pace you can hold.",
    extended:
      "Many beliefs formed when you were overwhelmed. They made sense then; they may narrow you now. The book offers a step-by-step way to notice them and work with them honestly.",
    href: "/books#belief-mastery",
    cta: "Explore Belief Mastery",
  },
  {
    id: "sovereign-of-mind",
    statement: "Your mind deserves to feel like yours.",
    supporting: "Sovereign of Mind is about clarity, influence, and standing in your own judgment—not someone else’s script.",
    extended:
      "Pressure, noise, and persuasion can sound like your own voice. This book helps you tell the difference and stay steady.",
    href: "/books#sovereign-of-mind",
    cta: "Explore Sovereign of Mind",
  },
];

function PortalBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const slideCount = PORTAL_SLIDES.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused || slideCount <= 1) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reducedMotion, isPaused, slideCount]);

  const activeSlide = useMemo(() => PORTAL_SLIDES[activeIndex], [activeIndex]);

  return (
    <article
      className="v3-portal-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-label="Introductory portal highlights"
    >
      <div
        className="v3-portal-slide-wrap"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label="Toggle extended portal explanation"
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
      >
        <div className="v3-portal-slide" key={activeSlide.id}>
          <p className="v3-portal-kicker">
            Two books · {activeIndex + 1} of {slideCount}
          </p>
          <blockquote className="v3-portal-quote">{activeSlide.statement}</blockquote>
          <p className="v3-portal-support">{activeSlide.supporting}</p>
          <p className={`v3-portal-extended ${expanded ? "is-open" : ""}`} hidden={!expanded}>
            {activeSlide.extended}
          </p>
          <Link className="v3-btn v3-btn--primary v3-portal-cta" to={activeSlide.href}>
            {activeSlide.cta}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="stack v3-home">
      <section className="surface v3-hero v3-hero--statement">
        <div className="v3-hero__inner">
          <h1 className="v3-hero-title v3-hero-title--single">{homeHero.thesis}</h1>
        </div>
      </section>

      <section className="surface v3-section--breathable v3-bridge">
        <h2 className="v3-section-title">{homeBridge.title}</h2>
        <p className="v3-lead v3-bridge__intro">{homeBridge.intro}</p>
        <ul className="v3-bridge-list">
          {homeBridge.bullets.map((item) => (
            <li key={item.label}>
              <strong>{item.label}.</strong> {item.text}
            </li>
          ))}
        </ul>
        <div className="v3-audit-cta">
          <Link className="v3-btn v3-btn--primary" to={homeBridge.ctaPrimary.to}>
            {homeBridge.ctaPrimary.label}
          </Link>
          <Link className="v3-btn v3-btn--outline" to={homeBridge.ctaSecondary.to}>
            {homeBridge.ctaSecondary.label}
          </Link>
        </div>
      </section>

      <PortalBanner />

      <TestimonialStack />

      <section className="surface v3-section--breathable">
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

      <section className="surface v3-section--breathable">
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

      <section className="surface v3-disclosures v3-section--breathable">
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
