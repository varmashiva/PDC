import React from 'react';
import { motion } from 'framer-motion';

const Marquee = ({ text = "PRUDHVI DANCE CLUB", speed = 40 }) => {
    // We duplicate the text multiple times to ensure the screen is filled
    // for the seamless loop to never break.
    const repeatedText = `${text} • `;

    return (
        <div className="w-full overflow-hidden bg-[#111111] text-white py-[10px] border-b border-black z-50 relative flex items-center">
            <motion.div
                className="whitespace-nowrap font-['Outfit'] font-black text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.2em] flex items-center"
                animate={{ x: [0, -1080] }}
                transition={{ 
                    repeat: Infinity, 
                    duration: speed, 
                    ease: "linear" 
                }}
            >
                {/* Large array to ensure continuous flow */}
                {[...Array(20)].map((_, i) => (
                    <span key={i} className="flex items-center">
                        <span className="opacity-90">{text}</span>
                        <span className="mx-6 text-[0.8rem] opacity-40">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
};

export default Marquee;
