// Added newChat handler & fixed dark mode persistence
import React, { memo, useEffect, useState } from "react";

const Header = memo(function Header({ userName, onSubmit, onNewChat }) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setDarkMode(theme === "dark");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Chat a LostSoul XD
        </h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={onNewChat}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            New Chat
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>

          <button
            onClick={onSubmit}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
});

export default Header;
