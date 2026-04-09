import React from 'react';
import { motion } from 'framer-motion';


const Media = () => {
    return (
        <div className="w-full min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-10 font-['Outfit']">
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative"
                >
                    {/* Pulsing Glow */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="absolute inset-0 bg-[#ff1a1a] rounded-full blur-[100px] z-0"
                    />

                    <div className="relative z-10 space-y-6">
                        <span className="text-[0.7rem] font-black text-[#ff1a1a] tracking-[0.5em] uppercase block animate-pulse">
                            [ STATUS: IN_PROGRESS ]
                        </span>
                        
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none font-['Outfit'] italic">
                            WE ARE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">COOKING</span>
                        </h1>

                        <p className="text-white/40 text-sm md:text-base font-bold uppercase tracking-[0.2em] max-w-sm mx-auto pt-8">
                            OUR VISUAL ARCHIVE IS CURRENTLY UNDER DEVELOPMENT.
                        </p>

                        <div className="flex items-center justify-center gap-2 pt-4">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ 
                                        y: [0, -10, 0],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{ 
                                        duration: 1, 
                                        repeat: Infinity, 
                                        delay: i * 0.2 
                                    }}
                                    className="w-2 h-2 bg-[#ff1a1a] rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Media;
