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

/**
 * Legacy HTML pages set data-bm-legacy-page on body; SPA routes do not.
 */
export function shouldBootLegacyEngine(markerId) {
  if (typeof document === 'undefined') return false;
  if (document.body?.dataset?.bmLegacyPage !== 'true') return false;
  return Boolean(markerId && document.getElementById(markerId));
}

export function bootLegacyEngine(markerId, bootFn) {
  const run = () => bootFn();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
}
