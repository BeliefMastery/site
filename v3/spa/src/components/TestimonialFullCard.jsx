/**
 * Full testimonial card for the testimonials page (always expanded).
 * @param {{ id: string, paragraphs: string[], by: string, role?: string }} props
 */
export default function TestimonialFullCard({ id, paragraphs, by, role }) {
  return (
    <article id={id} className="v3-testimonial v3-testimonial--full">
      <blockquote className="v3-testimonial__quote">
        {paragraphs.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </blockquote>
      <p className="v3-testimonial__by">
        {by}
        {role ? <span className="v3-testimonial__role"> · {role}</span> : null}
      </p>
    </article>
  );
}
