import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GatzaraSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const services = [
        { 
            id: '01', 
            title: 'STRATEGY',
            content: "We define precise roadmaps that align your vision with market reality, ensuring sustained growth and competitive edge through data-driven insights."
        },
        { 
            id: '02', 
            title: 'DESIGN',
            content: "Crafting immersive visual identities and premium user experiences that resonate deeply with your audience, blending aesthetics with functional excellence."
        },
        { 
            id: '03', 
            title: 'TECHNOLOGY',
            content: "WE IMPLEMENT THE MOST SUITABLE TECH AND DEVELOPMENT FRAMEWORKS TO FUEL INNOVATION, BOOST PERFORMANCE, ENSURE SCALABILITY, AND EASE OF USE."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="w-full text-black pt-12 sm:pt-24 md:pt-36 pb-8 sm:pb-12 md:pb-16 px-6 md:px-12 lg:px-24 xl:px-32 relative z-40 overflow-hidden bg-[#ff1a1a]">
            {/* Main grid with consistent split to match target image spacing */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                
                {/* Left Side: Services (approx 4/12 split) */}
                <div className="lg:col-span-4 pt-4 px-2 lg:px-4">
                    {/* Header labels */}
                    <div className="flex justify-between items-center text-[0.55rem] md:text-[0.6rem] font-bold tracking-[0.05em] uppercase pb-6 opacity-80">
                        <span className="w-1/3 text-left">HOW WE</span>
                        <span className="w-1/3 text-center">GET SH*T</span>
                        <span className="w-1/3 text-right">DONE</span>
                    </div>

                    {/* Services List with accordion behavior */}
                    <div className="space-y-0 border-t border-black">
                        {services.map((service, index) => (
                            <div 
                                key={service.id}
                                className="border-b border-black overflow-hidden"
                            >
                                <button 
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center py-5 cursor-pointer hover:bg-black/5 transition-colors text-left"
                                >
                                    <div className="flex items-center">
                                        <span className="text-[0.65rem] md:text-[0.8rem] font-black tracking-tight uppercase">
                                            {service.id} {service.title}
                                        </span>
                                    </div>
                                    <div className="text-[0.65rem] md:text-[0.8rem] font-black">
                                        [{activeIndex === index ? '—' : '+'}]
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="pb-8 pr-4">
                                                <p className="text-[0.6rem] md:text-[0.75rem] font-black leading-tight uppercase tracking-tight text-black opacity-90">
                                                    {service.content}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Philosophy Text (approx 8/12 split) */}
                <div className="lg:col-span-8 px-2 lg:px-0">
                    <div className="flex flex-col">
                        <h2 
                            className="font-black tracking-[-0.03em] leading-[1.05] mt-0 text-black uppercase overflow-hidden"
                            style={{ 
                                fontFamily: '"Outfit", sans-serif',
                                fontSize: 'clamp(1.5rem, 3.8vw, 2.75rem)'
                            }}
                        >
                            {"From college competitions to sangeets and studio productions, his work speaks through energy, precision, and presence. Not just teaching steps — he builds performers who own the stage.".split(' ').map((word, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: "100%", opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true, margin: "-10% 0px" }}
                                    transition={{ 
                                        duration: 0.8, 
                                        delay: i * 0.03, 
                                        ease: [0.16, 1, 0.3, 1] 
                                    }}
                                    className="inline-block mr-[0.3em] origin-bottom"
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatzaraSection;
