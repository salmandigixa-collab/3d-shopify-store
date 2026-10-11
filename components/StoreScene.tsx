'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, RoundedBox } from '@react-three/drei';

export function StoreScene() {
  return (
    <div className="h-[520px] w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 3, 3]} intensity={2} color="#ffffff" />
        <spotLight position={[-5, 5, 5]} intensity={1.5} angle={0.4} penumbra={1} />

        <Float speed={1.8} rotationIntensity={1.2} floatIntensity={1.6}>
          <group>
            <RoundedBox args={[2.1, 2.1, 2.1]} radius={0.18} smoothness={6} position={[0, 0, 0]}>
              <meshStandardMaterial color="#7cf3d0" metalness={0.5} roughness={0.18} />
            </RoundedBox>

            <mesh position={[0, 0, -1.2]} rotation={[0, 0, 0]}>
              <torusGeometry args={[1.8, 0.12, 20, 100]} />
              <meshStandardMaterial color="#ff8b5e" metalness={0.7} roughness={0.25} />
            </mesh>

            <mesh position={[0, 0, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.2, 1.65, 64]} />
              <meshStandardMaterial color="#dfe7f2" emissive="#7cf3d0" emissiveIntensity={0.5} />
            </mesh>
          </group>
        </Float>

        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}
