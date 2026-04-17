const SWIPE_COMMIT_PX = 56;
const DIRECTION_LOCK_PX = 14;
const VERTICAL_DOMINANCE = 1.25;
const BASE_PAGES = [
  'tools.html',
  'diagnosis.html',
  'coaching.html',
  'needs-dependency.html',
  'sovereignty-spectrum.html',
  'paradigm.html',
  'manipulation.html',
  'sovereignty.html',
  'channels.html',
  'character-sheet.html',
  'entities.html',
  'outlier-aptitude.html'
];

function shouldIgnoreTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  if (target.closest('input, textarea, select, button, [contenteditable=""], [contenteditable="true"], [contenteditable]')) {
    return true;
  }
  let node = target;
  while (node && node !== document.body) {
    if (node.scrollWidth > node.clientWidth + 2) return true;
    node = node.parentElement;
  }
  return false;
}

function currentPage() {
  return location.pathname.split('/').pop() || 'index.html';
}

function getSwipeCyclePages() {
  return BASE_PAGES.slice();
}

function navigateToIndex(delta) {
  const pages = getSwipeCyclePages();
  const current = currentPage();
  const idx = pages.indexOf(current);
  if (idx < 0) return;
  const next = (idx + delta + pages.length) % pages.length;
  const target = pages[next];
  if (!target || target === current) return;
  window.location.assign(target);
}

function initSwipeNav() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.body && document.body.dataset.bmSwipeNav !== 'true') return;

  let pointerDown = false;
  let lock = null;
  let startX = 0;
  let startY = 0;

  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (shouldIgnoreTarget(event.target)) return;
    pointerDown = true;
    lock = null;
    startX = event.clientX;
    startY = event.clientY;
  }, { passive: true });

  document.addEventListener('pointermove', (event) => {
    if (!pointerDown) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (lock == null && (Math.abs(dx) > DIRECTION_LOCK_PX || Math.abs(dy) > DIRECTION_LOCK_PX)) {
      lock = Math.abs(dx) > (Math.abs(dy) * VERTICAL_DOMINANCE) ? 'x' : 'y';
    }
  }, { passive: true });

  document.addEventListener('pointerup', (event) => {
    if (!pointerDown) return;
    pointerDown = false;
    const dx = event.clientX - startX;
    if (lock !== 'x' || Math.abs(dx) < SWIPE_COMMIT_PX) return;
    navigateToIndex(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.addEventListener('pointercancel', () => {
    pointerDown = false;
    lock = null;
  }, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSwipeNav);
} else {
  initSwipeNav();
}
