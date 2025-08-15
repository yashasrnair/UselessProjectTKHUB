import { useEffect, useState } from "react";
import UploadAndChat from "./UploadAndChat.jsx";
import Chat from "./Chat.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Dashboard({ userName, activeObjectId, setActiveObjectId, onCreateNew, onError }) {
  const [panelMode, setPanelMode] = useState("recent");
  const [objectList, setObjectList] = useState([]);
  const [selectedObject, setSelectedObject] = useState(activeObjectId);

  const fetchList = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/owner/${userName}`);
      if (!res.ok) throw new Error("Failed to fetch objects");
      const data = await res.json();
      setObjectList(data);
      if (activeObjectId && !data.find((o) => o._id === activeObjectId)) {
        setSelectedObject(null);
        setActiveObjectId(null);
        setPanelMode("recent");
      }
    } catch (err) {
      onError(err.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, [userName]);

  useEffect(() => {
    if (activeObjectId) {
      setSelectedObject(activeObjectId);
      setPanelMode("chat");
    }
  }, [activeObjectId]);

  const handleUploadFlow = () => {
    setPanelMode("upload");
    setSelectedObject(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[80vh] transition-all duration-300">
      <aside className="md:col-span-1 sidebar rounded-xl p-6 shadow overflow-y-auto max-h-[80vh]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Objects</h3>
          <button
            onClick={handleUploadFlow}
            className="px-3 py-1 rounded hover:opacity-90 transition"
          >
            New Object
          </button>
        </div>
        <ul className="space-y-2">
          {objectList.map((obj) => (
            <li
              key={obj._id}
              onClick={() => {
                setSelectedObject(obj._id);
                setPanelMode("chat");
                setActiveObjectId(obj._id);
              }}
              className={`p-3 rounded cursor-pointer transition-colors ${
                selectedObject === obj._id
                  ? "bg-accent-color/20 text-accent-color"
                  : "hover:bg-border-color"
              }`}
            >
              <div className="flex items-center gap-3">
                {obj.imageUrl && (
                  <img
                    src={`${API_BASE_URL}/${obj.imageUrl}`}
                    alt={obj.name || obj.type}
                    className="w-10 h-10 rounded object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{obj.name || obj.type}</p>
                  <p className="text-sm truncate">
                    {obj.lastMessage || obj.mood || "No messages yet"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section className="md:col-span-3">
        {panelMode === "upload" && (
          <div className="fade-in card-bg rounded-xl p-6 shadow border">
            <UploadAndChat
              userName={userName}
              onBack={() => setPanelMode("recent")}
              onCreate={(newId) => {
                fetchList();
                setSelectedObject(newId);
                setPanelMode("chat");
                setActiveObjectId(newId);
                onCreateNew(newId);
              }}
              onError={onError}
            />
          </div>
        )}

        {panelMode === "chat" && selectedObject && (
          <div className="fade-in card-bg rounded-xl p-6 shadow border">
            <Chat
              objectId={selectedObject}
              onClose={() => {
                setPanelMode("recent");
                setSelectedObject(null);
                setActiveObjectId(null);
                fetchList();
              }}
              onError={onError}
            />
          </div>
        )}

        {panelMode === "recent" && !selectedObject && (
          <div className="fade-in card-bg rounded-xl p-8 h-full shadow border flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {userName} 👋</h2>
            <p className="max-w-xl text-center">
              Select a past chat to continue, or click below to upload an object and start chatting.
            </p>
            <div className="mt-6">
              <button
                onClick={handleUploadFlow}
                className="px-4 py-2 rounded hover:opacity-90 transition"
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
