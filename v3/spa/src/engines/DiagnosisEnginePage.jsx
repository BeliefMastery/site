import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DiagnosisEngine } from "@site/diagnosis-engine.js";
import { SecurityUtils } from "@site/shared/utils.js";
import "@site/style.css";

const RESULTS_EXPORT_ROOT = "#diagnosis-v3-results-section";

function questionMetaLine(question) {
  if (!question) return null;
  if (question.type === "comorbidity_refinement") {
    return (
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600 }}>
        <em>Refinement Question ({SecurityUtils.sanitizeHTML(question.groupName || "")})</em>
      </p>
    );
  }
  if (question.type === "refinement") {
    return (
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)" }}>
        <em>Additional detail for {SecurityUtils.sanitizeHTML(question.disorder || "")}</em>
      </p>
    );
  }
  if (question.type === "differential") {
    return (
      <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--accent)" }}>
        <em>Differential diagnosis question</em>
      </p>
    );
  }
  return null;
}

function clinicalBlock(question) {
  if (!question) return null;
  const rawStem = question.questionText || "";
  const clinicalRaw = question.clinicalAnchorText || "";
  const normStem = String(rawStem).replace(/\s+/g, " ").trim().toLowerCase();
  const normClinical = String(clinicalRaw).replace(/\s+/g, " ").trim().toLowerCase();
  const showClinicalRef =
    (question.type === "symptom" || question.type === "criterion") &&
    clinicalRaw &&
    normClinical &&
    normClinical !== normStem;
  if (!showClinicalRef) return null;
  const clinicalAnchor = SecurityUtils.sanitizeHTML(clinicalRaw);
  return (
    <details className="question-clinical-ref">
      <summary>Clinical reference wording</summary>
      <p dangerouslySetInnerHTML={{ __html: clinicalAnchor }} />
    </details>
  );
}

export default function DiagnosisEnginePage() {
  const engineRef = useRef(null);
  const resultsInnerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState("selection");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questionSnap, setQuestionSnap] = useState(null);
  const [sliderValue, setSliderValue] = useState(5);
  const [refinementGroups, setRefinementGroups] = useState(null);
  const [needsResultsHydrate, setNeedsResultsHydrate] = useState(false);

  const syncStageFromEngine = useCallback((engine) => {
    if (!engine) return;
    setSelectedCategories([...engine.selectedCategories]);
    if (engine.currentStage === "results") {
      setStage("results");
      setRefinementGroups(null);
      setQuestionSnap(null);
    } else if (engine.currentStage === "questionnaire") {
      setStage("questionnaire");
      if (engine._externalQuestionSnapshot) {
        setQuestionSnap({ ...engine._externalQuestionSnapshot });
        const q = engine._externalQuestionSnapshot.question;
        const v = q ? engine.answers[q.id] ?? 5 : 5;
        setSliderValue(v);
      }
    } else {
      setStage("selection");
      setQuestionSnap(null);
      setRefinementGroups(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const engine = new DiagnosisEngine({
      externalUI: true,
      onNotify: (event, payload) => {
        if (cancelled) return;
        const eng = engineRef.current;
        if (event === "question") {
          setStage("questionnaire");
          setRefinementGroups(null);
          if (eng?._externalQuestionSnapshot) {
            setQuestionSnap({ ...eng._externalQuestionSnapshot });
            const q = eng._externalQuestionSnapshot.question;
            const v = q ? eng.answers[q.id] ?? 5 : 5;
            setSliderValue(v);
          }
        } else if (event === "refinement-offer") {
          setStage("refinement");
          setQuestionSnap(null);
          setRefinementGroups(payload?.groups ?? null);
        } else if (event === "results") {
          setStage("results");
          setRefinementGroups(null);
          setQuestionSnap(null);
        } else if (event === "reset") {
          setStage("selection");
          setQuestionSnap(null);
          setRefinementGroups(null);
          setSelectedCategories([]);
        } else if (event === "selection") {
          setSelectedCategories([...(payload?.selectedCategories ?? [])]);
        }
      },
    });

    engineRef.current = engine;

    (async () => {
      try {
        await engine.ready;
        if (cancelled) return;
        const cats = await engine.getCategorySelectionModel();
        if (cancelled) return;
        setCategories(cats);
        syncStageFromEngine(engine);
        if (engine.currentStage === "results") {
          setNeedsResultsHydrate(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      engineRef.current = null;
    };
  }, [syncStageFromEngine]);

  useLayoutEffect(() => {
    const eng = engineRef.current;
    const el = resultsInnerRef.current;
    if (eng && el) eng.setExternalResultsMount(el);
  });

  useLayoutEffect(() => {
    if (!needsResultsHydrate) return;
    const eng = engineRef.current;
    const el = resultsInnerRef.current;
    if (!eng || !el) return;
    eng
      .hydrateResultsView(el)
      .then(() => setNeedsResultsHydrate(false))
      .catch(() => setNeedsResultsHydrate(false));
  }, [needsResultsHydrate]);

  const onToggleCategory = (key) => {
    engineRef.current?.toggleCategory(key, null);
  };

  const onStart = () => {
    void engineRef.current?.startAssessment();
  };

  const onSliderInput = (value, questionId) => {
    const eng = engineRef.current;
    if (!eng || !questionId) return;
    const num = parseFloat(value);
    setSliderValue(num);
    eng.answers[questionId] = num;
    const isInRefinement = eng.refinementRequested && eng.refinedQuestionSequence?.length > 0;
    const totalMain = eng.questionSequence.length;
    const answerKey = isInRefinement && eng.currentQuestionIndex >= totalMain ? "refinedAnswers" : "answers";
    if (!eng.analysisData[answerKey]) eng.analysisData[answerKey] = {};
    eng.analysisData[answerKey][questionId] = num;
    eng.saveProgress();
  };

  const onNext = () => {
    engineRef.current?.nextQuestionFromExternal(sliderValue);
  };

  const onPrev = () => {
    engineRef.current?.prevQuestionFromExternal(sliderValue);
  };

  const onAbandon = () => {
    void engineRef.current?.abandonAssessment();
  };

  const onNewAssessment = () => {
    engineRef.current?.resetAssessment();
  };

  const onExportHtml = () => {
    engineRef.current?.exportReportHtml(RESULTS_EXPORT_ROOT);
  };

  const onExportBrief = () => {
    engineRef.current?.exportExecutiveBrief();
  };

  const onProceedRefinement = () => {
    void engineRef.current?.proceedWithRefinementFromExternal();
  };

  const onSkipRefinement = () => {
    void engineRef.current?.skipRefinementToResultsFromExternal();
  };

  const q = questionSnap?.question;
  const totalQ = questionSnap?.totalQuestions ?? 1;
  const idx = questionSnap?.currentIndex ?? 0;
  const progressPct = totalQ > 0 ? ((idx + 1) / totalQ) * 100 : 0;
  const step = q?.sliderStep ?? 0.5;

  if (loading) {
    return (
      <section className="stack">
        <article className="surface">
          <p>Loading Pathology Assessment…</p>
        </article>
      </section>
    );
  }

  return (
    <div className="diagnosis-v3-root assessment-container">
      <section className="stack" style={{ display: stage === "selection" ? "block" : "none" }}>
        <article className="surface">
          <h1>Pathology Assessment</h1>
          <p className="tool-lead">
            DSM-5-referenced symptom pattern scan for self-inquiry. Results are not a diagnosis.
          </p>
          <h2 style={{ marginBottom: "0.5rem" }}>Select diagnostic category</h2>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Choose one or more categories. Selection uses the same saved progress as the standalone tool.
          </p>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                className={`category-card${selectedCategories.includes(cat.key) ? " selected" : ""}${cat.suggested ? " suggested" : ""}`}
                data-category={cat.key}
                onClick={() => onToggleCategory(cat.key)}
              >
                <h3>{SecurityUtils.sanitizeHTML(cat.name)}</h3>
                <p>
                  {cat.disorderCount} disorder{cat.disorderCount !== 1 ? "s" : ""} available
                </p>
                {cat.suggested ? <p className="suggested-badge">✓ Suggested for you</p> : null}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button type="button" className="btn btn-primary" disabled={selectedCategories.length === 0} onClick={onStart}>
              Begin assessment
            </button>
          </div>
        </article>
      </section>

      <section className="questionnaire-section active" style={{ display: stage === "questionnaire" ? "block" : "none" }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {q ? (
          <div className="question-block">
            {q.plainLanguageHint ? (
              <p className="question-plain-hint" role="note" dangerouslySetInnerHTML={{ __html: SecurityUtils.sanitizeHTML(q.plainLanguageHint) }} />
            ) : null}
            <h3 dangerouslySetInnerHTML={{ __html: SecurityUtils.sanitizeHTML(q.questionText || "") }} />
            {clinicalBlock(q)}
            <div className="scale-container">
              <div className="scale-input">
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={step}
                  value={sliderValue}
                  aria-valuemin={0}
                  aria-valuemax={10}
                  data-question-id={q.id}
                  onChange={(e) => onSliderInput(e.target.value, q.id)}
                />
              </div>
              <div className="scale-value">
                {Number.isInteger(sliderValue) ? sliderValue : sliderValue.toFixed(1)}
              </div>
            </div>
            {questionMetaLine(q)}
          </div>
        ) : null}
        <div className="navigation-buttons">
          <button type="button" className="btn btn-secondary" disabled={idx === 0} onClick={onPrev}>
            Previous
          </button>
          <button type="button" className="btn btn-primary" onClick={onNext}>
            Next
          </button>
        </div>
        <div className="abandon-link">
          <button type="button" className="btn btn-secondary" onClick={onAbandon}>
            Abandon / Restart
          </button>
        </div>
      </section>

      <section className="stack" style={{ display: stage === "refinement" ? "block" : "none" }}>
        <article className="surface comorbidity-notice" style={{ border: "2px solid var(--accent)", borderRadius: "var(--radius)", padding: "2rem" }}>
          <h2 style={{ color: "var(--brand)" }}>Multi-branching assessment detected</h2>
          <p style={{ lineHeight: 1.6 }}>
            The assessment detected potential <strong>comorbidity</strong> (conditions that commonly co-occur):
          </p>
          <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
            {(refinementGroups ?? []).map((group) => (
              <li key={group.name || group.message} style={{ marginBottom: "0.5rem" }}>
                <strong>{SecurityUtils.sanitizeHTML(group.name || "")}:</strong>{" "}
                {(group.disorders || []).map((d) => SecurityUtils.sanitizeHTML(d || "")).join(", ")}
                <br />
                <em style={{ fontSize: "0.9rem", color: "var(--muted)" }}>{SecurityUtils.sanitizeHTML(group.message || "")}</em>
              </li>
            ))}
          </ul>
          <p style={{ lineHeight: 1.6 }}>
            Additional refined questions are available to help differentiate between these conditions.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-primary" onClick={onProceedRefinement}>
              Continue with refined questions
            </button>
            <button type="button" className="btn btn-secondary" onClick={onSkipRefinement}>
              Skip to results
            </button>
          </div>
          <div className="abandon-link" style={{ marginTop: "1rem" }}>
            <button type="button" className="btn btn-secondary" onClick={onAbandon}>
              Abandon / Restart
            </button>
          </div>
        </article>
      </section>

      <section className="results-section" id="diagnosis-v3-results-section" style={{ display: stage === "results" ? "block" : "none" }}>
        <h2>Assessment results</h2>
        <div id="diagnosis-v3-results-root" ref={resultsInnerRef} />
        <div className="results-actions export-section">
          <p className="tool-lead tool-lead--flush">
            Download a single MHTML snapshot of the full on-screen report (works offline in Chromium-based browsers).
          </p>
          <div className="action-buttons">
            <button type="button" className="btn btn-primary" onClick={onExportHtml}>
              Download report (MHTML)
            </button>
            <button type="button" className="btn btn-secondary" onClick={onNewAssessment}>
              Start new assessment
            </button>
          </div>
          <details className="export-advanced export-advanced--top">
            <summary>Optional: executive brief (plain text)</summary>
            <div className="action-buttons action-buttons--push">
              <button type="button" className="btn btn-secondary" onClick={onExportBrief}>
                Executive brief (TXT)
              </button>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
