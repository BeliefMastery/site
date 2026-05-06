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

export function loadTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return themes.includes(saved) ? saved : "earth";
}

export function saveTheme(theme) {
  if (!themes.includes(theme)) return;
  window.localStorage.setItem(STORAGE_KEY, theme);
}
