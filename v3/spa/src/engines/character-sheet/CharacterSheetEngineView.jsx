import { useEffect, useRef } from 'react';
import EngineLayout from '../shared/EngineLayout';
import ExportActions from '../shared/ExportActions';
import { useEngineHost } from '../shared/useEngineHost';
import { engineNativeCopy } from '../engineNativeConfig';

export default function CharacterSheetEngineView({ label }) {
  const { engine, phase, ready, error } = useEngineHost('character-sheet');
  const shellRef = useRef(null);

  useEffect(() => {
    if (!ready || !engine || !shellRef.current) return;
    engine.mountExternalShell?.(shellRef.current);
  }, [ready, engine]);

  if (error) {
    return (
      <EngineLayout label={label} lead={engineNativeCopy['character-sheet'].lead}>
        <p className="v3-muted">{error}</p>
      </EngineLayout>
    );
  }

  if (!ready || !engine) {
    return (
      <EngineLayout label={label} lead={engineNativeCopy['character-sheet'].lead}>
        <p className="v3-muted">Loading character sheet generator…</p>
      </EngineLayout>
    );
  }

  return (
    <EngineLayout label={label} lead={engineNativeCopy['character-sheet'].lead}>
      <div ref={shellRef} className="bm-engine bm-character-sheet-host" />
      <ExportActions engine={engine} showSample={phase !== 'results'} />
    </EngineLayout>
  );
}
