import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export default function Planet({ 
  name, 
  color, 
  size, 
  distance, 
  orbitSpeed = 0.1, 
  rotationSpeed = 0.5,
  info,
  onClick 
}) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { camera } = useThree();

  // Create orbit path
  const orbitGeometry = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [distance]);

  // Enhanced planet material with atmosphere effect
  const planetMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.1,
      emissive: hovered ? new THREE.Color(color).multiplyScalar(0.1) : new THREE.Color(0x000000),
    });
  }, [color, hovered]);

  // Atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: hovered ? 0.3 : 0.1,
      side: THREE.BackSide,
    });
  }, [color, hovered]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const currentOrbitSpeed = 1 / Math.sqrt(distance) * orbitSpeed;
    
    if (meshRef.current) {
      // Orbital motion
      meshRef.current.position.x = Math.sin(t * currentOrbitSpeed) * distance;
      meshRef.current.position.z = Math.cos(t * currentOrbitSpeed) * distance;
      
      // Planet rotation
      meshRef.current.rotation.y += 0.01 * rotationSpeed;
      
      // Scale effect when hovered
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const handleClick = (event) => {
    event.stopPropagation();
    setClicked(!clicked);
    onClick?.(name, info);
  };

  const handlePointerOver = (event) => {
    event.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (event) => {
    event.stopPropagation();
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <group>
      {/* Orbit Path */}
      <line geometry={orbitGeometry}>
        <lineBasicMaterial 
          color={0x444444} 
          transparent 
          opacity={hovered ? 0.6 : 0.2}
        />
      </line>

      {/* Main Planet */}
      <mesh
        ref={meshRef}
        material={planetMaterial}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[size, 32, 32]} />
      </mesh>

      {/* Atmosphere */}
      {hovered && (
        <mesh
          position={meshRef.current?.position || [0, 0, 0]}
          material={atmosphereMaterial}
        >
          <sphereGeometry args={[size * 1.05, 32, 32]} />
        </mesh>
      )}

      {/* Planet Label */}
      {(hovered || clicked) && meshRef.current && (
        <Text
          position={[
            meshRef.current.position.x,
            meshRef.current.position.y + size + 1,
            meshRef.current.position.z
          ]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}

      {/* Planet Info Panel */}
      {clicked && info && meshRef.current && (
        <Html
          position={[
            meshRef.current.position.x + size + 2,
            meshRef.current.position.y,
            meshRef.current.position.z
          ]}
          transform
          occlude
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div className="planet-info-panel">
            <h3>{name}</h3>
            <div className="planet-stats">
              {info.diameter && <div>Diameter: {info.diameter}</div>}
              {info.distance && <div>Distance from Sun: {info.distance}</div>}
              {info.period && <div>Orbital Period: {info.period}</div>}
              {info.moons && <div>Moons: {info.moons}</div>}
            </div>
            {info.description && (
              <p className="planet-description">{info.description}</p>
            )}
          </div>
        </Html>
      )}

      {/* Rings for Saturn */}
      {name === 'Saturn' && meshRef.current && (
        <mesh 
          position={meshRef.current.position}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[size * 1.2, size * 1.8, 64]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Moon for Earth */}
      {name === 'Earth' && meshRef.current && (
        <mesh 
          position={[
            meshRef.current.position.x + size * 2,
            meshRef.current.position.y,
            meshRef.current.position.z
          ]}
        >
          <sphereGeometry args={[size * 0.27, 16, 16]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      )}
    </group>
  );
}