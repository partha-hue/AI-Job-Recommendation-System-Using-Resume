import { FormEvent, useEffect, useState } from "react";

import { createJob, fetchApplications, fetchRecruiterProfile, fetchJobs, updateApplicationStatus, updateRecruiterProfile } from "../api";
import { useAuth } from "../components/AuthProvider";
import type { ApplicationItem, JobItem, RecruiterProfile } from "../types";

type RecruiterTab = "overview" | "jobs" | "applications" | "profile";

const EMPTY_PROFILE: RecruiterProfile = {
  company: "",
  title: "",
  location: "",
  about: "",
};

const EMPTY_JOB: JobItem = {
  job_id: "",
  title: "",
  company: "",
  location: "",
  summary: "",
  required_skills: [],
  preferred_skills: [],
};

export function RecruiterPage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<RecruiterTab>("overview");
  const [profile, setProfile] = useState<RecruiterProfile>(EMPTY_PROFILE);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [jobForm, setJobForm] = useState<JobItem>(EMPTY_JOB);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchRecruiterProfile(token).then(setProfile).catch(() => undefined);
    fetchJobs().then(setJobs).catch(() => undefined);
    fetchApplications(token).then(setApplications).catch(() => undefined);
  }, [token]);

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      const updated = await updateRecruiterProfile(token, profile);
      setProfile(updated);
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save recruiter profile.");
    }
  };

  const submitJob = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await createJob(token, jobForm);
      setJobs(await fetchJobs());
      setJobForm(EMPTY_JOB);
      setActiveTab("jobs");
    } catch (jobError) {
      setError(jobError instanceof Error ? jobError.message : "Failed to create job.");
    }
  };

  const updateStatus = async (applicationId: number, status: string) => {
    if (!token) return;
    await updateApplicationStatus(token, applicationId, status);
    setApplications(await fetchApplications(token));
  };

  return (
    <div className="dashboard-view">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Recruiter Dashboard</p>
          <h2>Manage jobs, applicant pipelines, and recruiter company profile.</h2>
        </div>
      </section>

      <div className="tab-row">
        {(["overview", "jobs", "applications", "profile"] as RecruiterTab[]).map((tab) => (
          <button key={tab} type="button" className={`tab-button${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      {activeTab === "overview" ? (
        <section className="stats-grid">
          <article className="metric-card"><span>Open jobs</span><strong>{jobs.length}</strong></article>
          <article className="metric-card"><span>Applications</span><strong>{applications.length}</strong></article>
          <article className="metric-card"><span>Shortlisted</span><strong>{applications.filter((item) => item.status === "shortlisted").length}</strong></article>
          <article className="metric-card"><span>Interview</span><strong>{applications.filter((item) => item.status === "interview").length}</strong></article>
        </section>
      ) : null}

      {activeTab === "jobs" ? (
        <section className="content-grid">
          <form className="panel profile-form" onSubmit={submitJob}>
            <h3>Create Job</h3>
            <label><span>Job ID</span><input value={jobForm.job_id} onChange={(e) => setJobForm({ ...jobForm, job_id: e.target.value })} /></label>
            <label><span>Title</span><input value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} /></label>
            <label><span>Company</span><input value={jobForm.company} onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })} /></label>
            <label><span>Location</span><input value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} /></label>
            <label><span>Summary</span><textarea rows={4} value={jobForm.summary} onChange={(e) => setJobForm({ ...jobForm, summary: e.target.value })} /></label>
            <label><span>Required Skills</span><input value={jobForm.required_skills.join(", ")} onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label>
            <label><span>Preferred Skills</span><input value={jobForm.preferred_skills.join(", ")} onChange={(e) => setJobForm({ ...jobForm, preferred_skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label>
            <button type="submit">Create Job</button>
          </form>
          <section className="cards compact-cards">
            {jobs.map((job) => (
              <article key={job.job_id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.company}</p>
                <p className="summary">{job.summary}</p>
              </article>
            ))}
          </section>
        </section>
      ) : null}

      {activeTab === "applications" ? (
        <section className="cards compact-cards">
          {applications.map((application) => (
            <article key={application.id} className="job-card">
              <h3>{application.job_title}</h3>
              <p>{application.candidate_name}</p>
              <p className="summary">{application.status}</p>
              <div className="chip-wrap">
                {["submitted", "shortlisted", "interview", "offered", "rejected"].map((status) => (
                  <button key={status} type="button" className="secondary-link" onClick={() => updateStatus(application.id, status)}>
                    {status}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "profile" ? (
        <form className="panel profile-form" onSubmit={saveProfile}>
          <h3>Recruiter Profile</h3>
          <label><span>Company</span><input value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} /></label>
          <label><span>Title</span><input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} /></label>
          <label><span>Location</span><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></label>
          <label><span>About</span><textarea rows={5} value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} /></label>
          <button type="submit">Save Recruiter Profile</button>
        </form>
      ) : null}
    </div>
  );
}
