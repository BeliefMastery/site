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
        <h1 className="v3-hero-title">Books &amp; frameworks</h1>
        <p className="v3-lead">
          Secular armor for the cognitively vigilant: language, structure, and method for standing guard over the mind itself—without surrendering discernment or agency.
        </p>
      </section>

      <BookHero
        id="belief-mastery"
        title="Belief Mastery"
        subtitle="A Structural Method for Rewriting Your Hidden Rules"
        cover="BM-cover.jpg"
        alt="Belief Mastery cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Belief-Mastery-Identifying-Transforming-Subconscious-ebook/dp/B0FG1B174P" target="_blank" rel="noreferrer">
            Purchase Belief Mastery
          </a>
        }
      >
        <p className="v3-book-lead">
          Subconscious beliefs form in moments of overwhelm—protecting the child but limiting the adult. They distort perception, drive hidden dependency, and repeat emotional loops. <strong>Belief Mastery</strong>{" "}
          rewrites those buried rules through a precise step-by-step inference and transformation process.
        </p>
        <ul className="v3-feature-list">
          <li>Trace recurring problems to their root need.</li>
          <li>Expose the belief holding each pattern in place.</li>
          <li>Navigate a 12-step inference process to transform it.</li>
          <li>Re-parent the parts that once had no choice.</li>
          <li>Master pattern tracing through detailed case studies.</li>
        </ul>
        <p className="v3-book-note">
          Blending right-brain visualization (<em>The Journey Home</em>) with left-brain logic (<em>The Belief Inference Process</em>), this book delivers surgeon-level clarity with witness-level compassion.
        </p>
      </BookHero>

      <BookHero
        id="sovereign-of-mind"
        title="Sovereign of Mind"
        subtitle="Cognitive Sovereignty in a Manipulated World"
        cover="SoM-cover.jpg"
        alt="Sovereign of Mind cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Sovereign-Mind-Cognitive-Manipulation-Authorship-ebook/dp/B0F9VJK911" target="_blank" rel="noreferrer">
            Purchase Sovereign of Mind
          </a>
        }
      >
        <p className="v3-book-lead">
          Your thoughts may not always be your own. In a world built for persuasion, mimicry, and dependency, most minds operate on borrowed scaffolding—trauma, culture, ideology.{" "}
          <strong>Sovereign of Mind</strong> is the structural antidote.
        </p>
        <ul className="v3-feature-list">
          <li>Secure conscious authorship of thought and will.</li>
          <li>Expand perception and discernment.</li>
          <li>Build your paradigm deliberately upon frameworks that can withstand contradiction.</li>
          <li>Recognize and neutralize manipulation vectors.</li>
          <li>Master relational dynamics without surrendering sovereignty.</li>
          <li>Map internal architecture to restore coherence and integrity.</li>
        </ul>
        <p className="v3-book-note">Sovereign of Mind forges cognitive infrastructure—the sword and sheath for those who choose to think, live, and act by structures of their own design.</p>
      </BookHero>

      <BookHero
        id="distortion-codex"
        title="The Sovereignty-Distortion Codex"
        subtitle="A structural exposure of sovereignty obstruction patterns and archetypal manipulation machinery."
        cover="SDC-cover.jpg"
        alt="Sovereignty-Distortion Codex cover"
        action={
          <a className="v3-btn v3-btn--outline" href="https://www.amazon.com/Structural-Demonology-Taxonomy-Sovereignty-Distortion-Codex/dp/B0FHG1M794" target="_blank" rel="noreferrer">
            View on Amazon
          </a>
        }
      >
        <p className="v3-book-lead">
          Structural distortions erode will and hijack perception long before they arrive as argument or politics. <strong>The Sovereignty-Distortion Codex</strong> reads myth, history, and collapse as impersonal
          patterns—maps the machinery, names the seduction, and points toward reclamation.
        </p>
        <ul className="v3-feature-list">
          <li>Recognition heuristics for collapse sequences and mimicry patterns</li>
          <li>Seduction strategy analysis to reveal how ideals or beauty can be co-opted</li>
          <li>Diagnostic flows for early intervention in group or individual dynamics</li>
        </ul>
      </BookHero>

      <BookHero id="unspeakables-grimoire" title="The Unspeakables Grimoire" subtitle="Structured language for what resists ordinary narration." cover="U-cover.jpg" alt="The Unspeakables Grimoire cover">
        <p className="v3-book-lead">
          A grimoire in the classical sense: a working notebook of terms, postures, and operations for engaging territory that mainstream maps tend to blur, sanitize, or deny.
        </p>
        <ul className="v3-feature-list">
          <li>Define nuanced inner and interpersonal phenomena without sensational language.</li>
          <li>Use structural naming conventions to reduce confusion and projection.</li>
          <li>Track repeating symbolic, emotional, and relational patterns over time.</li>
          <li>Convert vague unease into clear inquiry prompts and practical boundaries.</li>
          <li>Bridge mythic intuition with disciplined epistemic hygiene.</li>
        </ul>
        <p className="v3-book-note">
          Built as a field manual, this text privileges precision over drama so difficult territory can be examined without collapse into superstition or denial.
        </p>
      </BookHero>

      <BookHero
        id="sovereign-integral-devotionalism"
        title="Sovereign Integral Devotionalism"
        subtitle="Devotional practice without surrendering epistemic adulthood."
        cover="SID-cover.jpg"
        alt="Sovereign Integral Devotionalism cover"
      >
        <p className="v3-book-lead">
          A framework for depth, awe, and loyalty-to-truth that refuses coercion, confusion, and counterfeit ultimatum.
        </p>
        <ul className="v3-feature-list">
          <li>Practice devotion without outsourcing conscience or critical thought.</li>
          <li>Integrate reason, reverence, embodiment, and moral accountability.</li>
          <li>Discern authentic surrender from dependency or performative piety.</li>
          <li>Identify coercive spiritual dynamics and rebuild healthy agency.</li>
          <li>Anchor devotion in verifiable conduct, not ideological theater.</li>
        </ul>
        <p className="v3-book-note">
          This is devotional architecture for mature discernment: spiritually serious, psychologically grounded, and structurally resistant to manipulation.
        </p>
      </BookHero>

      <BookHero id="peer-counseling-manual" title="The Peer-Counseling Manual" subtitle="Relational clarity under pressure." cover="PC-cover.jpg" alt="The Peer-Counseling Manual cover">
        <p className="v3-book-lead">
          Practical peer frameworks for reflection, mediation, and stabilization in high-stakes interpersonal dynamics.
        </p>
        <ul className="v3-feature-list">
          <li>Run clean listening and mirroring protocols without overreach.</li>
          <li>De-escalate conflict while preserving dignity and boundaries.</li>
          <li>Differentiate support, accountability, and referral thresholds.</li>
          <li>Use structured debriefs to reduce reenactment and role confusion.</li>
          <li>Strengthen peer containers for trust, clarity, and follow-through.</li>
        </ul>
        <p className="v3-book-note">
          Designed for real conversations under pressure, the manual emphasizes process integrity so peers can help effectively without drifting into amateur therapy.
        </p>
      </BookHero>
    </div>
  );
}
