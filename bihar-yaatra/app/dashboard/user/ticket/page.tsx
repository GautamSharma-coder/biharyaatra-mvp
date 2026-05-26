"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type BookingData = {
    id: string;
    title: string;
    subtitle?: string;
    type: string;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    location: string;
    guests: number;
    price: number;
    paymentId: string;
    guestDetails?: { name: string };
};

const MOCK_BOOKING: BookingData = {
    id: 'bk-a1b2c3d4e5f6',
    title: 'Mahabodhi Temple Experience',
    subtitle: 'Buddhist Circuit Tour',
    type: 'Destination',
    date: '2026-01-15',
    checkIn: '2026-01-15',
    checkOut: '2026-01-17',
    location: 'Bodh Gaya, Bihar',
    guests: 2,
    price: 3250,
    paymentId: 'pay_NxZ7kL9mPqR2Ts',
    guestDetails: { name: 'Rahul Sharma' },
};

function TicketContent() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<BookingData | null>(null);

    useEffect(() => {
        // Simulate fetching
        setTimeout(() => {
            setBooking(MOCK_BOOKING);
            setLoading(false);
        }, 800);
    }, [bookingId]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'Date N/A';
        return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/user" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition">
                            <i className="fas fa-arrow-left"></i>
                        </Link>
                        <h1 className="font-display font-bold text-lg text-gray-900">Booking Ticket</h1>
                    </div>
                    <button onClick={() => window.print()} className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center gap-2">
                        <i className="fas fa-print"></i> Print
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 flex items-center justify-center">
                {loading && (
                    <div className="text-center py-20">
                        <i className="fas fa-circle-notch fa-spin text-3xl text-orange-500 mb-4"></i>
                        <p className="text-gray-500">Retrieving secure ticket...</p>
                    </div>
                )}

                {!loading && booking && (
                    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden relative border border-gray-100">
                        {/* Ticket Header */}
                        <div className="bg-gray-900 text-white p-8 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex items-center gap-3">
                                <span className="font-display font-bold text-2xl tracking-tight text-white">
                                    Bihar<span className="text-orange-500">Yaatra</span>
                                </span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border border-white/10">Confirmed</span>
                            </div>
                            <div className="relative z-10 text-right">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Booking ID</p>
                                <p className="font-mono font-bold text-lg tracking-wide">#{booking.id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Ticket Body */}
                        <div className="p-8 md:p-12 relative">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-8 border-b border-dashed border-gray-200">
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">{booking.title}</h2>
                                    <p className="text-gray-500 font-medium">{booking.subtitle || booking.type + ' Reservation'}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-right">
                                    <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 inline-block text-sm font-bold">
                                        <i className="fas fa-check-circle mr-2"></i>Payment Successful
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 mb-10">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Check In / Start</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600"><i className="fas fa-calendar-check"></i></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{formatDate(booking.date || booking.checkIn)}</p>
                                            <p className="text-xs text-gray-500">12:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Check Out / End</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600"><i className="fas fa-calendar-times"></i></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{booking.checkOut ? formatDate(booking.checkOut) : 'Same Day'}</p>
                                            <p className="text-xs text-gray-500">11:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guest Details</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-user"></i></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{booking.guestDetails?.name || 'Guest'}</p>
                                            <p className="text-xs text-gray-500">{booking.guests} Adults</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600"><i className="fas fa-map-marker-alt"></i></div>
                                        <div>
                                            <p className="font-bold text-gray-900">{booking.location}</p>
                                            <button className="text-xs text-blue-600 hover:underline">Get Directions</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                                <h4 className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-200 pb-2">Payment Summary</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Base Fare</span>
                                        <span>₹{booking.price - 250}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Taxes & Fees</span>
                                        <span>₹250</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200 mt-2">
                                        <span>Total Paid</span>
                                        <span>₹{booking.price}</span>
                                    </div>
                                </div>
                            </div>

                            {/* QR + Support */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
                                <div className="flex items-center gap-4">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BY-BOOKING-${booking.id}`} className="w-24 h-24 border-4 border-white shadow-lg" alt="QR Code" />
                                    <div className="text-xs text-gray-400">
                                        <p className="mb-1">Scan to verify</p>
                                        <p className="font-mono text-gray-600 select-all">{booking.paymentId}</p>
                                    </div>
                                </div>
                                <div className="text-center md:text-right">
                                    <p className="text-xs text-gray-400 mb-1">Need Help?</p>
                                    <p className="font-bold text-gray-900 text-sm">support@biharyaatra.com</p>
                                    <p className="font-bold text-gray-900 text-sm">+91 98765 43210</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !booking && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-red-500">Ticket Not Found</h3>
                        <Link href="/dashboard/user" className="text-sm underline text-gray-600 mt-2">Return to Dashboard</Link>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function TicketPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
            <TicketContent />
        </Suspense>
    );
}
