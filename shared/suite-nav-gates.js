import { getSuiteCompletion } from './suite-completion.js';

function setLockedState(link, locked, reason) {
  if (!(link instanceof HTMLElement)) return;
  if (locked) {
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('data-suite-locked', 'true');
    link.setAttribute('title', reason);
    link.addEventListener('click', preventWhenLocked);
  } else {
    link.removeAttribute('aria-disabled');
    link.removeAttribute('data-suite-locked');
    if (link.getAttribute('title') === reason) link.removeAttribute('title');
    link.removeEventListener('click', preventWhenLocked);
  }
}

function preventWhenLocked(event) {
  const link = event.currentTarget;
  if (!(link instanceof HTMLElement)) return;
  if (link.getAttribute('data-suite-locked') !== 'true') return;
  event.preventDefault();
}

function initSuiteNavGates() {
  const gateLinks = Array.from(document.querySelectorAll('[data-suite-gate]'));
  if (!gateLinks.length) return;
  const completion = getSuiteCompletion();
  gateLinks.forEach((link) => {
    const threshold = Number.parseInt(link.getAttribute('data-suite-gate') || '0', 10);
    const needed = Number.isFinite(threshold) ? threshold : 0;
    const isLocked = completion.completeCount < needed;
    const reason = `Complete at least ${needed} tools to unlock this page.`;
    setLockedState(link, isLocked, reason);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSuiteNavGates);
} else {
  initSuiteNavGates();
}
