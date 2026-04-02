import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';

const Hero3D = () => {
    return (
        <Canvas className="w-full h-full">
            <Suspense fallback={null}>
                <OrbitControls enableZoom={false} />
                <ambientLight intensity={1} />
                <directionalLight position={[3, 2, 1]} />
                <Sphere args={[1, 100, 200]} scale={2.4}>
                    <MeshDistortMaterial
                        color="#6B46C1"
                        attach="material"
                        distort={0.5}
                        speed={2}
                    />
                </Sphere>
            </Suspense>
        </Canvas>
    );
};

export default Hero3D;
