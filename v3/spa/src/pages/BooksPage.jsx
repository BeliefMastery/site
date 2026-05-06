import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_IMAGES } from "@/data/toolsCatalog";

function BookHero({ id, title, subtitle, cover, alt, children, action }) {
  return (
    <section id={id} className="surface v3-book-section">
      <h2 className="v3-book-title">{title}</h2>
      {subtitle ? <p className="v3-book-subtitle">{subtitle}</p> : null}
      <div className="v3-book-hero">
        <img src={`${SITE_IMAGES}/${cover}`} alt={alt} className="v3-book-cover" width={378} height={605} loading="lazy" />
        <div className="v3-book-hero__text">{children}</div>
      </div>
      {action}
    </section>
  );
}

export default function BooksPage() {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    window.requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash, location.pathname]);

  return (
    <div className="stack">
      <section className="surface v3-books-intro">
        <p className="kicker">Catalog</p>
        <h1 className="v3-hero-title">Books</h1>
        <p className="v3-lead">
          Straightforward writing for people who want real change—belief work, mental clarity, and frameworks you can actually use.
        </p>
      </section>

      <BookHero
        id="belief-mastery"
        title="Belief Mastery"
        subtitle="Rewriting the rules underneath your life"
        cover="BM-cover.jpg"
        alt="Belief Mastery cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Belief-Mastery-Identifying-Transforming-Subconscious-ebook/dp/B0FG1B174P" target="_blank" rel="noreferrer">
            Buy on Amazon
          </a>
        }
      >
        <p className="v3-book-lead">
          Old beliefs often formed when you were overwhelmed—they helped then and may limit you now. <strong>Belief Mastery</strong> is a step-by-step way to see those beliefs clearly and work with them kindly.
        </p>
        <ul className="v3-feature-list">
          <li>Find the need behind repeating problems.</li>
          <li>Name the belief that keeps a pattern stuck.</li>
          <li>Walk a clear inference process instead of guessing.</li>
          <li>Gentle inner work with room for real-life examples.</li>
        </ul>
        <p className="v3-book-note">
          Pairs guided imagery (<em>The Journey Home</em>) with a logical sequence (<em>The Belief Inference Process</em>) so head and heart can move together.
        </p>
      </BookHero>

      <BookHero
        id="sovereign-of-mind"
        title="Sovereign of Mind"
        subtitle="Keeping your mind yours in a noisy world"
        cover="SoM-cover.jpg"
        alt="Sovereign of Mind cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Sovereign-Mind-Cognitive-Manipulation-Authorship-ebook/dp/B0F9VJK911" target="_blank" rel="noreferrer">
            Buy on Amazon
          </a>
        }
      >
        <p className="v3-book-lead">
          Not every thought arrives with your name on it. <strong>Sovereign of Mind</strong> is a readable field guide to influence, clarity, and owning your judgment again.
        </p>
        <ul className="v3-feature-list">
          <li>Tell pressure apart from your own voice.</li>
          <li>Strengthen discernment without turning cynical.</li>
          <li>Build a worldview that can hold real-life contradiction.</li>
          <li>See manipulation patterns for what they are.</li>
          <li>Stay steady in relationships without giving yourself away.</li>
        </ul>
        <p className="v3-book-note">For anyone who wants mental habits that feel steady—not borrowed.</p>
      </BookHero>

      <BookHero
        id="distortion-codex"
        title="The Sovereignty-Distortion Codex"
        subtitle="Spotting patterns that quietly steal clarity"
        cover="SDC-cover.jpg"
        alt="Sovereignty-Distortion Codex cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Structural-Demonology-Taxonomy-Sovereignty-Distortion-Codex/dp/B0FHG1M794" target="_blank" rel="noreferrer">
            Buy on Amazon
          </a>
        }
      >
        <p className="v3-book-lead">
          Some forces bend perception before they show up as an argument. The <strong>Codex</strong> names those patterns—in culture, myth, and groups—so you can see them earlier and respond with both eyes open.
        </p>
        <ul className="v3-feature-list">
          <li>Simple “if this, watch for that” recognition cues.</li>
          <li>How beauty and ideals get used against you.</li>
          <li>Early moves when dynamics in a group or relationship turn sour.</li>
        </ul>
      </BookHero>

      <BookHero
        id="unspeakables-grimoire"
        title="The Unspeakables Grimoire"
        subtitle="Plain words for hard-to-name experience"
        cover="U-cover.jpg"
        alt="The Unspeakables Grimoire cover"
      >
        <p className="v3-book-lead">
          A working notebook for inner and relational territory that usual language skips past—without hype or fear-mongering.
        </p>
        <ul className="v3-feature-list">
          <li>Name subtle states without dramatizing them.</li>
          <li>Reduce mix-ups between intuition and old fear.</li>
          <li>Track symbols, moods, and repeats over time.</li>
          <li>Turn “something’s off” into clear next questions.</li>
        </ul>
        <p className="v3-book-note">Precision over spectacle—so you can look honestly and stay grounded.</p>
      </BookHero>

      <BookHero
        id="sovereign-integral-devotionalism"
        title="Sovereign Integral Devotionalism"
        subtitle="Depth and awe without giving your mind away"
        cover="SID-cover.jpg"
        alt="Sovereign Integral Devotionalism cover"
      >
        <p className="v3-book-lead">
          For people who want reverence <em>and</em> adulthood—room for mystery without pressure, confusion, or spiritual bullying.
        </p>
        <ul className="v3-feature-list">
          <li>Love the sacred without shutting down your mind.</li>
          <li>Hold reason, body, and ethics in one frame.</li>
          <li>Tell real openness apart from people-pleasing faith.</li>
          <li>Spot coercion dressed as “higher truth.”</li>
          <li>Let practice show up in how you treat people.</li>
        </ul>
        <p className="v3-book-note">Serious about spirit, serious about clarity.</p>
      </BookHero>

      <BookHero
        id="peer-counseling-manual"
        title="The Peer-Counseling Manual"
        subtitle="Helping friends well—without playing therapist"
        cover="PC-cover.jpg"
        alt="The Peer-Counseling Manual cover"
      >
        <p className="v3-book-lead">
          Simple structures for listening, mediation, and steadying hard conversations—peer to peer, with clear boundaries.
        </p>
        <ul className="v3-feature-list">
          <li>Listen and reflect without taking over.</li>
          <li>Cool things down while keeping dignity intact.</li>
          <li>Know when support ends and a referral begins.</li>
          <li>Short debriefs that reduce repeat drama.</li>
          <li>Build trust that lasts past one heavy talk.</li>
        </ul>
        <p className="v3-book-note">Built so help stays honest and within scope—not amateur therapy in disguise.</p>
      </BookHero>
    </div>
  );
}
