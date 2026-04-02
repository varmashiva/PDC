import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/logo.png';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
    {
        name: "Aarav Sharma",
        role: "Professional Dancer",
        text: "The workshops at PDC completely transformed my understanding of movement. The intensity and precision are on another level.",
        title: "TRANSFORMATIVE EXPERIENCE"
    },
    {
        name: "Isha Patel",
        role: "Artistic Director",
        text: "A masterclass in both technique and creative expression. The industrial aesthetic and focused environment make it truly unique.",
        title: "ELITE QUALITY"
    },
    {
        name: "Rohan Das",
        role: "Contemporary Artist",
        text: "Mastering the flow was a breakthrough moment for me. The instructor's attention to detail is remarkable.",
        title: "REVEALING DEPTH"
    },
    {
        name: "Sanya Gupta",
        role: "Movement Coach",
        text: "PDC isn't just a workshop series; it's a paradigm shift for anyone serious about the motion arts.",
        title: "A PARADIGM SHIFT"
    }
];

const ReviewsSection = () => {
    const sectionRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray('.review-card-pinned');

            // 0. Initial States
            gsap.set(logoRef.current, { opacity: 0, scale: 0.8 });
            gsap.set(cards, { y: 400, autoAlpha: 0, scale: 0.9 });

            // 1. MAIN SCROLL TIMELINE
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    start: 'top top',
                    end: '+=4000',
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    refreshPriority: 1,
                },
            });

            // PHASE 1: LOGO ENTRY
            tl.to(logoRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power3.out"
            });

            // PHASE 2: HOLD LOGO (The Storytelling Gap)
            tl.to({}, { duration: 1 }); 

            // PHASE 4: CARDS ENTRY (Staggered)
            // Note: We stagger each card's entrance and exit sequentially within child timelines
            // or just use a staggered from if they are meant to stay or cycle?
            // The user requested: "Cards animate from bottom, staggered entry, overlap logo"
            // and "Phase 5: Background shift (dim logo) at the same time (<)"
            
            tl.to(logoRef.current, {
                scale: 0.85,
                opacity: 0.1,
                duration: 1
            });

            cards.forEach((card, i) => {
                // Entrance
                tl.fromTo(card, 
                    { y: 400, autoAlpha: 0, scale: 0.9 },
                    { 
                        y: 0, 
                        autoAlpha: 1, 
                        scale: 1, 
                        duration: 1.5,
                        ease: "power3.out"
                    },
                    `>-0.5` // Overlap slightly with previous or logo dim
                );

                // Hold card on screen
                tl.to({}, { duration: 1.5 });

                // Exit (unless last card)
                if (i < cards.length - 1) {
                    tl.to(card, {
                        y: -400,
                        autoAlpha: 0,
                        scale: 0.9,
                        duration: 1,
                        ease: "power3.in"
                    });
                }
            });



        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-[#ff1a1a] flex flex-col items-center justify-center selection:bg-black selection:text-[#ff1a1a] rounded-t-2xl overflow-hidden"
        >
            {/* Background Logo Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <img
                    ref={logoRef}
                    src={logo}
                    alt=""
                    className="w-[90vw] md:w-[60vw] h-auto object-contain opacity-[0.1] grayscale brightness-0"
                />
            </div>

            {/* Subtle Grid Texture */}
            <div
                className="absolute inset-0 opacity-[0.1] pointer-events-none z-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Section Title */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
                <span className="text-[0.65rem] font-bold tracking-[0.4em] text-black uppercase mb-2 block">
                    [ PDC COMMUNITY FEEDBACK ]
                </span>
            </div>

            {/* Cards Stack — overflow:clip prevents cards from peeking outside during y-translate */}
            <div className="relative z-10 w-full flex items-center justify-center h-full" style={{ overflow: 'clip' }}>
                {reviews.map((review, i) => (
                    <div
                        key={i}
                        className="review-card-pinned absolute w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl px-4 sm:px-6"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="bg-white p-8 sm:p-12 md:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-black/5 flex flex-col gap-6 md:gap-8 relative">
                            <div>
                                <h4 className="text-[#ff1a1a] text-[0.5rem] md:text-[0.6rem] font-black tracking-[0.3em] uppercase mb-2 md:mb-4">
                                    {review.title}
                                </h4>
                                <p className="text-black text-lg sm:text-xl md:text-3xl font-bold leading-[1.2] md:leading-[1.3] font-['Outfit'] mb-6 md:mb-10">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 border-t border-black/5 pt-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center text-white font-black text-[0.6rem] md:text-xs">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-black font-black uppercase tracking-tight text-xs md:text-sm leading-none mb-1">
                                        {review.name}
                                    </span>
                                    <span className="text-black/30 text-[0.5rem] md:text-[0.55rem] font-bold uppercase tracking-widest leading-none">
                                        {review.role}
                                    </span>
                                </div>
                                <div className="ml-auto text-black/10 font-bold text-xs uppercase tracking-widest">
                                    [ 0{i + 1} — 0{reviews.length} ]
                                </div>
                            </div>

                            {/* Corner rivets */}
                            <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-black/10 rounded-full" />
                            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-black/10 rounded-full" />
                            <div className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-black/10 rounded-full" />
                            <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-black/10 rounded-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom dot indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none">
                <div className="flex gap-2">
                    {reviews.map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-black/10 border border-black/5" />
                    ))}
                </div>
                <div className="w-[1px] h-8 bg-black/10" />
            </div>
        </section>
    );
};

export default ReviewsSection;
