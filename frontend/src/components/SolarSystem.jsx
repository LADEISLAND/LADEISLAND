import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Planet from './Planet';

const planets = [
  { name: 'Mercury', color: '#b1b1b1', size: 0.38, distance: 12 },
  { name: 'Venus', color: '#e5c27b', size: 0.95, distance: 18 },
  { name: 'Earth', color: '#2d5f9b', size: 1.0, distance: 25 },
  { name: 'Mars', color: '#d14e28', size: 0.53, distance: 32 },
  { name: 'Jupiter', color: '#d9a066', size: 11.2, distance: 52 },
  { name: 'Saturn', color: '#d9c39a', size: 9.45, distance: 72 },
  { name: 'Uranus', color: '#91c7d9', size: 4.0, distance: 92 },
  { name: 'Neptune', color: '#4062b6', size: 3.9, distance: 110 },
];

export function SolarSystem() {
  return (
    <Canvas
      camera={{ position: [0, 40, 120], fov: 60 }}
      style={{ width: '100%', height: '100vh', background: 'black' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} />
      <Suspense fallback={null}>
        <Stars radius={300} depth={60} count={10000} factor={7} />
        {planets.map((p) => (
          <Planet key={p.name} {...p} />
        ))}
      </Suspense>
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}