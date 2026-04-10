import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Media = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full h-screen bg-[#0a0a0a] text-white overflow-hidden px-6 lg:px-10 font-['Outfit'] relative flex items-center justify-center">
            {/* 1. ARCHITECTURAL BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                <h2 className="absolute top-[10%] -left-[5%] text-[20vw] font-black text-white/5 uppercase leading-none italic select-none">
                    PDC
                </h2>
                <h2 className="absolute bottom-[10%] -right-[5%] text-[20vw] font-black text-white/5 uppercase leading-none italic select-none">
                    ARCHIVE
                </h2>
                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" 
                     style={{ 
                        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                        backgroundSize: '100px 100px' 
                     }} />
            </div>

            {/* 2. SCANNING LINE ANIMATION */}
            <motion.div 
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff1a1a]/40 to-transparent z-10"
            />

            {/* 3. MAIN CONTENT CONTAINER */}
            <div className="relative z-20 max-w-4xl w-full">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-24 rounded-[3rem] overflow-hidden"
                >
                    {/* Hardware Corners */}
                    <div className="absolute top-8 left-8 w-1 h-1 bg-[#ff1a1a] rounded-full shadow-[0_0_10px_#ff1a1a]" />
                    <div className="absolute top-8 right-8 w-1 h-1 bg-[#ff1a1a] rounded-full shadow-[0_0_10px_#ff1a1a]" />
                    <div className="absolute bottom-8 left-8 w-1 h-1 bg-[#ff1a1a] rounded-full shadow-[0_0_10px_#ff1a1a]" />
                    <div className="absolute bottom-8 right-8 w-1 h-1 bg-[#ff1a1a] rounded-full shadow-[0_0_10px_#ff1a1a]" />

                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-4 mb-10">
                            <span className="text-[0.6rem] font-bold text-white/30 tracking-[0.6em] uppercase">SYSTEM LOADING</span>
                            <div className="w-12 h-[1px] bg-white/20" />
                            <span className="text-[0.6rem] font-black text-[#ff1a1a] tracking-[0.6em] uppercase animate-pulse">20%</span>
                        </div>
                        
                        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12 font-['Outfit'] italic">
                            WE ARE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">COOKING</span>
                        </h1>

                        <div className="max-w-md space-y-8">
                            <p className="text-[0.7rem] md:text-[0.8rem] text-white/40 font-bold uppercase tracking-[0.3em] leading-relaxed">
                                Our visual archive and workshop recaps are currently being processed for the highest quality experience.
                            </p>

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                <div className="space-y-1">
                                    <p className="text-[0.5rem] font-bold text-white/20 uppercase">Signal</p>
                                    <p className="text-[0.65rem] font-black text-[#ff1a1a] uppercase">Stable</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[0.5rem] font-bold text-white/20 uppercase">Source</p>
                                    <p className="text-[0.65rem] font-black text-white uppercase">4K/SDR</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[0.5rem] font-bold text-white/20 uppercase">Legacy</p>
                                    <p className="text-[0.65rem] font-black text-white uppercase">PDC_V1</p>
                                </div>
                            </div>
                        </div>

                        {/* Return Navigation */}
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="mt-16 px-12 py-5 bg-[#ff1a1a] text-white text-[0.7rem] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl hover:shadow-[#ff1a1a]/20 transition-all"
                        >
                            Back to Core
                        </motion.button>
                    </div>

                    {/* Background Glow */}
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#ff1a1a]/10 rounded-full blur-[100px]" />
                </motion.div>
            </div>

            {/* Vertical Latency Data */}
            <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-8 opacity-20">
                <span className="text-[0.5rem] font-bold text-white tracking-[1em] uppercase -rotate-90">TX_00918_A</span>
                <span className="text-[0.5rem] font-bold text-white tracking-[1em] uppercase -rotate-90">BITRATE_6.8_GBPS</span>
            </div>
        </div>
    );
};

export default Media;
