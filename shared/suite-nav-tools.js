import { getSuiteCompletion } from './suite-completion.js';

function basenameFromHref(hrefAttr) {
  if (!hrefAttr || hrefAttr.startsWith('http')) return null;
  try {
    const u = new URL(hrefAttr, document.baseURI);
    const seg = (u.pathname || '').split('/').filter(Boolean).pop();
    return seg ? seg.split('?')[0] : null;
  } catch {
    return null;
  }
}

function currentPageFile() {
  const seg = (window.location.pathname || '').split('/').filter(Boolean).pop();
  return (seg || 'index.html').split('?')[0];
}

function findToolsDropdown() {
  const toggles = document.querySelectorAll('#top-nav a.dropdown-toggle');
  for (const a of toggles) {
    const file = basenameFromHref(a.getAttribute('href') || '');
    if (file === 'tools.html') return a.closest('.nav-dropdown');
  }
  return null;
}

function decorateToolsNav() {
  const dropdown = findToolsDropdown();
  if (!dropdown) return;

  const completion = getSuiteCompletion();
  const byHref = new Map(completion.items.map((item) => [item.href, item]));
  const currentFile = currentPageFile();

  const links = dropdown.querySelectorAll('.dropdown-menu a[role="menuitem"]');
  links.forEach((link) => {
    const hrefAttr = link.getAttribute('href') || '';
    const file = basenameFromHref(hrefAttr);
    if (!file || hrefAttr.startsWith('http')) return;

    if (file === 'tools.html') {
      link.classList.toggle('suite-nav-tool-link--active', currentFile === 'tools.html');
      if (currentFile === 'tools.html') {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
      return;
    }

    const item = byHref.get(file);
    if (!item) return;

    if (!link.dataset.suiteNavPlainLabel) {
      link.dataset.suiteNavPlainLabel = link.textContent.replace(/^\s*[✓○]\s*/u, '').trim();
    }
    const originalLabel = link.dataset.suiteNavPlainLabel;

    link.classList.add('suite-nav-tool-link');
    link.classList.toggle('suite-nav-tool-link--complete', item.completed);
    link.classList.toggle('suite-nav-tool-link--pending', !item.completed);

    if (file === currentFile) {
      link.classList.add('suite-nav-tool-link--active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('suite-nav-tool-link--active');
      link.removeAttribute('aria-current');
    }

    link.replaceChildren();

    const status = document.createElement('span');
    status.className = 'suite-nav-tool__status';
    status.setAttribute('aria-hidden', 'true');
    status.textContent = item.completed ? '\u2713' : '\u25cb';

    const label = document.createElement('span');
    label.className = 'suite-nav-tool__label';
    label.textContent = originalLabel;

    link.append(status, label);

    const state = item.completed ? 'Completed' : 'Not completed';
    const here = file === currentFile ? ' Current page.' : '';
    link.setAttribute('aria-label', `${originalLabel}. ${state}.${here}`);
  });
}

function init() {
  decorateToolsNav();
  window.addEventListener('storage', decorateToolsNav);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
