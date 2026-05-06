import { NavLink } from "react-router-dom";
import { navItems } from "@/routes";
import { themeLabels } from "@/lib/themeStore";

export default function TopNav({ theme, themes, onThemeChange }) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <NavLink className="brand" to="/">
          Belief Mastery
        </NavLink>
        <div className="top-nav-actions">
          <nav aria-label="Primary">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => (isActive ? "active" : "")}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="theme-picker">
            <label htmlFor="theme-picker">Theme</label>
            <select id="theme-picker" value={theme} onChange={(e) => onThemeChange(e.target.value)}>
              {themes.map((item) => (
                <option key={item} value={item}>
                  {themeLabels[item] ?? item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
