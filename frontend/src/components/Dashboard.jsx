// frontend/src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Chat from "./Chat.jsx";
import UploadAndChat from "./UploadAndChat.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Dashboard layout:
 * - left: list of user's previous chats (cards)
 * - right: active panel (Chat for selected, or UploadAndChat to create/upload)
 *
 * Full width on desktop, stacked on small screens.
 */
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
      // sort by lastUpdated desc
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
    // refresh list periodically
    const t = setInterval(fetchList, 45_000);
    return () => clearInterval(t);
  }, [userName]);

  // when parent asks to open an id (e.g. after create)
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

  const handleCreateNew = async (type = "object") => {
    // call backend POST /api/objects to create an empty object/chat
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, owner: userName }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // add to list and open chat
      await fetchList();
      if (data._id) {
        setSelectedObject(data._id);
        setPanelMode("chat");
        setActiveObjectId(data._id);
        if (onCreateNew) onCreateNew(data._id);
      }
    } catch (err) {
      console.error("Create chat error:", err);
      alert("Failed to create new chat: " + err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: list */}
      <aside className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-xl p-4 shadow border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Chats</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleCreateNew("object")}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              New Chat
            </button>
            <button
              onClick={() => setPanelMode("upload")}
              title="Upload & create"
              className="px-2 py-1 text-sm border rounded text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
          {loading && <div className="text-sm text-slate-500">Loading…</div>}

          {!loading && items.length === 0 && (
            <div className="text-sm text-slate-500">You have no chats yet — create one.</div>
          )}

          {items.map((it) => (
            <div
              key={it._id}
              onClick={() => openChat(it._id)}
              className={`cursor-pointer p-3 rounded-lg transition border ${
                selectedObject === it._id ? "border-blue-500 shadow-md" : "border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              } bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{it.name || (it.type || "Object")}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{it.type} • {it.mood ? it.mood.slice(0, 80) : "No mood"}</div>
                </div>
                <div className="text-xs text-slate-400">{it.lastUpdated ? new Date(it.lastUpdated).toLocaleString() : ""}</div>
              </div>
              {it.lastMessage && <div className="text-sm mt-2 text-slate-600 dark:text-slate-300">{it.lastMessage.slice(0, 120)}</div>}
            </div>
          ))}
        </div>
      </aside>

      {/* Right column: main panel (Upload or Chat) */}
      <section className="lg:col-span-2">
        {panelMode === "upload" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold mb-4">Upload & Create</h3>
            <UploadAndChat
              userName={userName}
              // when upload completes, backend returns created id and UploadAndChat triggers name & then chat
              onCreate={(newId) => {
                fetchList();
                setSelectedObject(newId);
                setPanelMode("chat");
                setActiveObjectId(newId);
              }}
            />
          </div>
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
              Select one of your past chats to continue, or create a new chat / upload an object to start a conversation.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => handleCreateNew("object")} className="px-4 py-2 bg-blue-600 text-white rounded">Create New Chat</button>
              <button onClick={() => setPanelMode("upload")} className="px-4 py-2 border rounded border-slate-200 dark:border-slate-700">Upload & Chat</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
