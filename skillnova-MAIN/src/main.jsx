// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AuthGate from "./AuthGate";
import "./index.css";

// ✅ Apply saved theme before render (prevents flicker)
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthGate />
  </React.StrictMode>
);