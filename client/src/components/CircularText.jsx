import React, { useEffect, useRef } from 'react';

const CircularText = ({ 
    text = " DIGITAL & BRAND DESIGN - BRIDGING   - ", 
    radius = 900,
    fontSize,
    fill = "#111111",
    className = ""
}) => {
    const idRef = useRef(Math.random().toString(36).substr(2, 9));
    const pathId = `circlePath-${idRef.current}`;
    const diameter = radius * 2;
    const center = radius;

    const fullText = (text + " " + text + " ").toUpperCase();

    const pathString = `
        M ${center},${center}
        m -${radius},0
        a ${radius},${radius} 0 1,1 ${diameter},0
        a ${radius},${radius} 0 1,1 -${diameter},0
    `;

    // Rotation state — we track a continuous angle
    const angleRef = useRef(0);       // current angle in degrees
    const scrollVelocityRef = useRef(0); // extra push from scroll
    const lastScrollY = useRef(window.scrollY);
    const rafRef = useRef(null);
    const svgWrapRef = useRef(null);

    useEffect(() => {
        const AUTO_SPEED = -0.04; // degrees/frame — ultra slow counter-clockwise
        const SCROLL_MULTIPLIER = 0.003; // near-imperceptible scroll nudge
        const DECAY = 0.95; // very slow decay for silky transitions

        const handleScroll = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;
            lastScrollY.current = currentY;

            // Positive delta = scroll down = clockwise = positive degrees
            scrollVelocityRef.current += delta * SCROLL_MULTIPLIER;
        };

        const animate = () => {
            // Decay the scroll impulse back toward 0
            scrollVelocityRef.current *= DECAY;

            // Effective velocity: auto speed + scroll overlay
            const effective = AUTO_SPEED + scrollVelocityRef.current;

            angleRef.current += effective;

            if (svgWrapRef.current) {
                svgWrapRef.current.style.transform = `rotate(${angleRef.current}deg)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className={`w-full h-full pointer-events-none ${className}`}>
            <div
                ref={svgWrapRef}
                style={{ width: '100%', height: '100%', willChange: 'transform' }}
            >
                <svg 
                    viewBox={`0 0 ${diameter} ${diameter}`} 
                    style={{ width: '100%', height: '100%' }}
                    className="overflow-visible"
                >
                    <defs>
                        <path
                            id={pathId}
                            d={pathString}
                        />
                    </defs>
                    
                    <text 
                        fill={fill}
                        className="font-sans font-black tracking-tighter"
                        fontSize={fontSize || radius * 0.35}
                    >
                        <textPath 
                            href={`#${pathId}`} 
                            startOffset="50%" 
                            textAnchor="middle"
                        >
                            {fullText}
                        </textPath>
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default CircularText;
