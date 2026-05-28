"use client";
import React from 'react';

export default function GuideRevenuePage() {
    const stats = { pendingPayout: "12,400", availablePayout: "8,900" };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pt-8">
            <div className="bg-white rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-xl text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-green-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60"></div>
                
                <div className="relative z-10">
                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-4xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-green-100 border border-green-200 shadow-inner rotate-3 hover:rotate-0 transition-transform duration-300">
                        <i className="fas fa-coins"></i>
                    </div>
                    <h2 className="text-4xl font-display font-black text-gray-800 tracking-tight">Earnings Center</h2>
                    <p className="text-gray-500 font-medium mt-3">Manage your payouts, transaction history, and wallet details.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <div className="p-8 md:p-10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] border border-gray-100 hover:border-gray-200 transition-colors group">
                            <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Uncleared Balance</p>
                            <p className="text-4xl md:text-5xl font-display font-black mt-4 text-gray-800 tracking-tighter">₹{stats.pendingPayout}</p>
                            <p className="text-xs text-orange-500 font-bold mt-4 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <i className="fas fa-clock"></i> Clears in 2-3 days
                            </p>
                        </div>
                        <div className="p-8 md:p-10 bg-linear-to-br from-blue-600 to-indigo-600 text-white rounded-[2.5rem] shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 transition-shadow">
                            <p className="text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest border-b border-blue-500/50 pb-2 inline-block">Available to Withdraw</p>
                            <p className="text-4xl md:text-5xl font-display font-black mt-4 tracking-tighter">₹{stats.availablePayout}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-300 font-bold bg-white/10 py-1.5 px-3 w-fit mx-auto rounded-full backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Ready for Payout
                            </div>
                        </div>
                    </div>
                    
                    <button className="w-full mt-10 py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1 active:scale-[0.98] duration-300 flex items-center justify-center gap-3 group text-lg tracking-wide">
                        Request Instant Payout
                        <i className="fas fa-arrow-right group-hover:translate-x-1.5 transition-transform duration-300"></i>
                    </button>
                    <p className="text-[10px] text-gray-400 font-bold mt-6 uppercase tracking-wider"><i className="fas fa-shield-alt text-gray-300 mr-1"></i> Secure End-to-End Encrypted Transfer to Linked Bank Account</p>
                </div>
            </div>
        </div>
    );
}
