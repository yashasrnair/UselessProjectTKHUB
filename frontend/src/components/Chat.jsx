import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Chat({ objectId, onClose }) {
  const [object, setObject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchObject = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/${objectId}`);
      const data = await res.json();
      setObject(data);
      setMessages(data.messages || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchObject();
  }, [objectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/talk/${objectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: "User", text: input },
          { sender: "Object", text: data.reply },
        ]);
        setInput("");
      }
    } catch (err) {
      console.error("Send error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat with {object?.name || object?.type}
        </h3>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 smooth-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] fade-in ${
              msg.sender === "User"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 ml-auto"
                : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            } transition-colors duration-200`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
