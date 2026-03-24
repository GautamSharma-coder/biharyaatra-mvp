"use client";
import React from 'react';

export default function HomestayListingPage() {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-6 pb-10">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/50">
                    <h2 className="text-2xl font-black font-display text-gray-900">Property Details</h2>
                    <button className="text-orange-600 font-bold text-sm hover:text-white transition bg-orange-50 hover:bg-orange-600 px-6 py-3 rounded-xl border border-orange-100 active:scale-95 duration-200 shadow-sm">
                        <i className="fas fa-save mr-2"></i> Save & Submit
                    </button>
                </div>

                {/* Banner */}
                <div className="mx-6 md:mx-8 mt-8 p-4 rounded-2xl border flex items-start gap-4 bg-green-50 border-green-200 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fas fa-check-circle text-green-600 text-lg"></i>
                    </div>
                    <div>
                        <p className="font-bold text-sm text-green-800">✅ Your listing is LIVE on the public page!</p>
                        <p className="text-xs mt-1 text-green-600 font-medium">Guests can now find and book your homestay instantly.</p>
                    </div>
                </div>
                
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Property Name</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" defaultValue="Bodh Gaya Serenity Stay" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Location</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" defaultValue="Near Mahabodhi Temple, Gaya" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Price / Night (₹)</label>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" defaultValue="2500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Host Name</label>
                                <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" defaultValue="Ramesh Babu" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Description</label>
                            <textarea className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm h-32 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" defaultValue="A peaceful homestay located just 5 minutes walk from the world famous Mahabodhi Temple. We offer authentic Bihari cuisine and a serene environment perfect for meditation and rest."></textarea>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Amenities</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                                {['WiFi', 'Kitchen', 'AC', 'River View'].map(am => (
                                    <span key={am} className="bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition cursor-pointer group">
                                        {am}
                                        <i className="fas fa-times text-gray-400 group-hover:text-red-500"></i>
                                    </span>
                                ))}
                                <button className="text-xs text-orange-600 font-bold border-2 border-dashed border-orange-200 px-4 py-1.5 rounded-full hover:bg-orange-50 hover:border-orange-300 transition">+ Add</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
                        <label className="block text-xs font-black font-display text-gray-800 tracking-wider uppercase mb-6 flex items-center gap-2">
                            <i className="fas fa-bed text-orange-500"></i> Rooms Inventory
                        </label>
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 p-5 rounded-2xl flex justify-between items-center hover:border-orange-300 shadow-sm hover:shadow-md transition group cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Deluxe AC Room</h4>
                                    <p className="text-xs text-gray-500 mt-1 font-medium"><span className="text-gray-900 font-bold">2 Guests</span> • ₹2,500/night</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition shadow-sm"><i className="fas fa-edit"></i></button>
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 p-5 rounded-2xl flex justify-between items-center hover:border-orange-300 shadow-sm hover:shadow-md transition group cursor-pointer">
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">Standard Room</h4>
                                    <p className="text-xs text-gray-500 mt-1 font-medium"><span className="text-gray-900 font-bold">2 Guests</span> • ₹1,500/night</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition shadow-sm"><i className="fas fa-edit"></i></button>
                                </div>
                            </div>
                            <button className="w-full py-5 mt-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold text-sm hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition">
                                <i className="fas fa-plus mr-1"></i> Add New Room Type
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
