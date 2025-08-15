import React, { useState } from "react";
import Chat from "./Chat.jsx";

export default function UploadAndChat({ userName, onBack, onCreate, onError }) {
  const [objectId, setObjectId] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("plant");
  const [loading, setLoading] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingObjData, setPendingObjData] = useState(null);
  const [objName, setObjName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleUpload = async () => {
    if (!file) return onError("Please choose a file!");
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);
    formData.append("userName", userName || "");

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Upload failed: HTTP ${res.status}`);
      const data = await res.json();
      if (!data._id) throw new Error("No object ID from server");
      setPendingObjData(data);
      setShowNamePrompt(true);
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveNameAndEnterChat = async () => {
    if (!pendingObjData) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/${pendingObjData._id}/name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: objName || "Unnamed", owner: userName || null }),
      });
      if (!res.ok) throw new Error("Failed to set name");
      setObjectId(pendingObjData._id);
      setShowNamePrompt(false);
      if (onCreate) onCreate(pendingObjData._id);
    } catch (err) {
      onError(err.message);
    }
  };

  if (objectId) {
    return <Chat objectId={objectId} onError={onError} />;
  }

  return (
    <div className="rounded-xl p-6 shadow border fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Upload & Create Chat</h3>
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1 rounded hover:opacity-90 transition"
          >
            ← Back
          </button>
        )}
      </div>

      <div className="space-y-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-4 py-2 rounded border transition"
        >
          <option value="plant">🌱 Plant</option>
          <option value="pet">🐾 Pet</option>
          <option value="gadget">⚡ Gadget</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:hover:opacity-90 transition"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full px-4 py-3 rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Uploading..." : "Upload & Chat"}
        </button>
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 fade-in">
          <div className="modal p-6 rounded-lg border w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Name your object</h3>
            <input
              value={objName}
              onChange={(e) => setObjName(e.target.value)}
              placeholder="e.g. Pottery Pete"
              className="w-full px-3 py-2 rounded mb-3 border transition"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={saveNameAndEnterChat}
                className="px-4 py-2 rounded hover:opacity-90 transition"
              >
                Save & Chat
              </button>
              <button
                onClick={() => { setShowNamePrompt(false); setPendingObjData(null); }}
                className="px-4 py-2 rounded hover:opacity-90 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
