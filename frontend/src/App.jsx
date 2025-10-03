import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { SolarSystem } from './components/SolarSystem';
import ChatPanel from './components/ChatPanel';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <div className="app">
        <SolarSystem />
        <ChatPanel />
      </div>
    </AppProvider>
  );
}