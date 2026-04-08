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
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Candidate Match</p>
          <h2>Analyze resumes and return ranked job matches.</h2>
          <p className="section-copy">
            Upload resume files or paste text, then review extracted skills, fit signals, and missing requirements.
          </p>
        </div>
        <span className={`status-pill ${apiOnline ? "online" : "offline"}`}>
          {apiOnline ? "Backend online" : "Backend offline"}
        </span>
      </section>

      <section className="content-grid">
        <div className="panel">
          <form onSubmit={submitText} className="form-grid">
            <label>
              <span>Resume text</span>
              <textarea
                rows={12}
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Paste the resume text here"
              />
            </label>

            <div className="controls">
              <label>
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

          <div className="upload-block">
            <label className="file-picker">
              <span>Resume file</span>
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
        </div>

        <div className="panel result-panel">
          <div className="result-header">
            <h3>Recommendation Output</h3>
            <p>API-driven results appear here with scoring, reasoning, and skills.</p>
          </div>

          {result ? (
            <>
              <div className="skills-row">
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
            </>
          ) : (
            <div className="empty-state">
              <p>Run a resume analysis to populate this workspace.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
