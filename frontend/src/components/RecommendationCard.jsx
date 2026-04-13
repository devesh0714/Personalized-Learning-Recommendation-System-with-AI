const RecommendationCard = ({ recommendation }) => (
  <article className="recommendation-card">
    <div className="card-pill">{recommendation.source}</div>
    <h3>{recommendation.title}</h3>
    <p>{recommendation.description}</p>
    <p className="muted">Reason: {recommendation.reason}</p>
    <div className="card-footer">
      <span>{recommendation.category}</span>
      <span>Priority {recommendation.priority}/5</span>
    </div>
    {recommendation.nextTopic?.title ? (
      <p className="next-topic">
        Next topic: <strong>{recommendation.nextTopic.title}</strong>
      </p>
    ) : null}
    {recommendation.actionUrl ? (
      <a href={recommendation.actionUrl} target="_blank" rel="noreferrer" className="card-link">
        Open learning resource
      </a>
    ) : null}
  </article>
);

export default RecommendationCard;
