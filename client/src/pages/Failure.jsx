import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, RefreshCcw } from 'lucide-react';

const Failure = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6 font-['Outfit']">
            <div className="max-w-xl w-full bg-[#111] border border-red-500/30 p-12 rounded-[2rem] text-center shadow-[0_0_80px_rgba(239,68,68,0.1)] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black rounded-full p-4 border border-red-500/30">
                    <XCircle size={64} className="text-red-500" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-8 mb-4">Payment Failed</h1>
                <p className="text-white/50 text-sm md:text-base font-medium mb-10">We couldn't process your payment. Please try again.</p>
                
                <div className="flex justify-center">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-3 px-10 py-4 bg-[#ff1a1a] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                    >
                        <RefreshCcw size={16} /> Retry Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Failure;
