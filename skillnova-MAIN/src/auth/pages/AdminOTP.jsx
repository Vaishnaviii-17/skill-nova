import { useState, useRef, useEffect } from "react";
import "./auth.css";
import { getSession, saveSession, clearSession } from "../../shared/utils/session";

const AdminOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      verifyOTP(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const verifyOTP = async (otpString) => {
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
          otp: otpString,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
        setLoading(false);
        return;
      }

      // ✅ OTP verified → update session
      const updatedSession = {
        ...session,
        isOtpVerified: true,
      };

      saveSession(updatedSession);

      // 🔥 Re-evaluate AuthGate → go to dashboard
      window.location.reload();

    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyOTP(otp.join(""));
  };

  const handleCancel = () => {
    clearSession();
    window.location.reload();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Admin Verification</h2>
        <p className="auth-subtitle">
          Enter the 6-digit OTP sent to your registered admin email (
          {session?.user?.email})
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="otp-input"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            className="auth-button auth-secondary-btn"
            onClick={handleCancel}
          >
            Cancel Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminOTP;