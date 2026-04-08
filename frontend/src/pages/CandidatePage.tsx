import { FormEvent, useEffect, useState } from "react";

import {
  createApplication,
  fetchApplications,
  fetchCandidateProfile,
  recommendFromText,
  updateCandidateProfile,
} from "../api";
import { useAuth } from "../components/AuthProvider";
import type { ApplicationItem, CandidateProfile, RecommendationResponse } from "../types";

type CandidateTab = "match" | "profile" | "applications";

const EMPTY_PROFILE: CandidateProfile = {
  headline: "",
  location: "",
  bio: "",
  experience_years: 0,
  skills: [],
  resume_text: "",
  links: [],
};

export function CandidatePage() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<CandidateTab>("match");
  const [profile, setProfile] = useState<CandidateProfile>(EMPTY_PROFILE);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchCandidateProfile(token).then(setProfile).catch(() => undefined);
    fetchApplications(token).then(setApplications).catch(() => undefined);
  }, [token]);

  const runMatch = async () => {
    if (!token) {
      return;
    }
    try {
      const data = await recommendFromText(profile.resume_text || profile.bio || "Python developer with SQL and React experience.", 5, token);
      setRecommendations(data);
      setError("");
    } catch (matchError) {
      setError(matchError instanceof Error ? matchError.message : "Failed to run match.");
    }
  };

  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      return;
    }
    try {
      const updated = await updateCandidateProfile(token, profile);
      setProfile(updated);
      setError("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save profile.");
    }
  };

  const applyToJob = async (jobId: string) => {
    if (!token) {
      return;
    }
    try {
      await createApplication(token, { job_id: jobId, cover_letter: profile.bio });
      const data = await fetchApplications(token);
      setApplications(data);
      setActiveTab("applications");
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Failed to apply.");
    }
  };

  return (
    <div className="dashboard-view">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Candidate Dashboard</p>
          <h2>Manage your profile, run job matching, and track applications.</h2>
        </div>
      </section>

      <div className="tab-row">
        <button type="button" className={`tab-button${activeTab === "match" ? " active" : ""}`} onClick={() => setActiveTab("match")}>
          Match Jobs
        </button>
        <button type="button" className={`tab-button${activeTab === "profile" ? " active" : ""}`} onClick={() => setActiveTab("profile")}>
          My Profile
        </button>
        <button
          type="button"
          className={`tab-button${activeTab === "applications" ? " active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications
        </button>
      </div>

      {error ? <p className="error-banner">{error}</p> : null}

      {activeTab === "profile" ? (
        <form className="panel profile-form" onSubmit={saveProfile}>
          <div className="profile-grid">
            <label><span>Headline</span><input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} /></label>
            <label><span>Location</span><input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} /></label>
            <label><span>Experience Years</span><input type="number" value={profile.experience_years} onChange={(e) => setProfile({ ...profile, experience_years: Number(e.target.value) })} /></label>
            <label><span>Skills</span><input value={profile.skills.join(", ")} onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label>
          </div>
          <label><span>Bio</span><textarea rows={5} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></label>
          <label><span>Resume Text</span><textarea rows={8} value={profile.resume_text} onChange={(e) => setProfile({ ...profile, resume_text: e.target.value })} /></label>
          <label><span>Links</span><input value={profile.links.join(", ")} onChange={(e) => setProfile({ ...profile, links: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label>
          <button type="submit">Save Profile</button>
        </form>
      ) : null}

      {activeTab === "match" ? (
        <section className="content-grid">
          <article className="panel">
            <h3>Candidate Summary</h3>
            <p className="summary">{profile.headline || "Complete your profile to improve matching."}</p>
            <div className="chip-wrap">
              {profile.skills.map((skill) => (
                <span key={skill} className="chip">{skill}</span>
              ))}
            </div>
            <button type="button" onClick={runMatch}>Run Match</button>
          </article>

          <article className="panel">
            <h3>Recommended Roles</h3>
            <div className="cards">
              {recommendations?.recommendations.map((job) => (
                <article key={job.job_id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p>{job.company}</p>
                    </div>
                    <span className="score">{job.match_score}%</span>
                  </div>
                  <p className="summary">{job.summary}</p>
                  <button type="button" className="apply-button" onClick={() => applyToJob(job.job_id)}>
                    Apply
                  </button>
                </article>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === "applications" ? (
        <section className="cards compact-cards">
          {applications.map((application) => (
            <article key={application.id} className="job-card">
              <h3>{application.job_title}</h3>
              <p>{application.company}</p>
              <p className="summary">{application.status}</p>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  );
}
