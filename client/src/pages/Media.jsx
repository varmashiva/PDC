import React from 'react';
import { motion } from 'framer-motion';

const videos = [
    { id: '1', title: 'PDC Workshop Series - Motion Mastery', embedId: 'dQw4w9WgXcQ' },
    { id: '2', title: 'Behind the Scenes - Gatzara', embedId: 'dQw4w9WgXcQ' },
    { id: '3', title: 'Creative Directing 101', embedId: 'dQw4w9WgXcQ' }
];

const Media = () => {
    return (
        <div className="w-full min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-10 font-['Outfit']">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <div className="mb-16">
                    <span className="text-[0.6rem] font-black text-[#ff1a1a] tracking-widest uppercase mb-4 block">
                        [ PDC MEDIA ]
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
                        Our Visual<br />Journey
                    </h1>
                </div>

                {/* YouTube Grid */}
                <div className="mb-20">
                    <h2 className="text-sm font-bold tracking-widest uppercase text-white/50 mb-8 border-b border-white/10 pb-4">
                        Masterclasses & Behind the Scenes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {videos.map((vid, idx) => (
                            <motion.div 
                                key={vid.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative w-full aspect-video bg-white/5 rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-white/30 transition-colors">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${vid.embedId}`}
                                        title={vid.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="grayscale group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>
                                <h3 className="text-white text-lg font-bold group-hover:text-[#ff1a1a] transition-colors">{vid.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Instagram Reels Grid Placeholder */}
                <div>
                    <h2 className="text-sm font-bold tracking-widest uppercase text-white/50 mb-8 border-b border-white/10 pb-4">
                        Instagram Highlights
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {[1, 2, 3, 4].map((item, idx) => (
                            <motion.div 
                                key={item}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative w-full aspect-[9/16] bg-white/5 rounded-xl overflow-hidden border border-white/10"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Reel {item}</span>
                                </div>
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-transparent transition-colors duration-500" />
                            </motion.div>
                        ))}
                    </div>
                </div>

            </motion.div>
        </div>
    );
};

export default Media;
