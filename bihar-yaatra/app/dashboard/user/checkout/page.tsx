"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { apiClient } from '@/lib/api-client';

type BookingItem = {
    title: string;
    type: string;
    price: number;
    guests?: number;
    image?: string;
    service_id: string;
    service_type: string;
    service_name: string;
    check_in?: string;
    check_out?: string;
};

// Razorpay types for the checkout modal
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    prefill: { name: string; email: string; contact: string };
    notes: { booking_id: string };
    theme: { color: string };
    modal?: { ondismiss?: () => void };
}

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => { open: () => void };
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [bookingItem, setBookingItem] = useState<BookingItem | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'online' | 'location'>('online');
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        guests: 1,
        check_in: '',
        check_out: '',
        notes: '',
    });
    const [extraTravelers, setExtraTravelers] = useState<Array<{ name: string; age: string }>>([]);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [createdBookingId, setCreatedBookingId] = useState<string | null>(null);

    useEffect(() => {
        // Get booking draft from localStorage
        const draft = localStorage.getItem('bookingDraft');
        if (!draft) {
            router.push('/packages');
            return;
        }
        const parsed = JSON.parse(draft) as BookingItem;

        const timer = setTimeout(() => {
            setBookingItem(parsed);
            const guestCount = parsed.guests || 1;
            setForm(prev => ({
                ...prev,
                guests: guestCount,
                check_in: parsed.check_in || '',
                check_out: parsed.check_out || '',
            }));
            // Initialize extra travelers if guests > 1
            if (guestCount > 1) {
                setExtraTravelers(Array.from({ length: guestCount - 1 }, () => ({ name: '', age: '' })));
            }
            setLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [router]);

    const calculateTotal = useCallback(() => {
        if (!bookingItem) return 0;
        const priceStr = String(bookingItem.price).replace(/[^0-9.]/g, '');
        const basePrice = parseFloat(priceStr) || 0;

        if (bookingItem.service_type === 'homestay' && form.check_in && form.check_out) {
            const diffMs = new Date(form.check_out).getTime() - new Date(form.check_in).getTime();
            const nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
            return basePrice * nights * form.guests;
        }

        return basePrice * form.guests;
    }, [bookingItem, form.guests, form.check_in, form.check_out]);

    const formatTotal = () => {
        return '₹' + calculateTotal().toLocaleString('en-IN');
    };

    // Get the appropriate date label based on service type
    const getDateLabel = () => {
        switch (bookingItem?.service_type) {
            case 'transport': return 'Travel Date';
            case 'homestay': return 'Check-in Date';
            case 'package': return 'Start Date';
            default: return 'Date';
        }
    };

    const showCheckOut = bookingItem?.service_type === 'homestay';

    const handleConfirmBooking = async () => {
        if (!form.name || !form.phone || !form.email) {
            alert('Please fill in all traveler details.');
            return;
        }
        // Validate extra travelers
        if (form.guests > 1) {
            const incomplete = extraTravelers.some(t => !t.name.trim() || !t.age.trim());
            if (incomplete) {
                alert('Please fill in name and age for all additional travelers.');
                return;
            }
        }
        if (!form.check_in) {
            alert(`Please select a ${getDateLabel().toLowerCase()}.`);
            return;
        }
        if (showCheckOut && !form.check_out) {
            alert('Please select a check-out date.');
            return;
        }
        if (!bookingItem) return;

        setProcessing(true);

        try {
            const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            
            // Validate payment gateway configuration BEFORE creating booking
            if (paymentMethod === 'online' && (!razorpayKeyId || (!razorpayLoaded && !window.Razorpay))) {
                alert('Payment gateway is not configured or still loading. Please make sure the API keys are added and the dev server has been restarted.');
                setProcessing(false);
                return;
            }

            // Build notes with extra traveler info
            const travelerNotes = extraTravelers.length > 0
                ? `\n\nAdditional Travelers:\n${extraTravelers.map((t, i) => `${i + 2}. ${t.name} (Age: ${t.age})`).join('\n')}`
                : '';

            // Step 1: Create the booking on the backend (skip if already created)
            let currentBookingId = createdBookingId;
            
            if (!currentBookingId) {
                const bookingPayload = {
                    service_type: bookingItem.service_type,
                    service_id: bookingItem.service_id,
                    service_name: bookingItem.service_name || bookingItem.title,
                    guests: form.guests,
                    check_in: form.check_in || undefined,
                    check_out: form.check_out || undefined,
                    notes: ((form.notes || '') + travelerNotes).trim() || undefined,
                };

                const { data: booking } = await apiClient.post('/bookings', bookingPayload);
                currentBookingId = booking.id;
                setCreatedBookingId(booking.id);
            }

            if (paymentMethod === 'online') {
                // Step 2: Create Razorpay order
                const amountInPaise = calculateTotal() * 100;
                const { data: order } = await apiClient.post('/payments/create-order', {
                    amount: amountInPaise,
                    currency: 'INR',
                    booking_id: currentBookingId,
                });

                // Step 3: Open Razorpay checkout modal

                const options: RazorpayOptions = {
                    key: razorpayKeyId || '',
                    amount: order.amount,
                    currency: order.currency || 'INR',
                    name: 'BiharYaatra',
                    description: `Booking: ${bookingItem.title}`,
                    order_id: order.id,
                    handler: async (response: RazorpayResponse) => {
                        try {
                            setProcessing(true);
                            // Call verification endpoint on the backend
                            await apiClient.post('/payments/verify', {
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                booking_id: currentBookingId,
                            });
                            localStorage.removeItem('bookingDraft');
                            router.push(`/dashboard/user/ticket?id=${currentBookingId}`);
                        } catch (verifyErr) {
                            console.error('Payment verification failed:', verifyErr);
                            // Fallback redirect to ticket page anyway since Razorpay transaction succeeded
                            localStorage.removeItem('bookingDraft');
                            router.push(`/dashboard/user/ticket?id=${currentBookingId}`);
                        }
                    },
                    prefill: {
                        name: form.name,
                        email: form.email,
                        contact: form.phone,
                    },
                    notes: {
                        booking_id: currentBookingId || '',
                    },
                    theme: {
                        color: '#F97316',
                    },
                    modal: {
                        ondismiss: () => {
                            setProcessing(false);
                        },
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return; // Don't setProcessing(false) — modal handles it
            }

            // Pay at Location — call backend confirm and redirect to ticket
            try {
                await apiClient.post(`/bookings/${currentBookingId}/confirm-location`);
                localStorage.removeItem('bookingDraft');
                router.push(`/dashboard/user/ticket?id=${currentBookingId}`);
            } catch (locationErr) {
                console.error('Failed to confirm location booking:', locationErr);
                localStorage.removeItem('bookingDraft');
                router.push(`/dashboard/user/ticket?id=${currentBookingId}`);
            }
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string | { message?: string }[] } } };
            const message = typeof error.response?.data?.error === 'string'
                ? error.response.data.error
                : 'Failed to create booking. Please try again.';
            alert(message);
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500 mb-4"></i>
                <p className="text-gray-500 font-bold">Initializing secure session...</p>
            </div>
        );
    }

    return (
        <>
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRazorpayLoaded(true)}
            />

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left — Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h1 className="text-3xl font-display font-bold mb-2">Confirm Your Trip</h1>
                            <p className="text-gray-500">Review your details and complete the booking.</p>
                        </div>

                        {/* Step 1: Traveler Details */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
                                <h3 className="font-bold text-lg">Traveler Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                        {/* Extra Travelers (when guests > 1) */}
                        {form.guests > 1 && (
                            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <h3 className="font-bold text-lg">Additional Travelers</h3>
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{extraTravelers.length} extra</span>
                                </div>
                                <div className="space-y-4">
                                    {extraTravelers.map((traveler, idx) => (
                                        <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Traveler {idx + 2}</p>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div className="md:col-span-2">
                                                    <input
                                                        type="text"
                                                        value={traveler.name}
                                                        onChange={e => {
                                                            const updated = [...extraTravelers];
                                                            updated[idx] = { ...updated[idx], name: e.target.value };
                                                            setExtraTravelers(updated);
                                                        }}
                                                        className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition text-sm"
                                                        placeholder="Full Name"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="number"
                                                        value={traveler.age}
                                                        onChange={e => {
                                                            const updated = [...extraTravelers];
                                                            updated[idx] = { ...updated[idx], age: e.target.value };
                                                            setExtraTravelers(updated);
                                                        }}
                                                        min="1"
                                                        max="120"
                                                        className="w-full p-3 bg-white rounded-lg border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition text-sm"
                                                        placeholder="Age"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Trip Details (Dates & Notes) */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">2</div>
                                <h3 className="font-bold text-lg">Trip Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{getDateLabel()}</label>
                                    <input type="date" value={form.check_in} onChange={e => setForm(prev => ({ ...prev, check_in: e.target.value }))}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition" />
                                </div>
                                {showCheckOut && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Check-out Date</label>
                                        <input type="date" value={form.check_out} onChange={e => setForm(prev => ({ ...prev, check_out: e.target.value }))}
                                            min={form.check_in || new Date().toISOString().split('T')[0]}
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-bold text-gray-800 transition" />
                                    </div>
                                )}
                                <div className={showCheckOut ? 'md:col-span-2' : ''}>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Special Requests <span className="text-gray-300 normal-case">(optional)</span></label>
                                    <textarea value={form.notes} onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                        rows={3}
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-orange-500 outline-none font-medium text-gray-800 transition resize-none"
                                        placeholder="Any dietary needs, accessibility requirements, pickup preferences..." />
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Payment Method */}
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">3</div>
                                <h3 className="font-bold text-lg">Payment Method</h3>
                            </div>
                            <div className="space-y-3">
                                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-5 h-5 accent-orange-600" />
                                        <div>
                                            <span className="font-bold text-gray-800 block">Pay Online</span>
                                            <span className="text-xs text-gray-500">UPI, Cards, Netbanking via Razorpay</span>
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
                                className="flex-2 py-4 bg-black text-white rounded-xl font-bold shadow-xl hover:bg-green-600 hover:shadow-green-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
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
                                    <i className={`text-2xl ${
                                        bookingItem?.service_type === 'transport' ? 'fas fa-car' :
                                        bookingItem?.service_type === 'homestay' ? 'fas fa-home' :
                                        'fas fa-suitcase-rolling'
                                    }`}></i>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-wide">{bookingItem?.type || 'Booking'}</span>
                                    <h4 className="font-bold text-gray-900 mt-1 leading-tight line-clamp-2">{bookingItem?.title}</h4>
                                </div>
                            </div>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Price</span>
                                    <span className="font-bold">₹{bookingItem?.price?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm items-center">
                                    <span className="text-gray-500">{bookingItem?.service_type === 'homestay' ? 'Guests' : 'Travelers'}</span>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => {
                                            const newGuests = Math.max(1, form.guests - 1);
                                            setForm(prev => ({ ...prev, guests: newGuests }));
                                            setExtraTravelers(prev => prev.slice(0, Math.max(0, newGuests - 1)));
                                        }} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"><i className="fas fa-minus"></i></button>
                                        <span className="font-bold">{form.guests}</span>
                                        <button onClick={() => {
                                            const newGuests = form.guests + 1;
                                            setForm(prev => ({ ...prev, guests: newGuests }));
                                            setExtraTravelers(prev => [...prev, { name: '', age: '' }]);
                                        }} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs"><i className="fas fa-plus"></i></button>
                                    </div>
                                </div>
                                {showCheckOut && form.check_in && form.check_out && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Nights</span>
                                        <span className="font-bold">{Math.max(1, Math.ceil((new Date(form.check_out).getTime() - new Date(form.check_in).getTime()) / (1000 * 60 * 60 * 24)))}</span>
                                    </div>
                                )}
                                {form.check_in && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">{getDateLabel()}</span>
                                        <span className="font-bold text-gray-700">{new Date(form.check_in).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Taxes & Fees</span>
                                    <span className="font-bold text-green-600">Free</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Total Payable</span>
                                    <span className="font-bold text-2xl font-display text-orange-600">{formatTotal()}</span>
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
            </div>
        </>
    );
}
