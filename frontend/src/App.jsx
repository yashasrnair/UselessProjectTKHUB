import { useCallback, useEffect, useMemo, useState } from 'react';

import './App.css';

import Header from './components/header.jsx';
import ImageUploader from './components/Image.jsx';
import Login from './components/login.jsx';

function App() {
  const [userName, setUserName] = useState(() =>
    window.localStorage.getItem('userName') || ''
  );

  const isNewUser = useMemo(() => userName === '', [userName]);

  const logout = useCallback(() => {
    setUserName('');
    window.localStorage.removeItem('userName');
    window.sessionStorage.clear();
  }, []);

  const handleUserName = useCallback((name) => {
    setUserName(name);
    window.localStorage.setItem('userName', name);
  }, []);

  useEffect(() => {
    // Sync across tabs
    const onStorage = (e) => {
      if (e.key === 'userName') {
        setUserName(e.newValue || '');
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      {isNewUser ? (
        <>
          <Login onSubmit={handleUserName} />
        </>
      ) : (
        <>
          <Header userName={userName} />
          <ImageUploader />
          <button
            onClick={logout}
            className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </>
      )}
    </>
  );
}

export default App;

