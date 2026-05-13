'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShape({
  position,
  color,
  size = 1,
}: {
  position: [number, number, number]
  color: string
  size?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.002
      meshRef.current.rotation.y += 0.003
    }
  })

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      floatingRange={[-0.5, 0.5]}
    >
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[size, 0]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  )
}

export function FloatingCodeScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#5FCCBA" />

        <FloatingShape position={[-3, 2, 0]} color="#4C8572" size={0.8} />
        <FloatingShape position={[3, -2, -1]} color="#F2B647" size={0.6} />
        <FloatingShape position={[-2, -1.5, -2]} color="#5FCCBA" size={0.7} />
        <FloatingShape position={[2.5, 1.5, -1.5]} color="#D4A373" size={0.5} />
        <FloatingShape position={[0, 0, -3]} color="#C97A5F" size={0.9} />
        <FloatingShape position={[-1, 3, -1]} color="#4C8572" size={0.4} />
        <FloatingShape position={[1, -3, -2.5]} color="#F2B647" size={0.6} />
      </Canvas>
    </div>
  )
}
