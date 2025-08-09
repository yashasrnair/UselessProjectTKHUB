import React, { useState } from "react";
import Chat from "./Chat";

export default function UploadAndChat() {
  const [objectId, setObjectId] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("plant");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file!");
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setObjectId(data._id); // Set the chat to open
    } catch (err) {
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  if (objectId) {
    return <Chat objectId={objectId} />;
  }

  return (
    <div style={styles.container}>
      <h2>Upload an Object to Chat</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="plant">Plant</option>
        <option value="pet">Pet</option>
        <option value="gadget">Gadget</option>
      </select>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Chat"}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    maxWidth: "300px",
  },
};
