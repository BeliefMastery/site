import { testimonials } from "@/data/testimonials";

export default function TestimonialStack() {
  return (
    <section className="surface v3-section--breathable v3-testimonials" aria-label="Reader notes">
      <h2 className="v3-section-title">What readers say</h2>
      <ul className="v3-testimonial-list">
        {testimonials.map((t) => (
          <li key={t.id} className="v3-testimonial">
            <blockquote className="v3-testimonial__quote">{t.quote}</blockquote>
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
