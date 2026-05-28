"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);

    // Derived dynamic auth state
    const isLoggedIn = !!user;
    const userName = user?.name || 'Traveler';
    const userAvatar = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f97316&color=fff`;

    const getDashboardUrl = () => {
        if (!user) return '/auth/login';
        if (user.role === 'admin' || user.role === 'superadmin') return '/dashboard/admin';
        return '/dashboard/user';
    };

    const servicesRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Outside Click Handlers for Dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
                setServicesOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <>
            <header className={`fixed w-full top-0 z-999 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
                            Bihar<span className="text-gradient">Yaatra</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/destinations" className="nav-item font-medium">Destinations</Link>

                            <div className="relative" ref={servicesRef}
                                 onMouseEnter={() => setServicesOpen(true)}
                                 onMouseLeave={() => setServicesOpen(false)}
                            >
                                <button 
                                    onClick={() => setServicesOpen(!servicesOpen)} 
                                    className="nav-item font-medium flex items-center gap-1.5 transition-colors duration-200"
                                >
                                    Services <i className={`fas fa-chevron-down text-xs ml-1 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}></i>
                                </button>
                                {servicesOpen && (
                                    <div className="absolute left-1/2 -translate-x-1/2 pt-4 w-56 transform origin-top animate-fade-in-down z-50">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                                            <Link href="/packages" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                <i className="fas fa-calendar-alt w-4 mr-2 text-blue-500"></i> Tour Packages
                                            </Link>
                                            <Link href="/aiplanner" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                <i className="fas fa-compass w-4 mr-2 text-purple-500"></i> AI Trip Planner
                                            </Link>
                                            <Link href="/homestays" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                <i className="fas fa-heart w-4 mr-2 text-orange-500"></i> Homestays
                                            </Link>
                                            <Link href="/transport" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                <i className="fas fa-bus-alt w-4 mr-2 text-green-500"></i> Transport
                                            </Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Link href="/guide-support" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                                <i className="fas fa-user-tie w-4 mr-2 text-teal-500"></i> Expert Guides
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <Link href="/about" className="nav-item font-medium">About</Link>
                            <Link href="/contact" className="nav-item font-medium">Contact</Link>

                            {loading ? (
                                <div className="w-10 h-10 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : !isLoggedIn ? (
                                <Link href="/auth/login" className="px-6 py-2.5 rounded-full bg-gradient text-white font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" style={{ display: 'inline-block' }}>
                                    Login
                                </Link>
                            ) : (
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 focus:outline-none">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={userAvatar} className="w-10 h-10 rounded-full border-2 border-orange-100 object-cover" alt="User Pic" />
                                        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`}></i>
                                    </button>

                                    {userMenu && (
                                        <div className="absolute right-0 mt-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden animate-fade-in-down">
                                            <Link href={getDashboardUrl()} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">Dashboard</Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
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

                    <div className="relative w-full max-w-xs bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
                        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
                            <span className="font-display font-bold text-xl">Menu</span>
                            <button onClick={() => setMobileMenu(false)} className="text-gray-500 hover:text-red-500 transition">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        {isLoggedIn && (
                            <div className="px-6 py-6 bg-orange-50/50 border-b border-orange-100 flex items-center gap-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={userAvatar} className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase">Welcome back</p>
                                    <h3 className="font-display font-bold text-xl text-gray-900">{userName}</h3>
                                </div>
                            </div>
                        )}

                        <div className="flex-1 px-6 py-6 overflow-y-auto">
                            <nav className="space-y-4">
                                {isLoggedIn && (
                                    <div>
                                        <Link href={getDashboardUrl()} className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-gray-900 bg-orange-50 rounded-xl transition">
                                            <i className="fas fa-th-large text-orange-500"></i> Dashboard
                                        </Link>
                                        <div className="border-t border-gray-100 my-4"></div>
                                    </div>
                                )}

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
                                <Link href="/about" className="flex items-center gap-4 text-lg font-medium text-orange-600 transition">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600"><i className="fas fa-info-circle"></i></div>
                                    About Us
                                </Link>
                                <Link href="/contact" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                    <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><i className="fas fa-envelope"></i></div>
                                    Contact
                                </Link>
                            </nav>
                        </div>

                        <div className="p-6 bg-gray-50">
                            {loading ? (
                                <div className="w-full flex justify-center py-4">
                                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : !isLoggedIn ? (
                                <Link href="/auth/login" className="block w-full text-center py-4 rounded-xl bg-gradient text-white font-medium shadow-lg hover:shadow-xl transition-all">
                                    Login / Sign Up
                                </Link>
                            ) : (
                                <button onClick={logout} className="block w-full text-center py-4 rounded-xl bg-white border border-gray-200 text-red-600 font-bold shadow-sm hover:bg-red-50">
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
