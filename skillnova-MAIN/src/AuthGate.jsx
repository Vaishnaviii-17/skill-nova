// src/AuthGate.jsx
import { getSession, clearSession } from "./shared/utils/session";

import UserApp from "./user/App";
import AdminApp from "./admin/App";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";
import AdminOTP from "./auth/pages/AdminOTP";
import User2FA from "./auth/pages/User2FA";

const AuthGate = () => {
  const session = getSession();
  const path = window.location.pathname;

  const handleLogout = () => {
    clearSession();
    window.location.reload();
  };

  // 🔓 Allow signup page without session
  if (!session && path === "/signup") {
    return <Signup />;
  }

  // 🔒 Not logged in → Login
  if (!session) {
    return <Login />;
  }

  // 🔐 OTP not verified → force verification
  if (!session.isOtpVerified) {
    if (session.user.role === "admin") {
      return <AdminOTP />;
    } else {
      return <User2FA />;
    }
  }

  // ✅ Authenticated → role-based app
  if (session.user.role === "admin") {
    return <AdminApp onLogout={handleLogout} />;
  }

  if (session.user.role === "intern") {
    return <UserApp onLogout={handleLogout} />;
  }

  // fallback
  return <Login />;
};

export default AuthGate;