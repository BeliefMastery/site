import { memo } from 'react';

/**
 * @param {{ engine: object, variant?: 'idle' | 'results' }} props
 * - idle: optional sample report preview only (no reset/export)
 * - results: export + start new assessment
 */
function ExportActions({ engine, variant = 'idle' }) {
  if (!engine) return null;

  const handleReset = async () => {
    await engine.resetAssessment?.();
  };

  if (variant === 'idle') {
    if (!engine.generateSampleReport) return null;
    return (
      <div className="bm-init-secondary">
        <p className="bm-init-secondary__label">Preview the report format without answering questions</p>
        <button
          type="button"
          className="v3-btn v3-btn--ghost"
          onClick={() => engine.generateSampleReport()}
        >
          Generate sample report
        </button>
      </div>
    );
  }

  return (
    <div className="bm-export-actions bm-export-actions--results">
      {engine.resetAssessment ? (
        <button type="button" className="v3-btn v3-btn--secondary" onClick={handleReset}>
          Start new assessment
        </button>
      ) : null}
      {engine.exportReportHtml ? (
        <button type="button" className="v3-btn v3-btn--ghost" onClick={() => engine.exportReportHtml()}>
          Download report (HTML)
        </button>
      ) : null}
      {engine.exportExecutiveBrief ? (
        <button type="button" className="v3-btn v3-btn--ghost" onClick={() => engine.exportExecutiveBrief()}>
          Executive brief
        </button>
      ) : null}
    </div>
  );
}

export default memo(ExportActions);
