import React, { useState } from 'react';
import ChatPanel from './components/ChatPanel';
import SolarSystemScene from './components/SolarSystemScene';
import './App.css';

export default function App() {
  const [countryState, setCountryState] = useState({
    name: 'Cosmicland',
    budget: 1_000_000,
    soldiers: 1_000,
    weapons: 500,
    citizens: 100_000,
    trade_balance: 0,
  });

  const handleUpdateState = (newState) => {
    setCountryState((prev) => ({ ...prev, ...newState }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <SolarSystemScene countryState={countryState} />
      </div>
      <ChatPanel onUpdateState={handleUpdateState} />
    </div>
  );
}