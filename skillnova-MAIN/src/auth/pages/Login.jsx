import { useState } from "react";
import "./auth.css";
import { saveSession } from "../../shared/utils/session";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ✅ Handle HTTP errors
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Handle backend logical failure
      if (!data.success) {
        setError(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // ✅ Save session
      const sessionData = {
        user: data.user,
        token: data.token || null,
        isOtpVerified: false,
      };

      saveSession(sessionData);

      // 🔥 Redirect via AuthGate
      window.location.reload();

    } catch (err) {
      console.error("🔥 FRONTEND LOGIN ERROR:", err);
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to your SkillNova account to continue.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              className="auth-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <span className="auth-error">{error}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#9ca3af",
            marginTop: "16px",
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              color: "#ff6d34",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => (window.location.href = "/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;