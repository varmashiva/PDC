import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WorkshopCard = ({ workshop }) => {
    // Cloudinary HEIC Fix: ensure the image is served in a browser-native format
    const getOptimizedImageUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col bg-transparent group cursor-pointer border-t border-white/10 pt-8"
        >
            {/* Visual Header with Large Label */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-red-500 uppercase mb-2">
                        [ WORKSHOP ]
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black font-['Outfit'] uppercase leading-[0.9] tracking-tight group-hover:text-red-500 transition-colors duration-300">
                        {workshop.title}
                    </h3>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black font-['Outfit']">₹{workshop.price}</span>
                </div>
            </div>

            {/* Main Image with Industrial Crop */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#111] mb-6">
                <img 
                    src={getOptimizedImageUrl(workshop.image)} 
                    alt={workshop.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                {/* 4 Corner Rivets for hardware look */}
                <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-white/20 rounded-full" />
                <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white/20 rounded-full" />
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/20 rounded-full" />
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 bg-white/20 rounded-full" />
            </div>
            
            {/* Meta Data with structured labels */}
            <div className="grid grid-cols-2 gap-y-4 border-b border-white/10 pb-8">
                <div className="flex flex-col">
                    <span className="text-[0.55rem] font-bold text-white/40 tracking-widest uppercase mb-1">DATE</span>
                    <span className="text-[0.8rem] font-black font-['Outfit']">{new Date(workshop.date).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[0.55rem] font-bold text-white/40 tracking-widest uppercase mb-1">TIME</span>
                    <span className="text-[0.8rem] font-black font-['Outfit'] uppercase">{workshop.time}</span>
                </div>
                <div className="flex flex-col col-span-2">
                    <span className="text-[0.55rem] font-bold text-white/40 tracking-widest uppercase mb-1">AVAILABILITY</span>
                    <span className="text-[0.8rem] font-black font-['Outfit'] uppercase">[{workshop.seats} SEATS REMAINING]</span>
                </div>
            </div>

            {/* Bottom Actions */}
            <Link 
                to={`/workshops/${workshop._id}`}
                className="mt-6 flex items-center justify-between text-[0.7rem] font-black font-['Outfit'] tracking-[0.1em] uppercase hover:text-red-500 transition-colors"
            >
                <span>BOOK YOUR SPOT NOW</span>
                <span className="text-lg">→</span>
            </Link>
        </motion.div>
    );
};

export default WorkshopCard;
