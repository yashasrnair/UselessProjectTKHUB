import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Login from './components/login.jsx';

function App() {
  const [userName, setUserName] = useState("");
  const [newUser, setNewUser] = useState(true);

  const logout = useCallback(() => {
    setNewUser(true);
    setUserName("");
    window.localStorage.clear();
    window.sessionStorage.clear();
  }, []);

  const handleUserName = useCallback((name) => {
    setUserName(name);
    setNewUser(false);
    window.localStorage.setItem('userName', name);
  }, []);

  useEffect(() => {
    const savedName = window.localStorage.getItem('userName');
    if (savedName) {
      setNewUser(false);
      setUserName(savedName);
    }
  }, []);

  return (
    <>
      {newUser ? (
        <Login onSubmit={handleUserName} />
      ) : (
        <div className="flex flex-col items-center gap-4 p-6 max-w-md mx-auto">
          <div className="text-lg font-medium text-white-800">
            Welcome {userName}
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </>
  )
}

export default App

