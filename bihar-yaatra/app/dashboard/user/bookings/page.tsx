"use client";
import React, { useState } from 'react';

export default function UserBookingsPage() {
    const bookings = [
        { id: '1', title: 'Bodh Gaya Serenity Stay', type: 'Hotel', status: 'Confirmed', date: 'Nov 14, 2025', price: '2,500', guests: 2, subtitle: 'Deluxe AC Room' },
        { id: '2', title: 'Patna to Gaya Transit', type: 'Taxi', status: 'Confirmed', date: 'Nov 14, 2025', price: '1,800', subtitle: 'SUV - Maurya Travels' },
        { id: '3', title: 'Nalanda Ruin Exploration', type: 'Package', status: 'Pending', date: 'Dec 05, 2025', price: '4,200', guests: 4, subtitle: 'Guided Tour' }
    ];

    const getIcon = (type: string) => {
        if (type === 'Hotel') return 'fas fa-bed text-purple-500 bg-purple-50';
        if (type === 'Taxi') return 'fas fa-taxi text-blue-500 bg-blue-50';
        if (type === 'Package') return 'fas fa-map-marked-alt text-orange-500 bg-orange-50';
        return 'fas fa-ticket-alt text-gray-500 bg-gray-50';
    };

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8 pb-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">My Bookings</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Manage your active and past reservations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-100 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm uppercase tracking-widest">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live Updates
                    </span>
                </div>
            </header>

            <div className="space-y-6">
                {bookings.map((booking) => (
                    <div key={booking.id} className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(255,125,41,0.08)] hover:border-orange-200 transition-all duration-300 group relative overflow-hidden cursor-pointer w-full">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50/40 rounded-bl-[6rem] -mr-12 -mt-12 z-0 transition-transform group-hover:scale-110 group-hover:bg-orange-50/80 duration-500"></div>

                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 md:gap-10">
                            <div className="flex items-start gap-5">
                                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] flex items-center justify-center text-2xl md:text-3xl shrink-0 shadow-sm border border-white group-hover:scale-110 transition-transform duration-300 ${getIcon(booking.type)}`}>
                                    <i className={getIcon(booking.type).split(' ')[0] + ' ' + getIcon(booking.type).split(' ')[1]}></i>
                                </div>
                                
                                <div>
                                    <div className="flex flex-wrap items-center gap-3 mb-2 mt-1">
                                        <h3 className="font-display font-black text-xl md:text-2xl text-gray-900 leading-tight tracking-tight group-hover:text-orange-600 transition-colors">{booking.title}</h3>
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                                            booking.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-100' :
                                            booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                            'bg-red-50 text-red-700 border-red-100'
                                        }`}>{booking.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium mb-4">{booking.subtitle}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 w-fit">
                                        <span className="flex items-center gap-1.5"><i className="far fa-calendar-alt text-orange-400 text-sm"></i> {booking.date}</span>
                                        {booking.guests && <span className="flex items-center gap-1.5 border-l border-gray-200 pl-4"><i className="fas fa-user-group text-blue-400 text-sm"></i> {booking.guests} Guests</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end justify-between md:pl-8 md:border-l border-gray-100 md:min-w-[220px] mt-4 md:mt-0">
                                <div className="text-left md:text-right w-full">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1.5">Total Paid</p>
                                    <span className="font-display font-black text-3xl md:text-4xl text-gray-900 tracking-tighter">₹{booking.price}</span>
                                </div>
                                
                                <div className="flex gap-3 mt-6 w-full md:w-auto self-end">
                                    <button className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 hover:text-gray-900 transition border border-gray-200 md:w-auto whitespace-nowrap">
                                        <i className="fas fa-file-invoice mr-1.5"></i> Invoice
                                    </button>
                                    <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-black text-white text-xs font-bold hover:bg-orange-600 transition shadow-lg shadow-gray-200 hover:shadow-orange-200 md:w-auto whitespace-nowrap shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
