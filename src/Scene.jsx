import { ContactShadows, Float, RoundedBox, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function Laptop() {
  return (
    <group position={[0, -0.15, 0.92]} rotation={[-0.08, 0, 0]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.65, 0.08, 1.08]} />
        <meshStandardMaterial color="#151019" roughness={0.3} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.44, -0.45]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[1.5, 0.95, 0.06]} />
        <meshStandardMaterial color="#1c1528" roughness={0.28} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.44, -0.41]} rotation={[-0.22, 0, 0]}>
        <planeGeometry args={[1.27, 0.72]} />
        <meshBasicMaterial color="#c2a4ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.06, 0.02]}>
        <boxGeometry args={[0.36, 0.015, 0.2]} />
        <meshStandardMaterial color="#a87cff" emissive="#6e43b5" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

function Character() {
  const group = useRef(null)
  const head = useRef(null)
  const particles = useMemo(() => Array.from({ length: 30 }, (_, index) => ({
    angle: index * 2.4,
    radius: 1.5 + (index % 5) * 0.13,
    height: -1.3 + (index % 7) * 0.4,
  })), [])

  useFrame(({ clock, pointer }) => {
    if (!group.current) return
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4)
    const drift = clock.elapsedTime * 0.36
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.34 + scroll * 0.52 + Math.sin(drift) * 0.04, 0.05)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * -0.14 - scroll * 0.12, 0.05)
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, Math.sin(clock.elapsedTime * 1.15) * 0.08 - scroll * 0.35, 0.04)
    if (head.current) head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, pointer.x * 0.28, 0.08)
  })

  return (
    <group ref={group} position={[0, -0.18, 0]}>
      <Float speed={1.25} rotationIntensity={0.08} floatIntensity={0.15}>
        <RoundedBox args={[1.45, 1.95, 0.82]} radius={0.25} smoothness={5} position={[0, -0.24, 0]}>
          <meshStandardMaterial color="#21172e" roughness={0.26} metalness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.43]}>
          <boxGeometry args={[1.04, 0.16, 0.02]} />
          <meshStandardMaterial color="#c2a4ff" emissive="#6f46b8" emissiveIntensity={0.6} />
        </mesh>
        <group ref={head} position={[0, 1.2, 0]}>
          <mesh>
            <sphereGeometry args={[0.73, 32, 24]} />
            <meshStandardMaterial color="#d3bfff" roughness={0.34} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.05, 0.63]}>
            <boxGeometry args={[1.05, 0.38, 0.08]} />
            <meshStandardMaterial color="#0f0b13" roughness={0.22} metalness={0.4} />
          </mesh>
          <mesh position={[-0.23, 0.03, 0.69]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshBasicMaterial color="#c2a4ff" toneMapped={false} />
          </mesh>
          <mesh position={[0.23, 0.03, 0.69]}>
            <sphereGeometry args={[0.08, 16, 12]} />
            <meshBasicMaterial color="#c2a4ff" toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.22, 0.67]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.13, 0.018, 10, 24, Math.PI]} />
            <meshBasicMaterial color="#4b356f" />
          </mesh>
        </group>
        <mesh position={[-0.88, -0.18, 0]} rotation={[0, 0, -0.18]}>
          <capsuleGeometry args={[0.16, 1.25, 8, 16]} />
          <meshStandardMaterial color="#9f7cda" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0.88, -0.18, 0]} rotation={[0, 0, 0.18]}>
          <capsuleGeometry args={[0.16, 1.25, 8, 16]} />
          <meshStandardMaterial color="#9f7cda" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[-0.38, -1.42, 0]}>
          <capsuleGeometry args={[0.2, 0.75, 8, 16]} />
          <meshStandardMaterial color="#161019" roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.38, -1.42, 0]}>
          <capsuleGeometry args={[0.2, 0.75, 8, 16]} />
          <meshStandardMaterial color="#161019" roughness={0.3} metalness={0.4} />
        </mesh>
        <Laptop />
      </Float>
      {particles.map((particle, index) => <mesh key={index} position={[Math.cos(particle.angle) * particle.radius, particle.height, Math.sin(particle.angle) * particle.radius]}>
        <sphereGeometry args={[0.018 + (index % 3) * 0.008, 6, 6]} />
        <meshBasicMaterial color="#c2a4ff" toneMapped={false} />
      </mesh>)}
    </group>
  )
}

function Scene() {
  return (
    <div className="webgl-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0.4, 7], fov: 34 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.75} color="#c2a4ff" />
        <directionalLight position={[2, 5, 5]} intensity={2.5} color="#f3ecff" />
        <pointLight position={[-3, 1, 3]} intensity={10} distance={8} color="#8e5de0" />
        <Sparkles count={70} scale={[5.5, 5, 3.5]} size={1.7} speed={0.2} color="#c2a4ff" />
        <Character />
        <ContactShadows position={[0, -2.02, 0]} opacity={0.48} scale={4.5} blur={2.8} far={4} color="#7b52b2" />
      </Canvas>
    </div>
  )
}

export default Scene
