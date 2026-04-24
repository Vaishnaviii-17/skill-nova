import { useState, useRef, useEffect } from "react";
import "./auth.css";
import { getSession, saveSession, clearSession } from "../../shared/utils/session";

const User2FA = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const session = getSession();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every((digit) => digit !== "")) {
      verify2FA(newCode.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verify2FA = async (codeString) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
          otp: codeString,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid code");
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
        setLoading(false);
        return;
      }

      // ✅ Verified → update session
      const updatedSession = {
        ...session,
        isOtpVerified: true,
      };

      saveSession(updatedSession);

      // 🔥 AuthGate will redirect to dashboard
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verify2FA(code.join(""));
  };

  const handleCancel = () => {
    clearSession();
    window.location.reload();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Two-Factor Authentication</h2>
        <p className="auth-subtitle">
          Enter the 6-digit code sent to your account for{" "}
          {session?.user?.email}.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            {code.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="otp-input"
                style={{ borderRadius: "8px" }}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                required
              />
            ))}
          </div>

          {error && (
            <div
              className="auth-error"
              style={{ textAlign: "center", marginBottom: "16px" }}
            >
              {error}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <button
            type="button"
            className="auth-button auth-secondary-btn"
            onClick={handleCancel}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default User2FA;