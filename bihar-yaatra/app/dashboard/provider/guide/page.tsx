"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

interface GuideProfile {
    id: string;
    name: string;
    slug: string;
    bio: string;
    location: string;
    languages: string[];
    skills: string[];
    price_per_day: number;
    is_available: boolean;
    is_verified: boolean;
    avg_rating: number;
}

interface GuideBooking {
    id: string;
    service_type: string;
    service_name: string;
    status: string;
    total_amount: string | number;
    guests: number;
    check_in: string;
    check_out: string;
}

export default function GuideDashboardPage() {
    const { user } = useAuth();
    const [guideProfiles, setGuideProfiles] = useState<GuideProfile[]>([]);
    const [bookings, setBookings] = useState<GuideBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [guidesRes, bookingsRes] = await Promise.all([
                    apiClient.get('/guides/my/listings'),
                    apiClient.get('/bookings/provider'),
                ]);
                setGuideProfiles(guidesRes.data || []);
                setBookings(bookingsRes.data || []);
            } catch (err) {
                console.error('Error fetching guide data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const guideBookings = bookings.filter(b => b.service_type === 'guide');
    const confirmedBookings = guideBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalEarnings = confirmedBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    const totalGuests = confirmedBookings.reduce((sum, b) => sum + (b.guests || 0), 0);

    const today = new Date().toISOString().slice(0, 10);
    const todayTours = guideBookings.filter(b => b.check_in?.slice(0, 10) === today).length;
    const pendingInquiries = guideBookings.filter(b => b.status === 'pending');

    const guideName = user?.name || 'Guide';
    const guideInitials = guideName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const guideProfile = guideProfiles[0]; // Primary guide profile

    // Find the next upcoming booking
    const upcomingBookings = guideBookings
        .filter(b => (b.status === 'confirmed' || b.status === 'pending') && b.check_in)
        .sort((a, b) => new Date(a.check_in).getTime() - new Date(b.check_in).getTime());
    const nextJob = upcomingBookings[0] || null;

    const getGreeting = () => {
        const hours = new Date().getHours();
        return hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
    };

    if (loading) {
        return (
            <div className="animate-fade-in max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{getGreeting()}</h2>
                    <h1 className="text-2xl lg:text-3xl font-display font-black">
                        <span>{guideName}</span>
                        {guideProfile && (
                            <span className="text-blue-600 text-sm font-sans ml-2">({guideProfile.is_verified ? 'Verified Guide' : 'Pending Verification'})</span>
                        )}
                    </h1>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex flex-col items-end">
                        {guideProfile && (
                            <>
                                <span className="text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full uppercase">{guideProfile.languages?.length || 0} languages</span>
                                <div className="flex text-yellow-400 text-[10px] mt-1 gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className={`fas ${i < Math.floor(guideProfile.avg_rating || 0) ? 'fa-star' : i < (guideProfile.avg_rating || 0) ? 'fa-star-half-alt' : 'fa-star text-gray-200'}`}></i>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                        {guideInitials}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><i className="fas fa-calendar-check"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Booked Today</p>
                        <p className="text-2xl font-display font-bold text-gray-800">{todayTours} Tours</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-xl group-hover:bg-green-600 group-hover:text-white transition-colors"><i className="fas fa-wallet"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Earnings (All Time)</p>
                        <p className="text-2xl font-display font-bold text-gray-800">₹{totalEarnings.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><i className="fas fa-users"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Happy Guests</p>
                        <p className="text-2xl font-display font-bold text-gray-800">{totalGuests}+</p>
                    </div>
                </div>
            </div>

            {/* Next Job Card */}
            <div className="bg-gray-900 rounded-[2.5rem] p-8 mt-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="absolute right-0 top-0 opacity-5 p-4 transform translate-x-10 -translate-y-10"><i className="fas fa-map-location-dot text-[15rem]"></i></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 hidden md:block"></div>
                
                <div className="relative z-10">
                    {nextJob ? (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md">Next Job</span>
                                <span className="text-gray-400 text-xs font-medium">• {nextJob.check_in ? new Date(nextJob.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8 tracking-tight">{nextJob.service_name || 'Guide Tour'}</h2>
                            <div className="flex flex-wrap gap-6 md:gap-12">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><i className="fas fa-user-friends"></i></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Guests</p>
                                        <p className="text-sm font-bold text-gray-100">{nextJob.guests} guest{nextJob.guests !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400"><i className="fas fa-rupee-sign"></i></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Amount</p>
                                        <p className="text-sm font-bold text-gray-100">₹{Number(nextJob.total_amount).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 font-bold italic py-8">No upcoming tours scheduled. Relax or update your availability!</p>
                    )}
                </div>
            </div>

            {/* Inquiries + Availability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <h3 className="font-display font-bold text-xl mb-6">Pending Inquiries ({pendingInquiries.length})</h3>
                    <div className="space-y-4">
                        {pendingInquiries.length === 0 ? (
                            <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-400">
                                <i className="fas fa-inbox text-2xl mb-2"></i>
                                <p className="text-sm font-medium">No pending inquiries</p>
                            </div>
                        ) : (
                            pendingInquiries.slice(0, 4).map((inquiry, i) => (
                                <div key={i} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition cursor-pointer group">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{inquiry.service_name || 'Guide Tour'}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                                            {inquiry.check_in ? new Date(inquiry.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No date'} • {inquiry.guests} guest{inquiry.guests !== 1 ? 's' : ''} • ₹{Number(inquiry.total_amount).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-gray-50/80 text-9xl pointer-events-none"><i className="fas fa-calendar-alt"></i></div>
                    <div className="relative z-10">
                        <h3 className="font-display font-bold text-xl mb-2">Guide Profile</h3>
                        {guideProfile ? (
                            <div className="space-y-4 mt-6">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500">Location</span>
                                    <span className="text-sm font-bold text-gray-800">{guideProfile.location || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500">Price/Day</span>
                                    <span className="text-sm font-bold text-gray-800">₹{guideProfile.price_per_day || 0}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500">Languages</span>
                                    <span className="text-sm font-bold text-gray-800">{guideProfile.languages?.join(', ') || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                    <span className="text-xs font-bold text-gray-500">Available</span>
                                    <span className={`text-sm font-bold ${guideProfile.is_available ? 'text-green-600' : 'text-red-500'}`}>{guideProfile.is_available ? 'Yes' : 'No'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 p-6 bg-orange-50 rounded-2xl text-center border border-orange-100">
                                <i className="fas fa-user-plus text-orange-500 text-2xl mb-2"></i>
                                <p className="text-sm font-bold text-orange-800">No guide profile yet</p>
                                <p className="text-xs text-orange-600 mt-1">Create one from the Profile page.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
