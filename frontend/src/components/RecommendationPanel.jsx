import RecommendationCard from "./RecommendationCard.jsx";

const RecommendationPanel = ({ recommendations }) => (
  <section className="panel recommendation-section">
    <div className="section-heading">
      <div>
        <p className="eyebrow">Recommendations</p>
        <h2>Next best learning steps</h2>
      </div>
    </div>

    <div className="recommendation-grid">
      {recommendations.map((recommendation) => (
        <RecommendationCard key={recommendation._id} recommendation={recommendation} />
      ))}
      {!recommendations.length ? (
        <p className="muted">Add domains and progress entries to generate recommendations.</p>
      ) : null}
    </div>
  </section>
);

export default RecommendationPanel;
