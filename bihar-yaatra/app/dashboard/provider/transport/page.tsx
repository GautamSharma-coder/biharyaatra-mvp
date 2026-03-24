"use client";
import React from 'react';

export default function TransportDashboardPage() {
    const vendorInfo = { name: 'Maurya Travels', id: 'V-998', initials: 'MT' };
    const stats = { completed: 12, onTime: 98.2, alerts: 3, earnings: "14,580" };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-display font-black text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1.5">
                        Welcome back, <span className="font-bold text-gray-800">{vendorInfo.name}</span> (ID: <span className="font-mono">{vendorInfo.id}</span>)
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs font-bold text-green-600 flex items-center gap-2 justify-end uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Live
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 tracking-wider">Patna Server: 42ms</p>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center relative shadow-sm hover:shadow-md transition text-lg active:scale-95 duration-200">
                        <i className="fas fa-bell text-gray-600"></i>
                        <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg shadow-md cursor-pointer hover:bg-gray-800 transition">
                        {vendorInfo.initials}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Completed Trips</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">{stats.completed}</p>
                    <span className="text-green-600 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-caret-up text-sm"></i> 14% vs yesterday</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">On-Time %</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">{stats.onTime}%</p>
                    <span className="text-blue-500 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-check-circle"></i> Industry Standard</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1 group">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Pending Alerts</p>
                    <p className="text-4xl font-display font-black mt-3 text-red-500 group-hover:scale-110 origin-left transition-transform duration-300">0{stats.alerts}</p>
                    <span className="text-red-500 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-exclamation-circle"></i> Action required</span>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Today's Earnings</p>
                    <p className="text-4xl font-display font-black mt-3 text-gray-900">₹{stats.earnings}</p>
                    <span className="text-gray-400 text-[10px] md:text-xs font-bold mt-3 flex items-center gap-1.5"><i className="fas fa-info-circle"></i> Net Payout Est.</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-2">
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest px-2">Attention Required</h3>
                    <div className="bg-white rounded-[2rem] p-6 border border-red-50/50 shadow-sm">
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-2xl bg-red-50/80 hover:bg-red-50 transition cursor-pointer border border-transparent hover:border-red-100 group">
                                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Unassigned Trip</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Patna to Gaya (Tomorrow, 6:00 AM)</p>
                                    <button className="mt-2.5 text-xs font-black text-red-600 hover:text-red-800 transition tracking-wide">ASSIGN NOW &rarr;</button>
                                </div>
                            </div>
                            <div className="h-px bg-gray-100 w-full mx-auto"></div>
                            <div className="flex gap-4 p-4 rounded-2xl bg-orange-50/80 hover:bg-orange-50 transition cursor-pointer border border-transparent hover:border-orange-100 group">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                    <i className="fas fa-file-invoice"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Insurance Expiring</p>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Vehicle BR01-P-9022 (4 days left)</p>
                                    <button className="mt-2.5 text-xs font-black text-orange-600 hover:text-orange-800 transition tracking-wide">RENEW POLICY &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest px-2">Fleet Utilization</h3>
                    <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 min-h-[18rem] flex flex-col justify-end shadow-sm">
                        <div className="flex items-end gap-1 sm:gap-3 lg:gap-4 h-56 px-2 pb-2">
                            {[40, 70, 90, 60, 80, 100, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-gradient-to-t from-gray-900 to-gray-600 rounded-t-xl transition-all hover:opacity-80 relative group cursor-pointer shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" style={{ height: `${h}%` }}>
                                    <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg shadow-xl">{h}%</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-50 pt-5 px-1">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
