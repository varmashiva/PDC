import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';
import Marquee from './Marquee';
import logo from '../assets/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const isHome = location.pathname === '/';
    const isAuthPage = ['/login', '/register'].includes(location.pathname);
    const isSpecialPage = ['/profile', '/dashboard', '/media'].includes(location.pathname);
    
    const containerClasses = isHome 
        ? 'absolute top-0 left-0 right-0 z-50 bg-transparent text-black' 
        : isAuthPage
            ? 'fixed top-0 left-0 right-0 z-50 pb-2 bg-[#ff1a1a] text-white'
            : `fixed top-0 left-0 right-0 z-50 transition-all duration-500 pb-2 ${
            isSpecialPage ? 'bg-black text-white shadow-2xl' : 'glass text-black shadow-sm'
          }`;

    return (
        <header className={containerClasses}>
            <Marquee />

            <nav className="w-full px-6 lg:px-10 pt-8 pb-4 flex items-center justify-between">
                
                <div className="hidden lg:grid grid-cols-5 w-full items-center font-['Outfit']">
                    
                    {/* Column 1: Slogan */}
                    <div className="flex flex-col items-start justify-start text-[0.60rem] lg:text-[0.65rem] font-bold uppercase tracking-[0.15em] leading-[1.7]">
                        <span className={`${isHome || isAuthPage || isSpecialPage ? 'text-white/50' : 'text-black/50'}`}>DEFINING</span>
                        <span className={`${isHome || isAuthPage || isSpecialPage ? 'text-white' : 'text-black'}`}>MOTION ARTISTRY</span>
                    </div>

                    {/* Column 2: Nav Links Left */}
                    <div className="flex items-center gap-6 justify-center text-[0.60rem] lg:text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                        <div className="flex items-center gap-[4px] hover:opacity-50 transition-opacity cursor-pointer">
                            <span className={`text-[0.45rem] ${isHome || isAuthPage || isSpecialPage ? 'text-white' : 'text-black'}`}>●</span>
                            <Link to="/">HOME</Link>
                        </div>
                        <a href="/#philosophy" className="hover:opacity-50 transition-opacity block">
                            ABOUT US
                        </a>
                        <a href="/#workshops" className="hover:opacity-50 transition-opacity block">
                            WORKSHOPS
                        </a>
                    </div>

                    {/* Column 3: Center Logo */}
                    <div className="flex justify-center flex-col items-center">
                        <Link to="/" className="hover:opacity-80 transition-opacity">
                            <img src={logo} alt="PDC Logo" className={`h-16 w-auto object-contain ${isHome || isAuthPage || isSpecialPage ? '' : 'invert'}`} />
                        </Link>
                    </div>

                    {/* Column 4: Nav Links Right */}
                    <div className="flex items-center justify-center gap-6 text-[0.60rem] lg:text-[0.65rem] font-bold uppercase tracking-[0.14em]">
                        <a href="/#previous-workshops" className="hover:opacity-50 transition-opacity block">
                            PREVIOUS
                        </a>
                        <Link to="/media" className="hover:opacity-50 transition-opacity block">
                            MEDIA
                        </Link>
                    </div>

                    {/* Column 5: Profile/CTA */}
                    <div className="flex justify-end relative items-center">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border ${isHome || isAuthPage || isSpecialPage ? 'bg-white/10 hover:bg-white/20 border-white/20' : 'bg-black/10 hover:bg-black/20 border-black/20'}`}
                                >
                                    <User size={16} strokeWidth={2} className={isHome || isAuthPage || isSpecialPage ? 'text-white' : 'text-black'} />
                                </button>
                                {showDropdown && (
                                    <div className="absolute top-14 right-0 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] py-2 flex flex-col z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <Link 
                                            to="/profile" 
                                            onClick={() => setShowDropdown(false)}
                                            className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            Bookings
                                        </Link>
                                        
                                        {user.role === 'admin' && (
                                            <Link 
                                                to="/dashboard" 
                                                onClick={() => setShowDropdown(false)}
                                                className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-[#ff1a1a] hover:bg-[#ff1a1a]/10 transition-colors"
                                            >
                                                Admin Console
                                            </Link>
                                        )}

                                        <button 
                                            onClick={() => {
                                                setShowDropdown(false);
                                                logout();
                                                navigate('/login');
                                            }}
                                            className="px-5 py-3 text-left text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5 mt-1 pt-3"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="relative px-6 py-[10px] text-[0.65rem] font-bold tracking-[0.12em] uppercase bg-[#111111] text-white hover:bg-white hover:text-black transition-all duration-300 rounded-md"
                            >
                                LOGIN / BOOK NOW
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="lg:hidden flex flex-col items-center justify-center w-full -mt-2">
                    <Link to="/" className="mb-1">
                        <img src={logo} alt="PDC Logo" className={`h-10 w-auto ${isHome || isAuthPage || isSpecialPage ? '' : 'invert'}`} />
                    </Link>
                    <span className={`text-[0.45rem] font-black tracking-[0.3em] uppercase ${isHome ? 'text-black/40' : 'text-white/40'}`}>
                        PREMIUM DANCE ARTISTRY
                    </span>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
