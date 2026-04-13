const LearningPathViewer = ({ paths, onTrackTopic, compact = false }) => (
  <section className="panel learning-path-section">
    <div className="section-heading">
      <div>
        <p className="eyebrow">Learning paths</p>
        <h2>{compact ? "Active roadmaps" : "Structured domain roadmaps"}</h2>
      </div>
    </div>

    <div className="path-list">
      {paths.map((path) => (
        <article key={path._id} className="path-block">
          <div className="path-header">
            <div>
              <h3>{path.domain?.name}</h3>
              <p className="muted">
                {path.skillLevel} • {path.goal}
              </p>
            </div>
            <span className="status-pill">{path.status}</span>
          </div>

          <div className="milestone-list">
            {path.milestones.slice(0, compact ? 2 : path.milestones.length).map((milestone) => (
              <div key={`${path._id}-${milestone.title}`} className="milestone-row">
                <h4>{milestone.title}</h4>
                <div className="topic-list">
                  {milestone.topics.map((entry) => (
                    <div key={`${path._id}-${entry.topic?._id || entry.title}`} className="topic-row">
                      <div>
                        <strong>{entry.title}</strong>
                        <span>
                          {entry.difficulty} • {entry.status}
                        </span>
                      </div>
                      {onTrackTopic ? (
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => onTrackTopic(path, milestone, entry)}
                        >
                          Mark progress
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
      {!paths.length ? <p className="muted">No learning path generated yet.</p> : null}
    </div>
  </section>
);

export default LearningPathViewer;
