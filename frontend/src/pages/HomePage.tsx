import { Link } from "react-router-dom";

import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../components/AuthProvider";

const candidateHighlights = [
  "Build a complete candidate profile with skills, experience, and goals.",
  "Upload resumes and review ranked job recommendations in one workspace.",
  "Track every application, interview stage, and recruiter response.",
];

const recruiterHighlights = [
  "Create jobs, review candidates, and manage status updates from one dashboard.",
  "Keep your hiring pipeline structured with application tracking and notes.",
  "Switch between open roles, talent review, and profile settings without losing context.",
];

export function HomePage() {
  const { user } = useAuth();

  return (
    <main className="public-shell">
      <header className="public-header">
        <Link className="public-brand" to="/">
          <span className="public-brand-mark">AI</span>
          <span>Job Recommender</span>
        </Link>

        <nav className="public-nav">
          <a href="#features">Features</a>
          <a href="#workspaces">Workspaces</a>
          <a href="#flow">Flow</a>
        </nav>

        <div className="public-actions">
          <p className="public-note">
            {user ? `Signed in as ${user.full_name}` : "Candidate and recruiter access available"}
          </p>
          <ThemeToggle />
          {user ? (
            <Link className="ghost-button" to={user.role === "recruiter" ? "/recruiter" : "/candidate"}>
              Open dashboard
            </Link>
          ) : (
            <>
              <Link className="ghost-button" to="/login">
                Login
              </Link>
              <Link className="primary-button" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Smart hiring workspace</p>
          <h1>Start on the product homepage, then move into candidate or recruiter tools.</h1>
          <p className="hero-text">
            This flow now begins with a clean landing page, clear navigation, and direct access to login or signup from
            the header instead of dropping users straight into a form.
          </p>
          <div className="hero-cta">
            <Link className="primary-button" to={user ? (user.role === "recruiter" ? "/recruiter" : "/candidate") : "/signup"}>
              {user ? "Continue to workspace" : "Create account"}
            </Link>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
          </div>
        </div>

        <div className="hero-card-grid">
          <article className="hero-stat-card">
            <span className="hero-stat-label">Candidate workspace</span>
            <strong>Profile, recommendations, applications</strong>
            <p>Resume analysis, job matching, and progress tracking in one place.</p>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-label">Recruiter workspace</span>
            <strong>Jobs, pipeline, candidate review</strong>
            <p>Post roles, manage applications, and move talent through hiring stages.</p>
          </article>
          <article className="hero-stat-card">
            <span className="hero-stat-label">Navigation-first entry</span>
            <strong>Professional public flow</strong>
            <p>Users land on the site first, then choose login or signup from the header.</p>
          </article>
        </div>
      </section>

      <section className="landing-section" id="features">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>Two focused experiences built inside one product.</h2>
        </div>
        <div className="workspace-grid">
          <article className="workspace-card">
            <p className="workspace-kicker">For candidates</p>
            <h3>Build a real job profile and track your next move.</h3>
            <ul className="workspace-list">
              {candidateHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="workspace-card">
            <p className="workspace-kicker">For recruiters</p>
            <h3>Manage openings and applications in a cleaner hiring flow.</h3>
            <ul className="workspace-list">
              {recruiterHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="landing-section" id="workspaces">
        <div className="section-heading">
          <p className="eyebrow">Workspaces</p>
          <h2>Choose the path that matches your role.</h2>
        </div>
        <div className="journey-grid">
          <article className="journey-card">
            <span className="journey-step">01</span>
            <h3>Candidate</h3>
            <p>Create a profile, upload resume content, discover matching roles, and follow applications.</p>
          </article>
          <article className="journey-card">
            <span className="journey-step">02</span>
            <h3>Recruiter</h3>
            <p>Set up company details, publish openings, review talent, and update application status.</p>
          </article>
          <article className="journey-card">
            <span className="journey-step">03</span>
            <h3>Shared product flow</h3>
            <p>Both roles start from the same landing page and enter through the header actions.</p>
          </article>
        </div>
      </section>

      <section className="landing-section landing-section-compact" id="flow">
        <div className="section-heading">
          <p className="eyebrow">Flow</p>
          <h2>Public first, account next, dashboard after that.</h2>
        </div>
        <div className="flow-strip">
          <div className="flow-node">Landing page</div>
          <div className="flow-node">Header login or signup</div>
          <div className="flow-node">Role-based dashboard</div>
        </div>
      </section>
    </main>
  );
}
