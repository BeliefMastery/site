/**
 * Site-wide theme (layered CSS variants + optional full alternate) and font scale.
 * Expects <link rel="stylesheet" href="…/style.css" id="bm-theme-base"> in <head>.
 * Resolves paths against document.baseURI so <base href> deployments work.
 */
(function () {
  'use strict';

  var STORAGE_THEME = 'bm_site_theme';
  var STORAGE_FONT = 'bm_font_scale';

  var THEMES = {
    cosmic: { type: 'layered', file: null },
    light: { type: 'layered', file: 'style/light.css' },
    forge: { type: 'layered', file: 'style/forge.css' },
    neomorphism: { type: 'layered', file: 'style/neomorphism.css' },
    ember: { type: 'full', file: 'style/stylered.css' }
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
    var path = u.pathname;
    /* Ember uses base href .../style/stylered.css — dirname is .../style/, not site root */
    if (/\/style\/[^/?#]+\.css$/i.test(path) && !/\/style\.css$/i.test(path)) {
      return new URL('../..', u);
    }
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

  function applyTheme(themeKey) {
    var spec = THEMES[themeKey];
    if (!spec) themeKey = 'cosmic';

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

    if (spec.type === 'full') {
      removeVariantLink();
      base.href = new URL(spec.file, root).href;
      return;
    }

    base.href = new URL('style.css', root).href;
    var v = ensureVariantLink();
    if (v) v.href = new URL(spec.file, root).href;
  }

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_THEME) || 'cosmic';
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
      { value: 'neomorphism', label: 'Neomorphism v2' },
      { value: 'ember', label: 'Ember v2 (full stylesheet)' }
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
    applyFontScale(readStoredFont());
    applyTheme(readStoredTheme());
  } catch (e) { /* ignore */ }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterControls);
  } else {
    initFooterControls();
  }

  window.BMThemePrefs = {
    applyTheme: applyTheme,
    applyFontScale: applyFontScale,
    readStoredTheme: readStoredTheme,
    readStoredFont: readStoredFont
  };
})();
