import React from 'react';
import { SolarSystem } from './components/SolarSystem';
import ChatPanel from './components/ChatPanel';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <SolarSystem />
      <ChatPanel />
    </div>
  );
}