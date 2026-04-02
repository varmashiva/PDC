import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            handleGoogleCallback(token);
        }
    }, []);

    const handleGoogleCallback = async (token) => {
        try {
            const { data } = await api.get('/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(data, token);
            toast.success(`Welcome, ${data.name}!`);
            navigate('/');
        } catch (error) {
            toast.error('Google registration failed');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            login(data, data.token);
            toast.success(`Account created! Welcome, ${data.name}`);
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#ff1a1a] text-white px-4 sm:px-6 font-['Outfit'] flex flex-col justify-center items-center relative overflow-hidden -mt-32 pt-[10rem] pb-16 z-0">

            <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-white/40 text-[0.7rem] font-bold uppercase tracking-widest">
                        Join the studio roster
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-sm font-bold outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Email Address</label>
                        <input 
                            type="email" 
                            className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-sm font-bold outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                            placeholder="name@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/40 ml-2">Security Key</label>
                        <input 
                            type="password" 
                            className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-xl text-sm font-bold outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all text-white placeholder:text-white/10"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="w-full mt-8 bg-white text-black py-4 rounded-xl text-[0.65rem] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border hover:border-white/20 hover:-translate-y-1 transition-all shadow-xl hover:shadow-[0_10px_40px_rgba(255,255,255,0.1)] duration-300 flex items-center justify-center gap-2 group border border-transparent">
                        Initialize Profile
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="relative flex items-center justify-center py-8">
                    <div className="border-t border-white/5 w-full absolute"></div>
                    <span className="bg-[#0a0a0a] px-4 z-10 text-white/20 text-[0.6rem] font-black uppercase tracking-[0.2em]">OR</span>
                </div>

                <button 
                    onClick={handleGoogleLogin}
                    className="w-full bg-white/[0.02] border border-white/5 text-white py-4 rounded-xl text-[0.65rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg"
                >
                    <img src="https://www.google.com/favicon.ico" className="w-4 grayscale opacity-80" alt="G" />
                    Connect via Google
                </button>

                <p className="text-center text-[0.65rem] font-bold uppercase tracking-widest text-white/30 mt-10">
                    Already registered? <Link to="/login" className="text-white hover:text-[#ff1a1a] transition-colors">Access Portal</Link>
                </p>
            </div>
            
            <div className="mt-12 text-center text-[0.5rem] font-black uppercase tracking-[0.4em] text-white/10">
                PDC © {new Date().getFullYear()} Global Operations
            </div>
        </div>
    );
};

export default Register;
