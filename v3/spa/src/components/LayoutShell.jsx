import { useLayoutEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import SeoHead from "./SeoHead";
import { loadTheme, saveTheme, syncLegacySiteThemeStorage, themes } from "@/lib/themeStore";

function syncDocumentTheme(theme) {
  const root = document.documentElement;
  for (const id of themes) {
    root.classList.remove(`theme-${id}`);
  }
  root.classList.add(`theme-${theme}`);
}

export default function LayoutShell() {
  const [theme, setTheme] = useState(loadTheme);

  useLayoutEffect(() => {
    syncDocumentTheme(theme);
    syncLegacySiteThemeStorage(theme);
  }, [theme]);

  function onThemeChange(next) {
    setTheme(next);
    saveTheme(next);
  }

  return (
    <div className="app">
      <SeoHead />
      <TopNav onThemeChange={onThemeChange} theme={theme} themes={themes} />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
