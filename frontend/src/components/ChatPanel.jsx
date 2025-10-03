import React, { useState } from 'react';
import './ChatPanel.css';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'player', text: input }]);
    setInput('');
    fetch('http://localhost:3001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
      })
      .catch(() => {
        setMessages((prev) => [...prev, { role: 'ai', text: 'Error: unable to reach server.' }]);
      });
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