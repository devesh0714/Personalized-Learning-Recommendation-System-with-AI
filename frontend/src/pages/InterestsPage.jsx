import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const availableInterests = [
  { name: "DSA", category: "Problem Solving", priority: 5 },
  { name: "Web Development", category: "Engineering", priority: 4 },
  { name: "AI", category: "Data & Intelligence", priority: 5 },
  { name: "DevOps", category: "Platform", priority: 3 }
];

const InterestsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterests = async () => {
      try {
        const response = await api.getInterests(token);
        setSelected(response.data.map((item) => item.name));
      } finally {
        setLoading(false);
      }
    };

    loadInterests();
  }, [token]);

  const toggleInterest = (name) => {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    );
  };

  const save = async () => {
    const payload = availableInterests.filter((interest) => selected.includes(interest.name));
    await api.saveInterests(token, payload);
    setMessage("Interests saved. Your dashboard is ready.");
    setTimeout(() => navigate("/dashboard"), 700);
  };

  return (
    <Layout title="Choose your interests" subtitle="These tags drive recommendations and AI insights.">
      <section className="glass-card">
        <div className="interest-grid">
          {availableInterests.map((interest) => (
            <button
              key={interest.name}
              type="button"
              className={`interest-chip ${selected.includes(interest.name) ? "selected" : ""}`}
              onClick={() => toggleInterest(interest.name)}
            >
              <strong>{interest.name}</strong>
              <span>{interest.category}</span>
            </button>
          ))}
        </div>

        <div className="actions-row">
          <button type="button" onClick={save} disabled={loading}>
            Save interests
          </button>
          {message ? <p className="muted">{message}</p> : null}
        </div>
      </section>
    </Layout>
  );
};

export default InterestsPage;
