// Nebula WebGL disabled site-wide (performance). Cosmic layers off in shared/background.css.
(function() {
  const canvas = document.getElementById('nebula-canvas');
  if (canvas) canvas.style.display = 'none';
})();

// Link debug identifiers + broken link checks (same-origin only).
(function() {
  function isSkippableHref(href) {
    if (!href) return true;
    const trimmed = href.trim();
    if (!trimmed || trimmed.startsWith('#')) return true;
    const lower = trimmed.toLowerCase();
    return (
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:') ||
      lower.startsWith('javascript:')
    );
  }

  function buildDebugId(link, index) {
    const href = link.getAttribute('href') || '';
    const text = (link.textContent || '').trim().slice(0, 40);
    const page = location.pathname.replace(/\W+/g, '_') || 'page';
    const suffix = text ? text.replace(/\s+/g, '_') : 'link';
    return `${page}_link_${index}_${suffix}`.replace(/_{2,}/g, '_');
  }

  function shouldCheckUrl(url) {
    if (!url || !url.origin) return false;
    if (location.protocol === 'file:') return false;
    return url.origin === location.origin;
  }

  function reportBrokenLink(link, url, debugId, status) {
    link.dataset.debugBroken = 'true';
    console.warn('[LinkCheck] Broken link', {
      debugId,
      href: link.getAttribute('href'),
      resolved: url ? url.toString() : null,
      status
    });
  }

  function checkLink(link, url, debugId) {
    fetch(url.toString(), { method: 'HEAD', cache: 'no-store' })
      .then((response) => {
        if (!response.ok) {
          reportBrokenLink(link, url, debugId, response.status);
        }
      })
      .catch(() => {
        fetch(url.toString(), { method: 'GET', cache: 'no-store' })
          .then((response) => {
            if (!response.ok) {
              reportBrokenLink(link, url, debugId, response.status);
            }
          })
          .catch(() => {
            reportBrokenLink(link, url, debugId, 'fetch_failed');
          });
      });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    links.forEach((link, index) => {
      if (!link.dataset.debugId) {
        link.dataset.debugId = buildDebugId(link, index);
      }

      const href = link.getAttribute('href');
      if (isSkippableHref(href)) {
        return;
      }

      let url;
      try {
        url = new URL(href, location.href);
      } catch {
        reportBrokenLink(link, null, link.dataset.debugId, 'invalid_url');
        return;
      }

      if (!shouldCheckUrl(url)) {
        return;
      }

      if (url.pathname === location.pathname && url.hash) {
        return;
      }

      checkLink(link, url, link.dataset.debugId);
    });
  });
})();
