import { useCallback, useEffect, useRef, useState } from 'react';
import { notifySuiteCompletionChanged } from '../../../../../shared/suite-completion-events.js';
import { engineLoaders } from './engineModules';
import { engineClassNames } from './engineClassNames';

function teardownEngineInstance(instance) {
  if (!instance) return;
  try {
    instance.setExternalQuestionMount?.(null);
    instance.setExternalResultsMount?.(null);
  } catch {
    /* ignore */
  }
  try {
    instance.destroy?.();
  } catch {
    /* ignore */
  }
}

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
  const initGenerationRef = useRef(0);

  const bump = useCallback(() => {
    if (mountedRef.current) setTick((t) => t + 1);
  }, []);

  const onNotify = useCallback(
    (event, payload) => {
      if (!mountedRef.current) return;
      if (event === 'phase' && payload?.phase) {
        setPhase(payload.phase);
      } else if (event === 'init' || event === 'reset') {
        const inst = instanceRef.current;
        setPhase(inst?.getPhase?.() || 'idle');
        if (event === 'reset') bump();
      } else if (event === 'results') {
        setPhase('results');
      } else if (event === 'selection' || event === 'question' || event === 'refinement-offer') {
        bump();
      }
    },
    [bump]
  );

  useEffect(() => {
    mountedRef.current = true;
    const generation = ++initGenerationRef.current;
    let cancelled = false;

    (async () => {
      try {
        const loader = engineLoaders[engineId];
        if (!loader) throw new Error(`Unknown engine: ${engineId}`);
        const mod = await loader();
        const className = options.EngineClass || engineClassNames[engineId];
        const EngineClass = (className && mod[className]) || mod.default;
        if (!EngineClass) throw new Error(`Engine class not found for ${engineId}`);

        teardownEngineInstance(instanceRef.current);

        const instance = new EngineClass({ externalUI: true, onNotify });
        instanceRef.current = instance;
        if (cancelled || generation !== initGenerationRef.current) {
          teardownEngineInstance(instance);
          return;
        }

        await (instance.ready ?? Promise.resolve());
        if (cancelled || generation !== initGenerationRef.current) {
          teardownEngineInstance(instance);
          return;
        }

        setEngine(instance);
        setPhase(instance.getPhase?.() || 'idle');
        setReady(true);
        setError(null);
      } catch (e) {
        if (!cancelled && generation === initGenerationRef.current) {
          setError(e?.message || 'Failed to load assessment engine');
          setReady(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      mountedRef.current = false;
      teardownEngineInstance(instanceRef.current);
      instanceRef.current = null;
      setEngine(null);
      setReady(false);
      notifySuiteCompletionChanged();
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
