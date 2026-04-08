import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../services/api';

gsap.registerPlugin(ScrollTrigger);

const PreviousWorkshopSnippet = ({ workshop, index }) => {
    const getOptimizedImageUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    return (
        <div className="workshop-card-container flex-shrink-0 w-[90vw] md:w-[80vw] lg:w-[70vw] h-full flex items-center justify-center px-4 md:px-8">
            <div className="workshop-card-inner relative w-full aspect-auto sm:aspect-[16/10] md:aspect-[16/8.5] min-h-[580px] sm:min-h-0 bg-[#111] border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-8 group will-change-transform">
                {/* Image Section */}
                <div className="relative w-full md:w-[45%] h-[260px] sm:h-52 md:h-full rounded-xl md:rounded-2xl overflow-hidden bg-[#222] flex-shrink-0">
                    <img 
                        src={getOptimizedImageUrl(workshop.image)} 
                        alt={workshop.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[0.5rem] md:text-[0.6rem] font-bold tracking-widest uppercase border border-white/20 text-white">
                            {new Date(workshop.date).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-[0.65rem] font-bold tracking-[0.2em] text-[#ff1a1a] uppercase">
                                [ COMPLETED WORKSHOP ]
                            </span>
                        </div>
                        <h3 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl font-black font-['Outfit'] uppercase leading-none tracking-tighter mb-2 md:mb-4 text-white group-hover:text-[#ff1a1a] transition-colors duration-300">
                            {workshop.title}
                        </h3>
                        <p className="text-white/50 text-sm sm:text-sm md:text-base line-clamp-2 md:line-clamp-3 font-medium leading-[1.4] md:leading-relaxed max-w-lg">
                            {workshop.description}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
                        <div className="flex gap-4 md:gap-8">
                            <div className="flex flex-col text-white">
                                <span className="text-[0.45rem] md:text-[0.55rem] font-bold text-white/30 tracking-widest uppercase mb-0.5 md:mb-1">COMPLETED ON</span>
                                <span className="text-xs md:text-sm font-bold uppercase">{new Date(workshop.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        <button className="px-6 md:px-10 py-3 md:py-4 bg-white text-black text-[0.6rem] md:text-[0.7rem] font-black uppercase tracking-widest rounded-full hover:bg-[#ff1a1a] hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                            VIEW RECAP →
                        </button>
                    </div>
                </div>

                {/* Hardware Rivets */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-white/20 rounded-full" />
                <div className="absolute bottom-6 right-6 w-2 h-2 bg-white/20 rounded-full" />
                <div className="absolute top-6 left-6 w-2 h-2 bg-white/10 rounded-full md:hidden" />
            </div>
        </div>
    );
};

const PreviousWorkshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const triggerRef = useRef(null);
    const containerRef = useRef(null);
    const cardsWrapperRef = useRef(null);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const { data } = await api.get('/workshops');
                const now = new Date();
                const previousWorkshops = data.filter((w) => {
                    const d = new Date(w.date);
                    if (w.time) {
                        const [hours, minutes] = w.time.split(':');
                        d.setHours(parseInt(hours, 10) || 0, parseInt(minutes, 10) || 0, 0);
                    }
                    return d <= now;
                });
                setWorkshops(previousWorkshops);
            } catch (error) {
                console.error('Error fetching workshops:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshops();
    }, []);

    useEffect(() => {
        if (loading || workshops.length === 0) return;

        const ctx = gsap.context(() => {
            const mainTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1.5,
                    start: "top top",
                    end: () => `+=${cardsWrapperRef.current.scrollWidth - window.innerWidth + 100}`,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    refreshPriority: 2,
                }
            });

            mainTimeline.to(cardsWrapperRef.current, {
                x: () => -(cardsWrapperRef.current.scrollWidth - window.innerWidth),
                ease: "none"
            });

        }, triggerRef);

        return () => ctx.revert();
    }, [loading, workshops]);

    if (loading) return null;

    if (workshops.length === 0) {
        return (
            <div className="w-full h-80 bg-white rounded-2xl flex items-center justify-center font-['Outfit'] mt-8">
                <h2 className="text-black/10 text-4xl font-black uppercase text-center px-4">No previous workshops available.</h2>
            </div>
        );
    }

    return (
        <section 
            ref={triggerRef} 
            className="previous-workshop-section-pin bg-white rounded-2xl w-full h-screen overflow-hidden flex flex-col justify-center relative mt-8"
        >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ 
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                 }} />

            {/* Content Container */}
            <div 
                ref={containerRef}
                className="relative z-10 w-full h-full flex items-center"
            >
                {/* Horizontal Scrolling Layer */}
                <div 
                    ref={cardsWrapperRef}
                    className="flex h-full items-center will-change-transform"
                    style={{ paddingLeft: '2vw' }} 
                >
                    {/* Persistent Side Info */}
                    <div className="flex-shrink-0 w-[90vw] sm:w-[85vw] md:w-[30vw] px-8 sm:px-12 flex flex-col justify-center z-20">
                        <span className="text-[0.75rem] md:text-[0.7rem] font-black tracking-[0.4em] text-[#ff1a1a] uppercase mb-4 md:mb-4 block">
                            [ ARCHIVE ]
                        </span>
                        <h2 className="text-5xl sm:text-6xl md:text-8xl font-black text-black uppercase leading-[0.8] tracking-tighter mb-6 md:mb-8">
                            PREV-<br/>IOUS
                        </h2>
                        <p className="text-black/60 text-sm md:text-sm max-w-xs leading-relaxed font-semibold">
                            EXPLORE OUR PAST CREATIVE SESSIONS AND MASTERCLASSES.
                        </p>
                        <div className="mt-10 flex items-center gap-4 animate-pulse">
                            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center">
                                <span className="text-black font-bold">→</span>
                            </div>
                            <span className="text-[0.65rem] font-black text-black/40 uppercase tracking-widest">SCROLL TO EXPLORE</span>
                        </div>
                    </div>

                    {/* Workshop Cards List */}
                    {workshops.map((ws, i) => (
                        <PreviousWorkshopSnippet 
                            key={ws._id} 
                            workshop={ws} 
                            index={i} 
                        />
                    ))}

                    {/* End Spacer */}
                    <div className="flex-shrink-0 w-[20vw] h-full" />
                </div>
            </div>

            {/* Vertical Label */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block">
                <span className="text-[0.5rem] font-bold text-black/10 tracking-[1em] uppercase -rotate-90 origin-center whitespace-nowrap">
                    PDC ARCHIVED SESSIONS
                </span>
            </div>
        </section>
    );
};

export default PreviousWorkshops;
