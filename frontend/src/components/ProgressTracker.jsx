const ProgressTracker = ({ summary, progress }) => (
  <section className="panel">
    <div className="section-heading">
      <div>
        <p className="eyebrow">Learning tracking</p>
        <h2>Progress overview</h2>
      </div>
      <div className="summary-grid">
        <div>
          <strong>{summary.completedTopics}</strong>
          <span>Completed</span>
        </div>
        <div>
          <strong>{summary.averageCompletion}%</strong>
          <span>Average</span>
        </div>
        <div>
          <strong>{summary.totalTimeSpentMinutes}m</strong>
          <span>Time spent</span>
        </div>
      </div>
    </div>

    <div className="domain-summary-grid">
      {summary.progressByDomain?.map((domain) => (
        <div key={domain.domainId || domain.domain} className="domain-summary">
          <strong>{domain.domain}</strong>
          <span>
            {domain.completedTopics}/{domain.totalPathTopics} topics • {domain.averageCompletion}% average
          </span>
        </div>
      ))}
    </div>

    <div className="progress-list">
      {progress.map((entry) => (
        <div key={entry._id} className="progress-item">
          <div className="progress-copy">
            <h3>{entry.topic}</h3>
            <p>
              {entry.domain?.name || entry.category} • {entry.subdomain?.name || "General"} • {entry.difficulty}
            </p>
          </div>
          <div className="progress-meter">
            <div className="progress-bar">
              <span style={{ width: `${entry.progressPercentage}%` }} />
            </div>
            <small>
              {entry.progressPercentage}%{entry.accuracy !== null ? ` • ${entry.accuracy}% accuracy` : ""}
            </small>
          </div>
        </div>
      ))}
      {!progress.length ? <p className="muted">No progress tracked yet.</p> : null}
    </div>
  </section>
);

export default ProgressTracker;
