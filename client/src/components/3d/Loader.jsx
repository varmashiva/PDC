import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const Loader = () => {
    const { progress } = useProgress();
    
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-white w-48">
                <div className="w-full h-1 bg-white/10 rounded-full mb-4 overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-primary" 
                        style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} 
                    />
                </div>
                <p className="text-light/60 font-medium tracking-wide">{Math.floor(progress)}% loaded</p>
                <p className="text-xs text-light/40 mt-1 uppercase tracking-widest text-center mt-4">Warming up the dance floor...</p>
            </div>
        </Html>
    );
};

export default Loader;
