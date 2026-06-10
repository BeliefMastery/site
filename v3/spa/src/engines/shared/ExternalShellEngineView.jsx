import '@/styles/engine-assessment.css';
import { useEffect, useRef } from 'react';
import EngineLayout from './EngineLayout';
import ExportActions from './ExportActions';
import { useEngineHost } from './useEngineHost';

export default function ExternalShellEngineView({
  engineId,
  label,
  lead,
  hostClassName,
  loadingMessage = 'Loading assessment…',
}) {
  const { engine, phase, ready, error } = useEngineHost(engineId);
  const shellRef = useRef(null);

  useEffect(() => {
    if (!ready || !engine || !shellRef.current) return;
    engine.mountExternalShell?.(shellRef.current);
  }, [ready, engine]);

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
        <p className="v3-muted">{loadingMessage}</p>
      </EngineLayout>
    );
  }

  return (
    <EngineLayout label={label} lead={lead}>
      <div ref={shellRef} className={`bm-engine ${hostClassName}`} />
      <ExportActions engine={engine} variant={phase === 'results' ? 'results' : 'idle'} />
    </EngineLayout>
  );
}
