import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ImageUploader({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("plant");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setStatus("Please select a file first");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("type", type);

      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (data._id) {
        setStatus("✅ Upload successful!");
        if (onUploadComplete) {
          onUploadComplete(data._id);
        }
      } else {
        setStatus("❌ Upload failed. No ID returned.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("🚨 Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-md mx-auto bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-lg shadow-cyan-500/20">
      {/* Glowing overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm -z-10"></div>

      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 text-center">
        Upload an Object
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full text-cyan-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-purple-500 file:text-white file:cursor-pointer mb-4"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full bg-slate-900/60 border border-cyan-500/30 text-white px-3 py-2 rounded-lg mb-4"
      >
        <option value="plant">🌱 Plant</option>
        <option value="pet">🐾 Pet</option>
        <option value="object">⚡ Object</option>
      </select>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold py-3 rounded-lg shadow-md shadow-cyan-500/30 transition-all duration-300"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {status && (
        <p className="mt-3 text-center text-sm text-cyan-300">{status}</p>
      )}
    </div>
  );
}
