'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// The hero's signature moment: a glowing core with four service "planets" on
// tilted orbits, star dust, pointer parallax and a scroll dolly. Loaded with
// next/dynamic({ ssr: false }) only on capable devices with motion allowed.

type RingDef = {
  r: number
  tilt: [number, number, number]
  speed: number
  color: string
  size: number
  phase: number
}

const RINGS: RingDef[] = [
  { r: 1.75, tilt: [1.2, 0.12, 0.25], speed: 0.46, color: '#F4EFE6', size: 0.08, phase: 0.4 },
  { r: 2.55, tilt: [1.34, -0.24, -0.16], speed: 0.31, color: '#D6B36A', size: 0.11, phase: 2.1 },
  { r: 3.35, tilt: [1.12, 0.34, 0.42], speed: 0.21, color: '#7FB4FF', size: 0.09, phase: 4.0 },
  { r: 4.25, tilt: [1.27, -0.08, -0.5], speed: 0.14, color: '#ECD29A', size: 0.065, phase: 5.3 },
]

// Deterministic PRNG so the star field is identical on every render.
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function useGlowTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      g.addColorStop(0, 'rgba(255,255,255,1)')
      g.addColorStop(0.25, 'rgba(255,255,255,0.45)')
      g.addColorStop(0.6, 'rgba(255,255,255,0.08)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 128, 128)
    }
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const rand = mulberry32(7)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 7 + rand() * 16
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi) - 6
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.035} sizeAttenuation color="#F4EFE6" transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}

function Core({ glow }: { glow: THREE.Texture }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.025
    ref.current?.scale.setScalar(s)
  })
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial color="#F4EFE6" emissive="#D6B36A" emissiveIntensity={0.85} roughness={0.35} />
      </mesh>
      <sprite scale={4.4}>
        <spriteMaterial map={glow} color="#D6B36A" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite scale={10}>
        <spriteMaterial map={glow} color="#7FB4FF" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
    </group>
  )
}

function Ring({ def, glow }: { def: RingDef; glow: THREE.Texture }) {
  const planet = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    const t = clock.elapsedTime * def.speed + def.phase
    planet.current?.position.set(Math.cos(t) * def.r, Math.sin(t) * def.r, 0)
  })
  return (
    <group rotation={def.tilt}>
      <mesh>
        <torusGeometry args={[def.r, 0.006, 6, 256]} />
        <meshBasicMaterial color="#F4EFE6" transparent opacity={0.2} />
      </mesh>
      <group ref={planet}>
        <mesh>
          <sphereGeometry args={[def.size, 24, 24]} />
          <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.6} roughness={0.5} />
        </mesh>
        <sprite scale={def.size * 10}>
          <spriteMaterial map={glow} color={def.color} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>
    </group>
  )
}

/** Pointer parallax + scroll dolly + responsive framing. */
function Rig({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const width = useThree((s) => s.size.width)
  const wide = width >= 900
  const baseX = wide ? 3.7 : 1.55
  const baseY = wide ? -0.2 : 3.25
  const scale = wide ? 0.95 : 0.5

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const k = 1 - Math.exp(-dt * 2.4)
    const p = pointer.current
    g.rotation.y += (p.x * 0.28 - g.rotation.y) * k
    g.rotation.x += (p.y * 0.16 - g.rotation.x) * k
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4)
    g.position.x = baseX
    g.position.y = baseY + scroll * 1.1
    g.scale.setScalar(scale)
    state.camera.position.z = 11 + scroll * 2.4
  })

  return <group ref={group}>{children}</group>
}

function Scene({ stars }: { stars: number }) {
  const glow = useGlowTexture()
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 0]} intensity={24} distance={14} color="#D6B36A" />
      <directionalLight position={[4, 6, 6]} intensity={0.7} color="#F4EFE6" />
      <Rig>
        <Core glow={glow} />
        {RINGS.map((def, i) => (
          <Ring key={i} def={def} glow={glow} />
        ))}
      </Rig>
      <Stars count={stars} />
    </>
  )
}

export default function OrbitCanvas({ onReady }: { onReady: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [stars] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 600 : 1400))

  // Stop rendering when the hero is off screen.
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 11], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={visible ? 'always' : 'never'}
        onCreated={() => requestAnimationFrame(() => requestAnimationFrame(onReady))}
      >
        <Scene stars={stars} />
      </Canvas>
    </div>
  )
}
