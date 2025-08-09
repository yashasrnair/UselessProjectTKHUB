import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

import Header from "./components/header.jsx";
import ImageUploader from "./components/Image.jsx";
import Login from "./components/login.jsx";
import Chat from "./components/Chat.jsx";

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

          {/* Image uploader will give us the objectId after successful upload */}
          <ImageUploader
            onUploadComplete={(id) => {
              console.log("Uploaded Object ID:", id);
              setObjectId(id);
            }}
          />

          {/* Only show chat if we have an object ID */}
          {objectId && (
            <div className="mt-40 flex justify-center items-center h-48 rounded-lg">
              <Chat objectId={objectId} />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
