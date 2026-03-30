import { memo, Suspense } from 'react';
import { Bounds, OrbitControls, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Bodybuilder3D from './Bodybuilder3D';

function BodybuilderHeroCanvas() {
  return (
    <div className="relative h-full w-full select-none" aria-hidden="true">
      <div className="absolute inset-x-[12%] bottom-[10%] h-[22%] rounded-full bg-[rgba(249,115,22,0.2)] blur-[52px]" />
      <div className="absolute left-[10%] top-[12%] h-[30%] w-[30%] rounded-full bg-[rgba(239,68,68,0.14)] blur-[56px]" />

      <Canvas
        camera={{ position: [0, 0.45, 7.4], fov: 26 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        performance={{ min: 0.8 }}
        style={{ pointerEvents: 'auto', touchAction: 'pan-y' }}
      >
        <ambientLight intensity={1.45} color="#fff3eb" />
        <hemisphereLight intensity={0.8} groundColor="#1b0d07" color="#fff0df" />
        <directionalLight position={[4.5, 6, 4.5]} intensity={2.4} color="#ffd8b5" />
        <directionalLight position={[-3, 3, 3.5]} intensity={1} color="#ffffff" />

        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.02}>
            <Bodybuilder3D />
          </Bounds>
          <OrbitControls
            makeDefault
            autoRotate
            autoRotateSpeed={2.4}
            enableDamping
            dampingFactor={0.08}
            enablePan={false}
            enableZoom={false}
            enableRotate
            rotateSpeed={0.85}
            minPolarAngle={1.2}
            maxPolarAngle={1.9}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default memo(BodybuilderHeroCanvas);
