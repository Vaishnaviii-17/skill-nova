import { useState } from "react";
import "./auth.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "intern",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { name, email, password, role } = form;

    if (!name || !email || !password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      // ✅ Success message
      setSuccess("Account created successfully! Please login.");

      // 🔁 Redirect to login after short delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (err) {
      setError("Server error. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Sign up to get started with SkillNova.
        </p>

        <div className="auth-form-group">
  <label className="auth-label">Full Name</label>
  <input
    type="text"
    name="name"
    className="auth-input"
    placeholder="Enter your name"
    value={form.name}
    onChange={handleChange}
    required
  />
</div>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Select Role</label>
            <select
              name="role"
              className="auth-input"
              value={form.role}
              onChange={handleChange}
            >
              <option value="intern">Intern</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <span className="auth-error">{error}</span>}
          {success && (
            <span style={{ color: "green", display: "block", marginBottom: "10px" }}>
              {success}
            </span>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
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
          Already have an account?{" "}
          <span
            style={{
              color: "#ff6d34",
              cursor: "pointer",
              fontWeight: "600",
            }}
            onClick={() => (window.location.href = "/")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;