import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import Scene from '../components/3d/Scene';
import CircularText from '../components/CircularText';
import GatzaraSection from '../components/GatzaraSection';
import WorkshopShowcase from '../components/WorkshopShowcase';
import PreviousWorkshops from '../components/PreviousWorkshops';
import ReviewsSection from '../components/ReviewsSection';
import Footer from '../components/Footer';
import { Play } from 'lucide-react';


const Home = () => {
    // Rotating Word Logic
    const heroWords = ["digital excellence.", "creative mastery.", "visionary motion."];
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const wordInterval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % heroWords.length);
        }, 3000); // changes every 3 seconds
        return () => clearInterval(wordInterval);
    }, []);
    
    // Smooth custom scroll mapping for 3d model using window natively
    const scrollRef = useRef(0);
    const containerRef = useRef(null);
    const { scrollY } = useScroll();

    // Translate window scroll into a 0 -> 1 progress indicator
    // that the SalsaModel can consume for the timeline playback.
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            // The magic number here maps down to approx how much they should scroll
            // to cycle through the dancing scene. Adjust height division to speed/slow.
            let progress = window.scrollY / (window.innerHeight * 1.5);
            scrollRef.current = Math.max(0, Math.min(1, progress));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Standard rigid document flow, removed parallax scrolling.
    return (
        <div ref={containerRef} className="w-screen min-h-screen relative left-1/2 right-1/2 -mx-[50vw] bg-black text-black overflow-x-hidden selection:bg-black selection:text-[#ff1a1a]">
            
            {/* 1. RED HERO CARD — Contained rounded card floating on white background */}
            <div className="w-full px-3 md:px-4 pt-3 pb-0">
            <section className="relative w-full overflow-hidden flex flex-col items-center pt-[15vh] pb-[5vh] z-0 bg-[#ff1a1a] rounded-2xl text-black">
                
                {/* Circular Wrap Text Background Layer (Z-0) */}
                <div 
                    className="absolute z-0 pointer-events-none origin-top left-1/2"
                    style={{ 
                        width: windowWidth < 768 ? '205vw' : '1120px', 
                        height: windowWidth < 768 ? '220vw' : '1120px',
                        top: windowWidth < 768 ? '180px' : '280px',
                        transform: `translateX(-50%) scale(${windowWidth < 768 ? 0.60 : 1})`,
                        opacity: 1
                    }}
                >
                    <CircularText 
                        text=" DIGITAL & BRAND DESIGN - PDC - " 
                        radius={560} 
                        fill="#000000"
                    />
                </div>

                {/* Huge Typography Heading (Z-10) */}
                <div 
                    className="relative z-10 w-full flex items-center justify-center select-none mt-28 sm:mt-32 md:mt-48 lg:mt-56 px-4"
                >
                    <h1 
                        className="font-black text-center text-[#111] mx-auto leading-none tracking-tight w-full flex flex-col"
                        style={{ 
                            fontSize: 'clamp(1.1rem, 5.5vw, 2.75rem)', 
                            fontFamily: '"Outfit", sans-serif' 
                        }}
                    >
                        <span className="block whitespace-nowrap pb-[0.3em]">A global design studio</span>
                        <span className="block whitespace-nowrap pb-[0.3em]">elevating brands and products</span>
                        <span className="block whitespace-nowrap">
                            through{' '}
                            <span className="relative inline-flex overflow-hidden align-bottom h-[1.1em]">
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={wordIndex}
                                        initial={{ y: "100%", opacity: 0 }}
                                        animate={{ y: "0%", opacity: 1 }}
                                        exit={{ y: "-100%", opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="inline-block"
                                    >
                                        {heroWords[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </span>
                    </h1>
                </div>

                {/* The massive 3D Canvas block (replaces the image 2 component exactly) */}
                <motion.div 
                    initial={{ opacity: 0, y: 150 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-30 w-full md:w-[85vw] max-w-6xl h-[55vh] sm:h-[60vh] md:h-[70vh] overflow-hidden -mt-7 group bg-transparent"
                >
                    <Scene scrollProgress={scrollRef} />

                    {/* Interactive overlay icon hidden unless hovered */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-black flex items-center justify-center opacity-0 pointer-events-none group-hover:scale-110 group-hover:opacity-10 transition-all duration-700 ease-out z-10 mix-blend-difference">
                        <Play size={80} strokeWidth={0.5} fill="currentColor" />
                    </div>

                    {/* Vertical Scroll Indicator - Directly beside the 3D Model! */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute top-1/2 -translate-y-1/2 right-[5%] sm:right-[10%] md:right-[15%] lg:right-[20%] hidden md:flex flex-col items-center gap-4 z-40 pointer-events-none text-[#111]"
                    >
                        <span 
                            className="text-[0.45rem] sm:text-[0.55rem] md:text-[0.60rem] font-bold uppercase tracking-[0.25em] opacity-80"
                            style={{ writingMode: 'vertical-rl' }}
                        >
                            SCROLL TO EXPLORE
                        </span>
                        <div className="w-[1px] h-12 md:h-20 bg-[#111]/20 overflow-hidden relative">
                            <motion.div 
                                animate={{ y: ['-100%', '200%'] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="w-full h-1/2 bg-[#111] absolute top-0 left-0"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* THE MAIN CALL TO ACTION BUTTON & SUBTEXT */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 1, ease: "easeOut" }}
                    className="relative z-50 flex flex-col items-center justify-center w-full mt-4 sm:mt-0 md:-mt-10 lg:-mt-16 mb-0 md:mb-24 gap-6 px-6"
                >
                    <a 
                        href="#workshops"
                        className="relative px-12 py-5 bg-[#111111] text-white font-['Outfit'] text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.3em] uppercase transition-all duration-500 hover:scale-105 hover:bg-white hover:text-black hover:shadow-2xl rounded-[4px]"
                    >
                        EXPLORE WORKSHOPS
                        
                        {/* Signature 4 corner hardware dots matching the Gatzara Navbar */}
                        <div className="absolute top-[6px] left-[6px] w-[3px] h-[3px] bg-white/30 rounded-full mix-blend-difference" />
                        <div className="absolute top-[6px] right-[6px] w-[3px] h-[3px] bg-white/30 rounded-full mix-blend-difference" />
                        <div className="absolute bottom-[6px] left-[6px] w-[3px] h-[3px] bg-white/30 rounded-full mix-blend-difference" />
                        <div className="absolute bottom-[6px] right-[6px] w-[3px] h-[3px] bg-white/30 rounded-full mix-blend-difference" />
                    </a>

                    <p className="hidden md:block max-w-md text-center text-[#111] font-medium text-xs md:text-sm leading-[1.6] tracking-wide opacity-70 mt-6 md:mt-10">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut.
                    </p>
                </motion.div>

                {/* Vertical Spacer for Breathing Room */}
                <div className="hidden md:block md:h-[22vh]" />

                <div id="philosophy">
                    <GatzaraSection />
                </div>

                {/* Removed bottom spacer for tighter fit */}
            </section>
            </div>{/* end red hero card wrapper */}

            {/* Spacer for breathing room - Reduced for tighter fit */}
            <div className="h-[3vh] md:h-[4vh]" />
 
            {/* 3. WORKSHOP SHOWCASE (Dynamic Merge) — relative z-10 ensures it stays behind the reviews if overlap occurs */}
            <div id="workshops" className="w-full px-3 md:px-4 pt-6 pb-12 relative z-10">
                <WorkshopShowcase />
            </div>

            {/* 4. PREVIOUS WORKSHOPS SECTION */}
            <div id="previous-workshops" className="w-full px-3 md:px-4 relative z-20">
                <PreviousWorkshops />
            </div>

            {/* 5. REVIEWS SECTION — relative z-20 ensures it stacks ABOVE the workshop pin-spacer */}
            <div id="reviews" className="w-full px-3 md:px-4 relative z-20 pt-8">
                <ReviewsSection />
            </div>

            {/* 6. FOOTER */}
            <div className="w-full px-3 md:px-4 relative z-30">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
