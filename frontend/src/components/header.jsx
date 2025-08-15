import React, { memo, useEffect } from "react";

const menuRightItems = ["Logout"];

const MenuList = memo(function MenuList({ items, onLogoutClick }) {
  return (
    <ul className="flex space-x-4">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href="#"
            onClick={item === "Logout" ? onLogoutClick : undefined}
            className="px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:bg-gray-100 dark:hover:text-blue-400 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
});

const Header = memo(function Header({ userName, onSubmit, theme, setTheme }) {
  const handleLogout = (e) => {
    e.preventDefault();
    onSubmit();
  };

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Chat a LostSoul XD
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {theme === "dark" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4.95 2.05a1 1 0 010 1.414l-1.42 1.42a1 1 0 11-1.414-1.415l1.42-1.419a1 1 0 011.414 0zM17 9a1 1 0 110 2h-2a1 1 0 110-2h2zM4.05 4.05a1 1 0 000 1.414L5.47 6.88a1 1 0 001.415-1.415L5.464 4.05a1 1 0 00-1.414 0zM3 9a1 1 0 000 2H1a1 1 0 000-2h2zm1.05 6.95a1 1 0 011.414 0l1.42 1.42a1 1 0 01-1.415 1.414l-1.419-1.42a1 1 0 010-1.414zM10 15a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zm6.95-1.05a1 1 0 000 1.414l1.42 1.42a1 1 0 11-1.415 1.414l-1.419-1.42a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M17.293 13.293A8 8 0 016.707 2.707 8.003 8.003 0 0010 18a8.003 8.003 0 007.293-4.707z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <MenuList items={menuRightItems} onLogoutClick={handleLogout} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Welcome, {userName}
          </span>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
