"use client";
import React, { useState } from 'react';

export default function UserTripsPage() {
    const [filter, setFilter] = useState('all');

    const trips = [
        { id: '1', title: 'Nalanda Weekend Escape', days: 3, status: 'upcoming', date: 'Nov 20 - Nov 23', desc: 'A deep dive into the historical ruins of ancient Nalanda University with exclusive guided tours.', image: 'https://images.unsplash.com/photo-1627894006066-b44642735b52?q=80&w=800' },
        { id: '2', title: 'Rajgir Peace Retreat', days: 2, status: 'completed', date: 'Oct 10 - Oct 12', desc: 'Meditative tour through the World Peace Pagoda, hot springs, and surrounding hills.', image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=800' },
    ];

    const filteredTrips = filter === 'all' ? trips : trips.filter(t => t.status === filter);

    return (
        <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">My Journeys</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Review your planned itineraries and past adventures.</p>
                </div>
                <button className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:bg-orange-600 transition shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-orange-500/20 hover:-translate-y-1 flex items-center justify-center gap-2 active:scale-95 duration-200 w-full md:w-auto border border-gray-800">
                    <i className="fas fa-plus relative top-[1px]"></i> <span className="hidden sm:inline tracking-wide">Plan New Trip</span>
                </button>
            </header>

            <div className="flex gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar">
                {['all', 'upcoming', 'completed'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} 
                        className={`px-8 py-3 rounded-full text-xs font-black transition-all whitespace-nowrap uppercase tracking-widest border ${filter === f ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30 border-orange-500 scale-105' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'}`}>
                        {f} Trips
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 lg:pt-4">
                {filteredTrips.map(trip => (
                    <div key={trip.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-300/40 transition-all duration-300 flex flex-col h-full relative cursor-pointer hover:-translate-y-2">
                        <button className="absolute top-5 right-5 z-20 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-red-500 hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300">
                            <i className="fas fa-trash-alt text-sm"></i>
                        </button>

                        <div className="h-72 relative overflow-hidden bg-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" />
                            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                            
                            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-lg">
                                {trip.days} Days
                            </div>

                            <div className="absolute bottom-6 left-6 text-white pr-6 w-full">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/30 backdrop-blur-md shadow-lg ${trip.status === 'upcoming' ? 'bg-blue-500/90 text-white' : 'bg-gray-600/90 text-gray-100'}`}>
                                        {trip.status}
                                    </span>
                                </div>
                                <h3 className="font-display font-black text-3xl leading-tight tracking-tight drop-shadow-lg pr-4">{trip.title}</h3>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1 bg-white relative z-10 transition-transform duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><i className="far fa-calendar-alt text-orange-500"></i> Dates</p>
                                    <p className="text-sm font-black text-gray-800 bg-orange-50/50 px-3 py-1.5 rounded-lg inline-block text-orange-950">
                                        {trip.date}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm line-clamp-2 mb-8 flex-1 font-medium leading-relaxed">{trip.desc}</p>

                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <div className="flex -space-x-4">
                                    {[1,2,3].map((i, idx) => (
                                        <div key={i} className={`w-12 h-12 rounded-[1.25rem] bg-gray-100 border-[3px] border-white flex items-center justify-center text-sm text-gray-400 shadow-sm z-${10-idx} hover:z-20 hover:-translate-y-2 transition-transform cursor-pointer hover:text-orange-500 hover:bg-orange-50`}>
                                            <i className="fas fa-user"></i>
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm font-black text-orange-600 group-hover:text-orange-700 flex items-center gap-2 tracking-wide uppercase px-4 py-2 rounded-xl group-hover:bg-orange-50 transition-colors">
                                    View Itinerary 
                                    <i className="fas fa-arrow-right text-sm bg-orange-100 text-orange-500 w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 group-hover:bg-orange-200 transition-all shadow-sm"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {filteredTrips.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200/60 shadow-sm mt-4">
                    <div className="w-24 h-24 bg-blue-50/80 rounded-4xl flex items-center justify-center mb-6 text-blue-500 text-4xl shadow-inner border border-blue-50">
                        <i className="fas fa-map-location-dot"></i>
                    </div>
                    <h3 className="font-display font-black text-3xl text-gray-900 mb-3 tracking-tight">No trips found</h3>
                    <p className="text-gray-500 text-lg mb-8 max-w-sm mx-auto leading-relaxed">It looks like you haven't planned any trips in this category yet.</p>
                    <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:bg-orange-600 transition-all hover:-translate-y-1 active:scale-95 duration-300 tracking-wide text-lg flex items-center gap-3">
                        Start Planning Now <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
