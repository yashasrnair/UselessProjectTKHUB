import { useState } from "react";

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

      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      if (data._id) {
        setStatus("Upload successful! 🎉");
        if (onUploadComplete) {
          onUploadComplete(data._id);
        }
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
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
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
      {status && <p>{status}</p>}
    </div>
  );
}
