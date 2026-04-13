import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client.js";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const levels = ["Beginner", "Intermediate", "Advanced"];

const countTopics = (domain) =>
  domain.subdomains.reduce((count, subdomain) => count + subdomain.topics.length, 0);

const InterestsPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [domains, setDomains] = useState([]);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDomains = async () => {
      try {
        const [domainResponse, pathResponse] = await Promise.all([
          api.getDomains(),
          api.getLearningPaths(token)
        ]);
        setDomains(domainResponse.data);

        const selectedByDomain = {};
        pathResponse.data.forEach((path) => {
          selectedByDomain[path.domain._id] = {
            skillLevel: path.skillLevel,
            goal: path.goal
          };
        });
        setSelected(selectedByDomain);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, [token]);

  const selectedCount = useMemo(() => Object.keys(selected).length, [selected]);

  const toggleDomain = (domain) => {
    setSelected((current) => {
      const next = { ...current };
      if (next[domain._id]) {
        delete next[domain._id];
      } else {
        next[domain._id] = {
          skillLevel: "Beginner",
          goal: domain.goals?.[0] || "Build strong fundamentals."
        };
      }
      return next;
    });
  };

  const updateSelection = (domainId, key, value) => {
    setSelected((current) => ({
      ...current,
      [domainId]: {
        ...current[domainId],
        [key]: value
      }
    }));
  };

  const save = async () => {
    setSaving(true);
    setMessage("");

    try {
      await Promise.all(
        Object.entries(selected).map(([domainId, config]) =>
          api.generateLearningPath(token, {
            domainId,
            skillLevel: config.skillLevel,
            goal: config.goal
          })
        )
      );
      setMessage("Domains saved and learning paths generated.");
      setTimeout(() => navigate("/learning-paths"), 700);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="page-shell">Loading domains...</div>;
  }

  return (
    <Layout
      title="Choose domains"
      subtitle="Pick any field, set your level, and generate a structured roadmap."
    >
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Domain selection</p>
            <h2>{selectedCount} selected</h2>
          </div>
          <button type="button" onClick={save} disabled={saving || selectedCount === 0}>
            {saving ? "Generating paths..." : "Save domains"}
          </button>
        </div>

        <div className="domain-grid">
          {domains.map((domain) => {
            const isSelected = Boolean(selected[domain._id]);
            return (
              <article key={domain._id} className={`domain-card ${isSelected ? "selected" : ""}`}>
                <button type="button" className="domain-toggle" onClick={() => toggleDomain(domain)}>
                  <span className="card-pill">{domain.category}</span>
                  <strong>{domain.name}</strong>
                  <span>{domain.description}</span>
                  <small>
                    {domain.subdomains.length} subdomains • {countTopics(domain)} topics
                  </small>
                </button>

                {isSelected ? (
                  <div className="domain-settings">
                    <label>
                      Skill level
                      <select
                        value={selected[domain._id].skillLevel}
                        onChange={(event) =>
                          updateSelection(domain._id, "skillLevel", event.target.value)
                        }
                      >
                        {levels.map((level) => (
                          <option key={level}>{level}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Goal
                      <textarea
                        rows="3"
                        value={selected[domain._id].goal}
                        onChange={(event) => updateSelection(domain._id, "goal", event.target.value)}
                      />
                    </label>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        {message ? <p className="muted status-message">{message}</p> : null}
      </section>
    </Layout>
  );
};

export default InterestsPage;
