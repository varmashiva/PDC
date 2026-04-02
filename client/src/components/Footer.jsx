import React from 'react';
import { Mail, Target, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#ff1a1a] px-6 md:px-12 lg:px-24 xl:px-32 pt-4 pb-12 text-black selection:bg-black selection:text-[#ff1a1a]">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col">
          <h2 className="text-[1.8rem] sm:text-[3rem] md:text-[4rem] font-black leading-[0.9] tracking-tighter flex flex-col uppercase italic"
              style={{ fontFamily: '"Outfit", sans-serif' }}>
            <span>Prudhvi</span>
            <span className="ml-[0.1em]">Dance Club</span>
          </h2>
        </div>

        {/* GET IN TOUCH SECTION */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.25em] uppercase opacity-90">
            Get in Touch
          </h3>
          <div className="flex flex-col gap-3 font-semibold text-[0.65rem] sm:text-xs md:text-sm tracking-wide">
            <a href="mailto:HELLO@GATZARA.STUDIO" className="flex items-center gap-2 hover:opacity-100 transition-opacity uppercase">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5} />
              HELLO@GATZARA.STUDIO
            </a>
            <div className="flex items-start gap-2 uppercase">
              <Target className="w-3.5 h-3.5 md:w-4 md:h-4 mt-0.5" strokeWidth={2.5} />
              <span className="max-w-[200px]">Based out of Barcelona Working internationally</span>
            </div>
          </div>
        </div>

        {/* CONNECT ON SOCIAL SECTION */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.25em] uppercase opacity-90">
            Connect on Social
          </h3>
          <div className="flex flex-wrap gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white text-[0.55rem] sm:text-[0.65rem] font-bold tracking-[0.2em] uppercase rounded-[4px] flex items-center gap-2 group hover:scale-105 transition-all duration-300">
              <Linkedin className="w-3 h-3 md:w-3.5 md:h-3.5" fill="white" />
              Linkedin
              <div className="absolute top-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute top-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute bottom-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute bottom-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
            </a>
            <a href="#" className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-black text-white text-[0.55rem] sm:text-[0.65rem] font-bold tracking-[0.2em] uppercase rounded-[4px] flex items-center gap-2 group hover:scale-105 transition-all duration-300">
              <span className="text-[0.6rem] sm:text-[0.7rem] font-black">1S.</span>
              1Signature
              <div className="absolute top-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute top-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute bottom-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              <div className="absolute bottom-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
            </a>
          </div>
          <p className="mt-4 text-[0.65rem] md:text-[0.7rem] font-bold tracking-widest uppercase opacity-80">
            ©2026, PRUDHVI DANCE CLUB
          </p>
        </div>

        {/* STAY UP TO DATE SECTION */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h3 className="text-[0.65rem] md:text-[0.75rem] font-bold tracking-[0.25em] uppercase opacity-90">
            Stay Up to Date
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center w-full sm:w-[320px]">
              <input 
                type="email" 
                placeholder="NAME@MAIL.COM" 
                className="w-full h-[36px] sm:h-[40px] px-4 bg-white text-black text-[0.6rem] sm:text-[0.65rem] font-bold tracking-widest uppercase outline-none rounded-l-[4px] placeholder:text-gray-400"
              />
              <button className="relative h-[36px] sm:h-[40px] px-4 sm:px-6 bg-black text-white text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.2em] uppercase rounded-r-[4px] hover:bg-[#222] transition-colors">
                Submit
                <div className="absolute top-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
                <div className="absolute top-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
                <div className="absolute bottom-[4px] left-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
                <div className="absolute bottom-[4px] right-[4px] w-[2px] h-[2px] bg-white/40 rounded-full" />
              </button>
            </div>
            <p className="text-[0.55rem] md:text-[0.6rem] font-bold tracking-[0.3em] uppercase opacity-60">
              No spam. Just design goodies
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
