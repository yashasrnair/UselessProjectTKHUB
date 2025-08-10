// frontend/src/components/Chat.jsx
import { useEffect, useRef, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Chat({ objectId, onClose }) {
  const [objectMeta, setObjectMeta] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(null);
  const [tokensUsed, setTokensUsed] = useState(0);
  const messagesRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/objects/${objectId}`);
        if (!res.ok) throw new Error("Failed to load object");
        const data = await res.json();
        if (data.messages) setMessages(data.messages);
        setTokensUsed(data.tokensUsed || 0);
        setObjectMeta({ name: data.name, type: data.type, mood: data.mood });
      } catch (err) {
        console.error("Load object:", err);
      }
    };
    if (objectId) load();
  }, [objectId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // speech recognition (unchanged)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported in this browser.");
    const rec = new SpeechRecognition();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.onerror = (e) => console.error("Speech recognition error", e);
    rec.start();
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    if (voices.length) utter.voice = voices[0];
    utter.rate = 1;
    speechSynthesis.speak(utter);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    const userMsg = input;
    setInput("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/talk/${objectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { sender: "Error", text: data.error }]);
      } else {
        setMessages((prev) => [...prev, { sender: "Object", text: data.reply }]);
        setTokensUsed(data.tokensUsed || tokensUsed);
        setTokensLeft(data.tokensLeft);
        speakText(data.reply);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "Error", text: "Failed to connect to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const isExhausted = tokensLeft !== null && tokensLeft <= 0;

  return (
    <div>
      {/* header area for this chat */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onClose && onClose()}
            className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-800 text-sm"
          >
            ← Back
          </button>
          <div>
            <div className="text-lg font-semibold">{objectMeta?.name || objectMeta?.type || "Chat"}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{objectMeta?.mood}</div>
          </div>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          Tokens used: {tokensUsed} • Left: {tokensLeft === null ? "—" : tokensLeft}
        </div>
      </div>

      <div ref={messagesRef} className="h-[48vh] md:h-[56vh] overflow-y-auto bg-slate-50 dark:bg-slate-800 p-4 rounded mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.sender === "You" ? "text-cyan-700 dark:text-cyan-300" : m.sender === "Object" ? "text-slate-800 dark:text-purple-200" : "text-red-500"}`}>
            <strong className="mr-2">{m.sender}:</strong> <span className="whitespace-pre-wrap">{m.text}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={startListening} className="px-3 py-2 bg-cyan-500 text-white rounded">🎙️</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isExhausted || loading} className="flex-1 px-3 py-2 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder={isExhausted ? "Token quota exhausted" : "Say something..."} />
        <button onClick={sendMessage} disabled={isExhausted || loading} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded">{loading ? "..." : "Send"}</button>
      </div>

      {isExhausted && <div className="mt-3 text-red-400">Token quota exhausted. Create a new object or increase quota.</div>}
    </div>
  );
}
