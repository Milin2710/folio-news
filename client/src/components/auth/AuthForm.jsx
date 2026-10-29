import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

// One form used by both the login and signup pages.
export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setFields({ ...fields, [field]: event.target.value });

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await (isSignup ? signup(fields) : login(fields));
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
      <p className="muted">
        {isSignup
          ? "Save articles, like stories and keep private notes."
          : "Log in to see your bookmarks and notes."}
      </p>

      <form onSubmit={handleSubmit} className="form">
        {isSignup && (
          <label>
            Name
            <input type="text" value={fields.name} onChange={update("name")} autoComplete="name" />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
            value={fields.email}
            onChange={update("email")}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={fields.password}
            onChange={update("password")}
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={isSignup ? 8 : undefined}
            required
          />
        </label>

        {error && <p className="form__error">{error}</p>}

        <button className="button button--block" disabled={submitting}>
          {submitting ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="muted auth-card__switch">
        {isSignup ? (
          <>Already have an account? <Link to="/login" state={location.state}>Log in</Link></>
        ) : (
          <>New here? <Link to="/signup" state={location.state}>Create an account</Link></>
        )}
      </p>
    </div>
  );
}
