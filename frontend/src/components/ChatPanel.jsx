import React, { useState } from 'react';
import './ChatPanel.css';

export default function ChatPanel({ onUpdateState }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendCommand = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((msgs) => [...msgs, { sender: 'user', text: userMessage }]);
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: userMessage }),
      });
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();

      setMessages((msgs) => [...msgs, { sender: 'agi', text: data.explanation }]);

      if (onUpdateState) onUpdateState(data.updated_state);
    } catch (error) {
      setMessages((msgs) => [...msgs, { sender: 'agi', text: 'Error communicating with backend.' }]);
    }
  };

  return (
    <div className="chat-panel" style={{ width: 300 }}>
      <div className="messages" style={{ height: 400 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              marginBottom: 5,
            }}
          >
            <b>{msg.sender === 'user' ? 'You' : 'AGI Cosmic'}:</b> {msg.text}
          </div>
        ))}
      </div>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendCommand();
          }
        }}
        style={{ width: '100%', resize: 'none' }}
      />
      <button onClick={sendCommand} style={{ marginTop: 5, width: '100%' }}>
        Send
      </button>
    </div>
  );
}