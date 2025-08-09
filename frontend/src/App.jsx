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
        <div>
          Welcome {userName}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  )
}

export default App

