/**
 * Site-wide theme (base style.css + optional layered variant) and font scale.
 * Expects <link rel="stylesheet" href="…/style.css" id="bm-theme-base"> in <head>.
 * Resolves paths against document.baseURI so <base href> deployments work.
 */
(function () {
  'use strict';

  var STORAGE_THEME = 'bm_site_theme';
  var STORAGE_FONT = 'bm_font_scale';
  var LOCAL_FONT_LINK_ID = 'bm-local-fonts';
  var LEGACY_THEME_MAP = {
    default: 'cosmic',
    matrix: 'forge',
    neo: 'neomorphism'
  };

  var THEMES = {
    cosmic: { type: 'layered', file: null },
    light: { type: 'layered', file: 'style/light.css' },
    forge: { type: 'layered', file: 'style/forge.css' },
    neomorphism: { type: 'layered', file: 'style/neomorphism.css' }
  };

  var FONT_STEPS = [
    { value: '0.9', label: 'Small' },
    { value: '1', label: 'Medium' },
    { value: '1.12', label: 'Large' },
    { value: '1.25', label: 'Extra large' }
  ];

  function getBaseLink() {
    return document.getElementById('bm-theme-base');
  }

  function styleCssUrl() {
    var base = getBaseLink();
    if (!base) return null;
    return new URL(base.getAttribute('href'), document.baseURI);
  }

  function siteRootUrl() {
    var u = styleCssUrl();
    if (!u) return null;
    return new URL('.', u);
  }

  function removeVariantLink() {
    var el = document.getElementById('bm-theme-variant');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function ensureVariantLink() {
    var existing = document.getElementById('bm-theme-variant');
    if (existing) return existing;
    var base = getBaseLink();
    if (!base || !base.parentNode) return null;
    var link = document.createElement('link');
    link.id = 'bm-theme-variant';
    link.rel = 'stylesheet';
    base.insertAdjacentElement('afterend', link);
    return link;
  }

  function applyFontScale(scaleStr) {
    var v = parseFloat(scaleStr, 10);
    if (!Number.isFinite(v) || v < 0.75 || v > 1.5) v = 1;
    document.documentElement.style.setProperty('--font-scale', String(v));
    try {
      localStorage.setItem(STORAGE_FONT, String(v));
    } catch (e) { /* ignore */ }
  }

  function normalizeThemeKey(themeKey) {
    if (!themeKey) return 'cosmic';
    var key = String(themeKey).toLowerCase();
    return THEMES[key] ? key : (LEGACY_THEME_MAP[key] || 'cosmic');
  }

  function readThemeFromQuery() {
    try {
      var url = new URL(window.location.href);
      var raw = url.searchParams.get('theme') || url.searchParams.get('style');
      if (!raw) return null;
      var normalized = normalizeThemeKey(raw);
      url.searchParams.delete('theme');
      url.searchParams.delete('style');
      window.history.replaceState({}, document.title, url.toString());
      return normalized;
    } catch (e) {
      return null;
    }
  }

  function ensureLocalFonts() {
    var head = document.head || document.getElementsByTagName('head')[0];
    if (!head) return;

    var root = siteRootUrl();
    if (!root) return;

    document.querySelectorAll('link[rel="preconnect"][href*="fonts.gstatic.com"], link[rel="dns-prefetch"][href*="fonts.googleapis.com"], link[rel="stylesheet"][href*="fonts.googleapis.com"]').forEach(function (node) {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });

    var existing = document.getElementById(LOCAL_FONT_LINK_ID);
    if (existing) return;
    var link = document.createElement('link');
    link.id = LOCAL_FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href = new URL('fonts/fonts.css', root).href;
    head.appendChild(link);
  }

  function applyTheme(themeKey) {
    themeKey = normalizeThemeKey(themeKey);
    var spec = THEMES[themeKey];

    var base = getBaseLink();
    var root = siteRootUrl();
    if (!base || !root) return;

    document.documentElement.setAttribute('data-bm-theme', themeKey);

    try {
      localStorage.setItem(STORAGE_THEME, themeKey);
    } catch (e) { /* ignore */ }

    if (themeKey === 'cosmic' || !spec.file) {
      base.href = new URL('style.css', root).href;
      removeVariantLink();
      return;
    }

    base.href = new URL('style.css', root).href;
    var v = ensureVariantLink();
    if (v) v.href = new URL(spec.file, root).href;
  }

  function readStoredTheme() {
    try {
      var t = localStorage.getItem(STORAGE_THEME) || 'cosmic';
      return normalizeThemeKey(t);
    } catch (e) {
      return 'cosmic';
    }
  }

  function readStoredFont() {
    try {
      var s = localStorage.getItem(STORAGE_FONT);
      return s && FONT_STEPS.some(function (f) { return f.value === s; }) ? s : '1';
    } catch (e) {
      return '1';
    }
  }

  function initFooterControls() {
    var footer = document.querySelector('footer');
    if (!footer || footer.querySelector('.footer-theme-prefs')) return;

    var wrap = document.createElement('div');
    wrap.className = 'footer-theme-prefs';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Display preferences');

    var themeField = document.createElement('div');
    themeField.className = 'footer-theme-prefs__group';
    var themeLabel = document.createElement('label');
    themeLabel.className = 'footer-theme-prefs__label';
    themeLabel.setAttribute('for', 'bm-theme-select');
    themeLabel.textContent = 'Theme';
    var themeSelect = document.createElement('select');
    themeSelect.id = 'bm-theme-select';
    themeSelect.className = 'footer-theme-prefs__select';
    [
      { value: 'cosmic', label: 'Cosmic (default)' },
      { value: 'light', label: 'Light v2' },
      { value: 'forge', label: 'Matrix Forge v2' },
      { value: 'neomorphism', label: 'Neomorphism v2' }
    ].forEach(function (opt) {
      var o = document.createElement('option');
      o.value = opt.value;
      o.textContent = opt.label;
      themeSelect.appendChild(o);
    });
    themeSelect.value = readStoredTheme();
    themeSelect.addEventListener('change', function () {
      applyTheme(themeSelect.value);
    });
    themeField.appendChild(themeLabel);
    themeField.appendChild(themeSelect);

    var fontField = document.createElement('div');
    fontField.className = 'footer-theme-prefs__group';
    var fontLabel = document.createElement('label');
    fontLabel.className = 'footer-theme-prefs__label';
    fontLabel.setAttribute('for', 'bm-font-select');
    fontLabel.textContent = 'Text size';
    var fontSelect = document.createElement('select');
    fontSelect.id = 'bm-font-select';
    fontSelect.className = 'footer-theme-prefs__select';
    FONT_STEPS.forEach(function (step) {
      var o = document.createElement('option');
      o.value = step.value;
      o.textContent = step.label;
      fontSelect.appendChild(o);
    });
    fontSelect.value = readStoredFont();
    fontSelect.addEventListener('change', function () {
      applyFontScale(fontSelect.value);
    });
    fontField.appendChild(fontLabel);
    fontField.appendChild(fontSelect);

    wrap.appendChild(themeField);
    wrap.appendChild(fontField);
    footer.appendChild(wrap);
  }

  try {
    ensureLocalFonts();
    applyFontScale(readStoredFont());
    applyTheme(readThemeFromQuery() || readStoredTheme());
  } catch (e) { /* ignore */ }

  function initSuiteNavToolsFromModule() {
    if (!document.getElementById('top-nav')) return;
    var scriptEl = document.querySelector('script[src*="theme-prefs.js"]');
    if (!scriptEl || !scriptEl.src) return;
    import(new URL('suite-nav-tools.js', scriptEl.src).href).catch(function () {});
  }

  function onDomReady() {
    initFooterControls();
    initSuiteNavToolsFromModule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDomReady);
  } else {
    onDomReady();
  }

  window.BMThemePrefs = {
    applyTheme: applyTheme,
    applyFontScale: applyFontScale,
    readStoredTheme: readStoredTheme,
    readStoredFont: readStoredFont
  };
})();
