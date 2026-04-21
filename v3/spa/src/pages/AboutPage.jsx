import { SITE_IMAGES } from "@/data/toolsCatalog";

export default function AboutPage() {
  return (
    <div className="stack v3-about">
      <section className="surface v3-about-hero">
        <div className="v3-about-hero__grid">
          <div className="v3-about-photo-frame">
            <img src={`${SITE_IMAGES}/warwick-marshall.jpg`} alt="Warwick Marshall" className="v3-about-photo" width={378} height={623} loading="lazy" />
          </div>
          <div>
            <p className="kicker">Author</p>
            <h1 className="v3-hero-title">Warwick Marshall</h1>
            <p className="v3-lead">Identifies the hidden logic that causes high-stakes systems—technical, behavioral, organizational—to stall or fail.</p>
          </div>
        </div>
      </section>

      <section className="surface">
        <p>
          Warwick Marshall is a systems architect specializing in structural diagnostics. He identifies the hidden logic that causes high-stakes systems—technical, behavioral, and organizational—to stall or fail,
          enabling targeted correction rather than surface-level fixes.
        </p>
        <p>Whether debugging a full-stack IT environment or a subconscious belief architecture, Marshall applies the same engineering discipline: dependency mapping, fault isolation, and root-cause correction.</p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">Method</h2>
        <p>
          Complex failure is rarely a surface-level event; it is a downstream effect of a governing rule. Marshall’s practice centers on the <strong>Belief Inference Process</strong>, a structured method for
          identifying and dismantling the operating rules that dictate what is visible, permissible, and possible within a system.
        </p>
        <p className="v3-mono-phrase">isolate the failure → map dependencies → locate the causal rule → implement the minimal stable fix</p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">Core Insight</h2>
        <p>Beliefs function as operating rules rather than opinions. These rules determine what becomes visible, permissible, and possible. Locating and articulating them restores autonomy.</p>
        <p>
          The <strong>Belief Inference Process</strong> provides a structured method for identifying, documenting, and dismantling subconscious belief architectures through direct logical tracing.
        </p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">Core Practice &amp; Applications</h2>
        <p>
          <strong>Infrastructure:</strong> Managing high-stakes technical environments (servers, networks, databases) for organizations where downtime is not an option.
        </p>
        <p>
          <strong>Cognition:</strong> Author of <strong>Belief Mastery</strong> and <strong>Sovereign of Mind</strong>—treating cognitive patterns as executable code that shapes perception and behavior.
        </p>
        <p>
          <strong>Relational diagnostics:</strong> Work on <strong>redpillSMV</strong> and related frameworks applies structural signal analysis to dating and partnership dynamics (separate from the core sovereignty
          tools on this site).
        </p>
        <p>
          <strong>Intervention:</strong> Facilitates peer-counseling, mediation, and private sessions for individuals and teams in complex, high-pressure environments.
        </p>
        <p>Across all domains—from infrastructure to human temperament—the goal remains constant: restore and enhance operator control through structural clarity.</p>
      </section>

      <section className="surface">
        <p>This work serves individuals, teams, and organizations where failure is costly and structural clarity is the fix.</p>
        <p className="v3-about-links">
          <a href="https://beliefmastery.github.io/site/" target="_blank" rel="noreferrer">
            beliefmastery.github.io
          </a>{" "}
          |
          <a href="https://instagram.com/belief.mastery" target="_blank" rel="noreferrer">
            Instagram @belief.mastery
          </a>{" "}
          |
          <a href="https://www.facebook.com/war.mars.9" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </p>
      </section>
    </div>
  );
}
