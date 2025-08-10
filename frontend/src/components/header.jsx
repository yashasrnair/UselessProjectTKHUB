import React, { memo } from 'react';

const menuLeftItems = [''];
const menuRightItems = ['Logout'];

const MenuList = memo(function MenuList({ items, onLogoutClick }) {
  return (
    <ul className="flex space-x-4">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href="#"
            onClick={item === 'Logout' ? onLogoutClick : undefined}
            className="px-4 py-2 text-cyan-200 hover:text-white bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-cyan-500/30 transition-all duration-300 shadow-cyan-500/20 shadow-md"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
});

const Header = memo(function Header({ userName, onSubmit }) {
  const handleLogout = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <header className="w-full px-6 py-4 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20 backdrop-blur-xl">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-lg">
            Chat a LostSoul XD
          </h1>
          <MenuList items={menuLeftItems} />
        </div>

        <div className="flex items-center space-x-6">
          <MenuList items={menuRightItems} onLogoutClick={handleLogout} />
          <span className="text-sm text-cyan-200">Welcome, {userName}</span>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
export default Header;
