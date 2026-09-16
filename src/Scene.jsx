import { ContactShadows, RoundedBox } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const palette = {
  skin: '#b98262', skinShadow: '#976149', hair: '#211b1a',
  shirt: '#444354', trousers: '#252833', metal: '#333440', accent: '#c2a4ff',
}

function SoftBox({ size, color, radius = 0.04, roughness = 0.65, metalness = 0, ...props }) {
  return <RoundedBox args={size} radius={radius} smoothness={3} castShadow receiveShadow {...props}>
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </RoundedBox>
}

function Ellipsoid({ position, scale, color, roughness = 0.8, ...props }) {
  return <mesh position={position} scale={scale} castShadow {...props}>
    <sphereGeometry args={[1, 32, 24]} />
    <meshStandardMaterial color={color} roughness={roughness} />
  </mesh>
}

// A tapered segment keeps elbows, knees and wrists in a believable seated pose.
function Limb({ from, to, radius, endRadius = radius, color }) {
  const { midpoint, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from)
    const end = new THREE.Vector3(...to)
    const direction = end.clone().sub(start)
    return {
      midpoint: start.add(end).multiplyScalar(0.5),
      length: direction.length(),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize()),
    }
  }, [from, to])
  return <group>
    <mesh position={midpoint} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[endRadius, radius, length, 20]} />
      <meshStandardMaterial color={color} roughness={0.86} />
    </mesh>
    <Ellipsoid position={from} scale={[radius, radius, radius]} color={color} />
    <Ellipsoid position={to} scale={[endRadius, endRadius, endRadius]} color={color} />
  </group>
}

function Stroke({ points, color, radius = 0.008 }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), [points])
  return <mesh>
    <tubeGeometry args={[curve, 20, radius, 6, false]} />
    <meshStandardMaterial color={color} roughness={0.9} />
  </mesh>
}

function Face() {
  const geometry = useMemo(() => {
    // Chin, jaw, cheekbones, temples and crown have different widths, unlike a spherical mascot head.
    const profile = new THREE.SplineCurve([
      new THREE.Vector2(0, -0.37), new THREE.Vector2(0.12, -0.35),
      new THREE.Vector2(0.20, -0.26), new THREE.Vector2(0.255, -0.09),
      new THREE.Vector2(0.26, 0.09), new THREE.Vector2(0.25, 0.24),
      new THREE.Vector2(0.19, 0.35), new THREE.Vector2(0, 0.40),
    ])
    const head = new THREE.LatheGeometry(profile.getPoints(48), 64)
    const positions = head.attributes.position
    for (let index = 0; index < positions.count; index += 1) {
      const y = positions.getY(index)
      const z = positions.getZ(index)
      // Flatten the face slightly while preserving a rounded back of the skull.
      positions.setZ(index, z * (z > 0 ? 0.86 : 1.03) + (y < -0.2 ? 0.025 : 0))
    }
    head.computeVertexNormals()
    // Colour the skull surface itself so the hairline follows the head without a floating cap.
    head.clearGroups()
    const indices = head.index.array
    const skinIndices = []
    const hairIndices = []
    for (let index = 0; index < indices.length; index += 3) {
      const vertex = indices[index]
      const y = positions.getY(vertex)
      const z = positions.getZ(vertex)
      const x = positions.getX(vertex)
      const hairline = z > 0.09 ? 0.215 + x * 0.12 : z < -0.09 ? -0.10 : 0.06
      const target = y > hairline ? hairIndices : skinIndices
      target.push(indices[index], indices[index + 1], indices[index + 2])
    }
    head.setIndex([...skinIndices, ...hairIndices])
    head.addGroup(0, skinIndices.length, 0)
    head.addGroup(skinIndices.length, hairIndices.length, 1)
    return head
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return <group>
    <mesh geometry={geometry} castShadow>
      <meshStandardMaterial attach="material-0" color={palette.skin} roughness={0.88} />
      <meshStandardMaterial attach="material-1" color={palette.hair} roughness={0.98} />
    </mesh>
    {/* Ears and their inset folds. */}
    {[-1, 1].map((side) => <group key={side}>
      <Ellipsoid position={[side * 0.258, -0.035, -0.005]} scale={[0.045, 0.085, 0.053]} color={palette.skin} />
      <Ellipsoid position={[side * 0.281, -0.032, 0.028]} scale={[0.012, 0.048, 0.023]} color={palette.skinShadow} />
      {/* Small, inset eyes, with eyelids rather than oversized glowing eyeballs. */}
      <Ellipsoid position={[side * 0.104, 0.035, 0.207]} scale={[0.051, 0.020, 0.011]} color="#d7c9b9" />
      <Ellipsoid position={[side * 0.103, 0.034, 0.217]} scale={[0.017, 0.018, 0.004]} color="#423329" />
      <Ellipsoid position={[side * 0.103, 0.034, 0.221]} scale={[0.008, 0.011, 0.002]} color="#161514" />
      <Stroke points={[[side * 0.055, 0.038, 0.215], [side * 0.101, 0.055, 0.221], [side * 0.155, 0.035, 0.201]]} color={palette.skinShadow} radius={0.008} />
      <Stroke points={[[side * 0.052, 0.104, 0.216], [side * 0.103, 0.119, 0.215], [side * 0.161, 0.098, 0.19]]} color={palette.hair} radius={0.012} />
    </group>)}
    {/* Bridge, tip and nostrils give the face a readable profile. */}
    <Ellipsoid position={[0, -0.003, 0.224]} scale={[0.033, 0.102, 0.04]} color={palette.skin} rotation={[-0.14, 0, 0]} />
    <Ellipsoid position={[0, -0.073, 0.258]} scale={[0.034, 0.030, 0.037]} color={palette.skin} />
    {[-1, 1].map((side) => <group key={side}>
      <Ellipsoid position={[side * 0.035, -0.09, 0.24]} scale={[0.024, 0.021, 0.028]} color={palette.skin} />
      <Ellipsoid position={[side * 0.024, -0.103, 0.257]} scale={[0.01, 0.005, 0.008]} color="#6f4839" />
    </group>)}
    <Stroke points={[[-0.069, -0.172, 0.205], [-0.028, -0.168, 0.221], [0, -0.174, 0.223], [0.029, -0.168, 0.22], [0.069, -0.172, 0.205]]} color="#785046" radius={0.007} />
    <Stroke points={[[-0.051, -0.187, 0.21], [0, -0.194, 0.221], [0.05, -0.187, 0.21]]} color="#ad7461" radius={0.009} />
    <Ellipsoid position={[-0.028, 0.321, 0.035]} scale={[0.213, 0.092, 0.166]} color={palette.hair} rotation={[0, 0, -0.12]} />
    {Array.from({ length: 7 }, (_, index) => <Stroke key={index} points={[
      [-0.18 + index * 0.05, 0.28, 0.20 - Math.abs(index - 3) * 0.012],
      [-0.13 + index * 0.045, 0.399, 0.08],
      [-0.08 + index * 0.038, 0.355, -0.10],
    ]} color="#302725" radius={0.005} />)}
  </group>
}

function Hand({ position, side, reducedMotion }) {
  const hand = useRef(null)
  useFrame(({ clock }) => {
    if (!hand.current || reducedMotion) return
    hand.current.rotation.x = Math.sin(clock.elapsedTime * 3.5 + side * 2) * 0.025
  })
  return <group ref={hand} position={position} rotation={[0, side * -0.13, 0]}>
    <Ellipsoid position={[0, 0, 0]} scale={[0.079, 0.036, 0.108]} color={palette.skin} />
    {[0, 1, 2, 3].map((finger) => <Limb key={finger} from={[-0.052 + finger * 0.034, 0, 0.065]} to={[-0.052 + finger * 0.034, -0.025, 0.16 - Math.abs(finger - 1) * 0.014]} radius={0.016} endRadius={0.012} color={palette.skin} />)}
    <Limb from={[side * -0.057, 0, 0.005]} to={[side * -0.104, -0.013, 0.075]} radius={0.023} endRadius={0.015} color={palette.skin} />
  </group>
}

function Developer({ reducedMotion, pointer }) {
  const upperBody = useRef(null)
  const head = useRef(null)
  useFrame(({ clock }, delta) => {
    const { x, y } = pointer.current
    if (upperBody.current) {
      upperBody.current.rotation.x = reducedMotion ? 0.075 : 0.075 + Math.sin(clock.elapsedTime * 1.4) * 0.006
      upperBody.current.rotation.y = reducedMotion ? 0 : THREE.MathUtils.damp(upperBody.current.rotation.y, x * 0.055, 4, delta)
    }
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, 0.16 + x * (reducedMotion ? 0.20 : 0.48), 5, delta)
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, 0.10 + y * (reducedMotion ? 0.08 : 0.22), 5, delta)
    }
  })
  return <group position={[0, 0, -0.68]}>
    <SoftBox position={[0, -0.63, 0.02]} size={[0.67, 0.32, 0.46]} radius={0.14} color={palette.trousers} />
    {[-1, 1].map((side) => <group key={side}>
      <Limb from={[side * 0.21, -0.65, 0.07]} to={[side * 0.27, -0.79, 0.67]} radius={0.17} endRadius={0.14} color={palette.trousers} />
      <Limb from={[side * 0.27, -0.79, 0.67]} to={[side * 0.28, -1.47, 0.78]} radius={0.135} endRadius={0.095} color={palette.trousers} />
      <SoftBox position={[side * 0.28, -1.59, 0.88]} size={[0.25, 0.19, 0.46]} radius={0.075} color="#202127" />
      <SoftBox position={[side * 0.28, -1.675, 0.9]} size={[0.255, 0.045, 0.46]} radius={0.015} color="#a19d98" />
    </group>)}
    <group ref={upperBody} rotation={[0.075, 0, 0]}>
      <SoftBox position={[0, -0.07, 0]} size={[0.77, 1.10, 0.43]} radius={0.19} color={palette.shirt} roughness={0.94} />
      <Limb from={[0, 0.44, 0]} to={[0, 0.75, 0.04]} radius={0.108} endRadius={0.115} color={palette.skin} />
      <mesh position={[0, 0.48, 0.022]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.116, 0.025, 8, 32]} />
        <meshStandardMaterial color="#30303b" />
      </mesh>
      <group ref={head} position={[0, 0.73, 0.045]} rotation={[0.10, 0.16, 0]}>
        <group position={[0, 0.31, 0]}><Face /></group>
      </group>
      {[-1, 1].map((side) => <group key={side}>
        <Limb from={[side * 0.39, 0.30, 0.02]} to={[side * 0.48, -0.055, 0.16]} radius={0.139} endRadius={0.108} color={palette.shirt} />
        <Limb from={[side * 0.48, -0.055, 0.16]} to={[side * 0.31, 0.015, 0.73]} radius={0.095} endRadius={0.054} color={palette.skin} />
        <Hand position={[side * 0.30, 0.015, 0.83]} side={side} reducedMotion={reducedMotion} />
      </group>)}
    </group>
  </group>
}

function Chair() {
  return <group position={[0, 0, -0.78]}>
    <SoftBox position={[0, -0.81, 0.08]} size={[0.86, 0.17, 0.78]} radius={0.075} color="#20212b" />
    <SoftBox position={[0, -0.12, -0.30]} rotation={[-0.10, 0, 0]} size={[0.79, 1.17, 0.15]} radius={0.07} color="#2c2c38" />
    <Limb from={[0, -1.5, 0.02]} to={[0, -0.85, 0.02]} radius={0.058} color="#62636a" />
    {[-1, 1].map((side) => <group key={side}>
      <Limb from={[side * 0.45, -0.8, 0]} to={[side * 0.45, -0.31, 0]} radius={0.027} color={palette.metal} />
      <SoftBox position={[side * 0.45, -0.29, 0.09]} size={[0.11, 0.065, 0.46]} radius={0.028} color="#22232a" />
    </group>)}
    {Array.from({ length: 5 }, (_, index) => {
      const angle = index * Math.PI * 2 / 5
      const x = Math.cos(angle) * 0.49
      const z = Math.sin(angle) * 0.49
      return <group key={index}>
        <Limb from={[0, -1.5, 0.02]} to={[x, -1.60, z]} radius={0.033} color={palette.metal} />
        <Ellipsoid position={[x, -1.675, z]} scale={[0.062, 0.062, 0.042]} color="#14151b" />
      </group>
    })}
  </group>
}

function CodeScreen({ width, height }) {
  return <group rotation={[0, Math.PI, 0]}>
    <mesh><planeGeometry args={[width, height]} /><meshBasicMaterial color="#111a25" /></mesh>
    <mesh position={[0, height * 0.43, 0.002]}><planeGeometry args={[width, height * 0.14]} /><meshBasicMaterial color="#263142" /></mesh>
    {['#b98287', '#c4aa7e', '#85b69c'].map((color, index) => <mesh key={color} position={[-width * 0.43 + index * width * 0.042, height * 0.43, 0.003]}>
      <circleGeometry args={[height * 0.017, 12]} /><meshBasicMaterial color={color} />
    </mesh>)}
    <mesh position={[-width * 0.31, -height * 0.07, 0.003]}><planeGeometry args={[width * 0.21, height * 0.76]} /><meshBasicMaterial color="#182332" /></mesh>
    {Array.from({ length: 11 }, (_, index) => <group key={index}>
      <mesh position={[-width * 0.315, height * 0.28 - index * height * 0.056, 0.005]}>
        <planeGeometry args={[width * (0.09 + index % 3 * 0.02), height * 0.01]} /><meshBasicMaterial color="#62758d" />
      </mesh>
      <mesh position={[-width * 0.1 + index % 3 * width * 0.037, height * 0.27 - index * height * 0.059, 0.005]}>
        <planeGeometry args={[width * (0.10 + index % 4 * 0.025), height * 0.013]} /><meshBasicMaterial color={index % 3 === 0 ? '#c2a4ff' : '#86b4bb'} />
      </mesh>
      <mesh position={[width * 0.16 + index % 2 * width * 0.04, height * 0.27 - index * height * 0.059, 0.005]}>
        <planeGeometry args={[width * (0.13 + index % 3 * 0.04), height * 0.013]} /><meshBasicMaterial color="#9ba9bd" />
      </mesh>
    </group>)}
  </group>
}

function Workstation() {
  return <group>
    <SoftBox position={[0, -0.16, 0.69]} size={[2.85, 0.13, 1.56]} radius={0.045} color="#63514d" roughness={0.86} />
    <SoftBox position={[0, -0.085, 0.44]} size={[1.50, 0.015, 0.80]} radius={0.005} color="#292934" />
    {[-1, 1].map((side) => <group key={side}>
      <SoftBox position={[side * 1.23, -0.94, 0.72]} size={[0.085, 1.47, 0.95]} radius={0.025} color="#282934" metalness={0.4} />
      <SoftBox position={[side * 1.23, -1.70, 0.72]} size={[0.16, 0.065, 1.12]} radius={0.02} color="#20212b" />
    </group>)}
    {/* External monitor offset to keep the person's face visible from the camera. */}
    <group position={[-0.68, -0.075, 1.06]} rotation={[0, -0.20, 0]}>
      <SoftBox position={[0, 0.025, 0]} size={[0.47, 0.035, 0.32]} radius={0.016} color={palette.metal} metalness={0.5} />
      <SoftBox position={[0, 0.23, 0.055]} size={[0.075, 0.43, 0.07]} radius={0.012} color={palette.metal} metalness={0.5} />
      <group position={[0, 0.71, 0]} rotation={[0.055, 0, 0]}>
        <SoftBox size={[1.29, 0.82, 0.065]} radius={0.025} color="#262833" metalness={0.45} />
        <group position={[0, 0, -0.035]}><CodeScreen width={1.19} height={0.71} /></group>
        <SoftBox position={[0, 0, 0.034]} size={[0.29, 0.15, 0.012]} radius={0.005} color="#30323d" />
      </group>
    </group>
    <group position={[0.58, -0.058, 0.67]} rotation={[0, -0.40, 0]}>
      <SoftBox size={[0.88, 0.035, 0.64]} radius={0.014} color="#85848c" metalness={0.65} roughness={0.35} />
      <SoftBox position={[0, 0.024, -0.19]} size={[0.29, 0.008, 0.17]} radius={0.003} color="#64646f" metalness={0.4} />
      {Array.from({ length: 4 }, (_, row) => Array.from({ length: 11 }, (_, key) => <mesh key={`${row}-${key}`} position={[-0.34 + key * 0.068, 0.023, -0.03 + row * 0.062]}>
        <boxGeometry args={[0.050, 0.008, 0.043]} /><meshStandardMaterial color="#292b36" />
      </mesh>))}
      <group position={[0, 0.023, 0.30]} rotation={[0.18, 0, 0]}>
        <SoftBox position={[0, 0.29, 0]} size={[0.88, 0.58, 0.032]} radius={0.012} color="#696a76" metalness={0.65} />
        <group position={[0, 0.29, -0.018]}><CodeScreen width={0.80} height={0.49} /></group>
      </group>
    </group>
    {/* A separate keyboard sits directly under the hands. */}
    <SoftBox position={[-0.12, -0.035, 0.22]} size={[0.89, 0.065, 0.29]} radius={0.018} color="#62616b" />
    {Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, key) => <mesh key={`${row}-${key}`} position={[-0.505 + key * 0.070, 0.003, 0.115 + row * 0.066]}>
      <boxGeometry args={[0.052, 0.014, 0.045]} /><meshStandardMaterial color={row === 3 ? '#a6a0b3' : '#363640'} />
    </mesh>))}
    <Ellipsoid position={[0.69, -0.03, 0.05]} scale={[0.08, 0.047, 0.12]} color="#9b97a6" />
    <group position={[-1.12, -0.02, 0.17]}>
      <mesh position={[0, 0.09, 0]} castShadow>
        <cylinderGeometry args={[0.083, 0.068, 0.19, 32]} /><meshStandardMaterial color="#b4a5c0" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.187, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.073, 32]} /><meshStandardMaterial color="#352820" /></mesh>
      <mesh position={[-0.088, 0.10, 0]}><torusGeometry args={[0.052, 0.013, 8, 24]} /><meshStandardMaterial color="#b4a5c0" /></mesh>
    </group>
  </group>
}

function Studio({ reducedMotion }) {
  const group = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const reset = () => { pointer.current = { x: 0, y: 0 } }
    reset()
    const move = (event) => {
      if (event.pointerType === 'touch') { reset(); return }
      pointer.current = {
        x: THREE.MathUtils.clamp(event.clientX / window.innerWidth * 2 - 1, -1, 1),
        y: THREE.MathUtils.clamp(event.clientY / window.innerHeight * 2 - 1, -1, 1),
      }
    }
    // Listen on the window so the artwork also follows movement over the hero text.
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('blur', reset)
    document.addEventListener('pointerleave', reset)
    document.addEventListener('visibilitychange', reset)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('blur', reset)
      document.removeEventListener('pointerleave', reset)
      document.removeEventListener('visibilitychange', reset)
    }
  }, [])
  useFrame((_, delta) => {
    if (!group.current) return
    // Reduced motion suppresses idle animation, but keeps a smaller, user-driven response.
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.current.x * (reducedMotion ? 0.14 : 0.28), 4, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointer.current.y * (reducedMotion ? 0.035 : 0.09), 4, delta)
  })
  return <group ref={group}>
    <Workstation />
    <Chair />
    <Developer reducedMotion={reducedMotion} pointer={pointer} />
    <mesh position={[0, -1.79, 0.12]} receiveShadow>
      <cylinderGeometry args={[2.12, 2.14, 0.075, 80]} />
      <meshStandardMaterial color="#201b29" roughness={0.9} />
    </mesh>
    <ContactShadows position={[0, -1.747, 0.12]} opacity={0.45} scale={5} blur={2.2} far={4} resolution={256} color="#08070c" />
  </group>
}

function Scene() {
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return <div className="webgl-scene" role="img" aria-label="A developer with natural facial features seated at a desk, working with a laptop and an external monitor.">
    <Canvas camera={{ position: [5.4, 2.9, 5.8], fov: 36 }} dpr={[1, 1.5]} shadows={THREE.PCFShadowMap} gl={{ alpha: true, antialias: true }} onCreated={({ camera }) => camera.lookAt(0, -0.43, 0)}>
      <ambientLight intensity={0.65} color="#f3e9e3" />
      <hemisphereLight args={['#eee9ff', '#302939', 1.1]} />
      <directionalLight position={[3, 5, 4]} intensity={3.0} color="#fff0df" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-normalBias={0.035} />
      <directionalLight position={[-3, 2, -2]} intensity={2.3} color="#b8a0f1" />
      <pointLight position={[0, 0.8, 1]} intensity={0.5} distance={2.5} color="#bbd9fa" />
      <Studio reducedMotion={reducedMotion} />
    </Canvas>
  </div>
}

export default Scene
