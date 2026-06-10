/**
 * Shared helpers for engines hosted in the V3 React SPA (externalUI mode).
 */

export function noopEngineUI() {
  return { transition() {} };
}

/**
 * @param {object} instance - Engine instance
 * @param {{ externalUI?: boolean, onNotify?: Function }} options
 */
export function applySpaExternalOptions(instance, options = {}) {
  instance.externalUI = Boolean(options.externalUI);
  instance._spaNotify = typeof options.onNotify === 'function' ? options.onNotify : null;
  instance._spaPhase = instance._spaPhase || 'idle';
  instance._externalQuestionSnapshot = instance._externalQuestionSnapshot ?? null;
}

export function spaEmit(instance, event, payload) {
  try {
    instance._spaNotify?.(event, payload);
  } catch (e) {
    console.warn('Engine SPA notify:', e);
  }
}

export function spaSetPhase(instance, phase) {
  instance._spaPhase = phase;
  spaEmit(instance, 'phase', { phase });
}
