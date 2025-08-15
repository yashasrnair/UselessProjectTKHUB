import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Chat({ objectId, onClose, onError }) {
  const [object, setObject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesis = window.speechSynthesis;

  const fetchObject = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/objects/${objectId}`);
      if (!res.ok) throw new Error("Failed to fetch object");
      const data = await res.json();
      setObject(data);
      setMessages(data.messages || []);
      setTokensLeft(data.tokensLeft || 10000 - (data.tokensUsed || 0)); // Initial estimate
    } catch (err) {
      onError(err.message);
    }
  };

  useEffect(() => {
    fetchObject();
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend({ preventDefault: () => {} }); // Auto send
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = (err) => onError("Speech recognition error: " + err.message);
    }
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
      if (!res.ok) throw new Error("Failed to send message");
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: "User", text: input },
          { sender: "Object", text: data.reply },
        ]);
        setTokensLeft(data.tokensLeft);
        setInput("");
        // Auto speak the reply
        speakReply(data.reply);
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const speakReply = (text) => {
    if (synthesis.speaking) synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (err) => onError("Speech synthesis error: " + err.message);
    synthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[70vh] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Chat with {object?.name || object?.type}
        </h3>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded hover:opacity-90 transition"
        >
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-lg border smooth-scroll">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] fade-in ${
              msg.sender === "User"
                ? "ml-auto bg-accent-color/20 text-text-color"
                : "bg-card-bg text-text-color"
            } transition-colors duration-200`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-2 text-sm">
        Tokens left: {tokensLeft !== null ? tokensLeft : 'Calculating...'}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded border focus:outline-none focus:ring-2 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? "Sending..." : "Send"}
        </button>
        <button
          type="button"
          onClick={toggleListening}
          className={`px-4 py-2 rounded transition ${isListening ? 'bg-red-500' : ''}`}
        >
          {isListening ? "Stop Listening" : "Voice Input"}
        </button>
        <button
          type="button"
          onClick={() => speakReply(messages[messages.length - 1]?.text || '')}
          disabled={isSpeaking || !messages.length}
          className="px-4 py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
        >
          {isSpeaking ? "Speaking..." : "Speak Last Reply"}
        </button>
      </form>
    </div>
  );
}
