"use client";
import React from 'react';

export default function GuideDashboardPage() {
    const guideData = { name: 'Rajesh Kumar', initials: 'RK', level: 'LEVEL 4', status: 'Certified Guide' };
    const stats = { todayTours: 4, earnings: "42,500", guests: "1,240" };
    const nextJob = { 
        circuitName: 'Buddhist Circuit Expedition', 
        location: 'Nalanda University Ruins', 
        guestName: 'Dr. Sarah Miller + 4', 
        time: 'In 2 Hours' 
    };
    const inquiries = [
        { id: 1, tourName: 'Gaya Heritage Walk', date: 'Oct 12', slot: 'Morning' },
        { id: 2, tourName: 'Bodh Gaya Meditation', date: 'Oct 14', slot: 'Evening' }
    ];

    const getGreeting = () => {
        const hours = new Date().getHours();
        return hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{getGreeting()}</h2>
                    <h1 className="text-2xl lg:text-3xl font-display font-black">
                        <span>{guideData.name}</span>
                        <span className="text-blue-600 text-sm font-sans ml-2">({guideData.status})</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-50">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded-full uppercase">{guideData.level}</span>
                        <div className="flex text-yellow-400 text-[10px] mt-1 gap-0.5">
                            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                        </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-200">
                        {guideData.initials}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors"><i className="fas fa-calendar-check"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Booked Today</p>
                        <p className="text-2xl font-display font-bold text-gray-800">{stats.todayTours} Tours</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-xl group-hover:bg-green-600 group-hover:text-white transition-colors"><i className="fas fa-wallet"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Earnings (Month)</p>
                        <p className="text-2xl font-display font-bold text-gray-800">₹{stats.earnings}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center gap-4 shadow-sm hover:shadow-md transition group">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors"><i className="fas fa-users"></i></div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Happy Guests</p>
                        <p className="text-2xl font-display font-bold text-gray-800">{stats.guests}+</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 mt-6 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                <div className="absolute right-0 top-0 opacity-5 p-4 transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-1000"><i className="fas fa-map-location-dot text-[15rem]"></i></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 hidden md:block"></div>
                
                <div className="relative z-10">
                    {nextJob ? (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md">Next Job</span>
                                <span className="text-gray-400 text-xs font-medium">• {nextJob.location}</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-8 tracking-tight">{nextJob.circuitName}</h2>
                            <div className="flex flex-wrap gap-6 md:gap-12">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400"><i className="fas fa-user-friends"></i></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Guest</p>
                                        <p className="text-sm font-bold text-gray-100">{nextJob.guestName}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm transition hover:bg-white/10">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400"><i className="fas fa-clock"></i></div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Start Time</p>
                                        <p className="text-sm font-bold text-gray-100">{nextJob.time}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex gap-4">
                                <button className="px-6 py-3.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-gray-100 transition shadow-lg hover:shadow-white/20 active:scale-95 duration-200">View Full Itinerary</button>
                                <button className="px-6 py-3.5 bg-black/40 backdrop-blur-md text-white rounded-xl font-bold text-sm border border-white/20 hover:bg-white/10 hover:border-white/30 transition active:scale-95 duration-200">Call Coordinator</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400 font-bold italic py-8">No upcoming tours scheduled for today. Relax!</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition">
                    <h3 className="font-display font-bold text-xl mb-6">New Inquiries</h3>
                    <div className="space-y-4">
                        {inquiries.map(inquiry => (
                            <div key={inquiry.id} className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition cursor-pointer group">
                                <div>
                                    <p className="font-bold text-sm text-gray-800">{inquiry.tourName}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{inquiry.date} • {inquiry.slot}</p>
                                </div>
                                <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="w-9 h-9 rounded-[10px] bg-green-500 text-white text-xs hover:bg-green-600 transition shadow-md shadow-green-500/30 hover:-translate-y-0.5"><i className="fas fa-check"></i></button>
                                    <button className="w-9 h-9 rounded-[10px] bg-gray-200 text-gray-600 text-xs hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/30 transition hover:-translate-y-0.5"><i className="fas fa-times"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-gray-50/80 text-9xl pointer-events-none"><i className="fas fa-calendar-alt"></i></div>
                    <div className="relative z-10">
                        <h3 className="font-display font-bold text-xl mb-2">Availability Settings</h3>
                        <p className="text-xs text-gray-500 mb-8 font-medium">Manage your public calendar status for instant bookings.</p>
                        <div className="grid grid-cols-4 gap-3">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <button key={day} className={`py-4 rounded-2xl border text-[10px] font-bold uppercase transition-all shadow-sm hover:shadow active:scale-95 duration-200 ${day === 'Sun' ? 'bg-red-50 text-red-500 border-red-100 hover:bg-red-100 hover:border-red-200' : 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:border-blue-200'}`}>
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
