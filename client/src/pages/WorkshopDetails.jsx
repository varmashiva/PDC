import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { Calendar, Clock, MapPin, Users, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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
            // 1. Create Order
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
                        // 2. Verify Payment
                        await api.post('/payments/verify', response);
                        
                        // 3. Create Booking
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
        <div className="max-w-6xl mx-auto space-y-12 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/20">
                    <img src={workshop.image} alt={workshop.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-display">{workshop.title}</h1>
                        <p className="text-xl text-light/60">{workshop.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 p-6 glass rounded-2xl">
                        <div className="flex items-center gap-3">
                            <Calendar className="text-primary" />
                            <div>
                                <p className="text-xs text-light/40 uppercase">Date</p>
                                <p className="font-semibold">{new Date(workshop.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="text-primary" />
                            <div>
                                <p className="text-xs text-light/40 uppercase">Time</p>
                                <p className="font-semibold">{workshop.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="text-primary" />
                            <div>
                                <p className="text-xs text-light/40 uppercase">Seats</p>
                                <p className="font-semibold">{workshop.seats} Available</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-primary" />
                            <div>
                                <p className="text-xs text-light/40 uppercase">Instructor</p>
                                <p className="font-semibold">{workshop.createdBy?.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-8 glass rounded-3xl border-2 border-primary/20">
                        <div>
                            <p className="text-light/40">Total Amount</p>
                            <p className="text-4xl font-bold italic">₹{workshop.price}</p>
                        </div>
                        <button 
                            onClick={handleBooking}
                            disabled={workshop.seats <= 0}
                            className="bg-primary px-10 py-4 rounded-2xl font-bold text-xl hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {workshop.seats > 0 ? 'Book My Spot' : 'Sold Out'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkshopDetails;
