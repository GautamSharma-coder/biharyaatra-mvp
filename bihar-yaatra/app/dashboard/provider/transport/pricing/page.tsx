"use client";
import React from 'react';

export default function TransportPricingPage() {
    return (
        <div className="max-w-4xl mx-auto animate-fade-in pt-4 md:pt-10 pb-10">
            <div className="bg-white rounded-[3rem] p-8 md:p-14 border border-gray-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-70"></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
                        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-4xl flex items-center justify-center text-4xl shadow-inner border border-blue-100 shrink-0 shadow-blue-100 rotate-3 transition-transform hover:rotate-0 duration-300">
                            <i className="fas fa-bolt"></i>
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tight">Surge Pricing Control</h2>
                            <p className="text-gray-500 font-medium mt-3 text-lg leading-relaxed">Adjust dynamic rates for Peak Season and massive local festivals like Chhath Puja.</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-orange-300 hover:shadow-md transition-all group cursor-pointer">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Base Multiplier</label>
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-5xl font-display font-black text-gray-900 tracking-tighter">1.5x</span>
                                    <div className="px-4 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-xl border border-green-200">+50% Normal Rate</div>
                                </div>
                                <input type="range" className="w-full accent-orange-500 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer" defaultValue={50} />
                                <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-3">
                                    <span>1.0x (Normal)</span>
                                    <span>2.0x (Max Cap)</span>
                                </div>
                            </div>
                            
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Service Radius Limit</label>
                                <p className="text-4xl font-black text-gray-900 font-display">50<span className="text-2xl ml-1">km</span></p> 
                                <p className="text-sm font-bold text-gray-400 mt-2">From Patna HQ Central</p>
                                <p className="text-xs text-gray-500 mt-6 leading-relaxed font-medium">Trips starting or ending outside this radius will automatically drop surge and apply the <span className="text-gray-900 font-bold border-b border-gray-300">Outstation Tariff Plan</span> instead to protect long-distance riders.</p>
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded-4xl p-6 lg:p-8 flex gap-5 items-start border border-orange-200 shadow-sm mt-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 text-xl shadow-inner mt-1">
                                <i className="fas fa-info-circle"></i>
                            </div>
                            <p className="text-sm font-medium text-orange-900 leading-relaxed pr-4">
                                <strong className="font-black font-display text-orange-950 block mb-2 text-lg">Transparent Disclosure Status: <span className="text-green-600 ml-1">Active</span></strong> 
                                Increasing rates will trigger a "High Demand" notification to customers searching in your radius. Consistent misuse of surge pricing during off-peak hours may negatively impact your vendor ranking algorithm score.
                            </p>
                        </div>

                        <button className="w-full py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:scale-[0.98] duration-300 flex items-center justify-center gap-3 group text-lg tracking-wide mt-6 border border-gray-800">
                            Push Global Rates Update
                            <i className="fas fa-check-circle group-hover:scale-110 transition-transform duration-300 text-green-400"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
