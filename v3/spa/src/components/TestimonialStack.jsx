import { testimonials } from "@/data/testimonials";

export default function TestimonialStack() {
  return (
    <section className="surface v3-section--breathable v3-testimonials v3-section-band--gradient" aria-label="What people say">
      <h2 className="v3-section-title">What people say</h2>
      <p className="v3-muted v3-testimonials__hint">Swipe or scroll sideways to read more.</p>
      <ul className="v3-testimonial-list" role="list">
        {testimonials.map((t) => (
          <li key={t.id} className="v3-testimonial">
            <blockquote className="v3-testimonial__quote">
              {t.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </blockquote>
            <p className="v3-testimonial__by">
              {t.by}
              {t.role ? <span className="v3-testimonial__role"> · {t.role}</span> : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
