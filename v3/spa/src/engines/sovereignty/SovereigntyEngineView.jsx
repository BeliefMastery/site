import { useEffect, useRef } from 'react';
import EngineLayout from '../shared/EngineLayout';
import ExportActions from '../shared/ExportActions';
import { useEngineHost } from '../shared/useEngineHost';
import { engineNativeCopy } from '../engineNativeConfig';

export default function SovereigntyEngineView({ label }) {
  const { engine, ready, error } = useEngineHost('sovereignty');
  const shellRef = useRef(null);

  useEffect(() => {
    if (!ready || !engine || !shellRef.current) return;
    engine.mountExternalShell?.(shellRef.current);
  }, [ready, engine]);

  if (error) {
    return (
      <EngineLayout label={label} lead={engineNativeCopy.sovereignty.lead}>
        <p className="v3-muted">{error}</p>
      </EngineLayout>
    );
  }

  if (!ready || !engine) {
    return (
      <EngineLayout label={label} lead={engineNativeCopy.sovereignty.lead}>
        <p className="v3-muted">Loading assessment…</p>
      </EngineLayout>
    );
  }

  return (
    <EngineLayout label={label} lead={engineNativeCopy.sovereignty.lead}>
      <div ref={shellRef} className="bm-engine bm-sovereignty-host" />
      <ExportActions engine={engine} />
    </EngineLayout>
  );
}
