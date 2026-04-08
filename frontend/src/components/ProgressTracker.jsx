const ProgressTracker = ({ summary, progress }) => (
  <section className="glass-card">
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

    <div className="progress-list">
      {progress.map((entry) => (
        <div key={entry._id} className="progress-item">
          <div className="progress-copy">
            <h3>{entry.topic}</h3>
            <p>
              {entry.category} • {entry.difficulty}
            </p>
          </div>
          <div className="progress-meter">
            <div className="progress-bar">
              <span style={{ width: `${entry.progressPercentage}%` }} />
            </div>
            <small>{entry.progressPercentage}%</small>
          </div>
        </div>
      ))}
      {!progress.length ? <p className="muted">No progress tracked yet.</p> : null}
    </div>
  </section>
);

export default ProgressTracker;
