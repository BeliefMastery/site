import { useId, useMemo, useState } from "react";
import { testimonials } from "@/data/testimonials";

const EXCERPT_MAX_CHARS = 240;

/**
 * Single flowing excerpt for collapsed state (word-boundary truncate).
 * @param {string[]} paragraphs
 * @param {number} maxChars
 */
function excerptPreview(paragraphs, maxChars) {
  const flat = paragraphs
    .map((p) => p.replace(/\s+/g, " ").trim())
    .join(" ")
    .trim();
  if (flat.length <= maxChars) {
    return { excerpt: flat, needsToggle: false };
  }
  let cut = flat.slice(0, maxChars);
  const sp = cut.lastIndexOf(" ");
  if (sp > maxChars * 0.45) cut = cut.slice(0, sp);
  return { excerpt: `${cut}…`, needsToggle: true };
}

function TestimonialCard({ t }) {
  const panelId = useId();
  const { excerpt, needsToggle } = useMemo(
    () => excerptPreview(t.paragraphs, EXCERPT_MAX_CHARS),
    [t.paragraphs],
  );
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="v3-testimonial">
      <blockquote id={panelId} className="v3-testimonial__quote">
        {expanded || !needsToggle ? (
          t.paragraphs.map((para, i) => <p key={i}>{para}</p>)
        ) : (
          <p>{excerpt}</p>
        )}
      </blockquote>
      {needsToggle ? (
        <button
          type="button"
          className="v3-testimonial__toggle"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      ) : null}
      <p className="v3-testimonial__by">
        {t.by}
        {t.role ? <span className="v3-testimonial__role"> · {t.role}</span> : null}
      </p>
    </li>
  );
}

export default function TestimonialStack() {
  return (
    <section className="surface v3-section--breathable v3-testimonials v3-section-band--gradient" aria-label="What people say">
      <h2 className="v3-section-title">What people say</h2>
      <p className="v3-muted v3-testimonials__hint">
        Each card shows a short excerpt—use <strong>Read more</strong> to see the full text. Swipe or scroll sideways for more voices.
      </p>
      <ul className="v3-testimonial-list" role="list">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </ul>
    </section>
  );
}
