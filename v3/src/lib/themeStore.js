const STORAGE_KEY = "bm_v3_theme";

export const themes = ["cosmic", "forge", "neomorphism", "light"];

export function loadTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return themes.includes(saved) ? saved : "cosmic";
}

export function saveTheme(theme) {
  if (!themes.includes(theme)) return;
  window.localStorage.setItem(STORAGE_KEY, theme);
}
