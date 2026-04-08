import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../components/AuthProvider";
import { ThemeToggle } from "../components/ThemeToggle";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/jobs");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Login failed.");
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
          <p className="public-note">Return to the landing page or continue into your account.</p>
          <ThemeToggle />
          <Link className="ghost-button" to="/">
            Home
          </Link>
          <Link className="primary-button" to="/signup">
            Sign up
          </Link>
        </div>
      </header>

      <section className="auth-layout">
        <div className="auth-sidecopy">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in and continue from the right workspace.</h1>
          <p>
            Candidates return to profiles, applications, and recommendations. Recruiters return to jobs, applicants,
            and hiring updates.
          </p>
        </div>

        <form className="auth-card" onSubmit={onSubmit}>
          <p className="eyebrow">Login</p>
          <h2>Sign in to your account</h2>
          <label>
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {error ? <p className="error-banner">{error}</p> : null}
          <button type="submit">Login</button>
          <p className="muted">
            No account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
