import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera } from '@react-three/drei';
import Planet from './Planet';
import './SolarSystem.css';

const planets = [
  { 
    name: 'Mercury', 
    color: '#8c7853', 
    size: 0.38, 
    distance: 12,
    orbitSpeed: 1.6,
    rotationSpeed: 0.1,
    info: {
      diameter: '4,879 km',
      distance: '57.9 million km',
      period: '88 days',
      moons: 0,
      description: 'The smallest planet in our solar system and closest to the Sun.'
    }
  },
  { 
    name: 'Venus', 
    color: '#ffc649', 
    size: 0.95, 
    distance: 18,
    orbitSpeed: 1.2,
    rotationSpeed: -0.05,
    info: {
      diameter: '12,104 km',
      distance: '108.2 million km',
      period: '225 days',
      moons: 0,
      description: 'The hottest planet in our solar system with a thick, toxic atmosphere.'
    }
  },
  { 
    name: 'Earth', 
    color: '#6b93d6', 
    size: 1.0, 
    distance: 25,
    orbitSpeed: 1.0,
    rotationSpeed: 1.0,
    info: {
      diameter: '12,756 km',
      distance: '149.6 million km',
      period: '365.25 days',
      moons: 1,
      description: 'Our home planet, the only known planet to harbor life.'
    }
  },
  { 
    name: 'Mars', 
    color: '#cd5c5c', 
    size: 0.53, 
    distance: 32,
    orbitSpeed: 0.8,
    rotationSpeed: 0.97,
    info: {
      diameter: '6,792 km',
      distance: '227.9 million km',
      period: '687 days',
      moons: 2,
      description: 'The Red Planet, a cold desert world with the largest volcano in the solar system.'
    }
  },
  { 
    name: 'Jupiter', 
    color: '#d8ca9d', 
    size: 3.2, 
    distance: 52,
    orbitSpeed: 0.4,
    rotationSpeed: 2.4,
    info: {
      diameter: '142,984 km',
      distance: '778.5 million km',
      period: '12 years',
      moons: 95,
      description: 'The largest planet, a gas giant with a Great Red Spot storm.'
    }
  },
  { 
    name: 'Saturn', 
    color: '#fad5a5', 
    size: 2.6, 
    distance: 72,
    orbitSpeed: 0.3,
    rotationSpeed: 2.2,
    info: {
      diameter: '120,536 km',
      distance: '1.43 billion km',
      period: '29 years',
      moons: 146,
      description: 'Famous for its spectacular ring system made of ice and rock particles.'
    }
  },
  { 
    name: 'Uranus', 
    color: '#4fd0e7', 
    size: 1.8, 
    distance: 92,
    orbitSpeed: 0.2,
    rotationSpeed: -1.4,
    info: {
      diameter: '51,118 km',
      distance: '2.87 billion km',
      period: '84 years',
      moons: 27,
      description: 'An ice giant that rotates on its side, likely due to an ancient collision.'
    }
  },
  { 
    name: 'Neptune', 
    color: '#4169e1', 
    size: 1.7, 
    distance: 110,
    orbitSpeed: 0.15,
    rotationSpeed: 1.5,
    info: {
      diameter: '49,528 km',
      distance: '4.50 billion km',
      period: '165 years',
      moons: 16,
      description: 'The windiest planet with speeds reaching 2,100 km/h.'
    }
  },
];

// Sun component
function Sun() {
  const sunRef = useRef();
  
  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial 
        color="#ffaa00" 
        emissive="#ff6600"
        emissiveIntensity={0.5}
      />
      {/* Sun glow effect */}
      <mesh scale={1.2}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial 
          color="#ffaa00"
          transparent
          opacity={0.3}
        />
      </mesh>
    </mesh>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div className="solar-system-loading">
      <div className="loading-spinner">
        <div className="spinner-orbit">
          <div className="spinner-planet"></div>
        </div>
      </div>
      <p>Loading Solar System...</p>
    </div>
  );
}

// Controls info
function ControlsInfo() {
  const [showControls, setShowControls] = useState(true);

  return (
    <div className={`controls-info ${showControls ? 'visible' : 'hidden'}`}>
      <button 
        className="controls-toggle"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? '✕' : 'ℹ️'}
      </button>
      {showControls && (
        <div className="controls-content">
          <h3>🚀 Navigation Controls</h3>
          <div className="control-item">
            <span className="control-key">🖱️ Left Click + Drag</span>
            <span className="control-desc">Rotate view</span>
          </div>
          <div className="control-item">
            <span className="control-key">🖱️ Right Click + Drag</span>
            <span className="control-desc">Pan camera</span>
          </div>
          <div className="control-item">
            <span className="control-key">🎚️ Scroll Wheel</span>
            <span className="control-desc">Zoom in/out</span>
          </div>
          <div className="control-item">
            <span className="control-key">🪐 Click Planet</span>
            <span className="control-desc">View details</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function SolarSystem({ onPlanetClick }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  const handlePlanetClick = (planetName, info) => {
    setSelectedPlanet({ name: planetName, info });
    onPlanetClick?.(planetName, info);
  };

  return (
    <div className="solar-system-container">
      <Canvas
        camera={{ position: [0, 40, 120], fov: 60 }}
        style={{ width: '100%', height: '100vh' }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.1} />
        <pointLight position={[0, 0, 0]} intensity={2} decay={2} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        {/* Environment */}
        <Suspense fallback={null}>
          <Stars 
            radius={500} 
            depth={60} 
            count={20000} 
            factor={4} 
            saturation={0}
            fade
            speed={0.5}
          />
          
          {/* Sun */}
          <Sun />
          
          {/* Planets */}
          {planets.map((planet) => (
            <Planet 
              key={planet.name} 
              {...planet}
              onClick={handlePlanetClick}
            />
          ))}
        </Suspense>

        {/* Camera Controls */}
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate 
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.4}
          minDistance={10}
          maxDistance={500}
          autoRotate={false}
          autoRotateSpeed={0.1}
        />
      </Canvas>

      {/* UI Overlays */}
      <ControlsInfo />
      
      {/* Planet Info Display */}
      {selectedPlanet && (
        <div className="planet-info-overlay">
          <button 
            className="close-info"
            onClick={() => setSelectedPlanet(null)}
          >
            ✕
          </button>
          <h2>🪐 {selectedPlanet.name}</h2>
          <div className="planet-details">
            {selectedPlanet.info.diameter && (
              <div className="detail-item">
                <span className="detail-label">Diameter:</span>
                <span className="detail-value">{selectedPlanet.info.diameter}</span>
              </div>
            )}
            {selectedPlanet.info.distance && (
              <div className="detail-item">
                <span className="detail-label">Distance from Sun:</span>
                <span className="detail-value">{selectedPlanet.info.distance}</span>
              </div>
            )}
            {selectedPlanet.info.period && (
              <div className="detail-item">
                <span className="detail-label">Orbital Period:</span>
                <span className="detail-value">{selectedPlanet.info.period}</span>
              </div>
            )}
            {selectedPlanet.info.moons !== undefined && (
              <div className="detail-item">
                <span className="detail-label">Moons:</span>
                <span className="detail-value">{selectedPlanet.info.moons}</span>
              </div>
            )}
          </div>
          {selectedPlanet.info.description && (
            <p className="planet-description">{selectedPlanet.info.description}</p>
          )}
        </div>
      )}
    </div>
  );
}