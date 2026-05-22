import { useEffect, useRef } from 'react';

/**
 * Hosts legacy engine-rendered question HTML inside the SPA (binary, multiselect, etc.).
 */
export default function QuestionHtmlBridge({ engine, phase, questionKey }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!engine || phase !== 'assessment' || !ref.current) return;
    engine.setExternalQuestionMount?.(ref.current);
    try {
      engine.renderCurrentQuestion?.();
    } catch (e) {
      console.error(e);
    }
    return () => {
      engine.setExternalQuestionMount?.(null);
    };
  }, [engine, phase, questionKey]);

  return <div ref={ref} className="bm-engine bm-question-dom-host" />;
}
