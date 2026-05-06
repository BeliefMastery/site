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
            <p className="v3-lead">Helps people and systems find what is actually driving the problem—so change can stick.</p>
            <p className="v3-lead v3-about-capacity">
              In plain words: this is about <strong>freedom with support</strong>—seeing the rules you live by so your next steps feel chosen, not automatic. Same care whether we speak in everyday language or precise structure.
            </p>
          </div>
        </div>
      </section>

      <section className="surface">
        <p>
          Warwick works as a systems-minded practitioner: he looks for the hidden logic behind stalls and repeats—in tech, in teams, and in the beliefs and habits that shape a life.
        </p>
        <p>Whether the context is infrastructure or inner life, the aim is the same: find the root, fix what matters, and leave you more in charge.</p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">How he works</h2>
        <p>
          Most stuck places are not random. They follow rules—often old ones. Warwick uses the <strong>Belief Inference Process</strong>: a clear sequence to name those rules and loosen what no longer serves.
        </p>
        <p className="v3-mono-phrase">find the strain → map what it ties to → name the rule → make a small, stable shift</p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">Core idea</h2>
        <p>Beliefs behave more like operating habits than opinions. When you can see them, you can work with them—and your sense of choice opens up.</p>
        <p>
          The <strong>Belief Inference Process</strong> is the structured way he helps people document and revisit those inner patterns without getting lost in the fog.
        </p>
      </section>

      <section className="surface">
        <h2 className="v3-section-title">Where this shows up</h2>
        <p>
          <strong>Technology:</strong> High-stakes environments where downtime and clarity both matter.
        </p>
        <p>
          <strong>Books:</strong> <strong>Belief Mastery</strong> and <strong>Sovereign of Mind</strong>—readable maps for inner life and mental self-defense.
        </p>
        <p>
          <strong>Relationships:</strong> Separate work (e.g. redpillSMV) on dating and partnership signals—not the same as the core tools on this site.
        </p>
        <p>
          <strong>Sessions &amp; groups:</strong> Peer counseling, mediation, and private work for people who want honest conversation and steady pacing.
        </p>
        <p>The through-line is always the same: more clarity, more agency, less guesswork.</p>
      </section>

      <section className="surface">
        <p>If you are ready to look squarely at what is running your life, this work is built for you.</p>
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
