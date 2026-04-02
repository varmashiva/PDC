import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import Loader from './Loader';
import SalsaModel from './SalsaModel';

const Scene = ({ scrollProgress }) => {
    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing bg-transparent overflow-hidden">
            <Canvas className="absolute inset-0 z-0 pointer-events-auto bg-transparent" dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={40} />
                
                {/* Premium studio lighting */}
                <ambientLight intensity={0.6} color="#ffffff" />
                <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" castShadow />
                <spotLight position={[-8, 10, 2]} intensity={3} color="#ff1a1a" angle={0.4} penumbra={1} />
                <spotLight position={[8, -5, -2]} intensity={1} color="#f9a8d4" angle={0.5} penumbra={1} />
                
                <Environment preset="city" />
                
                <Suspense fallback={<Loader />}>
                    <SalsaModel scrollProgress={scrollProgress} />
                    <ContactShadows position={[0, 0.4, 0]} opacity={0.6} scale={5} blur={1.5} far={4} color="#000000" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
