"use client";
import React from 'react';
import Link from 'next/link';

export default function UserDashboardPage() {
    const user = { balance: "4,500" };
    const nextTrip = { 
        title: "Bodh Gaya Retreat", 
        date: "Nov 15, 2025", 
        daysLeft: 12, 
        image: "https://images.unsplash.com/photo-1627894006066-b44642735b52?q=80&w=800" 
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hero / Next Trip */}
                <div className="lg:col-span-2 relative group cursor-pointer border border-gray-100/50 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
                    <div className="absolute inset-0 bg-gray-900 rounded-[2.5rem] transform transition-transform duration-500 group-hover:scale-[1.01] shadow-2xl shadow-gray-400/30"></div>
                    <div className="relative h-full rounded-[2.5rem] overflow-hidden flex flex-col justify-between p-8 md:p-12 text-white min-h-[340px]">
                        <div className="absolute inset-0 z-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={nextTrip.image} alt="Destination" className="w-full h-full object-cover opacity-60 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700 ease-out" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                        </div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 shadow-xl border border-orange-400/50">
                                    <i className="fas fa-plane-departure"></i> Upcoming Adventure
                                </div>
                                <h2 className="text-4xl md:text-6xl font-display font-black leading-none mb-4 tracking-tight shadow-black drop-shadow-lg">{nextTrip.title}</h2>
                                <p className="text-gray-200 text-lg md:text-xl flex items-center gap-2 font-medium drop-shadow-md"><i className="far fa-calendar text-orange-400"></i> <span>{nextTrip.date}</span></p>
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto pt-8 flex items-center justify-between border-t border-white/20">
                            <div className="flex gap-10">
                                <div>
                                    <span className="block text-4xl py-1 font-black font-display tracking-tight text-orange-400">{nextTrip.daysLeft}</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Days Left</span>
                                </div>
                                <div>
                                    <span className="block text-4xl py-1 font-black font-display tracking-tight text-white">4</span>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Trips</span>
                                </div>
                            </div>
                            <button className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors duration-300 shadow-xl transform group-hover:rotate-45 active:scale-90 relative">
                                <i className="fas fa-arrow-up text-xl"></i>
                                <div className="absolute inset-0 rounded-full border border-white scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right col cards */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex-1 flex flex-col justify-center items-center text-center hover:shadow-lg transition-all group hover:-translate-y-1">
                        <div className="w-16 h-16 bg-blue-50/80 rounded-[1.25rem] flex items-center justify-center text-blue-600 mb-6 text-2xl shadow-inner group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                            <i className="fas fa-wallet"></i>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Wallet Balance</p>
                        <h3 className="text-4xl lg:text-5xl font-display font-black text-gray-900 tracking-tight">₹{user.balance}</h3>
                        <Link href="/dashboard/user/wallet" className="mt-6 text-sm font-bold text-blue-600 hover:text-white px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all">Top Up Wallet</Link>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-[2.5rem] p-8 shadow-lg shadow-orange-500/20 text-white flex-1 flex flex-col justify-center relative overflow-hidden group cursor-pointer hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1">
                        <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl group-hover:scale-125 transition-transform duration-500 origin-bottom-right"><i className="fas fa-map-marked-alt"></i></div>
                        <h3 className="font-display font-black text-3xl relative z-10 tracking-tight mb-2">Plan New Trip</h3>
                        <p className="text-orange-50 text-sm relative z-10 mb-8 font-medium leading-relaxed max-w-[80%]">Explore Bihar's hidden gems and craft an itinerary instantly.</p>
                        <button className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-xl font-bold text-sm w-fit hover:bg-white hover:text-orange-600 transition-colors duration-300 flex items-center gap-3 group-hover:pr-4 shadow-lg">
                            Start Now <i className="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
                <h3 className="font-display font-black text-2xl text-gray-900 mb-6 flex items-center gap-3">
                    <i className="fas fa-bolt text-orange-500"></i> Quick Actions
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[
                        { icon: 'fas fa-magic', label: 'AI Planner', text: 'Generate trip', color: 'text-purple-600', bg: 'bg-purple-50', link: '/explore' },
                        { icon: 'fas fa-car', label: 'Book Cab', text: 'Instant ride', color: 'text-blue-600', bg: 'bg-blue-50', link: '/transport' },
                        { icon: 'fas fa-home', label: 'Homestays', text: 'Local stay', color: 'text-green-600', bg: 'bg-green-50', link: '/homestays' },
                        { icon: 'fas fa-headset', label: 'Support', text: 'Get help', color: 'text-red-600', bg: 'bg-red-50', link: '/dashboard/user/support' }
                    ].map((action, i) => (
                        <Link key={i} href={action.link} className="flex flex-col items-center justify-center p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 hover:border-gray-200 transition-all group hover:-translate-y-1.5">
                            <div className={`w-16 h-16 ${action.bg} ${action.color} rounded-[1.25rem] flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm mb-4`}>
                                <i className={action.icon}></i>
                            </div>
                            <span className="font-black text-lg text-gray-900 font-display tracking-tight">{action.label}</span>
                            <span className="text-xs text-gray-400 font-medium mt-1">{action.text}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pt-2">
                {/* Bookings */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 border-l-[5px] border-orange-500 pl-4 rounded-sm">Active Bookings</h3>
                        <Link href="/dashboard/user/bookings" className="text-orange-600 font-bold text-sm hover:underline hover:text-orange-700 transition">View All Bookings <i className="fas fa-arrow-right ml-1 text-xs"></i></Link>
                    </div>
                    <div className="space-y-4">
                        {[
                            { type: 'Hotel', title: 'Bodh Gaya Serenity Stay', date: 'Nov 14, 2025', price: '2,500', icon: 'fas fa-hotel' },
                            { type: 'Cab', title: 'Patna to Gaya Transit', date: 'Nov 14, 2025', price: '1,800', icon: 'fas fa-taxi' }
                        ].map((b, i) => (
                            <div key={i} className="bg-white rounded-[1.5rem] p-5 md:p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:border-orange-200 hover:shadow-md transition-all cursor-pointer">
                                <div className="flex items-center gap-4 md:gap-5">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center text-gray-400 text-xl md:text-2xl border border-gray-100 shadow-sm group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                        <i className={b.icon}></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-500">{b.type}</span>
                                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-green-200"></span>
                                        </div>
                                        <h4 className="font-bold text-sm md:text-lg text-gray-900 group-hover:text-orange-600 transition-colors tracking-tight">{b.title}</h4>
                                        <p className="text-xs text-gray-500 font-medium mt-1">{b.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-lg md:text-xl text-gray-900 font-display">₹{b.price}</p>
                                    <span className="text-[10px] text-gray-400 font-bold hover:text-gray-600 mt-2 block border-b border-gray-300 w-fit ml-auto pb-0.5">Details</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 border-l-[5px] border-gray-900 pl-4 rounded-sm">Recent Activity</h3>
                        <button className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-400 flex items-center justify-center transition border border-gray-100 shadow-sm"><i className="fas fa-ellipsis-h"></i></button>
                    </div>
                    <div className="bg-white rounded-[2rem] p-4 md:p-5 shadow-sm border border-gray-100 min-h-[16rem]">
                        <div className="flex flex-col gap-2">
                            {[
                                { title: 'Wallet Recharge', desc: 'Added ₹2,000 via UPI', time: '2h ago', icon: 'fas fa-rupee-sign', bg: 'bg-green-50 text-green-600' },
                                { title: 'Trip Draft Saved', desc: 'Nalanda Weekend Escape', time: 'Yesterday', icon: 'fas fa-map', bg: 'bg-blue-50 text-blue-600' },
                                { title: 'New Review', desc: 'Read reply to your review.', time: '3d ago', icon: 'fas fa-star', bg: 'bg-yellow-50 text-yellow-600' }
                            ].map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-[1.25rem] transition cursor-default group border border-transparent hover:border-gray-100">
                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl ${activity.bg} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                                        <i className={activity.icon}></i>
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="font-black text-gray-900 text-sm md:text-base truncate tracking-tight">{activity.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 truncate font-medium">{activity.desc}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm group-hover:bg-gray-100 transition-colors uppercase tracking-widest">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
