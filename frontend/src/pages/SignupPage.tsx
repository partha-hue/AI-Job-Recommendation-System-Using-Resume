import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import type { UserRole } from "../types";

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signUp(fullName, email, password, role);
      navigate(role === "recruiter" ? "/recruiter" : "/candidate");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Signup failed.");
    }
  };

  return (
    <main className="public-shell auth-page-shell">
      <header className="public-header">
        <Link className="public-brand" to="/">
          <span className="public-brand-mark">AI</span>
          <span>Job Recommender</span>
        </Link>

        <div className="public-actions">
          <p className="public-note">Start from the product homepage and join as candidate or recruiter.</p>
          <ThemeToggle />
          <Link className="ghost-button" to="/">
            Home
          </Link>
          <Link className="ghost-button" to="/login">
            Login
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        <div className="auth-sidecopy">
          <p className="eyebrow">Create your access</p>
          <h1>Join the platform with the role that fits your workflow.</h1>
          <p>
            Candidates build profiles and track applications. Recruiters manage openings, review applicants, and keep
            hiring organized from their dashboard.
          </p>
        </div>

        <form className="auth-card" onSubmit={onSubmit}>
          <p className="eyebrow">Signup</p>
          <h2>Create candidate or recruiter account</h2>
          <label>
            <span>Full name</span>
            <input value={fullName} onChange={(event) => setFullName(event.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <label>
            <span>Role</span>
            <select value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>
          {error ? <p className="error-banner">{error}</p> : null}
          <button type="submit">Create Account</button>
          <p className="muted">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
