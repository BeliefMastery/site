import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";
import { loadTheme, saveTheme, themes } from "@/lib/themeStore";

export default function LayoutShell() {
  const [theme, setTheme] = useState(loadTheme);

  function onThemeChange(next) {
    setTheme(next);
    saveTheme(next);
  }

  return (
    <div className={`app theme-${theme}`}>
      <TopNav onThemeChange={onThemeChange} theme={theme} themes={themes} />
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
