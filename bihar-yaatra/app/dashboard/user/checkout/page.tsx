"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type BookingItem = {
    title: string;
    type: string;
    price: number;
    guests?: number;
    image?: string;
};

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'location'>('online');
    const [form, setForm] = useState({ name: '', email: '', phone: '', guests: 1 });

    useEffect(() => {
        // Get booking draft from localStorage
        const draft = localStorage.getItem('bookingDraft');
        if (!draft) {
            router.push('/packages');
            return;
        }
        const parsed = JSON.parse(draft) as BookingItem;
        setBookingItem(parsed);
        if (parsed.guests) setForm(prev => ({ ...prev, guests: parsed.guests! }));
        setLoading(false);
    }, [router]);

    const calculateTotal = () => {
        if (!bookingItem) return '₹0';
        const priceStr = String(bookingItem.price).replace(/[^0-9.]/g, '');
        const basePrice = parseFloat(priceStr) || 0;
        const total = basePrice * form.guests;
        return '₹' + total.toLocaleString('en-IN');
    };

    const handleConfirmBooking = async () => {
        if (!form.name || !form.phone || !form.email) {
            alert('Please fill in all details.');
            return;
        }

        setProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear draft and redirect
        localStorage.removeItem('bookingDraft');
        router.push('/dashboard/user');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500 mb-4"></i>
                <p className="text-gray-500 font-bold">Initializing secure session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
                <Link href="/" className="text-2xl font-bold font-display tracking-tighter">
                    Bihar<span className="text-orange-500">Yaatra</span>
                </Link>
                <div className="text-sm font-bold text-gray-500 flex items-center gap-2">
                    <i className="fas fa-shield-alt text-green-500"></i> Secure Checkout
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left — Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h1 className="text-3xl font-display font-bold mb-2">Confirm Your Trip</h1>
                            <p className="text-gray-500">Review your details and complete the booking.</p>
                        </div>

                        {/* Step 1: Traveler Details */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
                                <h3 className="font-bold text-lg">Traveler Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                                    <input type="text" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone Number</label>
                                    <input type="tel" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition" placeholder="+91 98765 43210" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                                    <input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition" placeholder="john@example.com" />
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Payment Method */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">2</div>
                                <h3 className="font-bold text-lg">Payment Method</h3>
                            </div>
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-5 h-5 accent-orange-600" />
                                        <div>
                                            <span className="font-bold text-gray-800 block">Pay Online</span>
                                            <span className="text-xs text-gray-500">UPI, Cards, Netbanking</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-2xl">
                                        <i className="fab fa-cc-visa text-blue-600"></i>
                                        <i className="fab fa-cc-mastercard text-red-500"></i>
                                    </div>
                                </label>
                                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'location' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" value="location" checked={paymentMethod === 'location'} onChange={() => setPaymentMethod('location')} className="w-5 h-5 accent-orange-600" />
                                        <div>
                                            <span className="font-bold text-gray-800 block">Pay at Location</span>
                                            <span className="text-xs text-gray-500">Pay directly to the provider</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-money-bill-wave text-green-500 text-xl"></i>
                                </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 ml-2">
                                <i className={paymentMethod === 'online' ? 'fas fa-lock' : 'fas fa-info-circle'}></i>{' '}
                                {paymentMethod === 'online' ? 'Payments are 100% secured by Razorpay.' : 'You can pay the full amount when you arrive at your destination.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button onClick={() => router.back()} className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition">Cancel</button>
                            <button onClick={handleConfirmBooking} disabled={processing}
                                className="flex-[2] py-4 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-green-600 hover:shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                                {processing ? <><i className="fas fa-circle-notch fa-spin"></i> Processing...</> : <>Confirm & Pay <i className="fas fa-check ml-1"></i></>}
                            </button>
                        </div>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-28">
                            <h3 className="font-bold text-xl mb-6 font-display">Order Summary</h3>
                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500 shrink-0">
                                    <i className="fas fa-suitcase-rolling text-2xl"></i>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wide">{bookingItem?.type || 'Booking'}</span>
                                    <h4 className="font-bold text-gray-900 mt-1 leading-tight line-clamp-2">{bookingItem?.title}</h4>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Price</span>
                                    <span className="font-bold">₹{bookingItem?.price}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-500">Guests</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setForm(prev => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"><i className="fas fa-minus"></i></button>
                                        <span className="font-bold">{form.guests}</span>
                                        <button onClick={() => setForm(prev => ({ ...prev, guests: prev.guests + 1 }))} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Taxes & Fees</span>
                                    <span className="font-bold text-green-600">Free</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Payable</span>
                                    <span className="font-bold text-2xl font-display text-orange-600">{calculateTotal()}</span>
                                </div>
                                <p className="text-xs text-right text-gray-400 mt-1">{paymentMethod === 'online' ? 'Pay via Razorpay' : 'Pay at location'}</p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                                <i className="fas fa-shield-alt text-blue-500 mt-1"></i>
                                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                                    <strong>Safe Travel Guarantee:</strong> Verified drivers and hosts for every booking. 24/7 Support included.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
