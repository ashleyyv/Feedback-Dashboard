import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function BlueprintEarth() {
  const meshRef = useRef();
  const outerMeshRef = useRef();
  
  // Rotate the globe
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Main wireframe globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          wireframe={true}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Outer glow sphere */}
      <mesh ref={outerMeshRef}>
        <sphereGeometry args={[2.1, 32, 16]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      
      {/* Grid lines for longitude */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={`longitude-${i}`} rotation={[0, (i * Math.PI) / 6, 0]}>
          <ringGeometry args={[1.99, 2.01, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <BlueprintEarth />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.2}
        />
      </EffectComposer>
    </Canvas>
  );
}
