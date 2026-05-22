import { useCallback, useEffect, useRef, useState } from 'react';
import { engineLoaders } from './engineModules';
import { engineClassNames } from './engineClassNames';

/**
 * @param {string} engineId
 * @param {{ EngineClass?: string }} [options] - default export name = PascalCase + Engine
 */
export function useEngineHost(engineId, options = {}) {
  const [engine, setEngine] = useState(null);
  const [phase, setPhase] = useState('idle');
  const [tick, setTick] = useState(0);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const instanceRef = useRef(null);
  const mountedRef = useRef(true);

  const bump = useCallback(() => {
    if (mountedRef.current) setTick((t) => t + 1);
  }, []);

  const onNotify = useCallback(
    (event, payload) => {
      if (!mountedRef.current) return;
      if (event === 'phase' && payload?.phase) {
        setPhase(payload.phase);
      } else if (event === 'init') {
        const inst = instanceRef.current;
        if (inst?.getPhase) setPhase(inst.getPhase());
      } else if (event === 'results') {
        setPhase('results');
      } else if (event === 'selection' || event === 'question' || event === 'refinement-offer') {
        bump();
      }
      bump();
    },
    [bump]
  );

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    (async () => {
      try {
        const loader = engineLoaders[engineId];
        if (!loader) throw new Error(`Unknown engine: ${engineId}`);
        const mod = await loader();
        const className = options.EngineClass || engineClassNames[engineId];
        const EngineClass = (className && mod[className]) || mod.default;
        if (!EngineClass) throw new Error(`Engine class not found for ${engineId}`);

        if (instanceRef.current?.destroy) {
          try {
            instanceRef.current.destroy();
          } catch {
            /* ignore */
          }
        }

        const instance = new EngineClass({ externalUI: true, onNotify });
        instanceRef.current = instance;
        if (cancelled) return;

        await (instance.ready ?? Promise.resolve());
        if (cancelled) return;

        setEngine(instance);
        setPhase(instance.getPhase?.() || 'idle');
        setReady(true);
        setError(null);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || 'Failed to load assessment engine');
          setReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      instanceRef.current = null;
      setEngine(null);
    };
  }, [engineId, onNotify, options.EngineClass]);

  return {
    engine,
    phase,
    setPhase,
    ready,
    error,
    tick,
    bump,
    instanceRef,
  };
}
