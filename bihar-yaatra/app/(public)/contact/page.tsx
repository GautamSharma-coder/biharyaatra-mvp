"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Navbar from '@/components/layout/Navbar';

export default function ContactPage() {

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    useEffect(() => {
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage(false);

        // Mock API call
        setTimeout(() => {
            setSuccessMessage(true);
            setForm(prev => ({ ...prev, message: '' }));
            setLoading(false);
            
            setTimeout(() => {
                setSuccessMessage(false);
            }, 5000);
        }, 1500);
    };

    return (
        <div className="bg-gray-50 text-gray-900 font-sans overflow-x-hidden min-h-screen">
            <Navbar />

            <section className="pt-40 pb-12 bg-white text-center">
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
                    Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Touch</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto px-6 font-medium">
                    Have a question about a tour? Need help planning your itinerary? We're here to help you 24/7.
                </p>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-4xl shadow-lg border border-gray-100">
                                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                                    <i className="fas fa-building text-orange-500"></i> Service Center
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mt-1 shrink-0">
                                            <i className="fas fa-map-marker-alt"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Head Office</h4>
                                            <p className="text-gray-600">
                                                Bihar Yaatra Tourism HQ,<br/>
                                                Sarairanjan, Samastipur, Bihar, 848127<br/>
                                                India
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mt-1 shrink-0">
                                            <i className="fas fa-phone-alt"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Phone Support</h4>
                                            <p className="text-gray-600 hover:text-orange-600 transition font-medium">
                                                <a href="tel:+91987654321">+91 98765 43210</a>
                                            </p>
                                            <p className="text-sm text-gray-400">Mon - Sat (9:00 AM - 8:00 PM)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mt-1 shrink-0">
                                            <i className="fas fa-envelope"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Email Us</h4>
                                            <p className="text-gray-600 hover:text-orange-600 transition font-medium">
                                                <a href="mailto:support@biharyaatra.com">support@biharyaatra.com</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-200 rounded-4xl h-64 w-full overflow-hidden relative shadow-inner group">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Map_of_Bihar.jpg" alt="Map Location" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition duration-500" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <a href="https://maps.google.com/?q=Bihar" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:scale-105 transition transform flex items-center gap-2">
                                        <i className="fas fa-location-arrow text-orange-600"></i> View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-display font-bold mb-2">Send us a Message</h2>
                            <p className="text-gray-500 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

                            <form onSubmit={sendMessage} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">First Name</label>
                                        <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-medium" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Last Name</label>
                                        <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-medium" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email Address</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-medium" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Subject</label>
                                    <div className="relative">
                                        <select name="subject" value={form.subject} onChange={handleChange} className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-medium appearance-none cursor-pointer">
                                            <option>General Inquiry</option>
                                            <option>Tour Booking</option>
                                            <option>Feedback</option>
                                            <option>Partnership</option>
                                        </select>
                                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Message</label>
                                    <textarea rows={4} name="message" value={form.message} onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition resize-none font-medium" placeholder="Tell us how we can help..."></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:shadow-orange-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                    {!loading ? <span>Send Message</span> : <i className="fas fa-circle-notch fa-spin"></i>}
                                </button>

                                {successMessage && (
                                    <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center text-sm font-bold border border-green-100 mt-4 animate-fade-in">
                                        <i className="fas fa-check-circle mr-2"></i> Message sent successfully!
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <MobileBottomNav />
        </div>
    );
}
