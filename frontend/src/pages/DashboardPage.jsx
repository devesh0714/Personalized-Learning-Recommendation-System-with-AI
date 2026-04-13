import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import AIInsightPanel from "../components/AIInsightPanel.jsx";
import Layout from "../components/Layout.jsx";
import LearningPathViewer from "../components/LearningPathViewer.jsx";
import ProgressTracker from "../components/ProgressTracker.jsx";
import RecommendationPanel from "../components/RecommendationPanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const DashboardPage = () => {
  const { token, user } = useAuth();
  const [dashboard, setDashboard] = useState({
    progress: [],
    summary: {
      completedTopics: 0,
      averageCompletion: 0,
      totalTimeSpentMinutes: 0,
      progressByDomain: []
    },
    recommendations: [],
    learningPaths: [],
    ai: { result: { headline: "", insights: [] }, prompt: "" }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [syncingSample, setSyncingSample] = useState(false);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [progressResponse, recommendationResponse, pathResponse] = await Promise.all([
        api.getProgress(token),
        api.getRecommendations(token),
        api.getLearningPaths(token)
      ]);

      setDashboard({
        progress: progressResponse.data.progress,
        summary: progressResponse.data.summary,
        recommendations: recommendationResponse.data.recommendations,
        ai: recommendationResponse.data.ai,
        learningPaths: pathResponse.data
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
      const topics = dashboard.learningPaths
        .flatMap((path) =>
          path.milestones.flatMap((milestone) =>
            milestone.topics.map((entry) => ({ path, entry }))
          )
        )
        .slice(0, 3);

      await Promise.all(
        topics.map(({ path, entry }, index) =>
          api.saveProgress(token, {
            topicId: entry.topic?._id || entry.topic,
            completed: index === 0,
            progressPercentage: index === 0 ? 100 : 45 + index * 15,
            timeSpentMinutes: entry.topic?.estimatedMinutes || 60,
            accuracy: index === 0 ? 88 : 58 + index * 8,
            notes: `Sample progress for ${path.domain?.name}.`
          })
        )
      );
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
      <section className="dashboard-hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Multi-domain learning</p>
          <h2>Plan the next session with progress-aware recommendations.</h2>
          <p className="lead-text">
            Your roadmap, weak areas, and AI insights update as you complete topics.
          </p>
          <div className="actions-row">
            <Link className="button-link" to="/interests">Choose domains</Link>
            <Link className="button-link secondary-button" to="/learning-paths">View paths</Link>
          </div>
        </div>
        <img
          className="hero-image"
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
          alt="Learner using a laptop with study notes"
        />
      </section>

      <section className="hero-grid">
        <AIInsightPanel ai={dashboard.ai} />

        <div className="panel action-card">
          <p className="eyebrow">Quick start</p>
          <h2>Populate demo learning history</h2>
          <p className="muted">
            This adds progress entries from your generated learning paths so the engines have signal.
          </p>
          <button
            type="button"
            onClick={addSampleProgress}
            disabled={syncingSample || dashboard.learningPaths.length === 0}
          >
            {syncingSample ? "Syncing sample data..." : "Add sample progress"}
          </button>
          {dashboard.learningPaths.length === 0 ? (
            <p className="muted">Generate a learning path first.</p>
          ) : null}
          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </section>

      <ProgressTracker summary={dashboard.summary} progress={dashboard.progress} />
      <LearningPathViewer paths={dashboard.learningPaths} compact />
      <RecommendationPanel recommendations={dashboard.recommendations} />
    </Layout>
  );
};

export default DashboardPage;
