import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EngineLayout from './EngineLayout';
import ExtendedExplanation from './ExtendedExplanation';
import SelectionGrid from './SelectionGrid';
import QuestionFlow from './QuestionFlow';
import QuestionHtmlBridge from './QuestionHtmlBridge';
import ResultsHtmlBridge from './ResultsHtmlBridge';
import ExportActions from './ExportActions';
import { useEngineHost } from './useEngineHost';

function renderExplanation({ explanation, explanationTitle, explanationText, explanationParagraphs }) {
  if (explanation) return explanation;
  if (explanationParagraphs?.length) {
    return (
      <ExtendedExplanation title={explanationTitle || undefined}>
        {explanationParagraphs.map((text) => (
          <p key={text.slice(0, 48)}>{text}</p>
        ))}
      </ExtendedExplanation>
    );
  }
  if (explanationText) {
    return (
      <ExtendedExplanation>
        <p>{explanationText}</p>
      </ExtendedExplanation>
    );
  }
  return null;
}

function RefinementOfferPanel({ refinement, engine }) {
  return (
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
  );
}

/**
 * Generic React host for questionnaire engines with externalUI SPA support.
 */
export default function QuestionnaireEngineView({
  label,
  engineId,
  lead,
  explanation,
  explanationTitle,
  explanationText,
  explanationParagraphs,
  selectionTitle = 'Select sections',
  selectionHint,
  defaultSelections,
  selectionAdapter = 'sections',
  sliderStep,
  abandonMethod = 'resetAssessment',
  showRefinementOffer = false,
}) {
  const { engine, phase, ready, error, tick } = useEngineHost(engineId);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const defaultsAppliedRef = useRef(false);
  const isCategorySelection = selectionAdapter === 'categories';

  const refreshSelection = useCallback(async () => {
    if (isCategorySelection) {
      if (!engine?.getCategorySelectionModel) return;
      const list = await engine.getCategorySelectionModel();
      setItems(
        list.map((c) => ({
          id: c.key,
          name: c.name,
          meta: `${c.disorderCount} disorder${c.disorderCount !== 1 ? 's' : ''}`,
          suggested: c.suggested,
        }))
      );
      setSelected(engine.getSelectedCategoryKeys?.() || []);
      return;
    }

    if (!engine?.getSelectionModel) return;
    const list = await engine.getSelectionModel();
    setItems(
      list.map((item) => ({
        id: item.id ?? item.key,
        name: item.name ?? item.label,
        meta: item.meta ?? item.description,
        suggested: item.suggested,
      }))
    );
    const ids = engine.getSelectedIds?.() ?? engine.selectedSections ?? engine.selectedCategories ?? [];
    setSelected([...ids]);
  }, [engine, isCategorySelection]);

  useEffect(() => {
    if (ready && engine && phase === 'idle') refreshSelection();
  }, [ready, engine, phase, refreshSelection]);

  useEffect(() => {
    if (!ready || !engine || !defaultSelections?.length || phase !== 'idle') return;
    if (defaultsAppliedRef.current) return;
    defaultsAppliedRef.current = true;
    defaultSelections.forEach((id) => {
      engine.toggleSelectionFromExternal?.(id);
    });
    refreshSelection();
  }, [ready, engine, phase, defaultSelections, refreshSelection]);

  useEffect(() => {
    if (phase === 'idle') defaultsAppliedRef.current = false;
  }, [phase]);

  const snapshot = useMemo(() => engine?.getQuestionSnapshot?.(), [engine, tick]);
  const refinement = useMemo(
    () => (showRefinementOffer ? engine?.getRefinementOffer?.() : null),
    [engine, tick, showRefinementOffer]
  );
  const isAllocation = snapshot?.question?.type === 'allocation';
  const domQuestions = !isAllocation && engine?.usesDomQuestions?.() === true;
  const showSelection =
    items.length > 0 &&
    (isCategorySelection
      ? typeof engine?.getCategorySelectionModel === 'function'
      : typeof engine?.getSelectionModel === 'function');
  const questionKey = snapshot?.question?.id ?? `${snapshot?.currentIndex ?? 0}`;
  const explanationBlock = renderExplanation({
    explanation,
    explanationTitle,
    explanationText,
    explanationParagraphs,
  });

  const onToggleSelection = useCallback(
    (id) => {
      if (isCategorySelection) {
        engine?.toggleCategoryFromExternal?.(id);
        setSelected(engine.getSelectedCategoryKeys?.() || []);
        return;
      }
      engine?.toggleSelectionFromExternal?.(id);
      const ids =
        engine.getSelectedIds?.() ?? engine.selectedSections ?? engine.selectedCategories ?? [];
      setSelected([...ids]);
    },
    [engine, isCategorySelection]
  );

  const onNext = useCallback((v) => engine?.nextQuestionFromExternal?.(v), [engine]);
  const onPrev = useCallback((v) => engine?.prevQuestionFromExternal?.(v), [engine]);
  const onAbandon = useCallback(() => engine?.[abandonMethod]?.(), [engine, abandonMethod]);

  if (error) {
    return (
      <EngineLayout label={label} lead={lead}>
        <p className="v3-muted">{error}</p>
      </EngineLayout>
    );
  }

  if (!ready || !engine) {
    return (
      <EngineLayout label={label} lead={lead}>
        <p className="v3-muted">Loading assessment…</p>
      </EngineLayout>
    );
  }

  return (
    <EngineLayout label={label} lead={lead}>
      {phase === 'idle' && (
        <div className="bm-init-stage">
          {explanationBlock}
          {showSelection ? (
            <>
              <h2 className="bm-engine-heading">{selectionTitle}</h2>
              {selectionHint ? <p className="v3-muted">{selectionHint}</p> : null}
              <SelectionGrid items={items} selectedIds={selected} onToggle={onToggleSelection} />
            </>
          ) : null}
          <div className="bm-engine-actions bm-engine-actions--primary">
            <button
              type="button"
              className="v3-btn v3-btn--primary"
              disabled={showSelection && selected.length === 0}
              onClick={() => engine.startAssessment()}
            >
              Begin assessment
            </button>
          </div>
          <ExportActions engine={engine} variant="idle" />
        </div>
      )}

      {phase === 'assessment' && showRefinementOffer && refinement ? (
        <RefinementOfferPanel refinement={refinement} engine={engine} />
      ) : null}

      {phase === 'assessment' && !(showRefinementOffer && refinement) && domQuestions ? (
        <QuestionHtmlBridge engine={engine} phase={phase} questionKey={questionKey} />
      ) : null}

      {phase === 'assessment' && !(showRefinementOffer && refinement) && !domQuestions && snapshot ? (
        <QuestionFlow
          snapshot={snapshot}
          sliderStep={sliderStep}
          canGoBack={snapshot.currentIndex > 0}
          onNext={onNext}
          onPrev={onPrev}
          onAbandon={onAbandon}
        />
      ) : null}

      {phase === 'results' && (
        <>
          <ResultsHtmlBridge engine={engine} ready={ready} phase={phase} />
          <ExportActions engine={engine} variant="results" />
        </>
      )}
    </EngineLayout>
  );
}
