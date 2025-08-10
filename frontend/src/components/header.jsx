// frontend/src/components/header.jsx
import React, { memo } from "react";
import { SunIcon, MoonIcon } from "./icons"; // we will add an inline icons object below (or you can paste them directly)

const menuRightItems = ["Logout"];

const MenuList = memo(function MenuList({ items, onLogoutClick }) {
  return (
    <ul className="flex space-x-4">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href="#"
            onClick={item === "Logout" ? onLogoutClick : undefined}
            className="px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
});

function ThemeToggle({ theme, setTheme }) {
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 hover:scale-105 transition"
    >
      {theme === "dark" ? <SunSvg /> : <MoonSvg />}
    </button>
  );
}

const Header = memo(function Header({ userName, onSubmit, theme, setTheme }) {
  const handleLogout = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <header className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold text-blue-600 dark:text-cyan-400">LostSoul</div>
          <nav className="hidden sm:block">
            <ul className="flex items-center space-x-4">
              <li className="text-sm text-slate-600 dark:text-slate-300">Chat · Upload · Memories</li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <div className="text-sm text-slate-600 dark:text-slate-300">Welcome, {userName}</div>
          <MenuList items={menuRightItems} onLogoutClick={handleLogout} />
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;

/* Small inline SVGs so you don't need external assets */
function SunSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5 5l-1.5-1.5M20.5 20.5L19 19M19 5l1.5-1.5M4.5 19.5L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}
function MoonSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
