import { Children } from "react";

/**
 * Horizontally auto-scrolling row of cover tiles (books, tools).
 * Duplicates children for a seamless loop; pauses on hover.
 */
export default function CoverScrollGrid({ children, "aria-label": ariaLabel }) {
  const items = Children.toArray(children).filter(Boolean);
  if (!items.length) return null;

  const durationSec = Math.max(360, items.length * 36);
  const track = [...items, ...items];

  return (
    <div className="v3-cover-scroll" aria-label={ariaLabel}>
      <div className="v3-cover-scroll__viewport">
        <div
          className="v3-cover-scroll__track"
          style={{ "--v3-cover-scroll-duration": `${durationSec}s` }}
        >
          {track.map((child, i) => (
            <div key={i} className="v3-cover-scroll__cell">
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
