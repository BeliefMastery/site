import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopNav from "./TopNav";
import { loadTheme, saveTheme, themes } from "@/lib/themeStore";

export default function LayoutShell() {
  const location = useLocation();
  const [theme, setTheme] = useState(loadTheme);

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith("/engines/")) return "Assessment Engine";
    if (location.pathname === "/tools") return "Tools Hub";
    if (location.pathname === "/books") return "Books";
    if (location.pathname === "/about") return "About the Author";
    return "Belief Mastery";
  }, [location.pathname]);

  function onThemeChange(next) {
    setTheme(next);
    saveTheme(next);
  }

  return (
    <div className={`app theme-${theme}`}>
      <TopNav />
      <main className="container">
        <section className="hero">
          <p className="kicker">UI V3</p>
          <h1>{pageTitle}</h1>
          <div className="theme-picker">
            <label htmlFor="theme-picker">Theme</label>
            <select id="theme-picker" value={theme} onChange={(e) => onThemeChange(e.target.value)}>
              {themes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </section>
        <Outlet />
      </main>
    </div>
  );
}
