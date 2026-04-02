// client/src/components/CTAButton.jsx
import React from 'react';

const CTAButton = ({ children, onClick, className = '' }) => {
    return (
        <button 
            onClick={onClick}
            className={`group inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:!bg-white hover:!text-black transition-all duration-300 transform hover:scale-[1.02] shadow-xl ${className}`}
        >
            {children}
        </button>
    );
};

export default CTAButton;
