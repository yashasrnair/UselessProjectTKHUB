// frontend/src/App.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import Header from "./components/header.jsx";
import UploadAndChat from "./components/UploadAndChat.jsx";
import Login from "./components/login.jsx";

function App() {
  const [userName, setUserName] = useState(() =>
    window.localStorage.getItem("userName") || ""
  );
  const [objectId, setObjectId] = useState(null);

  const isNewUser = useMemo(() => userName === "", [userName]);

  const logout = useCallback(() => {
    setUserName("");
    window.localStorage.removeItem("userName");
    window.sessionStorage.clear();
    setObjectId(null);
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

          <div className="py-12 px-4">
            <div className="max-w-4xl mx-auto">
              <UploadAndChat userName={userName} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
