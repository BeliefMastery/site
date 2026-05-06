const STORAGE_KEY = "bm_v3_theme";

export const themes = ["earth", "cosmic", "light", "forge", "neomorphism"];

/** Human-readable labels for the theme picker */
export const themeLabels = {
  earth: "Earth",
  cosmic: "Cosmic",
  light: "Light",
  forge: "Forge",
  neomorphism: "Neomorphism",
};

/** Maps V3 shell themes to keys consumed by shared/theme-prefs.js on static engine pages. */
const LEGACY_SITE_THEME_MAP = {
  earth: "earth",
  cosmic: "cosmic",
  light: "light",
  forge: "forge",
  neomorphism: "neomorphism",
};

const SITE_THEME_STORAGE = "bm_site_theme";

/** Keep legacy static pages’ theme storage aligned with the V3 picker (same origin). */
export function syncLegacySiteThemeStorage(v3Theme) {
  const legacy = toLegacySiteTheme(v3Theme);
  try {
    localStorage.setItem(SITE_THEME_STORAGE, legacy);
  } catch (e) {
    /* ignore */
  }
}

export function loadTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return themes.includes(saved) ? saved : "earth";
}

export function saveTheme(theme) {
  if (!themes.includes(theme)) return;
  window.localStorage.setItem(STORAGE_KEY, theme);
  syncLegacySiteThemeStorage(theme);
  window.dispatchEvent(new CustomEvent("bm-v3-theme-change", { detail: { theme } }));
}

export function toLegacySiteTheme(theme) {
  return LEGACY_SITE_THEME_MAP[theme] || "light";
}
