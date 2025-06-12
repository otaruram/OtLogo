import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Stars } from '@react-three/drei';

const CosmicBackground = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
          />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default CosmicBackground; 