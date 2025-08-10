// frontend/src/components/Chat.jsx
import { useEffect, useRef, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Chat({ objectId }) {
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
      } catch (err) {
        console.error("Load object:", err);
      }
    };
    load();
  }, [objectId]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // speech recognition
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
    setMessages(prev => [...prev, { sender: "You", text: input }]);
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
        setMessages(prev => [...prev, { sender: "Error", text: data.error }]);
      } else {
        setMessages(prev => [...prev, { sender: "Object", text: data.reply }]);
        setTokensUsed(data.tokensUsed || tokensUsed);
        setTokensLeft(data.tokensLeft);
        speakText(data.reply);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { sender: "Error", text: "Failed to connect to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const isExhausted = tokensLeft !== null && tokensLeft <= 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-800/60 rounded-lg border border-cyan-500/20">
      <div className="flex justify-between mb-4 text-sm text-cyan-200">
        <div>Tokens used: {tokensUsed}</div>
        <div>Tokens left: {tokensLeft === null ? "—" : tokensLeft}</div>
      </div>

      <div ref={messagesRef} className="h-64 overflow-y-auto bg-slate-900/40 p-3 rounded mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.sender === "You" ? "text-cyan-300" : m.sender === "Object" ? "text-purple-300" : "text-red-300"}`}>
            <strong>{m.sender}: </strong>{m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={startListening} className="px-3 py-2 bg-cyan-500 text-white rounded">🎙️</button>
        <input value={input} onChange={(e) => setInput(e.target.value)} disabled={isExhausted || loading} className="flex-1 px-3 py-2 rounded bg-slate-900/60 text-white" placeholder={isExhausted ? "Token quota exhausted" : "Say something..."} />
        <button onClick={sendMessage} disabled={isExhausted || loading} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded">{loading ? "..." : "Send"}</button>
      </div>

      {isExhausted && <div className="mt-3 text-red-400">Token quota exhausted. Create a new object or increase quota.</div>}
    </div>
  );
}
