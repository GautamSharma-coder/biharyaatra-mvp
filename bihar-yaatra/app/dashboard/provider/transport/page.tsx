"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function TransportDashboardPage() {
    const { user } = useAuth();
    const [fleet, setFleet] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [fleetRes, bookingsRes] = await Promise.all([
                    apiClient.get('/transports/my/listings'),
                    apiClient.get('/bookings/provider'),
                ]);
                setFleet(fleetRes.data || []);
                setBookings(bookingsRes.data || []);
            } catch (err) {
                console.error('Error fetching transport data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const transportBookings = bookings.filter(b => b.service_type === 'transport');
    const completedTrips = transportBookings.filter(b => b.status === 'completed').length;
    const confirmedBookings = transportBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalEarnings = confirmedBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    const pendingAlerts = transportBookings.filter(b => b.status === 'pending').length;

    const vendorName = user?.name || 'Transport Vendor';
    const vendorInitials = vendorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    // Fleet utilization chart (per day of week)
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dayCounts = dayNames.map((_, idx) => {
        const jsDay = idx === 6 ? 0 : idx + 1; // Convert to JS day (0=Sun)
        return transportBookings.filter(b => new Date(b.created_at).getDay() === jsDay).length;
    });
    const maxDay = Math.max(...dayCounts, 1);
    const dayPercents = dayCounts.map(c => Math.max(10, Math.round((c / maxDay) * 100)));

    if (loading) {
        return (
            <div className="animate-fade-in max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1.5">
                        Welcome back, <span className="font-bold text-gray-800">{vendorName}</span> • {fleet.length} vehicle{fleet.length !== 1 ? 's' : ''} in fleet
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-green-600 flex items-center gap-2 justify-end uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Live
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 tracking-wider">{fleet.length} vehicles registered</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer hover:bg-gray-800 transition">
                        {vendorInitials}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 md:p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Completed Trips</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">{completedTrips}</p>
                    <span className="text-green-600 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-check-circle"></i> All time</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Total Bookings</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">{transportBookings.length}</p>
                    <span className="text-blue-500 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-truck"></i> Transport</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1 group">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Pending</p>
                    <p className={`text-4xl font-display font-black mt-3 ${pendingAlerts > 0 ? 'text-red-500' : 'text-gray-900'} group-hover:scale-110 origin-left transition-transform duration-300`}>{String(pendingAlerts).padStart(2, '0')}</p>
                    <span className={`${pendingAlerts > 0 ? 'text-red-500' : 'text-green-500'} text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5`}><i className={`fas ${pendingAlerts > 0 ? 'fa-exclamation-circle' : 'fa-check-circle'}`}></i> {pendingAlerts > 0 ? 'Action required' : 'All clear'}</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Total Earnings</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">₹{totalEarnings.toLocaleString('en-IN')}</p>
                    <span className="text-gray-400 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-info-circle"></i> Net Payout Est.</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-2">
                {/* Recent Bookings */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest px-2">Recent Transport Bookings</h3>
                    <div className="bg-white rounded-4xl p-6 border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                            {transportBookings.length === 0 ? (
                                <div className="p-4 rounded-2xl bg-gray-50 text-center text-gray-400">
                                    <i className="fas fa-car text-2xl mb-2"></i>
                                    <p className="text-sm font-medium">No transport bookings yet</p>
                                </div>
                            ) : (
                                transportBookings.slice(0, 3).map((b, i) => (
                                    <div key={i} className={`flex gap-4 p-4 rounded-2xl transition cursor-pointer border group ${
                                        b.status === 'pending' ? 'bg-red-50/80 hover:bg-red-50 hover:border-red-100' : 
                                        b.status === 'confirmed' ? 'bg-green-50/80 hover:bg-green-50 hover:border-green-100' : 
                                        'bg-gray-50/80 hover:bg-gray-50 hover:border-gray-100'
                                    }`}>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${
                                            b.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                        }`}>
                                            <i className="fas fa-car"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{b.service_name || 'Transport Booking'}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">₹{Number(b.total_amount).toLocaleString('en-IN')} • {b.guests} guest{b.guests !== 1 ? 's' : ''}</p>
                                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{b.status}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Fleet Utilization Chart */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest px-2">Fleet Utilization</h3>
                    <div className="bg-white rounded-4xl p-6 md:p-8 border border-gray-100 min-h-72 flex flex-col justify-end shadow-sm">
                        <div className="flex items-end gap-1 sm:gap-3 lg:gap-4 h-56 px-2 pb-2">
                            {dayPercents.map((h, i) => (
                                <div key={i} className="flex-1 bg-linear-to-t from-gray-900 to-gray-600 rounded-t-xl transition-all hover:opacity-80 relative group cursor-pointer shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" style={{ height: `${h}%` }}>
                                    <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg shadow-xl">{dayCounts[i]} bookings</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-5 px-1">
                            {dayNames.map(d => <span key={d}>{d}</span>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
