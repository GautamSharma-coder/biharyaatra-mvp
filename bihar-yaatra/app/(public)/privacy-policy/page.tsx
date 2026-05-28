"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function PrivacyPolicyPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    
    // Mock user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Traveler');
    const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Traveler&background=f97316&color=fff');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            {/* Header */}
            <header className={`fixed w-full top-0 z-999 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
                            Bihar<span className="text-gradient hover:text-orange-500">Yaatra</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/destinations" className="nav-item font-medium">Destinations</Link>
                            
                            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
                                <button onMouseEnter={() => setServicesOpen(true)} className="nav-item font-medium flex items-center gap-1.5 transition-colors duration-200">
                                    Services <i className={`fas fa-chevron-down text-xs ml-1 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}></i>
                                </button>
                                {servicesOpen && (
                                    <div className="absolute left-1/2 -translate-x-1/2 pt-4 w-56 transform origin-top animate-fade-in-down z-50">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                                        <Link href="/packages" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-calendar-alt w-4 mr-2 text-blue-500"></i> Tour Packages</Link>
                                        <Link href="/aiplanner" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-compass w-4 mr-2 text-purple-500"></i> AI Trip Planner</Link>
                                        <Link href="/homestays" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-heart w-4 mr-2 text-orange-500"></i> Homestays</Link>
                                        <Link href="/transport" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-bus-alt w-4 mr-2 text-green-500"></i> Transport</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link href="/guide-support" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-user-tie w-4 mr-2 text-teal-500"></i> Expert Guides</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link href="/about" className="nav-item font-medium">About</Link>
                            <Link href="/contact" className="nav-item font-medium">Contact</Link>

                            {!isLoggedIn ? (
                                <Link href="/auth" className="px-6 py-2.5 rounded-full bg-linear-to-r from-orange-400 to-pink-500 text-white font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5">
                                    Login
                                </Link>
                            ) : (
                                <div className="relative" onMouseLeave={() => setUserMenu(false)}>
                                    <button onMouseEnter={() => setUserMenu(true)} className="flex items-center gap-2 focus:outline-none">
                                        <img src={userAvatar} className="w-10 h-10 rounded-full border-2 border-orange-100 object-cover" alt="User Pic" />
                                        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    {userMenu && (
                                        <div className="absolute right-0 mt-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                                            <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">Dashboard</a>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>

                        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden focus:outline-none text-gray-800">
                            <i className="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 z-1000 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenu(false)}></div>
                    <div className="relative w-full max-w-xs bg-white shadow-2xl h-full flex flex-col pt-0 animate-slide-in-right">
                        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
                            <span className="font-display font-bold text-xl">Menu</span>
                            <button onClick={() => setMobileMenu(false)} className="text-gray-500 hover:text-red-500 transition">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
                            <Link href="/destinations" className="block text-lg font-medium hover:text-orange-600 transition">Destinations</Link>
                            <Link href="/packages" className="block text-lg font-medium hover:text-orange-600 transition">Packages</Link>
                            <Link href="/aiplanner" className="block text-lg font-medium hover:text-orange-600 transition">AI Planner</Link>
                            <Link href="/homestays" className="block text-lg font-medium hover:text-orange-600 transition">Homestays</Link>
                            <Link href="/transport" className="block text-lg font-medium hover:text-orange-600 transition">Transports</Link>
                            <Link href="/contact" className="block text-lg font-medium hover:text-orange-600 transition">Contact</Link>
                        </div>
                    </div>
                </div>
            )}

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
