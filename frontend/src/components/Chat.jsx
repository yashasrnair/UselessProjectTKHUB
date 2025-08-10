import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Chat({ objectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || !objectId) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/talk/${objectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { sender: "Object", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "Error", text: "No reply from object." },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "Error", text: "Failed to connect to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-6 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-lg shadow-cyan-500/20">
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm -z-10"></div>

      <div className="h-64 overflow-y-auto border border-cyan-500/20 rounded-lg p-3 mb-4 bg-slate-900/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "You"
                ? "text-cyan-400"
                : msg.sender === "Object"
                ? "text-purple-400"
                : "text-red-400"
            }`}
          >
            <strong>{msg.sender}: </strong>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          className="flex-1 px-3 py-2 rounded-lg bg-slate-900/60 border border-cyan-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-lg shadow-md shadow-cyan-500/30 transition-all duration-300"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
