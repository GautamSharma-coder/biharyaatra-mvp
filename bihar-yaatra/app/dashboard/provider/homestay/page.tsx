"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomestayDashboardPage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [listingsRes, bookingsRes] = await Promise.all([
                    apiClient.get('/homestays/my/listings'),
                    apiClient.get('/bookings/provider'),
                ]);
                setListings(listingsRes.data || []);
                setBookings(bookingsRes.data || []);
            } catch (err) {
                console.error('Error fetching provider data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    // Compute real stats from bookings
    const homestayBookings = bookings.filter(b => b.service_type === 'homestay');
    const confirmedBookings = homestayBookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalEarnings = confirmedBookings.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
    
    const today = new Date().toISOString().slice(0, 10);
    const todayCheckins = homestayBookings.filter(b => b.check_in?.slice(0, 10) === today).length;
    
    const totalCapacity = listings.reduce((sum, l) => sum + (l.max_guests || 0), 0);
    const occupancy = totalCapacity > 0 ? Math.round((confirmedBookings.length / Math.max(totalCapacity, 1)) * 100) : 0;

    // Simple chart data from last 15 days of bookings
    const chartData: number[] = [];
    for (let i = 14; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().slice(0, 10);
        const count = homestayBookings.filter(b => b.created_at?.slice(0, 10) === dateStr).length;
        chartData.push(count);
    }
    const maxChart = Math.max(...chartData, 1);
    const chartPercents = chartData.map(v => Math.max(10, Math.round((v / maxChart) * 100)));

    const hostName = user?.name || 'Host';

    if (loading) {
        return (
            <div className="animate-fade-in max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Welcome back, <span>{hostName}</span>! 👋</h1>
                    <p className="text-gray-500 mt-1 font-medium">Here's what's happening at your property today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-xl"><i className="fas fa-wallet"></i></div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">{confirmedBookings.length} bookings</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Earnings</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900">₹<span>{totalEarnings.toLocaleString('en-IN')}</span></h3>
                    <p className="text-xs text-green-500 font-bold mt-2">All time</p>
                </div>
                
                <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl"><i className="fas fa-door-open"></i></div>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">Today</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Check-ins</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900"><span>{todayCheckins}</span> Guests</h3>
                    <p className="text-xs text-blue-500 font-bold mt-2">{listings.length} listing{listings.length !== 1 ? 's' : ''} active</p>
                </div>
                
                <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-xl"><i className="fas fa-chart-line"></i></div>
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">{occupancy > 60 ? 'High' : occupancy > 30 ? 'Medium' : 'Low'}</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Occupancy Rate</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900"><span>{occupancy}</span>%</h3>
                    <p className="text-xs text-orange-500 font-bold mt-2">Based on bookings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
                    <h3 className="font-display font-bold text-xl mb-4 text-gray-900">Recent Bookings</h3>
                    <div className="space-y-4">
                        {homestayBookings.length === 0 ? (
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center text-gray-400">
                                <i className="fas fa-inbox text-2xl mb-2"></i>
                                <p className="text-sm font-medium">No bookings yet</p>
                            </div>
                        ) : (
                            homestayBookings.slice(0, 3).map((b, i) => (
                                <div key={i} className={`p-4 rounded-2xl border flex gap-3 items-start cursor-pointer transition ${
                                    b.status === 'pending' ? 'bg-yellow-50 border-yellow-100/50 hover:bg-yellow-100/50' :
                                    b.status === 'confirmed' ? 'bg-green-50 border-green-100/50 hover:bg-green-100/50' :
                                    'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
                                }`}>
                                    <i className={`fas ${b.status === 'pending' ? 'fa-exclamation-circle text-yellow-500' : b.status === 'confirmed' ? 'fa-check-circle text-green-500' : 'fa-times-circle text-gray-400'} mt-1`}></i>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{b.service_name || 'Homestay Booking'}</h4>
                                        <p className="text-xs text-gray-600 mt-1 font-medium">
                                            ₹{Number(b.total_amount).toLocaleString('en-IN')} • {b.guests} guest{b.guests !== 1 ? 's' : ''}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {b.check_in ? new Date(b.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No date'} → {b.check_out ? new Date(b.check_out).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-6 rounded-4xl shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-xl text-gray-900">Booking Trend</h3>
                        <span className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-600">Last 15 Days</span>
                    </div>
                    <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2">
                        {chartPercents.map((h, i) => (
                            <div key={i} className="w-full bg-orange-100 hover:bg-orange-500 transition-colors rounded-t-md relative group cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded">{chartData[i]}</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-3">
                        <span>{new Date(Date.now() - 14 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <span>{new Date(Date.now() - 7 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <span>Today</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
