import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import Header from "./components/header.jsx";
import Login from "./components/login.jsx";
import UploadAndChat from "./components/UploadAndChat.jsx";

function App() {
  const [userName, setUserName] = useState(() =>
    window.localStorage.getItem("userName") || ""
  );

  const isNewUser = useMemo(() => userName === "", [userName]);

  const logout = useCallback(() => {
    setUserName("");
    window.localStorage.removeItem("userName");
    window.sessionStorage.clear();
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
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <>
      {isNewUser ? (
        <Login onSubmit={handleUserName} />
      ) : (
        <>
          <Header userName={userName} onSubmit={logout} />
          <div className="mt-10 flex justify-center">
            <UploadAndChat />
          </div>
        </>
      )}
    </>
  );
}

export default App;
