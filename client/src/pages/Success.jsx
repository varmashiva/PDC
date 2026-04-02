import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { CheckCircle2, FileText, Bookmark } from 'lucide-react';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState(null);

    useEffect(() => {
        if (!location.state || !location.state.booking) {
            navigate('/dashboard');
            return;
        }
        setBookingDetails(location.state.booking);
    }, [location, navigate]);

    const generateReceipt = () => {
        if (!bookingDetails) return;
        const { booking, workshop, user } = bookingDetails;
        
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("PDC Workshop Receipt", 20, 30);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Booking ID: ${booking._id}`, 20, 50);
        doc.text(`Transaction ID: ${booking.paymentId}`, 20, 60);
        doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`, 20, 70);
        
        doc.setLineWidth(0.5);
        doc.line(20, 75, 190, 75);

        doc.setFont("helvetica", "bold");
        doc.text("Attendee Details", 20, 85);
        doc.setFont("helvetica", "normal");
        doc.text(`Name: ${user.name}`, 20, 95);
        doc.text(`Email: ${user.email}`, 20, 105);

        doc.setFont("helvetica", "bold");
        doc.text("Workshop Details", 20, 120);
        doc.setFont("helvetica", "normal");
        doc.text(`Session: ${workshop.title}`, 20, 130);
        doc.text(`Date: ${new Date(workshop.date).toLocaleDateString()}`, 20, 140);
        
        doc.setLineWidth(0.5);
        doc.line(20, 150, 190, 150);

        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(`Amount Paid: Rs ${workshop.price}`, 20, 165);

        doc.save(`Receipt_${booking.paymentId}.pdf`);
    };

    if (!bookingDetails) return null;

    return (
        <div className="w-full min-h-screen bg-black text-white flex items-center justify-center p-6 font-['Outfit']">
            <div className="max-w-xl w-full bg-[#111] border border-green-500/30 p-12 rounded-[2rem] text-center shadow-[0_0_80px_rgba(34,197,94,0.1)] relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black rounded-full p-4 border border-green-500/30">
                    <CheckCircle2 size={64} className="text-green-500" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-8 mb-4">Payment Successful</h1>
                <p className="text-white/50 text-sm md:text-base font-medium mb-10">Your spot for <strong className="text-white">{bookingDetails.workshop.title}</strong> is confirmed!</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                        onClick={generateReceipt}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 hover:bg-white hover:text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all w-full"
                    >
                        <FileText size={16} /> Download Receipt
                    </button>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-[#ff1a1a] hover:bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest transition-all w-full"
                    >
                        <Bookmark size={16} /> Go To Registered Workshops
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Success;
