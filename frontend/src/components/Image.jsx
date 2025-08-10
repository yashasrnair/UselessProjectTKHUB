import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ImageUploader({ onUploadComplete, onBack }) {
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

      if (data._id) {
        setStatus("Upload successful! 🎉");
        onUploadComplete && onUploadComplete(data._id);
      } else {
        setStatus("Upload failed. No ID returned.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded shadow">
      <button
        onClick={onBack}
        className="self-start px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        ← Back
      </button>

      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Upload an Object
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
      >
        <option value="plant">Plant</option>
        <option value="pet">Pet</option>
        <option value="object">Object</option>
      </select>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {status && <p className="text-sm">{status}</p>}
    </div>
  );
}
