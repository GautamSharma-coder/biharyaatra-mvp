"use client";
import React from 'react';

export default function AdminDashboardPage() {
    
    // Mock data based on the HTML design
    const revenueChart = [
        { h: 40, label: 'Mar' }, { h: 65, label: 'Apr' }, { h: 45, label: 'May' },
        { h: 80, label: 'Jun' }, { h: 55, label: 'Jul' }, { h: 90, label: 'Aug' },
        { h: 70, label: 'Sep' }, { h: 85, label: 'Oct' }, { h: 60, label: 'Nov' },
        { h: 75, label: 'Dec' }, { h: 50, label: 'Jan' }, { h: 95, label: 'Feb' }
    ];

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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase">System Users</p>
                            <h3 className="text-3xl font-display font-bold">128</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase">Total Bookings</p>
                            <h3 className="text-3xl font-display font-bold">3,042</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase">Homestays</p>
                            <h3 className="text-3xl font-display font-bold">45</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase">Revenue (Est.)</p>
                            <h3 className="text-3xl font-display font-bold text-green-600">₹<span>1,45,000</span></h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg mb-6">Booking Volume (Monthly)</h3>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                            {revenueChart.map((bar, i) => (
                                <div key={i} className="w-full flex flex-col items-center gap-1">
                                    <div 
                                        className="w-full bg-orange-100 hover:bg-orange-500 transition-colors rounded-t-lg"
                                        style={{ height: `${bar.h}px` }}
                                    ></div>
                                    <span className="text-[10px] text-gray-400">{bar.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
