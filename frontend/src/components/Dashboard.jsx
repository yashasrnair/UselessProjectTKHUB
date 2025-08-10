// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Chat from "./Chat.jsx";
import UploadAndChat from "./UploadAndChat.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Dashboard({ userName, activeObjectId, setActiveObjectId, onCreateNew }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [panelMode, setPanelMode] = useState("recent"); // recent | upload | chat
  const [selectedObject, setSelectedObject] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/owner/${encodeURIComponent(userName)}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      data.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      setItems(data);
    } catch (err) {
      console.error("Failed load items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    const t = setInterval(fetchList, 45000);
    return () => clearInterval(t);
  }, [userName]);

  useEffect(() => {
    if (activeObjectId) {
      setPanelMode("chat");
      setSelectedObject(activeObjectId);
    }
  }, [activeObjectId]);

  const openChat = (id) => {
    setSelectedObject(id);
    setPanelMode("chat");
    setActiveObjectId(id);
  };

  const handleUploadFlow = () => {
    setPanelMode("upload");
    setSelectedObject(null);
    setActiveObjectId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column */}
      <aside className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Chats</h3>
          <button
            onClick={handleUploadFlow}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            New Chat
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
          {loading && <div className="text-sm text-slate-500">Loading…</div>}

          {!loading && items.length === 0 && (
            <div className="text-sm text-slate-500">No chats yet — click New Chat above.</div>
          )}

          {items.map((it) => (
            <div
              key={it._id}
              onClick={() => openChat(it._id)}
              className={`cursor-pointer p-3 rounded-lg transition border ${
                selectedObject === it._id
                  ? "border-blue-500 shadow-md"
                  : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              } bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{it.name || (it.type || "Object")}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {it.type} • {it.mood ? it.mood.slice(0, 80) : "No mood"}
                  </div>
                </div>
                <div className="text-xs text-slate-400">
                  {it.lastUpdated ? new Date(it.lastUpdated).toLocaleString() : ""}
                </div>
              </div>
              {it.lastMessage && (
                <div className="text-sm mt-2 text-slate-600 dark:text-slate-300">
                  {it.lastMessage.slice(0, 120)}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Right column */}
      <section className="lg:col-span-2">
        {panelMode === "upload" && (
          <UploadAndChat
            userName={userName}
            onBack={() => setPanelMode("recent")}
            onCreate={(newId) => {
              fetchList();
              setSelectedObject(newId);
              setPanelMode("chat");
              setActiveObjectId(newId);
            }}
          />
        )}

        {panelMode === "chat" && selectedObject && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow border border-slate-200 dark:border-slate-800">
            <Chat
              objectId={selectedObject}
              onClose={() => {
                setPanelMode("recent");
                setSelectedObject(null);
                setActiveObjectId(null);
                fetchList();
              }}
            />
          </div>
        )}

        {panelMode === "recent" && !selectedObject && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 h-full shadow border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userName} 👋</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl text-center">
              Select a past chat to continue, or click below to upload an object and start chatting.
            </p>
            <div className="mt-6">
              <button
                onClick={handleUploadFlow}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Upload & Chat
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
