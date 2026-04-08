import { NavLink, Outlet } from "react-router-dom";

import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { to: "/candidate", label: "Candidate Match" },
  { to: "/jobs", label: "Job Explorer" },
  { to: "/recruiter", label: "Recruiter Desk" },
];

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-block">
            <p className="brand-kicker">Talent Intelligence</p>
            <h1>ResumeMatch Pro</h1>
            <p className="brand-copy">A structured hiring product for resume analysis, role discovery, and recruiter workflows.</p>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <ThemeToggle />
          <NavLink to="/" className="back-link">
            Back to Home
          </NavLink>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
