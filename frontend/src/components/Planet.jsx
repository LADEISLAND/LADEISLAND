import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Planet({ size, color, distance }) {
  const mesh = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const orbitSpeed = 1 / Math.sqrt(distance); // simple speed formula
    mesh.current.position.x = Math.sin(t * orbitSpeed) * distance;
    mesh.current.position.z = Math.cos(t * orbitSpeed) * distance;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={mesh} castShadow receiveShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}