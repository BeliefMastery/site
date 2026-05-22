import { useEffect, useRef } from 'react';

/**
 * Hosts legacy engine-rendered question HTML inside the SPA (binary, multiselect, etc.).
 */
export default function QuestionHtmlBridge({ engine, tick, phase }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!engine || phase !== 'assessment' || !ref.current) return;
    engine.setExternalQuestionMount?.(ref.current);
    try {
      engine.renderCurrentQuestion?.();
    } catch (e) {
      console.error(e);
    }
  }, [engine, phase, tick]);

  return <div ref={ref} className="bm-engine bm-question-dom-host" />;
}
