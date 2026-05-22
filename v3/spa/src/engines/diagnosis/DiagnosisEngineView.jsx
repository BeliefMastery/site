import { useCallback, useEffect, useRef, useState } from 'react';
import EngineLayout from '../shared/EngineLayout';
import ExtendedExplanation from '../shared/ExtendedExplanation';
import SelectionGrid from '../shared/SelectionGrid';
import QuestionFlow from '../shared/QuestionFlow';
import ResultsHtmlBridge from '../shared/ResultsHtmlBridge';
import ExportActions from '../shared/ExportActions';
import { useEngineHost } from '../shared/useEngineHost';

const LEAD =
  'Educational DSM-5 symptom mapping for pattern clarity—not a substitute for clinical assessment.';

export default function DiagnosisEngineView({ label }) {
  const { engine, phase, ready, error, tick, bump } = useEngineHost('diagnosis');
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const resultsReady = useRef(false);

  const loadCategories = useCallback(async () => {
    if (!engine?.getCategorySelectionModel) return;
    const list = await engine.getCategorySelectionModel();
    setCategories(
      list.map((c) => ({
        id: c.key,
        name: c.name,
        meta: `${c.disorderCount} disorder${c.disorderCount !== 1 ? 's' : ''}`,
        suggested: c.suggested,
      }))
    );
    setSelected(engine.getSelectedCategoryKeys?.() || []);
  }, [engine]);

  useEffect(() => {
    if (ready && engine && phase === 'idle') loadCategories();
  }, [ready, engine, phase, tick, loadCategories]);

  useEffect(() => {
    if (phase === 'results') resultsReady.current = true;
  }, [phase]);

  const snapshot = engine?.getQuestionSnapshot?.();
  const refinement = engine?.getRefinementOffer?.();

  const onToggle = (id) => {
    engine?.toggleCategoryFromExternal?.(id);
    setSelected(engine.getSelectedCategoryKeys?.() || []);
  };

  if (error) {
    return (
      <EngineLayout label={label} lead={LEAD}>
        <p className="v3-muted">{error}</p>
      </EngineLayout>
    );
  }

  if (!ready || !engine) {
    return (
      <EngineLayout label={label} lead={LEAD}>
        <p className="v3-muted">Loading assessment…</p>
      </EngineLayout>
    );
  }

  return (
    <EngineLayout label={label} lead={LEAD}>
      {phase === 'idle' && (
        <>
          <ExtendedExplanation title="Extended explanation">
            <p>
              Choose the diagnostic categories you wish to explore. You can select multiple
              categories for a broader picture.
            </p>
            <p>
              <strong>Educational mode:</strong> for pattern recognition and preparation for
              professional dialogue—not diagnosis.
            </p>
          </ExtendedExplanation>
          <h2 className="bm-engine-heading">Select diagnostic categories</h2>
          <SelectionGrid items={categories} selectedIds={selected} onToggle={onToggle} />
          <div className="bm-engine-actions">
            <button
              type="button"
              className="v3-btn v3-btn--primary"
              disabled={selected.length === 0}
              onClick={() => engine.startAssessment()}
            >
              Begin assessment
            </button>
          </div>
          <ExportActions engine={engine} />
        </>
      )}

      {phase === 'assessment' && !refinement && snapshot && (
        <QuestionFlow
          snapshot={snapshot}
          sliderStep={0.5}
          canGoBack={snapshot.currentIndex > 0}
          onNext={(v) => engine.nextQuestionFromExternal(v)}
          onPrev={(v) => engine.prevQuestionFromExternal(v)}
          onAbandon={() => engine.abandonAssessment?.()}
        />
      )}

      {phase === 'assessment' && refinement && (
        <div className="bm-refinement-offer surface">
          <h3>Multi-branching assessment detected</h3>
          <p>Additional refined questions can improve clarity between overlapping patterns.</p>
          <ul>
            {(refinement || []).map((g) => (
              <li key={g.name || g.id}>
                <strong>{g.name}:</strong> {(g.disorders || []).join(', ')}
              </li>
            ))}
          </ul>
          <div className="bm-engine-actions">
            <button
              type="button"
              className="v3-btn v3-btn--primary"
              onClick={() => engine.proceedWithRefinementFromExternal?.()}
            >
              Continue with refined questions
            </button>
            <button
              type="button"
              className="v3-btn v3-btn--ghost"
              onClick={() => engine.skipRefinementToResultsFromExternal?.()}
            >
              Skip to results
            </button>
          </div>
        </div>
      )}

      {phase === 'results' && (
        <>
          <ResultsHtmlBridge engine={engine} ready={ready} />
          <ExportActions engine={engine} showSample={false} />
        </>
      )}
    </EngineLayout>
  );
}
