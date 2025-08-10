import React, { useState } from "react";
import Chat from "./Chat";

export default function UploadAndChat() {
  const [objectId, setObjectId] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("plant");
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";


  const handleUpload = async () => {
    if (!file) return alert("Please choose a file!");
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Upload response received:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data._id) {
        throw new Error("No object ID received from server");
      }
      
      console.log("✅ Setting objectId:", data._id);
      setObjectId(data._id); // Set the chat to open
    } catch (err) {
      console.error("Upload error:", err);
      alert(`Upload failed: ${err.message}`);
    }

    setLoading(false);
  };

  if (objectId) {
    return <Chat objectId={objectId} />;
  }

  return (
    <div className="relative max-w-md mx-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl shadow-cyan-500/20">
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm -z-10"></div>
      
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8 text-center tracking-wide">
        Upload an Object to Chat
      </h2>
      
      <div className="space-y-6">
        <div className="relative">
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-slate-800/50 border border-cyan-500/40 rounded-xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer hover:bg-slate-700/50"
          >
            <option value="plant" className="bg-slate-800 text-cyan-100">🌱 Plant</option>
            <option value="pet" className="bg-slate-800 text-cyan-100">🐾 Pet</option>
            <option value="gadget" className="bg-slate-800 text-cyan-100">⚡ Gadget</option>
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full bg-slate-800/50 border border-cyan-500/40 rounded-xl px-4 py-3 text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all duration-300 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-purple-500 file:text-white file:font-medium hover:file:from-cyan-400 hover:file:to-purple-400 file:cursor-pointer"
          />
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={loading}
          className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
        >
          <span className="relative z-10">
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload & Chat"
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}
