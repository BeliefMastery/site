import { useEffect, useRef } from 'react';

/**
 * Renders engine-generated results HTML into a React-hosted div.
 */
export default function ResultsHtmlBridge({ engine, ready }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ready || !engine || !ref.current) return;
    engine.setExternalResultsMount?.(ref.current);
    const run = async () => {
      if (engine.hydrateResultsView) {
        await engine.hydrateResultsView(ref.current);
      } else if (engine.showResults) {
        await engine.showResults();
      } else if (engine.renderResults) {
        await engine.renderResults(ref.current);
      }
    };
    run().catch(console.error);
  }, [engine, ready]);

  return <div ref={ref} className="bm-results-bridge" />;
}
