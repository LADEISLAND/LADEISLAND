import React, { useState } from 'react';
import './ChatPanel.css';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;
    const outbound = input;
    setMessages((prev) => [...prev, { role: 'player', text: outbound }]);
    setInput('');
    setIsSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: outbound }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply ?? 'No reply' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Error contacting backend.' }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="chat-panel">
      <div className="messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`msg ${m.role}`}>{m.text}</div>
        ))}
      </div>
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}