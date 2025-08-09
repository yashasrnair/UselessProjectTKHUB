import { useEffect, useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('http://localhost:5000/messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // refresh every 3s
    return () => clearInterval(interval);
  }, []);

  // Send message to backend
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      await fetch('http://localhost:5000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      setInput('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="w-full max-w-md p-4 border rounded">
      <div className="h-64 mb-4 p-2 overflow-y-auto border bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">{msg.user || 'User'}:</span>{' '}
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}

