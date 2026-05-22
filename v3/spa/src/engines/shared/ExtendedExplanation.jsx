import { useState } from 'react';

export default function ExtendedExplanation({ title = 'Extended explanation', children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bm-extended-explanation">
      <button
        type="button"
        className="v3-btn v3-btn--ghost bm-extended-explanation__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {title}
      </button>
      {open ? <div className="bm-extended-explanation__panel">{children}</div> : null}
    </div>
  );
}
