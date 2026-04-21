import { NavLink } from "react-router-dom";
import { navItems } from "@/routes";

export default function TopNav() {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <NavLink className="brand" to="/">
          Belief Mastery
        </NavLink>
        <nav>
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
      </div>
    </header>
  );
}
