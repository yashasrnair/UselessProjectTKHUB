import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/header.jsx";
import UploadAndChat from "./components/UploadAndChat.jsx";
import Login from "./components/login.jsx";
import Dashboard from "./components/Dashboard.jsx";

function App() {
  const [userName, setUserName] = useState(() =>
    window.localStorage.getItem("userName") || ""
  );
  const [activeObjectId, setActiveObjectId] = useState(null);
  const [theme, setTheme] = useState(() => {
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) return storedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  });

  const isNewUser = useMemo(() => userName === "", [userName]);

  const logout = useCallback(() => {
    setUserName("");
    window.localStorage.removeItem("userName");
    window.sessionStorage.clear();
    setActiveObjectId(null);
  }, []);

  const handleUserName = useCallback((name) => {
    setUserName(name);
    window.localStorage.setItem("userName", name);
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "userName") {
        setUserName(e.newValue || "");
      }
      if (e.key === "theme") {
        setTheme(e.newValue || "light");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  if (isNewUser) {
    return <Login onSubmit={handleUserName} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header
        userName={userName}
        onSubmit={logout}
        theme={theme}
        setTheme={setTheme}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard
          userName={userName}
          activeObjectId={activeObjectId}
          setActiveObjectId={setActiveObjectId}
          onCreateNew={(newId) => setActiveObjectId(newId)}
        />
      </main>
    </div>
  );
}

export default App;
