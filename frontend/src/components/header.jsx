import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ userName, onLogout }) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid var(--accent-color)",
        backgroundColor: "inherit",
        color: "inherit",
      }}
    >
      <h1 style={{ margin: 0 }}>Chat a LostSoul XD</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.4rem",
            cursor: "pointer",
            color: "inherit",
          }}
          title="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <span>Welcome, {userName || "User"}</span>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "var(--accent-color)",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
