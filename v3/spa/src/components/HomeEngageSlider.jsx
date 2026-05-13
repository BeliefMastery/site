import { useCallback, useId, useState } from "react";
import { Link } from "react-router-dom";

function ctaClassName(variant) {
  const base = "v3-btn";
  switch (variant) {
    case "primary":
      return `${base} v3-btn--primary`;
    case "ghost":
      return `${base} v3-btn--ghost`;
    case "soft":
      return `${base} v3-btn--soft`;
    case "outline":
    default:
      return `${base} v3-btn--outline`;
  }
}

/**
 * @typedef {{ id: string, headline: string, body: string, cta: { label: string, to: string, variant?: string } }} EngageSlide
 * @param {{ slides: EngageSlide[] }} props
 */
export default function HomeEngageSlider({ slides }) {
  const baseId = useId();
  const liveId = `${baseId}-live`;
  const [activeIndex, setActiveIndex] = useState(0);
  const n = slides.length;
  const slide = slides[activeIndex];

  const go = useCallback(
    (delta) => {
      setActiveIndex((i) => (i + delta + n) % n);
    },
    [n],
  );

  if (!slide || n === 0) return null;

  return (
    <div className="v3-engage-slider">
      <div className="v3-engage-slider__nav" role="group" aria-label="Slide controls">
        <button type="button" className="v3-engage-slider__arrow" onClick={() => go(-1)} aria-controls={`${baseId}-panel`}>
          Previous
        </button>
        <button type="button" className="v3-engage-slider__arrow" onClick={() => go(1)} aria-controls={`${baseId}-panel`}>
          Next
        </button>
      </div>

      <div
        id={`${baseId}-panel`}
        className="v3-engage-slider__panel"
        aria-label={`${activeIndex + 1} of ${n}: ${slide.headline}`}
      >
        <h3 className="v3-engage-slider__headline">{slide.headline}</h3>
        <p className="v3-engage-slider__body">{slide.body}</p>
        <div className="v3-engage-slider__cta">
          <Link className={ctaClassName(slide.cta.variant)} to={slide.cta.to}>
            {slide.cta.label}
          </Link>
        </div>
      </div>

      <div className="v3-engage-slider__dots" role="group" aria-label="Choose a situation">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={i === activeIndex}
            aria-controls={`${baseId}-panel`}
            aria-label={`Show: ${s.headline}`}
            className={`v3-engage-slider__dot${i === activeIndex ? " v3-engage-slider__dot--active" : ""}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <p id={liveId} className="v3-visually-hidden" aria-live="polite" aria-atomic="true">
        {slide.headline}
      </p>
    </div>
  );
}
