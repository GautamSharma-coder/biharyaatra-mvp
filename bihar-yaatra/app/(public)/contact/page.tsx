"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function ContactPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    
    // Mock user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Traveler');
    const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Traveler&background=f97316&color=fff');

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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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
            {/* Header */}
            <header className={`fixed w-full top-0 z-[999] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'}`}>
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
                            <Link href="/contact" className="nav-item font-medium text-orange-600">Contact</Link>

                            {!isLoggedIn ? (
                                <Link href="/auth" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5">
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
                <div className="fixed inset-0 z-[1000] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenu(false)}></div>
                    <div className="relative w-full max-w-xs bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
                        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
                            <span className="font-display font-bold text-xl">Menu</span>
                            <button onClick={() => setMobileMenu(false)} className="text-gray-500 hover:text-red-500 transition">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
                            <Link href="/packages" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><i className="fas fa-suitcase-rolling"></i></div>
                                Packages
                            </Link>
                            <Link href="/homestays" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><i className="fas fa-home"></i></div>
                                Homestays
                            </Link>
                            <Link href="/transport" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><i className="fas fa-car"></i></div>
                                Transports
                            </Link>
                            <Link href="/guide-support" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><i className="fas fa-user-tie"></i></div>
                                Guides
                            </Link>
                            <Link href="/about" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600"><i className="fas fa-info-circle"></i></div>
                                About
                            </Link>
                            <Link href="/contact" className="flex items-center gap-4 text-lg font-medium text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><i className="fas fa-envelope"></i></div>
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <section className="pt-40 pb-12 bg-white text-center">
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
                    Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Touch</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-xl mx-auto px-6 font-medium">
                    Have a question about a tour? Need help planning your itinerary? We're here to help you 24/7.
                </p>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100">
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

                            <div className="bg-gray-200 rounded-[2rem] h-64 w-full overflow-hidden relative shadow-inner group">
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
