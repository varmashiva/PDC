import React from 'react';
import { motion } from 'framer-motion';

const HighlightsSection = () => {
    return (
        <section className="relative w-full h-[100vh] flex items-center justify-center bg-white overflow-hidden selection:bg-black selection:text-white">
            
            {/* 1. Grid Background matching the Gatzara industrial style */}
            <div className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none" 
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 2. Top-Right Label: HIGHLIGHTS */}
            <div className="absolute top-10 right-10 md:top-14 md:right-14 z-20">
                <span className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.25em] text-black/80 uppercase">
                    HIGHLIGHTS
                </span>
            </div>

            {/* 3. Bottom-Left Label: pagination [01-04] */}
            <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14 z-20">
                <span className="text-[0.65rem] md:text-[0.75rem] font-black tracking-tight text-black">
                    [01-04]
                </span>
            </div>

            {/* 4. Left-Middle Project Description */}
            <div className="absolute left-10 md:left-14 top-1/2 -translate-y-1/2 max-w-[150px] md:max-w-[210px] z-20">
                <p className="text-[0.55rem] md:text-[0.65rem] font-black leading-[1.4] tracking-tight uppercase text-black/80">
                    CAMPAIGN LANDING PAGE TO PRESENT THE DS-ADAPT FAMILY GOLF CLUBS AND FEATURES.
                </p>
            </div>

            {/* 5. Right-Middle Hash-Tags */}
            <div className="absolute right-10 md:right-14 top-1/2 -translate-y-1/2 text-right z-20">
                <span className="text-[0.55rem] md:text-[0.65rem] font-black tracking-widest uppercase text-black">
                    #ECOM, #CAMPAIGN, #STORYTELLING
                </span>
            </div>

            {/* 6. Huge Background Typography: COBRA (Top Left) & GOLF (Bottom Right) */}
            <div className="absolute top-12 left-10 md:top-16 md:left-14 z-10 select-none">
                <motion.h2 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[11vw] font-black leading-none text-black tracking-[-0.04em] uppercase"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                    COBRA
                </motion.h2>
            </div>

            <div className="absolute bottom-12 right-10 md:bottom-16 right-14 z-10 select-none">
                <motion.h2 
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13vw] font-black leading-none text-black tracking-[-0.04em] uppercase"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                    GOLF
                </motion.h2>
            </div>

            {/* 7. Central Circular Visual with Image & Glow */}
            <motion.div 
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-[65vh] h-[65vh] max-w-[90vw] max-h-[90vw] flex items-center justify-center"
            >
                {/* Outer Glow Circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1aff1a] via-[#10cc10] to-[#055a05] scale-[1.05] blur-3xl opacity-20" />
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-[1px] border-black/5 shadow-2xl">
                    {/* Dark gradient base */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-black/90 z-0" />
                    
                    {/* The Golf Club Image */}
                    <img 
                        src="/Users/shivavarma/.gemini/antigravity/brain/0619cd6e-0325-4952-95a7-f2a084ef3d2c/cobra_golf_club_highlight_1774359997640.png"
                        alt="Cobra Golf Highlight"
                        className="w-full h-full object-cover relative z-10 scale-110"
                    />

                    {/* [+] Interaction Button Mockup like in the target image */}
                    <div className="absolute bottom-1/4 right-[28%] z-30 pointer-events-auto">
                        <button className="w-8 h-8 md:w-10 md:h-10 bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center rounded-lg shadow-xl hover:scale-110 transition-transform">
                            <span className="text-white text-[0.6rem] md:text-[0.7rem] font-black">[+]</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Sub-Border to connect with the next dark section nicely */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/10" />

        </section>
    );
};

export default HighlightsSection;
