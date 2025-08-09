import React, { memo } from 'react';

const menuLeftItems = [''];
const menuRightItems = ['Logout'];

const MenuList = memo(function MenuList({ items,onLogoutClick }) {
  return (
    <ul className="flex space-x-4">
      {items.map((item, index) => (
        <li key={index}>
          <a
            href="#"
            onClick={item === 'Logout' ? onLogoutClick: undefined}
            className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  );
});

const Header = memo(function Header({ userName,onSubmit }) {
  const handleLogout=(e)=>{
    e.preventDefault();
    onSubmit();
  }

  return (
    <header className="w-full px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <h1 className="text-xl font-bold text-gray-900">App</h1>
          <MenuList items={menuLeftItems} />
        </div>
        
        <div className="flex items-center space-x-6">
          <MenuList items={menuRightItems} onLogoutClick={handleLogout}/>
          <span className="text-sm text-gray-600">Welcome, {userName}</span>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;

