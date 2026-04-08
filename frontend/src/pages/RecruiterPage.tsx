const pipelineStats = [
  { label: "Open roles", value: "06" },
  { label: "Shortlisted", value: "24" },
  { label: "Interviewing", value: "08" },
  { label: "Offer stage", value: "03" },
];

const workflowItems = [
  "Create role briefs aligned with required and preferred skills.",
  "Run resume analysis to surface best-fit candidates faster.",
  "Review missing-skill gaps before moving candidates to interview.",
  "Use the live catalog as the source of truth for active openings.",
];

export function RecruiterPage() {
  return (
    <div className="dashboard-view">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Recruiter Desk</p>
          <h2>Professional workspace for hiring operations and team-level visibility.</h2>
        </div>
      </section>

      <section className="stats-grid">
        {pipelineStats.map((item) => (
          <article key={item.label} className="metric-card">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="result-header">
            <h3>Hiring Workflow</h3>
            <p>Suggested operating model for the platform.</p>
          </div>
          <ul className="reason-list">
            {workflowItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel spotlight-panel">
          <p className="card-label">Recruiter Summary</p>
          <h3>Separate workspace, stronger product framing.</h3>
        </article>
      </section>
    </div>
  );
}
