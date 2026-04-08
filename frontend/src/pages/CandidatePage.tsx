import { FormEvent, useEffect, useState } from "react";

import { fetchHealth, recommendFromFile, recommendFromText } from "../api";
import type { RecommendationResponse } from "../types";

const SAMPLE_RESUME = `Python developer with 3+ years of experience building FastAPI services, SQL-backed applications, Dockerized deployments, and React dashboards. Worked on machine learning pipelines, NLP-based resume parsing, AWS deployment, and CI/CD automation.`;

export function CandidatePage() {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [topK, setTopK] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    fetchHealth().then(setApiOnline);
  }, []);

  const submitText = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await recommendFromText(resumeText, topK);
      setResult(payload);
      setApiOnline(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to fetch recommendations.");
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const submitFile = async () => {
    if (!resumeFile) {
      setError("Choose a TXT, PDF, or DOCX resume file.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = await recommendFromFile(resumeFile, topK);
      setResult(payload);
      setApiOnline(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to upload resume.");
      setApiOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-view">
      <section className="dashboard-header dashboard-header-tight">
        <div>
          <p className="eyebrow">Candidate Match</p>
          <h2>Analyze resumes and review ranked matches in a balanced workspace.</h2>
          <p className="section-copy">
            The resume form stays compact on the left, and recommendation cards scroll independently on the right.
          </p>
        </div>
        <span className={`status-pill ${apiOnline ? "online" : "offline"}`}>
          {apiOnline ? "Backend online" : "Backend offline"}
        </span>
      </section>

      <section className="candidate-grid">
        <article className="panel candidate-form-panel">
          <div className="panel-topline">
            <div>
              <p className="card-label">Resume Input</p>
              <h3>Upload or paste CV content</h3>
            </div>
          </div>

          <form onSubmit={submitText} className="form-grid">
            <label>
              <span>Resume text</span>
              <textarea
                rows={11}
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Paste the resume text here"
              />
            </label>

            <div className="candidate-actions">
              <label className="compact-field">
                <span>Top recommendations</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={topK}
                  onChange={(event) => setTopK(Number(event.target.value))}
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Text"}
              </button>
            </div>
          </form>

          <div className="upload-block candidate-upload-block">
            <label className="file-picker">
              <span>Attached CV</span>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button type="button" onClick={submitFile} disabled={loading}>
              {loading ? "Uploading..." : "Analyze File"}
            </button>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}
        </article>

        <article className="panel candidate-results-panel">
          <div className="panel-topline">
            <div>
              <p className="card-label">Recommendation Output</p>
              <h3>Ranked roles and matched skills</h3>
            </div>
            <p className="section-copy">Results stay in one clean scroll area instead of stretching the whole page.</p>
          </div>

          {result ? (
            <div className="candidate-results-scroll">
              <div className="skills-row candidate-skills-row">
                <span>Extracted skills</span>
                <div className="chip-wrap">
                  {result.extracted_skills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cards">
                {result.recommendations.map((job) => (
                  <article key={job.job_id} className="job-card animated-card">
                    <div className="job-card-header">
                      <div>
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                      </div>
                      <span className="score">{job.match_score}%</span>
                    </div>

                    <p className="location">{job.location}</p>
                    <p className="summary">{job.summary}</p>

                    <div className="chip-wrap">
                      {job.matched_skills.map((skill) => (
                        <span key={skill} className="chip matched">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <ul className="reason-list">
                      {job.reasons.map((reason) => (
                        <li key={reason}>{reason}</li>
                      ))}
                    </ul>

                    {job.missing_skills.length ? (
                      <p className="missing">Missing: {job.missing_skills.join(", ")}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state candidate-empty-state">
              <p>Run a resume analysis to populate this recommendation workspace.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
