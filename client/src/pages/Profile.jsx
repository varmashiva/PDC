import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Profile = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchBookings = async () => {
            try {
                const { data } = await api.get('/bookings/mybookings');
                setBookings(data);
            } catch (error) {
                toast.error('Failed to load bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user, navigate]);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data: uploadData } = await api.post('/upload/avatar', formData);
            
            const { data: updatedUser } = await api.put('/auth/profile', {
                profileImage: uploadData.url
            });

            login(updatedUser, localStorage.getItem('token'));
            toast.success('Profile Image Updated');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Loader />;
    if (!user) return null;

    // Cloudinary HEIC Fix
    const getOptimizedImageUrl = (url) => {
        if (!url) return '';
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    return (
        <div className="min-h-screen bg-[#000] text-white pt-32 pb-16 px-6 md:px-16 font-['Outfit'] relative">
            
            <div className="max-w-7xl mx-auto">
                <h2 className="text-[#ff1a1a] tracking-[0.3em] font-black text-xs md:text-sm mb-10 uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff1a1a] animate-pulse"></span>
                    REGISTERED SESSIONS
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    
                    {/* LEFT PROFILE */}
                    <div className="bg-[#0e0e0e] border border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-2xl h-fit md:sticky md:top-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        
                        <div className="relative group shrink-0 mx-auto mb-6">
                            <img 
                                src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=111&color=fff&size=256`} 
                                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-white/10 group-hover:border-[#ff1a1a]/30 transition-all shadow-xl"
                                alt={user.name}
                            />
                            <div 
                                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload size={20} className="text-white" />
                            </div>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleUpload}
                            />
                            {uploading && (
                                <div className="absolute inset-0 bg-black/80 rounded-full flex items-center justify-center border border-[#ff1a1a]">
                                    <span className="text-[0.6rem] font-bold uppercase tracking-widest animate-pulse">Wait...</span>
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{user.name}</h2>
                        <p className="text-white/40 text-xs md:text-sm font-bold tracking-widest mt-2 lowercase">{user.email}</p>
                        
                        {user.role === 'admin' && (
                            <span className="inline-block mt-6 px-3 py-1 bg-[#ff1a1a]/10 border border-[#ff1a1a]/20 text-[#ff1a1a] text-[0.6rem] font-black tracking-[0.2em] uppercase rounded-full">
                                ADMIN ACCOUNT
                            </span>
                        )}
                    </div>

                    {/* RIGHT WORKSHOP */}
                    <div className="md:col-span-2 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {bookings.length === 0 ? (
                            <div className="bg-[#0e0e0e] border border-white/5 rounded-[2rem] p-16 flex flex-col items-center justify-center text-center shadow-xl">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white/50 mb-4">No bookings yet</h3>
                                <p className="text-white/30 text-sm max-w-sm mb-8">You haven't registered for any workshops. Secure your spot now.</p>
                                <button 
                                    onClick={() => navigate('/#workshops')}
                                    className="px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#ff1a1a] hover:text-white hover:-translate-y-0.5 transition-all shadow-xl"
                                >
                                    Browse Workshops
                                </button>
                            </div>
                        ) : (
                            bookings.map((booking) => {
                                const ws = booking.workshopId;
                                const isManual = booking.paymentId?.startsWith('manual_');
                                const participantName = user.name;
                                const participantEmail = user.email;

                                return (
                                    <div key={booking._id} className="bg-[#0e0e0e] border border-white/5 rounded-[2rem] overflow-hidden group hover:scale-[1.02] hover:border-white/10 transition-all duration-300 shadow-xl relative">

                                        {/* IMAGE */}
                                        <div className="relative h-56 md:h-64 overflow-hidden">
                                            {ws?.image ? (
                                                <img 
                                                    src={getOptimizedImageUrl(ws.image)} 
                                                    className="w-full h-full object-cover"
                                                    alt={ws?.title}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-[#111] text-white/10 text-xs font-black tracking-widest uppercase">
                                                    NO IMAGE
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent" />

                                            {/* STATUS */}
                                            <span className="absolute top-4 right-4 bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-[0.6rem] font-black tracking-widest uppercase flex items-center gap-1.5 backdrop-blur-md">
                                                <CheckCircle2 size={12} strokeWidth={3} />
                                                CONFIRMED
                                            </span>

                                            {/* DATE */}
                                            <p className="absolute bottom-5 left-6 md:left-8 text-2xl font-black uppercase tracking-tight text-white drop-shadow-lg">
                                                {ws?.date ? new Date(ws.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                                            </p>
                                        </div>

                                        {/* CONTENT */}
                                        <div className="p-6 md:p-8 relative bg-[#0e0e0e]">
                                            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-6 leading-none line-clamp-2">
                                                {ws?.title || 'Unknown Workshop'}
                                            </h3>

                                            {/* DETAILS BOX */}
                                            <div className="bg-black/40 border border-white/5 rounded-[1.25rem] p-5 mb-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col">
                                                        <p className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                                                            TIME
                                                        </p>
                                                        <p className="text-sm font-bold text-white/80 uppercase tracking-wide">
                                                            {ws?.time || 'TBA'}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <p className="text-[0.6rem] font-black text-white/30 uppercase tracking-[0.2em] mb-1">
                                                            PARTICIPANT
                                                        </p>
                                                        <div className="flex items-center gap-2 truncate">
                                                            <p className="text-sm font-bold text-white/80 uppercase truncate">
                                                                {participantName}
                                                            </p>
                                                            {isManual && <span className="text-[0.45rem] bg-[#ff1a1a]/10 text-[#ff1a1a] border border-[#ff1a1a]/20 px-1.5 py-0.5 rounded-sm font-black uppercase tracking-widest shrink-0">Manual</span>}
                                                        </div>
                                                        <p className="text-[0.65rem] text-white/40 font-semibold truncate mt-0.5">
                                                            {participantEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* FOOTER */}
                                            <div className="flex justify-between items-center text-[0.65rem] font-black uppercase tracking-[0.2em] text-gray-500 pt-2 border-t border-white/5">
                                                <span>TXN: {booking.paymentId?.split('_').pop() || 'N/A'}</span>
                                                <button className="text-gray-400 hover:text-white hover:underline transition-colors flex items-center gap-1">
                                                    VIEW DETAILS →
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
