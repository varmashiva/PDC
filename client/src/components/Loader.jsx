import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] w-full bg-white rounded-2xl">
            <div className="relative w-20 h-20">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-black/5 rounded-full"
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-[#ff1a1a] rounded-full"
                />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#ff1a1a] rounded-full shadow-[0_0_10px_#ff1a1a]" />
            </div>
            <div className="mt-8 space-y-2 text-center">
                <p className="text-[0.6rem] font-black tracking-[0.5em] text-[#ff1a1a] uppercase">Initializing</p>
                <p className="text-xl font-black uppercase font-['Outfit'] tracking-tighter">PDC Sessions</p>
            </div>
        </div>
    );
};

export default Loader;
