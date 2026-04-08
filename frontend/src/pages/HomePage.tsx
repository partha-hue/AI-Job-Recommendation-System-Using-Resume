import { Link } from "react-router-dom";

import { ThemeToggle } from "../components/ThemeToggle";

const destinations = [
  {
    title: "Candidate Match",
    description: "Upload resumes, analyze skills, and get ranked recommendations with clear reasoning.",
    to: "/candidate",
  },
  {
    title: "Job Explorer",
    description: "Review the live job inventory, skill expectations, and open roles from the backend catalog.",
    to: "/jobs",
  },
  {
    title: "Recruiter Desk",
    description: "Manage the hiring pipeline view with fast stats, posting workflow, and team-facing summaries.",
    to: "/recruiter",
  },
];

export function HomePage() {
  return (
    <main className="landing-shell">
      <header className="landing-hero">
        <div className="landing-copy">
          <p className="eyebrow">Resume intelligence platform</p>
          <h1>Professional AI hiring experience, structured like a real product.</h1>
          <div className="hero-actions">
            <Link to="/candidate" className="primary-link">
              Open Candidate Match
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="hero-showcase">
          <div className="hero-metric">
            <strong>Resume upload + ranking</strong>
          </div>
          <div className="hero-metric">
            <strong>Home, dashboard, explorer, recruiter desk</strong>
          </div>
          <div className="hero-metric">
            <strong>Frontend + FastAPI + persistent catalog</strong>
          </div>
        </div>
      </header>

      <section className="destination-grid">
        {destinations.map((item) => (
          <article key={item.to} className="destination-card">
            <p className="card-label">Workspace</p>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link to={item.to} className="secondary-link">
              Enter workspace
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
