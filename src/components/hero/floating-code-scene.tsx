'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

type Palette = {
  shapes: string[]
  pointLight: string
  ambient: number
  directional: number
}

const PALETTES: Record<'dark' | 'light', Palette> = {
  dark: {
    shapes: ['#5FCCBA', '#F2B647', '#5FCCBA', '#D4A373', '#C97A5F', '#4C8572', '#F2B647'],
    pointLight: '#5FCCBA',
    ambient: 0.45,
    directional: 0.9,
  },
  light: {
    shapes: ['#4C8572', '#D89F34', '#5FCCBA', '#D4A373', '#C97A5F', '#3A6B5B', '#F2B647'],
    pointLight: '#4C8572',
    ambient: 0.85,
    directional: 0.8,
  },
}

const SHAPES = [
  { position: [-5.5, 2.4, 0] as const, size: 0.9, distort: 0.32 },
  { position: [5.2, -2.6, -1.2] as const, size: 0.65, distort: 0.28 },
  { position: [-4.2, -2.0, -2.4] as const, size: 0.75, distort: 0.34 },
  { position: [4.6, 2.2, -1.6] as const, size: 0.55, distort: 0.26 },
  { position: [0, 0.4, -3.6] as const, size: 1.05, distort: 0.36 },
  { position: [-2.4, 3.6, -1.2] as const, size: 0.45, distort: 0.22 },
  { position: [3.0, -3.5, -2.8] as const, size: 0.7, distort: 0.3 },
]

function FloatingShape({
  position,
  color,
  size,
  distort,
  index,
}: {
  position: readonly [number, number, number]
  color: string
  size: number
  distort: number
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const rotSpeed = useRef({
    x: 0.0015 + (index % 3) * 0.0005,
    y: 0.002 + (index % 4) * 0.0004,
  })

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotSpeed.current.x
      meshRef.current.rotation.y += rotSpeed.current.y
    }
  })

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.35}
      floatIntensity={0.7}
      floatingRange={[-0.45, 0.45]}
    >
      <mesh ref={meshRef} position={position as unknown as [number, number, number]}>
        <octahedronGeometry args={[size, 0]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={1.6}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>
    </Float>
  )
}

export function FloatingCodeScene() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const palette = PALETTES[resolvedTheme === 'light' ? 'light' : 'dark']

  if (!mounted) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={palette.ambient} />
        <directionalLight position={[10, 10, 5]} intensity={palette.directional} />
        <pointLight position={[-10, -10, -5]} intensity={0.55} color={palette.pointLight} />

        {SHAPES.map((s, i) => (
          <FloatingShape
            key={i}
            index={i}
            position={s.position}
            size={s.size}
            distort={s.distort}
            color={palette.shapes[i % palette.shapes.length]!}
          />
        ))}
      </Canvas>
    </div>
  )
}
