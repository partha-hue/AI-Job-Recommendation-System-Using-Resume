import { useEffect, useMemo, useState } from "react";

import { fetchJobs } from "../api";
import type { JobItem } from "../types";

export function JobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("all");

  useEffect(() => {
    fetchJobs()
      .then((items) => {
        setJobs(items);
        setError("");
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Failed to load jobs.");
      });
  }, []);

  const locations = useMemo(
    () => ["all", ...Array.from(new Set(jobs.map((job) => job.location))).sort()],
    [jobs],
  );

  const skills = useMemo(
    () =>
      [
        "all",
        ...Array.from(new Set(jobs.flatMap((job) => [...job.required_skills, ...job.preferred_skills]))).sort(),
      ],
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchIndex =
        `${job.title} ${job.company} ${job.location} ${job.summary} ${job.required_skills.join(" ")} ${job.preferred_skills.join(" ")}`
          .toLowerCase();
      const matchesSearch = searchTerm.trim() ? searchIndex.includes(searchTerm.toLowerCase()) : true;
      const matchesLocation = locationFilter === "all" ? true : job.location === locationFilter;
      const matchesSkill =
        skillFilter === "all"
          ? true
          : [...job.required_skills, ...job.preferred_skills].includes(skillFilter);

      return matchesSearch && matchesLocation && matchesSkill;
    });
  }, [jobs, locationFilter, searchTerm, skillFilter]);

  return (
    <div className="dashboard-view">
      <section className="dashboard-header dashboard-header-tight">
        <div>
          <p className="eyebrow">Job Explorer</p>
          <h2>Browse active roles in a cleaner, recruiter-grade layout.</h2>
        </div>
      </section>

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="stats-grid stats-grid-compact">
        <div className="metric-card">
          <span>Matching roles</span>
          <strong>{filteredJobs.length}</strong>
        </div>
        <div className="metric-card">
          <span>Remote roles</span>
          <strong>{filteredJobs.filter((job) => job.location.toLowerCase().includes("remote")).length}</strong>
        </div>
        <div className="metric-card">
          <span>Locations</span>
          <strong>{locations.length - 1}</strong>
        </div>
        <div className="metric-card">
          <span>Tracked skills</span>
          <strong>{skills.length - 1}</strong>
        </div>
      </section>

      <section className="panel filter-panel">
        <div className="filter-topline">
          <div>
            <p className="card-label">Filter Section</p>
            <h3>Refine the catalog</h3>
          </div>
        </div>

        <div className="filter-grid">
          <label>
            <span>Search</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, company, location, skill"
            />
          </label>

          <label>
            <span>Location</span>
            <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location === "all" ? "All locations" : location}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Skill</span>
            <select value={skillFilter} onChange={(event) => setSkillFilter(event.target.value)}>
              {skills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill === "all" ? "All skills" : skill}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="jobs-list-grid">
        {filteredJobs.map((job) => (
          <article key={job.job_id} className="job-card animated-card job-list-card">
            <div className="job-card-header">
              <div>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>
              <button type="button" className="apply-button">
                Apply
              </button>
            </div>

            <div className="job-meta-row">
              <span className="location-badge">{job.location}</span>
              <span className="meta-hint">Job ID: {job.job_id}</span>
            </div>

            <p className="summary">{job.summary}</p>

            <div className="job-card-columns">
              <div>
                <p className="mini-heading">Required skills</p>
                <div className="chip-wrap">
                  {job.required_skills.map((skill) => (
                    <span key={`${job.job_id}-${skill}`} className="chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="mini-heading">Preferred skills</p>
                <div className="chip-wrap">
                  {job.preferred_skills.map((skill) => (
                    <span key={`${job.job_id}-${skill}`} className="chip matched">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}

        {!filteredJobs.length ? (
          <article className="panel empty-state">
            <p>No jobs match the selected filters.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
