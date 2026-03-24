"use client";
import React from 'react';

export default function HomestayDashboardPage() {
    const hostData = { hostName: 'Ramesh' };
    const stats = { earnings: "14,500", checkins: 2, occupancy: 78 };
    const chartData = [40, 60, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95, 60, 80, 100];

    return (
        <div className="animate-fade-in max-w-6xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">Welcome back, <span>{hostData.hostName}</span>! 👋</h1>
                    <p className="text-gray-500 mt-1 font-medium">Here's what's happening at your property today.</p>
                </div>
                <button className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition hidden md:block active:scale-95 duration-200">
                    <i className="fas fa-plus mr-2"></i> Add Blocked Date
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-xl"><i className="fas fa-wallet"></i></div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">+12%</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Earnings</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900">₹<span>{stats.earnings}</span></h3>
                    <p className="text-xs text-green-500 font-bold mt-2">This month</p>
                </div>
                
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl"><i className="fas fa-door-open"></i></div>
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">Today</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Check-ins</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900"><span>{stats.checkins}</span> Guests</h3>
                    <p className="text-xs text-blue-500 font-bold mt-2">Room 101, 104</p>
                </div>
                
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition hover:-translate-y-1">
                    <div className="flex justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-xl"><i className="fas fa-chart-line"></i></div>
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-lg h-fit">High</span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Occupancy Rate</p>
                    <h3 className="text-3xl font-display font-bold mt-1 text-gray-900"><span>{stats.occupancy}</span>%</h3>
                    <p className="text-xs text-orange-500 font-bold mt-2">Last 30 days</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Alerts */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-1 h-fit">
                    <h3 className="font-display font-bold text-xl mb-4 text-gray-900">Action Required</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100/50 flex gap-3 items-start cursor-pointer hover:bg-yellow-100/50 transition">
                            <i className="fas fa-exclamation-circle text-yellow-500 mt-1"></i>
                            <div>
                                <h4 className="font-bold text-sm text-yellow-900">Pending Review</h4>
                                <p className="text-xs text-yellow-700 mt-1 font-medium">Guest Amit Kumar left a 4-star review. Reply now.</p>
                            </div>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100/50 flex gap-3 items-start cursor-pointer hover:bg-red-100/50 transition">
                            <i className="fas fa-file-invoice text-red-500 mt-1"></i>
                            <div>
                                <h4 className="font-bold text-sm text-red-900">Incomplete Profile</h4>
                                <p className="text-xs text-red-700 mt-1 font-medium">Upload PAN card to enable payouts.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Mock */}
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display font-bold text-xl text-gray-900">Occupancy Trend</h3>
                        <select className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-600 outline-none hover:border-orange-500 focus:border-orange-500 transition-colors">
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-56 flex items-end justify-between gap-1 sm:gap-2 px-2 pb-2">
                        {chartData.map((h, i) => (
                            <div key={i} className="w-full bg-orange-100 hover:bg-orange-500 transition-colors rounded-t-md relative group cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold py-1 px-2 rounded">{h}%</div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-t border-gray-50 pt-3">
                        <span>1 Oct</span><span>15 Oct</span><span>30 Oct</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
