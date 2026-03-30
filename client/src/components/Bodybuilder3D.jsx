import { useEffect } from 'react';
import { Center, useGLTF } from '@react-three/drei';

export default function Bodybuilder3D({
  scale = 2.15,
  position = [0, -0.78, 0],
  rotation = [0, 0.18, 0],
}) {
  const { scene } = useGLTF('/models/bodybuilder.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      child.castShadow = false;
      child.receiveShadow = false;
      child.frustumCulled = true;
    });
  }, [scene]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload('/models/bodybuilder.glb');
