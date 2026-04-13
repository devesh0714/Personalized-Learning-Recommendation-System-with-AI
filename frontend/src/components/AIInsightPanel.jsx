const AIInsightPanel = ({ ai }) => {
  const insights = ai?.result?.insights || [];

  return (
    <section className="panel highlight-panel">
      <div>
        <p className="eyebrow">AI insights</p>
        <h2>{ai?.result?.headline || "Start tracking progress to unlock guidance"}</h2>
        {ai?.result?.strategy ? <p className="lead-text">{ai.result.strategy}</p> : null}
      </div>

      <div className="insight-list">
        {insights.map((insight) => (
          <p key={insight}>{insight}</p>
        ))}
      </div>

      {ai?.prompt ? (
        <details>
          <summary>AI prompt used</summary>
          <pre>{ai.prompt}</pre>
        </details>
      ) : null}
    </section>
  );
};

export default AIInsightPanel;
