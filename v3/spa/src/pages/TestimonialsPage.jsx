import { useMemo } from "react";
import { Link } from "react-router-dom";
import TestimonialFullCard from "@/components/TestimonialFullCard";
import { testimonials } from "@/data/testimonials";

function groupByYear(items) {
  const years = [...new Set(items.map((t) => t.sourceYear))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    items: items.filter((t) => t.sourceYear === year),
  }));
}

export default function TestimonialsPage() {
  const groups = useMemo(() => groupByYear(testimonials), []);

  return (
    <div className="stack v3-testimonials-page">
      <header className="surface v3-section--breathable v3-section-band--gradient">
        <p className="kicker">
          <Link to="/">Home</Link>
        </p>
        <h1 className="v3-hero-title">What people say</h1>
        <p className="v3-muted">
          Client voices in their own words—grouped by year. Thank you to everyone who shared
          these reflections.
        </p>
      </header>

      {groups.map(({ year, items }) => (
        <section
          key={year}
          className="surface v3-section--breathable v3-testimonials-page__year"
          aria-labelledby={`testimonials-year-${year}`}
        >
          <h2 id={`testimonials-year-${year}`} className="v3-section-title">
            {year}
          </h2>
          <div className="v3-testimonials-page__list">
            {items.map((t) => (
              <TestimonialFullCard
                key={t.id}
                id={t.id}
                paragraphs={t.paragraphs}
                by={t.by}
                role={t.role}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
