import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSummary } from "../../api/articles.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function SummaryBox({ articleId, initialSummary }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(initialSummary || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!user) return navigate("/login", { state: { from: `/article/${articleId}` } });
    setLoading(true);
    setError("");
    try {
      const result = await getSummary(articleId);
      setSummary(result.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // The server sends bullets as lines starting with "- "
  const bullets = summary
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  return (
    <section className="panel">
      <div className="panel__header">
        <h2><Sparkles size={18} /> AI summary</h2>
        {!summary && (
          <button className="button button--small" onClick={generate} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        )}
      </div>

      {error && <p className="form__error">{error}</p>}
      {bullets.length > 0 ? (
        <ul className="summary-list">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      ) : (
        !error && <p className="muted">Get the key points of this story in a few lines.</p>
      )}
    </section>
  );
}
