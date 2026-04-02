import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { 
    Plus, Trash2, Edit, Calendar, Clock, User, 
    IndianRupee, Users, Download, Activity, 
    LayoutDashboard, Briefcase, Settings, X, Upload,
    ChevronRight, ArrowUpRight, Search, Filter 
} from 'lucide-react';
import toast from 'react-hot-toast';
import socket from '../services/socket';
import { jsPDF } from "jspdf";

const Dashboard = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [workshops, setWorkshops] = useState([]); 
    const [allBookings, setAllBookings] = useState([]); 
    const [usersList, setUsersList] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0); 
    const [activeUsers, setActiveUsers] = useState(0); 
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('workshops');

    // Modal & Form States
    const [showModal, setShowModal] = useState(false);
    const [editingWorkshop, setEditingWorkshop] = useState(null);
    const [formData, setFormData] = useState({
        title: '', description: '', featuredDescription: '', 
        date: '', time: '', price: '', seats: '', image: null
    });
    const [uploading, setUploading] = useState(false);
    const [workshopToDelete, setWorkshopToDelete] = useState(null);
    const [showManualModal, setShowManualModal] = useState(false);
    const [manualData, setManualData] = useState({ name: '', email: '', workshopId: '' });

    const isAdmin = user?.role === 'admin';

    const fetchData = async () => {
        try {
            if (isAdmin) {
                const [workshopsRes, allBookingsRes, usersRes] = await Promise.all([
                    api.get('/workshops'),
                    api.get('/bookings'),
                    api.get('/auth/users')
                ]);
                setWorkshops(workshopsRes.data);
                setAllBookings(allBookingsRes.data);
                setUsersList(usersRes.data);
                setTotalUsers(usersRes.data.length);
            }
            const { data } = await api.get('/bookings/mybookings');
            setBookings(data);
        } catch (error) {
            toast.error('Error fetching dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();

        socket.on('activeUsers', (count) => setActiveUsers(count));
        return () => socket.off('activeUsers');
    }, [user, isAdmin]);

    const handleManualBooking = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings/manual', manualData);
            toast.success('Participant added successfully');
            setShowManualModal(false);
            setManualData({ name: '', email: '', workshopId: '' });
            fetchData(); // Refresh data
        } catch (error) {
            toast.error(error.response?.data?.message || 'Manual booking failed');
        }
    };

    // Cloudinary HEIC Fix: ensure the image is served in a browser-native format
    const getOptimizedImageUrl = (url) => {
        if (!url) return 'https://placehold.co/800x450/0a0a0a/ff1a1a?text=NO+IMAGE';
        if (typeof url === 'string' && url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    const handleSaveWorkshop = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let imageUrl = formData.image;
            
            // Upload new file or handle new workshop with a file selected
            if (formData.image instanceof File) {
                const uploadFormData = new FormData();
                uploadFormData.append('image', formData.image);
                const { data: uploadData } = await api.post('/upload', uploadFormData);
                imageUrl = uploadData.url;
            }

            const payload = { ...formData, image: imageUrl };
            if (editingWorkshop) {
                const { data } = await api.put(`/workshops/${editingWorkshop._id}`, payload);
                setWorkshops(prev => prev.map(ws => ws._id === data._id ? data : ws));
                toast.success('Workshop updated');
            } else {
                // Ensure image exists for new workshop
                if (!imageUrl || imageUrl instanceof File) {
                    toast.error('Please select an image');
                    return;
                }
                const { data } = await api.post('/workshops', payload);
                setWorkshops(prev => [data, ...prev]);
                toast.success('Workshop created');
            }
            setShowModal(false);
            setEditingWorkshop(null);
            setFormData({ title: '', description: '', featuredDescription: '', date: '', time: '', price: '', seats: '', image: null });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        } finally {
            setUploading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/workshops/${workshopToDelete}`);
            setWorkshops(prev => prev.filter(ws => ws._id !== workshopToDelete));
            toast.success('Deleted');
        } catch (error) {
            toast.error('Delete failed');
        } finally {
            setWorkshopToDelete(null);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] flex overflow-hidden">
            
            {/* --- SIDEBAR (FIXED LEFT BELOW NAVBAR) --- */}
            <aside className="fixed top-32 left-0 w-20 md:w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-[calc(100vh-128px)] overflow-hidden group transition-all duration-500 z-40">
                <div className="p-6 md:p-8 flex items-center justify-center md:justify-start gap-4">
                    <div className="w-10 h-10 bg-[#ff1a1a] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,26,26,0.3)]">
                        <span className="text-black font-black text-xl">P</span>
                    </div>
                    <span className="hidden md:block font-black text-xl tracking-tighter uppercase whitespace-nowrap">Studio Admin</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {isAdmin && (
                        <>
                            <NavItem active={activeTab === 'workshops'} onClick={() => setActiveTab('workshops')} icon={<Briefcase size={20} />} label="Workshops" />
                            <NavItem active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<Calendar size={20} />} label="All Bookings" />
                            <NavItem active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} icon={<IndianRupee size={20} />} label="Revenue" />
                            <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={20} />} label="Users" />
                        </>
                    )}
                    {!isAdmin && (
                        <NavItem active={activeTab === 'my-bookings'} onClick={() => setActiveTab('my-bookings')} icon={<Download size={20} />} label="My Bookings" />
                    )}
                </nav>

                <div className="p-4 border-t border-white/5 mx-2 mb-4 bg-white/5 rounded-2xl hidden md:block">
                    <div className="flex items-center gap-3">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=ff1a1a&color=000`} 
                            className="w-10 h-10 rounded-full border border-white/10" 
                            alt=""
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black uppercase truncate">{user.name}</p>
                            <p className="text-[0.6rem] text-white/40 uppercase font-bold tracking-widest">{user.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* --- MAIN CONTENT (FIXED RIGHT OF SIDEBAR) --- */}
            <main className="flex-1 ml-20 md:ml-64 min-h-screen bg-[radial-gradient(circle_at_top_right,_#110505_0%,_transparent_40%)]">
                
                {/* TOP BAR (BLOCK HEADER - NO LONGER STICKY) */}
                <header className="w-full bg-[#050505] border-b border-white/5 px-8 py-10 flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#ff1a1a] mb-1">
                            [{activeTab.replace('-', ' ').toUpperCase()}]
                        </h2>
                        <p className="text-[0.65rem] text-white/40 font-bold uppercase tracking-widest">Global Administration Console</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {isAdmin && activeTab === 'workshops' && (
                            <button 
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2.5 bg-[#ff1a1a] text-black text-[0.65rem] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_5px_20px_rgba(255,26,26,0.2)]"
                            >
                                + New Workshop
                            </button>
                        )}
                        {isAdmin && activeTab === 'bookings' && (
                            <button 
                                onClick={() => setShowManualModal(true)}
                                className="px-6 py-2.5 bg-white text-black text-[0.65rem] font-black uppercase tracking-widest rounded-lg hover:bg-[#ff1a1a] transition-all"
                            >
                                + Add Participant
                            </button>
                        )}
                    </div>
                </header>

                <div className="p-8 space-y-12 max-w-6xl mx-auto">
                    
                    {/* REVENUE CONTENT (MOVED KPI BOARD HERE) */}
                    {activeTab === 'revenue' && isAdmin && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* KPI Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <StatCard icon={<Activity />} title="Live Presence" value={activeUsers} sub={`${totalUsers} Total Accounts`} />
                                <StatCard icon={<IndianRupee />} title="Total Revenue" value={`₹${allBookings.reduce((acc, b) => acc + (b.workshopId?.price || 0), 0).toLocaleString()}`} color="text-[#00ff9d]" />
                                <StatCard icon={<Calendar />} title="Total Bookings" value={allBookings.length} />
                                <StatCard icon={<Users />} title="Conversion" value="64%" trend="+12%" />
                            </div>

                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest">Recent Transactions</h3>
                                {allBookings.slice(0, 10).map(b => (
                                    <div key={b._id} className="flex items-center gap-4 group">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/10 flex items-center justify-center shrink-0">
                                            <IndianRupee size={14} className="text-green-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[0.7rem] font-black uppercase truncate">{b.userId?.name}</p>
                                            <p className="text-[0.6rem] text-white/30 uppercase font-bold tracking-tighter truncate">{b.workshopId?.title}</p>
                                        </div>
                                        <span className="text-[0.6rem] font-black text-[#00ff9d]">+₹{b.workshopId?.price}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* WORKSHOPS CONTENT */}
                    {activeTab === 'workshops' && isAdmin && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {workshops.map(ws => (
                                    <div key={ws._id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-[#ff1a1a]/50 transition-all duration-500">
                                        <div className="aspect-[16/9] overflow-hidden relative bg-white/5">
                                            <img 
                                                src={getOptimizedImageUrl(ws.image)} 
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                                                alt={ws.title} 
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <div className="absolute top-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => { setEditingWorkshop(ws); setFormData({...ws, date: ws.date.split('T')[0]}); setShowModal(true); }} className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-[#ff1a1a] transition-all"><Edit size={16} /></button>
                                                <button onClick={() => setWorkshopToDelete(ws._id)} className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <span className="text-[0.6rem] text-[#ff1a1a] font-black uppercase tracking-[0.2em]">
                                                    {ws.status === 'completed' ? '[ SESSION COMPLETED ]' : '[ ACTIVE SESSION ]'}
                                                </span>
                                                <h4 className={`text-xl font-black uppercase tracking-tight group-hover:text-[#ff1a1a] transition-all ${ws.status === 'completed' ? 'opacity-50' : ''}`}>{ws.title}</h4>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                                <div className="text-[0.65rem] font-bold text-white/40 uppercase tracking-widest leading-loose">
                                                    Slot: <span className="text-white">{ws.seats}</span><br/>
                                                    Price: <span className="text-white">₹{ws.price}</span>
                                                </div>
                                                <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* USERS CONTENT */}
                    {activeTab === 'users' && isAdmin && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <StatCard icon={<Activity />} title="Live Presence" value={activeUsers} sub="Connected Now" color="text-[#00ff9d]" />
                                <StatCard icon={<Users />} title="Total Base" value={usersList.length} sub="Registered Accounts" />
                            </div>

                            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-white/[0.02] border-b border-white/5">
                                        <tr className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-white/30">
                                            <th className="px-8 py-6">User / Identity</th>
                                            <th className="px-8 py-6">Email Address</th>
                                            <th className="px-8 py-6">Privilege</th>
                                            <th className="px-8 py-6 text-right">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {usersList.map(u => (
                                            <tr key={u._id} className="hover:bg-white/[0.01] transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#ff1a1a]/10 flex items-center justify-center text-[#ff1a1a] text-[0.6rem] font-black">
                                                            {u.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <p className="text-xs font-black uppercase">{u.name}</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-[0.6rem] text-white/30 font-bold tracking-widest uppercase truncate max-w-[200px]">{u.email}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[0.55rem] font-black tracking-widest uppercase ${u.role === 'admin' ? 'bg-[#ff1a1a]/10 text-[#ff1a1a]' : 'bg-white/5 text-white/40'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <p className="text-[0.65rem] font-bold text-white/50">{new Date(u.createdAt).toLocaleDateString()}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* BOOKINGS TABLE */}
                    {(activeTab === 'bookings' || activeTab === 'my-bookings') && (
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 animate-in spin-in">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02] border-b border-white/5">
                                    <tr className="text-[0.65rem] font-black uppercase tracking-[0.3em] text-white/30">
                                        <th className="px-8 py-6">Identity / Source</th>
                                        <th className="px-8 py-6">Linked Session</th>
                                        <th className="px-8 py-6">Transaction ID</th>
                                        <th className="px-8 py-6">Timestamp</th>
                                        <th className="px-8 py-6 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {(activeTab === 'bookings' ? allBookings : bookings).map(b => (
                                        <tr key={b._id} className="hover:bg-white/[0.01] group transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#ff1a1a]/10 flex items-center justify-center text-[#ff1a1a] text-[0.6rem] font-black">
                                                        {b.userId?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase flex items-center gap-2">
                                                            {b.userId?.name || user.name}
                                                            {b.paymentId?.startsWith('manual_') && (
                                                                <span className="text-[0.5rem] text-[#ff1a1a] bg-[#ff1a1a]/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">Manual record</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[0.6rem] text-white/30 truncate max-w-[120px]">{b.userId?.email || user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold uppercase tracking-tight">{b.workshopId?.title || 'Unknown Workshop'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <code className="text-[0.6rem] text-white/40 bg-white/5 px-2 py-1 rounded truncate block max-w-[100px]">{b.paymentId || 'MANUAL-ENTRY'}</code>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-[0.65rem] font-bold text-white/50">{new Date(b.createdAt).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="inline-block px-3 py-1 bg-green-500/10 text-green-500 text-[0.55rem] font-black tracking-widest uppercase rounded-full">Success</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* --- MODAL --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                    <div className="relative bg-[#0d0d0d] border border-white/10 p-10 rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_100px_rgba(255,26,26,0.1)]">
                         <div className="flex justify-between items-center mb-12">
                            <div className="space-y-1">
                                <span className="text-[0.6rem] font-black text-[#ff1a1a] tracking-[0.4em] uppercase">[ SESSION_CONFIG ]</span>
                                <h2 className="text-4xl font-black uppercase tracking-tight">{editingWorkshop ? 'Revise Entry' : 'New Workshop'}</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-full hover:bg-[#ff1a1a] hover:text-black transition-all flex items-center justify-center"><X size={24} /></button>
                         </div>
                         <form onSubmit={handleSaveWorkshop} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <Input label="Title" placeholder="FUSION" value={formData.title} onChange={v => setFormData({...formData, title: v})} />
                                    <Textarea label="Description" value={formData.description} onChange={v => setFormData({...formData, description: v})} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Date" type="date" value={formData.date} onChange={v => setFormData({...formData, date: v})} />
                                        <Input label="Time" type="time" value={formData.time} onChange={v => setFormData({...formData, time: v})} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Price (₹)" type="number" value={formData.price} onChange={v => setFormData({...formData, price: v})} />
                                        <Input label="Slots" type="number" value={formData.seats} onChange={v => setFormData({...formData, seats: v})} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-2">Workshop Visual</label>
                                        <label className="block border-2 border-dashed border-white/10 rounded-3xl p-10 text-center cursor-pointer hover:border-[#ff1a1a]/50 transition-all bg-white/[0.02] group">
                                            <Upload className="mx-auto text-white/20 group-hover:text-[#ff1a1a] transition-all mb-4" />
                                            <p className="text-[0.65rem] font-black uppercase tracking-widest text-white/40">Select Graphics</p>
                                            <input type="file" className="hidden" onChange={e => setFormData({...formData, image: e.target.files[0]})} />
                                        </label>
                                    </div>
                                    <button disabled={uploading} className="w-full bg-[#ff1a1a] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-[#ff1a1a]/20">
                                        {uploading ? 'Processing...' : (editingWorkshop ? 'Save Changes' : 'Publish Workshop')}
                                    </button>
                                </div>
                         </form>
                    </div>
                </div>
            )}

            {workshopToDelete && <DeleteModal onAbort={() => setWorkshopToDelete(null)} onConfirm={confirmDelete} />}

            {/* MANUAL BOOKING MODAL */}
            {showManualModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-3xl p-10 space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <span className="text-[0.6rem] font-black text-[#ff1a1a] tracking-[0.4em] uppercase shadow-sm">[ ENTRY_PROTOCOL ]</span>
                                <h2 className="text-xl font-black uppercase tracking-widest text-white">Manual Enrollment</h2>
                            </div>
                            <button onClick={() => setShowManualModal(false)} className="text-white/40 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleManualBooking} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 ml-2">Workshop Context</label>
                                <select 
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-xs font-black uppercase text-white focus:border-[#ff1a1a]/50 transition-all outline-none appearance-none cursor-pointer"
                                    value={manualData.workshopId}
                                    onChange={(e) => setManualData({...manualData, workshopId: e.target.value})}
                                >
                                    <option value="" className="bg-[#0a0a0a]">Select Session...</option>
                                    {workshops.filter(ws => ws.status !== 'completed').map(ws => (
                                        <option key={ws._id} value={ws._id} className="bg-[#111]">
                                            {ws.title} (₹{ws.price})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 ml-2">Participant Name</label>
                                    <input required type="text" className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-xs font-black uppercase text-white focus:border-[#ff1a1a]/50 transition-all outline-none" value={manualData.name} onChange={(e) => setManualData({...manualData, name: e.target.value})} placeholder="Full name..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/40 ml-2">Participant Email</label>
                                    <input required type="email" className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-4 text-xs font-black uppercase text-white focus:border-[#ff1a1a]/50 transition-all outline-none" value={manualData.email} onChange={(e) => setManualData({...manualData, email: e.target.value})} placeholder="Email address..." />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-5 bg-[#ff1a1a] text-black text-[0.65rem] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all shadow-[0_10px_40px_rgba(255,26,26,0.2)]">
                                Confirm Entry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// UI COMPONENTS
const NavItem = ({ active, onClick, icon, label }) => (
    <button onClick={onClick} className={`w-full flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl transition-all duration-300 relative group truncate ${active ? 'bg-[#ff1a1a] text-black' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
        {icon}
        <span className="hidden md:block font-black uppercase text-[0.65rem] tracking-widest">{label}</span>
        {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-l-full" />}
    </button>
);

const StatCard = ({ icon, title, value, sub, color = "text-white", trend }) => (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-all">
        <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#ff1a1a] transition-all">
                {icon}
            </div>
            {trend && <span className="text-[0.65rem] font-bold text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-0.5 rounded-full">{trend}</span>}
        </div>
        <h3 className="text-white/30 text-[0.6rem] font-black uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
        {sub && <p className="text-[0.6rem] font-bold text-white/20 uppercase tracking-widest mt-1">{sub}</p>}
    </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-2">{label}</label>
        <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold uppercase outline-none focus:border-[#ff1a1a] transition-all" />
    </div>
);

const Textarea = ({ label, value, onChange }) => (
    <div className="space-y-2">
        <label className="text-[0.6rem] font-black uppercase tracking-widest text-white/30 ml-2">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-medium min-h-[120px] outline-none focus:border-[#ff1a1a] transition-all" />
    </div>
);

const DeleteModal = ({ onAbort, onConfirm }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
        <div className="bg-[#0d0d0d] border border-red-500/20 p-10 rounded-[3rem] text-center space-y-6 max-w-sm">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 mx-auto rounded-full flex items-center justify-center"><Trash2 size={40} /></div>
            <h2 className="text-2xl font-black uppercase">Purge Protocol</h2>
            <p className="text-[0.65rem] font-bold text-white/40 uppercase tracking-widest leading-loose">This will permanently remove the record from the global lattice.</p>
            <div className="flex gap-4">
                <button onClick={onAbort} className="flex-1 bg-white/5 py-4 rounded-2xl font-black uppercase text-[0.6rem] tracking-[0.2em] hover:bg-white/10">Abort</button>
                <button onClick={onConfirm} className="flex-1 bg-red-500 py-4 rounded-2xl font-black uppercase text-[0.6rem] tracking-[0.2em] text-black hover:bg-white">Confirm</button>
            </div>
        </div>
    </div>
);

export default Dashboard;
