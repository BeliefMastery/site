import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EngineLayout from './EngineLayout';
import ExtendedExplanation from './ExtendedExplanation';
import SelectionGrid from './SelectionGrid';
import QuestionFlow from './QuestionFlow';
import QuestionHtmlBridge from './QuestionHtmlBridge';
import ResultsHtmlBridge from './ResultsHtmlBridge';
import ExportActions from './ExportActions';
import { useEngineHost } from './useEngineHost';

/**
 * Generic React host for questionnaire engines with externalUI SPA support.
 */
export default function QuestionnaireEngineView({
  label,
  engineId,
  lead,
  explanation,
  selectionTitle = 'Select sections',
  selectionHint,
  defaultSelections,
}) {
  const { engine, phase, ready, error, tick } = useEngineHost(engineId);
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState([]);
  const defaultsAppliedRef = useRef(false);

  const refreshSelection = useCallback(async () => {
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
  }, [engine]);

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
  const isAllocation = snapshot?.question?.type === 'allocation';
  const domQuestions = !isAllocation && engine?.usesDomQuestions?.() === true;
  const showSelection = items.length > 0 && typeof engine?.getSelectionModel === 'function';
  const questionKey = snapshot?.question?.id ?? `${snapshot?.currentIndex ?? 0}`;

  const onToggleSelection = useCallback(
    (id) => {
      engine?.toggleSelectionFromExternal?.(id);
      const ids =
        engine.getSelectedIds?.() ?? engine.selectedSections ?? engine.selectedCategories ?? [];
      setSelected([...ids]);
    },
    [engine]
  );

  const onNext = useCallback((v) => engine?.nextQuestionFromExternal?.(v), [engine]);
  const onPrev = useCallback((v) => engine?.prevQuestionFromExternal?.(v), [engine]);
  const onAbandon = useCallback(() => engine?.resetAssessment?.(), [engine]);

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
        <>
          {explanation ? <ExtendedExplanation>{explanation}</ExtendedExplanation> : null}
          {showSelection ? (
            <>
              <h2 className="bm-engine-heading">{selectionTitle}</h2>
              {selectionHint ? <p className="v3-muted">{selectionHint}</p> : null}
              <SelectionGrid items={items} selectedIds={selected} onToggle={onToggleSelection} />
            </>
          ) : null}
          <div className="bm-engine-actions">
            <button
              type="button"
              className="v3-btn v3-btn--primary"
              disabled={showSelection && selected.length === 0}
              onClick={() => engine.startAssessment()}
            >
              Begin assessment
            </button>
          </div>
          <ExportActions engine={engine} />
        </>
      )}

      {phase === 'assessment' && domQuestions ? (
        <QuestionHtmlBridge engine={engine} phase={phase} questionKey={questionKey} />
      ) : null}

      {phase === 'assessment' && !domQuestions && snapshot ? (
        <QuestionFlow
          snapshot={snapshot}
          canGoBack={snapshot.currentIndex > 0}
          onNext={onNext}
          onPrev={onPrev}
          onAbandon={onAbandon}
        />
      ) : null}

      {phase === 'results' && (
        <>
          <ResultsHtmlBridge engine={engine} ready={ready} phase={phase} />
          <ExportActions engine={engine} showSample={false} />
        </>
      )}
    </EngineLayout>
  );
}
