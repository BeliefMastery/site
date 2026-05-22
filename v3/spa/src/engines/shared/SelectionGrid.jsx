import { memo } from 'react';

function SelectionGrid({ items, selectedIds, onToggle, emptyLabel = 'No options' }) {
  if (!items?.length) {
    return <p className="v3-muted">{emptyLabel}</p>;
  }
  const selectedSet = new Set(selectedIds);
  return (
    <div className="bm-selection-grid" role="listbox" aria-multiselectable="true">
      {items.map((item) => {
        const id = item.id ?? item.key;
        const selected = selectedSet.has(id);
        return (
          <button
            key={id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`bm-selection-card${selected ? ' bm-selection-card--selected' : ''}${item.suggested ? ' bm-selection-card--suggested' : ''}`}
            onClick={() => onToggle(id)}
          >
            <h3 className="bm-selection-card__title">{item.name ?? item.label}</h3>
            {item.description ? <p className="bm-selection-card__desc">{item.description}</p> : null}
            {item.meta ? <p className="bm-selection-card__meta">{item.meta}</p> : null}
            {item.suggested ? <span className="bm-selection-card__badge">Suggested</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export default memo(SelectionGrid);
