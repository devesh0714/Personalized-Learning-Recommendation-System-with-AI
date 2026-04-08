import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Layout from "../components/Layout.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import RecommendationCard from "../components/RecommendationCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const starterProgress = [
  {
    topic: "Arrays and Strings",
    category: "DSA",
    progressPercentage: 100,
    timeSpentMinutes: 120,
    completed: true,
    difficulty: "Beginner",
    notes: "Comfortable solving easy problems."
  },
  {
    topic: "Supervised Learning Fundamentals",
    category: "AI",
    progressPercentage: 45,
    timeSpentMinutes: 80,
    completed: false,
    difficulty: "Beginner",
    notes: "Need practice with evaluation metrics."
  }
];

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState({
    progress: [],
    summary: { completedTopics: 0, averageCompletion: 0, totalTimeSpentMinutes: 0 },
    recommendations: [],
    ai: { result: { headline: "", insights: [] }, prompt: "" }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingSample, setSyncingSample] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [progressResponse, recommendationResponse] = await Promise.all([
        api.getProgress(token),
        api.getRecommendations(token)
      ]);

      setDashboard({
        progress: progressResponse.data.progress,
        summary: progressResponse.data.summary,
        recommendations: recommendationResponse.data.recommendations,
        ai: recommendationResponse.data.ai
      });
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [token]);

  const addSampleProgress = async () => {
    setSyncingSample(true);

    try {
      await Promise.all(starterProgress.map((entry) => api.saveProgress(token, entry)));
      await loadDashboard();
    } finally {
      setSyncingSample(false);
    }
  };

  if (loading) {
    return <div className="page-shell">Loading dashboard...</div>;
  }

  return (
    <Layout
      title={`Welcome, ${user?.name || "Learner"}`}
      subtitle="Track growth, review recommendations, and use AI coaching to focus your next session."
    >
      <section className="hero-grid">
        <div className="glass-card spotlight-card">
          <p className="eyebrow">AI insight</p>
          <h2>{dashboard.ai.result.headline || "Start tracking progress to unlock guidance"}</h2>
          <div className="insight-list">
            {dashboard.ai.result.insights?.map((insight) => (
              <p key={insight}>{insight}</p>
            ))}
          </div>
          <details>
            <summary>AI prompt used</summary>
            <pre>{dashboard.ai.prompt}</pre>
          </details>
        </div>

        <div className="glass-card action-card">
          <p className="eyebrow">Quick start</p>
          <h2>Populate demo learning history</h2>
          <p className="muted">
            This adds a few progress entries so the recommendation engine has enough signal.
          </p>
          <button type="button" onClick={addSampleProgress} disabled={syncingSample}>
            {syncingSample ? "Syncing sample data..." : "Add sample progress"}
          </button>
          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </section>

      <ProgressTracker summary={dashboard.summary} progress={dashboard.progress} />

      <section className="recommendation-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recommendations</p>
            <h2>Next best learning steps</h2>
          </div>
        </div>

        <div className="recommendation-grid">
          {dashboard.recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation._id} recommendation={recommendation} />
          ))}
          {!dashboard.recommendations.length ? (
            <div className="glass-card">
              <p className="muted">
                Add interests and progress entries to generate recommendations.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
