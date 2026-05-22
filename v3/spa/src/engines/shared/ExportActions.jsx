import { memo } from 'react';

function ExportActions({ engine, showSample = true }) {
  if (!engine) return null;
  return (
    <div className="bm-export-actions">
      {showSample && engine.generateSampleReport ? (
        <button type="button" className="v3-btn v3-btn--ghost" onClick={() => engine.generateSampleReport()}>
          Generate sample report
        </button>
      ) : null}
      {engine.exportReportHtml ? (
        <button type="button" className="v3-btn v3-btn--secondary" onClick={() => engine.exportReportHtml()}>
          Download report (HTML)
        </button>
      ) : null}
      {engine.exportExecutiveBrief ? (
        <button type="button" className="v3-btn v3-btn--ghost" onClick={() => engine.exportExecutiveBrief()}>
          Executive brief
        </button>
      ) : null}
      {engine.resetAssessment ? (
        <button type="button" className="v3-btn v3-btn--ghost" onClick={() => engine.resetAssessment()}>
          Start new assessment
        </button>
      ) : null}
    </div>
  );
}

export default memo(ExportActions);
