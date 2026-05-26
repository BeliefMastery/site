import { memo, useCallback, useMemo, useState } from 'react';
import {
  createEmptyWeights,
  formatAllocationPercent,
  getAllocationTargetSum,
  maybeUpgradeAllocationWeights,
  parseAllocationPercentInput,
  redistributeOnChange,
  sumWeights
} from '@site/shared/allocation-scales.js';

function AllocationSliders({ snapshot, onNext, onPrev, onAbandon, canGoBack = true }) {
  const q = snapshot?.question;
  const targetSum = getAllocationTargetSum(q);
  const members = q?.allocationMembers ?? [];
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);
  const [weights, setWeights] = useState(() => {
    const base = createEmptyWeights(memberIds, null, targetSum);
    const merged = { ...base, ...(q?.allocationWeights || {}) };
    return maybeUpgradeAllocationWeights(merged, targetSum);
  });

  const onWeightChange = useCallback(
    (id, raw) => {
      setWeights((prev) => redistributeOnChange(id, raw, prev, targetSum, memberIds));
    },
    [targetSum, memberIds]
  );

  const total = sumWeights(weights);
  const progress = snapshot.totalQuestions
    ? Math.round(((snapshot.currentIndex + 1) / snapshot.totalQuestions) * 100)
    : 0;

  if (!q || !members.length) {
    return <p className="v3-muted">Loading allocation question…</p>;
  }

  return (
    <div className="bm-question-flow bm-allocation-flow">
      <div className="bm-progress" aria-hidden="true">
        <div className="bm-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="bm-progress__text">
        Question {snapshot.currentIndex + 1} of {snapshot.totalQuestions}
      </p>
      {q.plainHint ? <p className="bm-question-hint">{q.plainHint}</p> : null}
      <h3 className="bm-question-stem">{q.text}</h3>
      <p className={`bm-allocation-sum${total === targetSum ? ' bm-allocation-sum--ok' : ''}`}>
        Total: <strong>{formatAllocationPercent(total, targetSum)}%</strong> / 100%
      </p>
      <div className="bm-allocation-grid">
        {members.map((m) => (
          <div key={m.id} className="bm-allocation-row">
            <label className="bm-allocation-label" htmlFor={`alloc-${m.id}`}>
              {m.label}
            </label>
            {m.hint ? <p className="bm-allocation-hint">{m.hint}</p> : null}
            <div className="bm-scale">
              <input
                id={`alloc-${m.id}`}
                type="range"
                min={0}
                max={100}
                step={0.1}
                value={formatAllocationPercent(weights[m.id] ?? 0, targetSum)}
                onChange={(e) => onWeightChange(m.id, parseAllocationPercentInput(e.target.value))}
              />
              <span className="bm-scale__value">
                {formatAllocationPercent(weights[m.id] ?? 0, targetSum)}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="bm-question-nav">
        <button type="button" className="v3-btn v3-btn--ghost" disabled={!canGoBack} onClick={() => onPrev(weights)}>
          Previous
        </button>
        <button
          type="button"
          className="v3-btn v3-btn--primary"
          disabled={total !== targetSum}
          onClick={() => onNext({ weights, sum: targetSum })}
        >
          Next
        </button>
      </div>
      {onAbandon ? (
        <button type="button" className="v3-btn v3-btn--ghost bm-abandon" onClick={onAbandon}>
          Abandon / Restart
        </button>
      ) : null}
    </div>
  );
}

export default memo(AllocationSliders);
