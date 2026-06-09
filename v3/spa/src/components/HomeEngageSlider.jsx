import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

const FADE_MS = 320;

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

function ArrowIcon({ direction }) {
  return (
    <span
      className={`v3-engage-slider__arrow-icon v3-engage-slider__arrow-icon--${direction}`}
      aria-hidden="true"
    />
  );
}

/**
 * @typedef {{ id: string, headline: string, body: string, cta: { label: string, to: string, variant?: string } }} EngageSlide
 * @param {{ slides: EngageSlide[] }} props
 */
export default function HomeEngageSlider({ slides }) {
  const baseId = useId();
  const liveId = `${baseId}-live`;
  const timerRef = useRef(null);
  const indexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const n = slides.length;
  const slide = slides[activeIndex];

  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const transitionTo = useCallback((nextIndex) => {
    if (nextIndex === indexRef.current) return;

    setVisible(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIndex(nextIndex);
      setVisible(true);
    }, FADE_MS);
  }, []);

  const go = useCallback(
    (delta) => {
      transitionTo((indexRef.current + delta + n) % n);
    },
    [n, transitionTo],
  );

  if (!slide || n === 0) return null;

  return (
    <div className="v3-engage-slider">
      <div className="v3-engage-slider__stage">
        <button
          type="button"
          className="v3-engage-slider__arrow v3-engage-slider__arrow--prev"
          onClick={() => go(-1)}
          aria-controls={`${baseId}-panel`}
          aria-label="Previous option"
        >
          <ArrowIcon direction="prev" />
        </button>

        <div
          id={`${baseId}-panel`}
          className={`v3-engage-slider__panel${visible ? "" : " v3-engage-slider__panel--hidden"}`}
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

        <button
          type="button"
          className="v3-engage-slider__arrow v3-engage-slider__arrow--next"
          onClick={() => go(1)}
          aria-controls={`${baseId}-panel`}
          aria-label="Next option"
        >
          <ArrowIcon direction="next" />
        </button>
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
            onClick={() => transitionTo(i)}
          />
        ))}
      </div>

      <p id={liveId} className="v3-visually-hidden" aria-live="polite" aria-atomic="true">
        {slide.headline}
      </p>
    </div>
  );
}
