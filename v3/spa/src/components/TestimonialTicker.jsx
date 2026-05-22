import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getTickerTestimonials } from "@/data/testimonials";

function TickerItem({ t }) {
  const attribution = t.byShort ?? t.by;
  return (
    <span className="v3-testimonial-ticker__item">
      <span className="v3-testimonial-ticker__quote">&ldquo;{t.excerpt}&rdquo;</span>
      <span className="v3-testimonial-ticker__by">— {attribution}</span>
    </span>
  );
}

export default function TestimonialTicker() {
  const items = useMemo(() => getTickerTestimonials(), []);

  if (!items.length) return null;

  const durationSec = Math.max(72, items.length * 4.5);
  const track = [...items, ...items];

  return (
    <Link
      to="/testimonials"
      className="surface v3-section--breathable v3-testimonials v3-section-band--gradient v3-testimonial-ticker"
      aria-label="What people say — view all testimonials"
    >
      <h2 className="v3-section-title">What people say</h2>
      <p className="v3-muted v3-testimonials__hint">
        Tap or click to read everyone&apos;s words in full.
      </p>

      <div className="v3-testimonial-ticker__viewport" aria-hidden="true">
        <div
          className="v3-testimonial-ticker__track"
          style={{ "--v3-ticker-duration": `${durationSec}s` }}
        >
          {track.map((t, i) => (
            <TickerItem key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <p className="v3-testimonial-ticker__cta v3-muted">
        View all testimonials <span aria-hidden="true">→</span>
      </p>
    </Link>
  );
}
