import { useEffect, useMemo, useState } from "react";

import { createApplication, fetchJobs } from "../api";
import { useAuth } from "../components/AuthProvider";
import type { JobItem } from "../types";

export function JobsPage() {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs().then(setJobs).catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Failed to load jobs."));
  }, []);

  const filteredJobs = useMemo(
    () => jobs.filter((job) => `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(searchTerm.toLowerCase())),
    [jobs, searchTerm],
  );

  const apply = async (jobId: string) => {
    if (!token || user?.role !== "candidate") {
      setError("Candidate login required to apply.");
      return;
    }
    try {
      await createApplication(token, { job_id: jobId, cover_letter: "" });
      setError("");
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Apply failed.");
    }
  };

  return (
    <div className="dashboard-view">
      <section className="dashboard-header dashboard-header-tight">
        <div>
          <p className="eyebrow">Job Explorer</p>
          <h2>Explore live job profiles and apply directly.</h2>
        </div>
      </section>
      {error ? <p className="error-banner">{error}</p> : null}
      <section className="panel filter-panel">
        <label>
          <span>Search</span>
          <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search jobs" />
        </label>
      </section>
      <section className="jobs-list-grid">
        {filteredJobs.map((job) => (
          <article key={job.job_id} className="job-card">
            <div className="job-card-header">
              <div>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>
              {user?.role === "candidate" ? (
                <button type="button" className="apply-button" onClick={() => apply(job.job_id)}>
                  Apply
                </button>
              ) : null}
            </div>
            <p className="summary">{job.summary}</p>
            <div className="job-card-columns">
              <div className="chip-wrap">
                {job.required_skills.map((skill) => <span key={skill} className="chip">{skill}</span>)}
              </div>
              <div className="chip-wrap">
                {job.preferred_skills.map((skill) => <span key={skill} className="chip matched">{skill}</span>)}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
