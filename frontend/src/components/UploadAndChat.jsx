// frontend/src/components/UploadAndChat.jsx
import React, { useState } from "react";
import Chat from "./Chat.jsx";

export default function UploadAndChat({ userName }) {
  const [objectId, setObjectId] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("plant");
  const [loading, setLoading] = useState(false);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [pendingObjData, setPendingObjData] = useState(null);
  const [objName, setObjName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file!");
    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);
    formData.append("userName", userName || "");

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data._id) throw new Error("No object ID from server");
      // open name prompt
      setPendingObjData(data);
      setShowNamePrompt(true);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + err.message);
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
    } catch (err) {
      console.error("Name save failed:", err);
      alert("Failed to save name: " + err.message);
    }
  };

  if (objectId) {
    return <Chat objectId={objectId} />;
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 shadow-xl border border-cyan-500/20">
      <h2 className="text-2xl font-bold text-white mb-6">Upload an Object to Chat</h2>

      <div className="space-y-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 rounded bg-slate-800 text-white">
          <option value="plant">🌱 Plant</option>
          <option value="pet">🐾 Pet</option>
          <option value="gadget">⚡ Gadget</option>
        </select>

        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full text-white" />

        <button onClick={handleUpload} disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded">
          {loading ? "Uploading..." : "Upload & Chat"}
        </button>
      </div>

      {showNamePrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-slate-900/95 p-6 rounded-lg border border-cyan-500/30">
            <h3 className="text-lg font-bold mb-2 text-white">Name your object</h3>
            <input value={objName} onChange={(e) => setObjName(e.target.value)} placeholder="e.g. Pottery Pete" className="w-full px-3 py-2 rounded mb-3" />
            <div className="flex gap-2">
              <button onClick={saveNameAndEnterChat} className="px-4 py-2 bg-cyan-500 text-white rounded">Save & Chat</button>
              <button onClick={() => { setShowNamePrompt(false); setPendingObjData(null); }} className="px-4 py-2 bg-gray-600 text-white rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
