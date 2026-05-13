import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SITE_IMAGES } from "@/data/toolsCatalog";
import {
  booksIntro,
  beliefMastery,
  sovereignOfMind,
  distortionCodex,
  unspeakablesGrimoire,
  sovereignIntegralDevotionalism,
  peerCounselingManual,
  purchaseSection,
  CONTACT_SCRIPT_URL,
} from "@/data/booksPageSource";

function purchaseLink(hash) {
  return `/books#${hash}`;
}

function BooksMoreInfoCards({ cards }) {
  return (
    <div className="v3-books-card-grid">
      {cards.map((c) => (
        <div key={c.heading} className="v3-books-card">
          <strong>{c.heading}</strong>
          <p className="v3-books-card-note">{c.cardNote}</p>
          <div className="v3-books-card-extended">{c.extended}</div>
        </div>
      ))}
    </div>
  );
}

/** Mirrors v3/books.html: hero, feature list, optional book-note, More Info details */
function StandardBookSection({ data, moreInfoLead }) {
  return (
    <section
      id={data.sectionId}
      className="surface v3-book-section v3-books-page-section"
      aria-labelledby={data.titleId}
    >
      <h2 id={data.titleId} className="v3-book-title">
        {data.title}
      </h2>
      <p className="v3-book-subtitle">{data.subtitle}</p>
      <div className="v3-book-hero">
        <img
          src={`${SITE_IMAGES}/${data.cover}`}
          alt={data.coverAlt}
          className="v3-book-cover"
          width={378}
          height={605}
          loading="lazy"
        />
        <div className="v3-book-hero__col">
          <p className="v3-book-lead">{data.lead}</p>
          <Link className="v3-btn v3-btn--outline" to={purchaseLink(data.purchaseCta.hash)}>
            {data.purchaseCta.label}
          </Link>
          <ul className="v3-feature-list v3-feature-list--in-hero">
            {data.features.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
      {"note" in data && data.note != null ? (
        <p className="v3-book-note">{data.note}</p>
      ) : null}
      <div className="v3-books-spacer">
        <details className="v3-details" id={data.moreInfoId}>
          <summary>More Info</summary>
          <div className="v3-details__body">
            {moreInfoLead ? <p className="v3-book-tools-lead">{moreInfoLead}</p> : null}
            <BooksMoreInfoCards cards={data.cards} />
          </div>
        </details>
      </div>
    </section>
  );
}

function BooksContactForm() {
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const raw = new FormData(e.currentTarget).get("email")?.toString().trim() ?? "";
    if (!raw) {
      setStatus("Enter an email address");
      return;
    }
    const email = encodeURIComponent(raw);
    const url = `${CONTACT_SCRIPT_URL}?email=${email}`;
    fetch(url, { method: "GET", mode: "no-cors" })
      .then(() => {
        setStatus("✅ Thank you — message received");
        e.currentTarget.reset();
      })
      .catch(() => setStatus("❌ Submission failed"));
  };

  return (
    <>
      <form className="v3-subscribe-form" id="subscribe-form" onSubmit={onSubmit}>
        <input type="email" id="email" name="email" required placeholder="Email address" aria-label="Email address" />
        <button type="submit" className="v3-btn v3-btn--primary">
          ✉️ Contact the Author
        </button>
      </form>
      <p id="status" className="v3-subscribe-status" role="status">
        {status}
      </p>
    </>
  );
}

function getInPageAnchorFromHash() {
  const h = window.location.hash || "";
  const i = h.indexOf("#", 1);
  return i >= 0 ? h.slice(i + 1) : "";
}

export default function BooksPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/books") return;
    const scrollToAnchor = () => {
      const anchor = getInPageAnchorFromHash();
      if (!anchor) return;
      window.requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    scrollToAnchor();
    window.addEventListener("hashchange", scrollToAnchor);
    return () => window.removeEventListener("hashchange", scrollToAnchor);
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="stack v3-books-page">
      <section
        id={booksIntro.sectionId}
        className="surface v3-book-section v3-books-intro v3-books-page-section"
        aria-labelledby={booksIntro.titleId}
      >
        <h1 id={booksIntro.titleId} className="v3-hero-title">
          {booksIntro.title}
        </h1>
      </section>

      <StandardBookSection data={beliefMastery} />

      <StandardBookSection data={sovereignOfMind} moreInfoLead={sovereignOfMind.toolsLead} />

      <StandardBookSection data={distortionCodex} />

      <StandardBookSection data={unspeakablesGrimoire} />

      <StandardBookSection data={sovereignIntegralDevotionalism} />

      <StandardBookSection data={peerCounselingManual} />

      <section
        id={purchaseSection.sectionId}
        className="surface v3-book-section v3-books-page-section"
        aria-labelledby={purchaseSection.titleId}
      >
        <h2 id={purchaseSection.titleId} className="v3-book-title">
          {purchaseSection.title}
        </h2>
        <p className="v3-book-subtitle">{purchaseSection.subtitle}</p>
        <div className="v3-books-purchase-inner">
          <div>
            <p className="v3-book-note v3-book-note--spaced">{purchaseSection.tagline}</p>
            <div className="v3-purchase-cta">
              {purchaseSection.amazon.map((a) => (
                <a key={a.href} className="v3-btn v3-btn--primary" href={a.href} target="_blank" rel="noopener noreferrer">
                  {a.label}
                </a>
              ))}
            </div>
            <div className="v3-section-divider-top">
              <h3 className="v3-purchase-subtitle">{purchaseSection.comingSoonTitle}</h3>
              <p className="v3-book-tools-lead">{purchaseSection.comingSoonLead}</p>
              <ul className="v3-purchase-list">
                {purchaseSection.comingSoonList.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <p className="v3-purchase-footer">{purchaseSection.footer}</p>
            <BooksContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
