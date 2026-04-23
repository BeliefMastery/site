import { useEffect, useMemo, useState } from "react";
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

const PORTAL_SLIDES = [
  {
    id: "belief-mastery",
    statement: "The reason you're not full of joy is because your subconscious is wired to get you to do things you don't want to do.",
    supporting: "Belief Mastery exposes the hidden rules driving emotional loops and dependency, then walks a precise rewrite process.",
    extended:
      "Subconscious beliefs form in moments of overwhelm—protecting the child but limiting the adult. They distort perception, drive hidden dependency, and repeat emotional loops. Belief Mastery rewrites those buried rules through a precise step-by-step inference and transformation process.",
    href: "/books#belief-mastery",
    cta: "Explore Inner Architecture",
  },
  {
    id: "sovereign-of-mind",
    statement: "Your thoughts may not always be your own.",
    supporting: "Sovereign of Mind strengthens discernment and protects conscious authorship under pressure from manipulation systems.",
    extended:
      "In a world built for persuasion, mimicry, and dependency, most minds operate on borrowed scaffolding—trauma, culture, ideology. Sovereign of Mind is the structural antidote. Part field manual, part philosophical defense, it fortifies the architecture that thinking stands on—securing authorship against systems and interests that seek to claim it.",
    href: "/books#sovereign-of-mind",
    cta: "Fortify Cognitive Structure",
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
          <p className="v3-portal-kicker">Portal {activeIndex + 1} of {slideCount}</p>
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
      <section className="surface v3-hero">
        <p className="kicker">Sovereign of Mind</p>
        <h1 className="v3-hero-title">Structure Your Mind — Author Your Life.</h1>
        <p className="v3-lead">Excavate your hidden rules and fortify your cognitive defenses.</p>
      </section>
      <PortalBanner />

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
