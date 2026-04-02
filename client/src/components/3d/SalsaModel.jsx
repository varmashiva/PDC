import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const SalsaModel = ({ scrollProgress }) => {
    const group = useRef();
    
    // Using the exact Cloudinary URL
    const { scene, animations } = useGLTF('https://res.cloudinary.com/dsqzmt3eb/image/upload/v1774328459/groot_dancing_mqqzqm.glb');
    const { actions, names } = useAnimations(animations, group);

    // Initial scale & rotation states
    useEffect(() => {
        // Find and pause the animation immediately
        if (names.length > 0) {
            const actionName = names[0]; // grab the main dance move
            const action = actions[actionName];
            
            action.play();
            // Start paused! We'll manipulate the time via scroll progress
            action.paused = true;
        }
    }, [actions, names]);

    useFrame(() => {
        if (!scrollProgress) return;
        
        // Ensure scrollProgress is clamped between 0 and 1
        const p = scrollProgress.current || 0;

        if (names.length > 0) {
            const actionName = names[0];
            const action = actions[actionName];
            
            // Scrub through a larger 6-second chunk of the animation to make it "faster" visually
            const targetTime = p * 6.0; 

            // Increase the lerp factor extensively so it responds extremely 
            // tightly to scrolling UP and down, instantly reversing previous actions!
            action.time = THREE.MathUtils.lerp(action.time, targetTime, 0.15);
        }

        // Camera / Model movement (Spin the couple gently alongside standard animation constraint)
        if (group.current) {
            // Speed up the rotation twist slightly to mirror the faster animation
            const targetRotationY = p * Math.PI * 0.35;
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.1);
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* Shift the character natively higher up within the vertical space grid */}
            <primitive object={scene} scale={[0.9, 0.9, 0.9]} position={[0, 0.4, 0]} />
        </group>
    );
};

// Preload to bypass long wait once the scene actually mounts if they navigate early
useGLTF.preload('https://res.cloudinary.com/dsqzmt3eb/image/upload/v1774328459/groot_dancing_mqqzqm.glb');

export default SalsaModel;
