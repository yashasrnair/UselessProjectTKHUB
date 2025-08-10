import { useState, useEffect } from "react";
import Header from "./components/header";
import Chat from "./components/chat";
import ImageUploader from "./components/image";

export default function App() {
  const [currentObjectId, setCurrentObjectId] = useState(null);
  const [view, setView] = useState("chats"); // chats | upload

  // Dark mode persistence
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header
        userName="User"
        onSubmit={() => console.log("Logout")}
        onNewChat={() => setView("upload")} // New Chat → Upload
      />

      <main className="p-4 max-w-5xl mx-auto">
        {view === "upload" && (
          <ImageUploader
            onUploadComplete={(id) => {
              setCurrentObjectId(id);
              setView("chats");
            }}
            onBack={() => setView("chats")}
          />
        )}

        {view === "chats" && currentObjectId && (
          <Chat objectId={currentObjectId} />
        )}

        {view === "chats" && !currentObjectId && (
          <div className="text-center text-gray-600 dark:text-gray-300">
            Click "New Chat" to start talking to an object.
          </div>
        )}
      </main>
    </div>
  );
}
