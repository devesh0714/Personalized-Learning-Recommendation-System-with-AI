import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import Layout from "../components/Layout.jsx";
import LearningPathViewer from "../components/LearningPathViewer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const LearningPathPage = () => {
  const { token } = useAuth();
  const [paths, setPaths] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadPaths = async () => {
    const response = await api.getLearningPaths(token);
    setPaths(response.data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadPaths();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const markProgress = async (path, _milestone, entry) => {
    try {
      await api.saveProgress(token, {
        topicId: entry.topic?._id || entry.topic,
        progressPercentage: 100,
        completed: true,
        timeSpentMinutes: entry.topic?.estimatedMinutes || 60,
        accuracy: 80,
        notes: `Completed from ${path.domain?.name} learning path.`
      });
      setMessage(`Progress saved for ${entry.title}.`);
      await loadPaths();
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div className="page-shell">Loading learning paths...</div>;
  }

  return (
    <Layout
      title="Learning path viewer"
      subtitle="Follow each domain roadmap from subdomain to topic to subtopic."
    >
      <LearningPathViewer paths={paths} onTrackTopic={markProgress} />
      {message ? <p className="muted status-message">{message}</p> : null}
    </Layout>
  );
};

export default LearningPathPage;
