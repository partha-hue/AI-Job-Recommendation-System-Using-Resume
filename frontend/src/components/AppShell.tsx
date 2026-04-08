import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "./AuthProvider";
import { ThemeToggle } from "./ThemeToggle";

export function AppShell() {
  const { user, logout } = useAuth();

  const navItems =
    user?.role === "recruiter"
      ? [
          { to: "/recruiter", label: "Recruiter Dashboard" },
          { to: "/jobs", label: "Job Management" },
        ]
      : [
          { to: "/candidate", label: "Candidate Dashboard" },
          { to: "/jobs", label: "Explore Jobs" },
        ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-block">
            <p className="brand-kicker">Talent Intelligence</p>
            <h1>ResumeMatch Pro</h1>
            <p className="brand-copy">{user?.full_name}</p>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <ThemeToggle />
          <button type="button" className="back-link" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
