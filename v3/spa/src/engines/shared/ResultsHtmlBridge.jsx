import { useEffect, useRef } from 'react';

/**
 * Renders engine-generated results HTML into a React-hosted div.
 */
export default function ResultsHtmlBridge({ engine, ready, phase }) {
  const ref = useRef(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!ready || !engine || !ref.current) return;
    if (phase !== 'results') {
      hydratedRef.current = false;
      return;
    }
    if (hydratedRef.current) return;

    engine.setExternalResultsMount?.(ref.current);
    const run = async () => {
      if (engine.hydrateResultsView) {
        await engine.hydrateResultsView(ref.current);
      } else if (engine.showResults) {
        await engine.showResults();
      } else if (engine.renderResults) {
        await engine.renderResults(ref.current);
      }
      hydratedRef.current = true;
    };
    run().catch(console.error);

    return () => {
      hydratedRef.current = false;
      engine.setExternalResultsMount?.(null);
    };
  }, [engine, ready, phase]);

  return <div ref={ref} className="bm-results-bridge" />;
}
