import { useState } from "react";

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
      const res = await fetch(
        `http://localhost:3000/api/objects/talk/${objectId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

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
    <div className="w-full max-w-md bg-white p-4 rounded shadow">
      <div className="h-64 overflow-y-auto border p-2 rounded mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${
              msg.sender === "You" ? "text-blue-500" : "text-green-500"
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
          className="flex-1 border px-2 py-1 rounded"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
