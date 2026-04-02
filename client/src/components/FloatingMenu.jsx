import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FloatingMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const menuItems = [
        { name: "Home", path: "/" },
        user?.role === 'admin' ? { name: "Dashboard", path: "/dashboard" } : { name: "Workshops", path: "/#workshops" },
        { name: "Media", path: "/media" },
        { name: "Profile", path: "/profile" }
    ];

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed bottom-8 w-full z-[100] lg:hidden flex flex-col items-center justify-end pointer-events-none">
            
            {/* Expanded Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[88vw] max-w-[340px] bg-[#e3e3e3] rounded-[2.5rem] pt-12 pb-[4.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/50 origin-bottom pointer-events-auto relative z-0 flex flex-col items-center -mb-[40px]"
                    >
                        <div className="flex flex-col gap-5 text-center items-center w-full">
                            {menuItems.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        navigate(item.path);
                                        setIsOpen(false);
                                    }}
                                    className="text-[2.2rem] leading-none font-semibold font-['Outfit'] tracking-[-0.04em] text-[#111] hover:text-[#555] active:scale-95 transition-all"
                                >
                                    {item.name}
                                </button>
                            ))}

                            {/* LOGOUT BUTTON */}
                            {user && (
                                <div className="mt-6 px-8 w-full pointer-events-auto">
                                    <button 
                                        onClick={handleLogout}
                                        className="relative w-auto min-w-[140px] mx-auto bg-[#1a1a1a] text-white px-8 py-3.5 rounded-xl text-[0.65rem] font-semibold tracking-[0.2em] uppercase active:scale-95 transition-transform flex items-center justify-center hover:bg-black group"
                                    >
                                        {/* Corners dots */}
                                        <span className="absolute top-[6px] left-[6px] w-[3px] h-[3px] bg-white/30 rounded-full group-hover:bg-[#ff1a1a] transition-colors"></span>
                                        <span className="absolute top-[6px] right-[6px] w-[3px] h-[3px] bg-white/30 rounded-full group-hover:bg-[#ff1a1a] transition-colors"></span>
                                        <span className="absolute bottom-[6px] left-[6px] w-[3px] h-[3px] bg-white/30 rounded-full group-hover:bg-[#ff1a1a] transition-colors"></span>
                                        <span className="absolute bottom-[6px] right-[6px] w-[3px] h-[3px] bg-white/30 rounded-full group-hover:bg-[#ff1a1a] transition-colors"></span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Floating Button perfectly recreating image 1 overlapping style + scroll progress */}
            <div className="relative flex items-center justify-center z-10 w-[80px] h-[80px] pointer-events-auto">
                <svg className="absolute w-[80px] h-[80px] -rotate-90 pointer-events-none drop-shadow-xl">
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="4"
                        fill="transparent"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#111111"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={2 * Math.PI * 36 * (1 - scrollProgress / 100)}
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                        strokeLinecap="round"
                    />
                </svg>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none"
                >
                    {isOpen ? <X size={28} strokeWidth={1.5} className="text-black" /> : <Menu size={28} strokeWidth={1.5} className="text-black" />}
                </button>
            </div>
            
        </div>
    );
};

export default FloatingMenu;
