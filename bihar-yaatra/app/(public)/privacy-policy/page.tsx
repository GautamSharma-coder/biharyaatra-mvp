"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Navbar from '@/components/layout/Navbar';

export default function PrivacyPolicyPage() {

    useEffect(() => {
    }, []);

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Privacy <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Policy</span></h1>
                        <p className="text-gray-500 text-lg">Last updated: October 12, 2025</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 space-y-12">
                        <section>
                            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Welcome to Bihar Yaatra. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">2. Data We Collect</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-orange-500 mt-1"></i>
                                    <span className="text-gray-600"><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-orange-500 mt-1"></i>
                                    <span className="text-gray-600"><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-orange-500 mt-1"></i>
                                    <span className="text-gray-600"><strong>Financial Data:</strong> includes bank account and payment card details (processed securely via Razorpay).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <i className="fas fa-check-circle text-orange-500 mt-1"></i>
                                    <span className="text-gray-600"><strong>Usage Data:</strong> includes information about how you use our website, products and services.</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Data</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fas fa-ticket-alt text-2xl text-blue-500 mb-3"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">Service Fulfillment</h4>
                                    <p className="text-sm text-gray-600">To process your bookings for flights, hotels, cabs, and guides.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fas fa-shield-alt text-2xl text-green-500 mb-3"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">Security</h4>
                                    <p className="text-sm text-gray-600">To verify your identity and prevent fraud.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fas fa-magic text-2xl text-purple-500 mb-3"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">Personalization</h4>
                                    <p className="text-sm text-gray-600">To provide AI-driven recommendations based on your preferences.</p>
                                </div>
                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <i className="fas fa-envelope text-2xl text-orange-500 mb-3"></i>
                                    <h4 className="font-bold text-gray-900 mb-2">Communication</h4>
                                    <p className="text-sm text-gray-600">To send you updates about your bookings and trip itineraries.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">4. Data Security</h2>
                            <p className="text-gray-600 leading-relaxed">
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-display text-2xl font-bold mb-4 text-gray-900">5. Contact Us</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                            </p>
                            <div className="flex flex-col md:flex-row gap-6">
                                <a href="mailto:privacy@biharyaatra.com" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition group flex-1">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm group-hover:scale-110 transition">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Email Us</p>
                                        <p className="font-bold text-gray-900">privacy@biharyaatra.com</p>
                                    </div>
                                </a>
                                <Link href="/contact" className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition group flex-1">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition">
                                        <i className="fas fa-headset"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase">Support Center</p>
                                        <p className="font-bold text-gray-900">Visit Help Page</p>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer space */}

            <MobileBottomNav />
        </div>
    );
}
