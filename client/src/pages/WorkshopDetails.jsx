import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { Calendar, Clock, MapPin, Users, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';


const WorkshopDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const { data } = await api.get(`/workshops/${id}`);
                setWorkshop(data);
            } catch (error) {
                toast.error('Workshop not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshop();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book');
            navigate('/login');
            return;
        }

        try {
            const { data: order } = await api.post('/payments/order', { amount: workshop.price });
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: order.amount,
                currency: "INR",
                name: "PDC Sessions",
                description: `Booking for ${workshop.title}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        await api.post('/payments/verify', response);
                        const { data: booking } = await api.post('/bookings', {
                            workshopId: workshop._id,
                            paymentId: response.razorpay_payment_id
                        });
                        toast.success('Workshop booked successfully!');
                        navigate('/success', { state: { booking: { booking, workshop, user } } });
                    } catch (err) {
                        toast.error('Payment verification failed');
                        navigate('/failure');
                    }
                },
                theme: { color: "#ff1a1a" },
            };
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error(response.error.description);
                navigate('/failure');
            });
            rzp.open();
        } catch (error) {
            toast.error('Error initiating payment');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="w-full bg-[#f8f8f8] min-h-screen pb-20 selection:bg-black selection:text-[#ff1a1a]">
            {/* Header / Hero Section */}
            <div className="w-full px-3 md:px-4 pt-3">
                <section className="relative w-full overflow-hidden bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-black/5">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
                        
                        {/* 1. Large Workshop Image (LHS) */}
                        <div className="lg:col-span-7 relative group">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="aspect-[4/5] md:aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 group shadow-2xl relative"
                            >
                                <img 
                                    src={workshop.image} 
                                    alt={workshop.title} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                />
                                
                                {/* Overlay gradient for premium feel */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>

                            {/* Floating Stats / Tags */}
                            <div className="absolute -bottom-6 -right-6 hidden md:flex flex-col gap-2 z-10">
                                <span className="bg-[#ff1a1a] text-white px-6 py-3 rounded-full text-[0.65rem] font-black tracking-widest uppercase shadow-xl">
                                    {workshop.type || 'WORKSHOP'}
                                </span>
                            </div>
                        </div>

                        {/* 2. Content Info (RHS) */}
                        <div className="lg:col-span-5 flex flex-col pt-4 md:pt-0">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <span className="text-[0.65rem] font-black tracking-[0.4em] text-[#ff1a1a] uppercase mb-4 block">
                                    {new Date(workshop.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-[#111] leading-[0.9] tracking-tighter mb-8 font-['Outfit'] uppercase">
                                    {workshop.title}
                                </h1>
                                <p className="text-sm md:text-base text-black/60 leading-relaxed max-w-md mb-12 font-medium">
                                    {workshop.description}
                                </p>

                                {/* Event Details Grid */}
                                <div className="grid grid-cols-2 gap-8 mb-12 border-t border-black/10 pt-10">
                                    <div className="space-y-1">
                                        <p className="text-[0.6rem] font-bold text-black/40 uppercase tracking-[0.2em]">Date & Time</p>
                                        <p className="text-sm font-black text-[#111] font-['Outfit'] uppercase">
                                            {new Date(workshop.date).toLocaleDateString()} — {workshop.time}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[0.6rem] font-bold text-black/40 uppercase tracking-[0.2em]">Location</p>
                                        <p className="text-sm font-black text-[#111] font-['Outfit'] uppercase">
                                            {workshop.location || 'Studio PDC'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[0.6rem] font-bold text-black/40 uppercase tracking-[0.2em]">Instructor</p>
                                        <p className="text-sm font-black text-[#111] font-['Outfit'] uppercase">
                                            {workshop.createdBy?.name || 'PDC Expert'}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[0.6rem] font-bold text-black/40 uppercase tracking-[0.2em]">Availability</p>
                                        <p className="text-sm font-black text-[#111] font-['Outfit'] uppercase">
                                            {workshop.seats} SPOTS REMAINING
                                        </p>
                                    </div>
                                </div>

                                {/* Booking Card Inside */}
                                <div className="bg-[#111] p-10 rounded-2xl text-white relative overflow-hidden group">
                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4">
                                        <div>
                                            <p className="text-[0.6rem] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">TOTAL INVESTMENT</p>
                                            <p className="text-5xl font-black italic font-['Outfit'] tracking-tighter">₹{workshop.price}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={handleBooking}
                                            disabled={workshop.seats <= 0}
                                            className="relative bg-white text-black px-10 py-5 font-['Outfit'] text-[0.8rem] font-black tracking-[0.15em] uppercase hover:bg-[#ff1a1a] hover:text-white transition-all duration-500 rounded-sm group/btn shadow-xl disabled:opacity-50"
                                        >
                                            {workshop.seats > 0 ? 'BOOK MY SPOT' : 'SOLD OUT'}
                                            
                                            {/* Hardware Dots */}
                                            <div className="absolute top-[6px] left-[6px] w-[3px] h-[3px] bg-black/20 rounded-full" />
                                            <div className="absolute top-[6px] right-[6px] w-[3px] h-[3px] bg-black/20 rounded-full" />
                                            <div className="absolute bottom-[6px] left-[6px] w-[3px] h-[3px] bg-black/20 rounded-full" />
                                            <div className="absolute bottom-[6px] right-[6px] w-[3px] h-[3px] bg-black/20 rounded-full" />
                                        </button>
                                    </div>

                                    {/* Abstract BG Decor */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ff1a1a]/10 rounded-full blur-3xl" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Additional Details Section */}
            <div className="max-w-7xl mx-auto px-6 mt-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <span className="text-[0.6rem] font-black text-[#ff1a1a] uppercase tracking-widest">01 / Foundation</span>
                        <h3 className="text-2xl font-black uppercase font-['Outfit']">Master the basics</h3>
                        <p className="text-sm text-black/50 leading-relaxed">Focus on core techniques and foundational movements that define the PDC style. Precision before performance.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[0.6rem] font-black text-[#ff1a1a] uppercase tracking-widest">02 / Expression</span>
                        <h3 className="text-2xl font-black uppercase font-['Outfit']">Finding your flow</h3>
                        <p className="text-sm text-black/50 leading-relaxed">Transition from steps to storytelling. Learn how to channel energy and presence in every motion.</p>
                    </div>
                    <div className="space-y-4">
                        <span className="text-[0.6rem] font-black text-[#ff1a1a] uppercase tracking-widest">03 / Performance</span>
                        <h3 className="text-2xl font-black uppercase font-['Outfit']">Own the stage</h3>
                        <p className="text-sm text-black/50 leading-relaxed">Final polished sequences ready for the spotlight. Build the confidence to perform unapologetically.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails;
