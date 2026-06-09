/** Lightweight pub/sub for suite progress UI (replaces polling). */

const listeners = new Set();

export function notifySuiteCompletionChanged() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.warn('Suite completion listener:', e);
    }
  });
}

/** @param {() => void} listener @returns {() => void} unsubscribe */
export function subscribeSuiteCompletion(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
