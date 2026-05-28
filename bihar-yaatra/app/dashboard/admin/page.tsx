"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    apiClient.get('/auth/admin/stats'),
                    apiClient.get('/bookings'),
                ]);
                setStats(statsRes.data);
                setRecentBookings((bookingsRes.data || []).slice(0, 8));
            } catch (err) {
                console.error('Error fetching admin stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Compute monthly booking chart from real data
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthCounts = monthLabels.map((_, idx) => {
        return recentBookings.filter(b => new Date(b.created_at).getMonth() === idx).length;
    });
    const maxMonth = Math.max(...monthCounts, 1);

    if (loading) {
        return (
            <>
                <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                    <h2 className="text-xl font-bold font-display">Dashboard</h2>
                </header>
                <div className="flex-1 flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
                </div>
            </>
        );
    }

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                <h2 className="text-xl font-bold font-display capitalize">Dashboard</h2>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Live sync active</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                <div className="animate-fade-in">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-gray-400 font-bold uppercase">System Users</p>
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500"><i className="fas fa-users"></i></div>
                            </div>
                            <h3 className="text-3xl font-display font-bold">{stats?.totalUsers || 0}</h3>
                            <p className="text-xs text-gray-400 mt-1">Registered accounts</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-gray-400 font-bold uppercase">Total Bookings</p>
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500"><i className="fas fa-calendar-check"></i></div>
                            </div>
                            <h3 className="text-3xl font-display font-bold">{stats?.totalBookings || 0}</h3>
                            <p className="text-xs text-gray-400 mt-1">All time</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-gray-400 font-bold uppercase">Homestays</p>
                                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500"><i className="fas fa-home"></i></div>
                            </div>
                            <h3 className="text-3xl font-display font-bold">{stats?.totalHomestays || 0}</h3>
                            <p className="text-xs text-gray-400 mt-1">Listed properties</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs text-gray-400 font-bold uppercase">Revenue (Est.)</p>
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500"><i className="fas fa-wallet"></i></div>
                            </div>
                            <h3 className="text-3xl font-display font-bold text-green-600">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</h3>
                            <p className="text-xs text-gray-400 mt-1">From confirmed bookings</p>
                        </div>
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 text-lg"><i className="fas fa-map-marked-alt"></i></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Tour Guides</p>
                                <h3 className="text-2xl font-display font-bold">{stats?.totalGuides || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 text-lg"><i className="fas fa-bus"></i></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Transport</p>
                                <h3 className="text-2xl font-display font-bold">{stats?.totalTransports || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 text-lg"><i className="fas fa-box-open"></i></div>
                            <div>
                                <p className="text-xs text-gray-400 font-bold uppercase">Packages</p>
                                <h3 className="text-2xl font-display font-bold">{stats?.totalPackages || 0}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Chart + Recent Bookings */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                            <h3 className="font-bold text-lg mb-6">Booking Volume (Monthly)</h3>
                            <div className="h-48 flex items-end justify-between gap-2 px-2">
                                {monthLabels.map((label, i) => (
                                    <div key={i} className="w-full flex flex-col items-center gap-1 group">
                                        <div className="relative w-full">
                                            <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded z-10">{monthCounts[i]}</div>
                                        </div>
                                        <div
                                            className="w-full bg-orange-100 hover:bg-orange-500 transition-colors rounded-t-lg cursor-pointer"
                                            style={{ height: `${Math.max(4, Math.round((monthCounts[i] / maxMonth) * 160))}px` }}
                                        ></div>
                                        <span className="text-[10px] text-gray-400">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4">Recent Bookings</h3>
                            <div className="space-y-3">
                                {recentBookings.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-8">No bookings yet</p>
                                ) : (
                                    recentBookings.slice(0, 5).map((b, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 truncate max-w-[140px]">{b.service_name || b.service_type}</p>
                                                <p className="text-[10px] text-gray-400">{new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">₹{Number(b.total_amount).toLocaleString('en-IN')}</p>
                                                <span className={`text-[10px] font-bold uppercase ${
                                                    b.status === 'confirmed' ? 'text-green-600' :
                                                    b.status === 'pending' ? 'text-yellow-600' :
                                                    b.status === 'cancelled' ? 'text-red-500' : 'text-gray-400'
                                                }`}>{b.status}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
