import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedWorkshopBanner = ({ workshop }) => {
    if (!workshop) return null;

    // Split title for dynamic background typography
    const words = workshop.title.split(' ');
    const firstPart = words[0] || 'ELITE';
    const restParts = words.slice(1).join(' ') || 'WORKSHOP';

    // Cloudinary HEIC Fix: ensure the image is served in a browser-native format
    const getOptimizedImageUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            // Forces Cloudinary to serve modern formats (WebP/AVIF) regardless of source extension (.heic)
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    return (
        <section className="relative w-full h-[100vh] flex items-center justify-center bg-white overflow-hidden selection:bg-black selection:text-white">
            
            {/* 1. Grid Background matching the Gatzara industrial style */}
            <div className="absolute inset-0 z-0 opacity-[0.22] pointer-events-none" 
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 2. Brand/Context Labels */}
            <div className="absolute top-10 right-10 md:top-14 md:right-14 z-30">
                <span className="text-[0.65rem] md:text-[0.8rem] font-black tracking-[0.3em] text-[#ff1a1a] uppercase">
                    [ NEXT EVENT ]
                </span>
            </div>

            <div className="absolute bottom-10 left-10 md:bottom-14 md:left-14 z-30">
                <span className="text-[0.65rem] md:text-[0.8rem] font-black tracking-widest text-black/90">
                    DATE / {new Date(workshop.date).toLocaleDateString()}
                </span>
            </div>

            {/* 3. Detailed Information Overlay (UX: Descriptive text for context) */}
            <div className="absolute left-10 md:left-14 top-[58%] -translate-y-1/2 max-w-[180px] md:max-w-[280px] z-30 pointer-events-none">
                <p className="text-[0.55rem] md:text-[0.8rem] font-bold leading-[1.6] tracking-tight uppercase text-black/60">
                    {workshop.featuredDescription || `AN EXCLUSIVE SESSION LED BY INDUSTRY LEADERS. SECURE YOUR SPOT TO MASTER THE ART OF ${restParts || 'MOTION'}.`}
                </p>
            </div>

            {/* 4. Price & Enrollment Stats (UX: Social Proof / FOMO) */}
            <div className="absolute right-10 md:right-14 top-[42%] -translate-y-1/2 text-right z-30">
                <div className="flex flex-col gap-2">
                    <span className="text-2xl md:text-3xl font-black font-['Outfit'] tracking-tight text-black italic">
                        ₹{workshop.price}
                    </span>
                    <span className="text-[0.55rem] md:text-[0.65rem] font-black tracking-[0.2em] uppercase text-[#ff1a1a]">
                        ONLY {workshop.seats} SLOTS REMAINING
                    </span>
                </div>
            </div>

            {/* 5. DYNAMIC BACKGROUND TYPOGRAPHY (UI: Replacing Elite/Squad with Event Name) */}
            <div className="absolute top-12 left-8 md:top-16 md:left-12 z-10 select-none pointer-events-none">
                <motion.h2 
                    initial={{ opacity: 0, x: -80 }}
                    whileInView={{ opacity: 0.9, x: 0 }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[14vw] font-black leading-none text-black tracking-[-0.05em] uppercase"
                    style={{ fontFamily: '"Outfit", sans-serif' }}
                >
                    {firstPart}
                </motion.h2>
            </div>

            {/* 6. CENTRAL VISUAL SHOWCASE */}
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-20 w-[60vh] h-[60vh] max-w-[85vw] max-h-[85vw] flex items-center justify-center group"
            >
                {/* Visual Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff1a1a] via-[#111] to-[#ff1a1a] scale-[1.03] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000" />
                
                {/* Main Image Mask (Cleaned of extra overlays to show the workshop image clearly) */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-[1px] border-black/5 shadow-3vw bg-[#f0f0f0]">
                    <img 
                        src={getOptimizedImageUrl(workshop.image)}
                        alt={workshop.title}
                        className="w-full h-full object-cover relative z-0 scale-100 group-hover:scale-105 transition-transform duration-[2.5s] ease-out"
                    />
                </div>
            </motion.div>

            {/* 7. RELOCATED INTERACTIVE CTA (UX: Clean central visual, pinned bottom-right action) */}
            <div className="absolute bottom-12 right-10 md:bottom-20 md:right-16 z-30">
                <Link to={`/workshops/${workshop._id}`}>
                    <motion.button 
                        whileHover={{ scale: 1.05, backgroundColor: '#ff1a1a' }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-black text-white font-black font-['Outfit'] text-[0.8rem] md:text-[0.9rem] tracking-[0.3em] uppercase transition-all duration-300 rounded-sm shadow-2xl flex items-center gap-6 border border-white/10"
                    >
                        <span>RESERVE SPOT</span>
                        <span className="text-2xl">→</span>
                    </motion.button>
                </Link>
            </div>

            {/* Bottom Section Divider */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-black/5" />

        </section>
    );
};

export default FeaturedWorkshopBanner;
