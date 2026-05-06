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

/**
 * Legacy static tool pages only support these theme keys via shared/theme-prefs.js.
 * Earth maps to light as the closest calm palette.
 */
const LEGACY_SITE_THEME_MAP = {
  earth: "light",
  cosmic: "cosmic",
  light: "light",
  forge: "forge",
  neomorphism: "neomorphism",
};

export function loadTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return themes.includes(saved) ? saved : "earth";
}

export function saveTheme(theme) {
  if (!themes.includes(theme)) return;
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("bm-v3-theme-change", { detail: { theme } }));
}

export function toLegacySiteTheme(theme) {
  return LEGACY_SITE_THEME_MAP[theme] || "light";
}
