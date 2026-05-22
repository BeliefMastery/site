import { useEffect, useState } from 'react';

export default function QuestionFlow({
  snapshot,
  onNext,
  onPrev,
  onAbandon,
  canGoBack = true,
  sliderStep = 0.5,
}) {
  const q = snapshot?.question;
  const [value, setValue] = useState(q?.initialValue ?? 5);

  useEffect(() => {
    setValue(snapshot?.question?.initialValue ?? 5);
  }, [snapshot?.question?.id, snapshot?.currentIndex]);

  if (!q) {
    return <p className="v3-muted">Loading question…</p>;
  }

  const progress = snapshot.totalQuestions
    ? Math.round(((snapshot.currentIndex + 1) / snapshot.totalQuestions) * 100)
    : 0;

  return (
    <div className="bm-question-flow">
      <div className="bm-progress" aria-hidden="true">
        <div className="bm-progress__fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="bm-progress__text">
        Question {snapshot.currentIndex + 1} of {snapshot.totalQuestions}
      </p>

      {q.plainHint ? (
        <p className="bm-question-hint" role="note">
          {q.plainHint}
        </p>
      ) : null}
      <h3 className="bm-question-stem">{q.text}</h3>
      {q.clinicalAnchor ? (
        <details className="bm-question-clinical">
          <summary>Clinical reference wording</summary>
          <p>{q.clinicalAnchor}</p>
        </details>
      ) : null}
      {q.badge ? <p className="bm-question-badge">{q.badge}</p> : null}

      <div className="bm-scale">
        <input
          type="range"
          min={0}
          max={10}
          step={sliderStep}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={value}
        />
        <span className="bm-scale__value">
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
      </div>

      <div className="bm-question-nav">
        <button type="button" className="v3-btn v3-btn--ghost" disabled={!canGoBack} onClick={() => onPrev(value)}>
          Previous
        </button>
        <button type="button" className="v3-btn v3-btn--primary" onClick={() => onNext(value)}>
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
