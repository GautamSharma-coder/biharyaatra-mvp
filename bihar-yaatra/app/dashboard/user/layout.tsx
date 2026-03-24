"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const menu: Array<{ href: string; label: string; icon: string; exact?: boolean }> = [
        { href: '/dashboard/user', label: 'Dashboard', icon: 'fas fa-border-all', exact: true },
        { href: '/dashboard/user/trips', label: 'My Trips', icon: 'fas fa-map-location-dot' },
        { href: '/dashboard/user/bookings', label: 'Bookings', icon: 'fas fa-ticket' }
    ];
    
    const settings: Array<{ href: string; label: string; icon: string; exact?: boolean }> = [
        { href: '/dashboard/user/profile', label: 'Profile', icon: 'fas fa-user-gear' },
        { href: '/dashboard/user/wallet', label: 'Wallet', icon: 'fas fa-wallet' },
        { href: '/dashboard/user/support', label: 'Support', icon: 'fas fa-life-ring' }
    ];

    const user = {
        name: 'Traveler',
        email: 'traveler@biharyaatra.com',
        avatar: 'https://ui-avatars.com/api/?name=Traveler&background=FF7D29&color=fff',
        location: 'Bihar, India'
    };

    return (
        <div className="flex h-screen bg-[#FAFAFA] font-sans text-gray-800 overflow-hidden">
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 lg:static lg:translate-x-0 z-50 w-72 h-full bg-white lg:border-r border-gray-100 flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none shrink-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 pb-4 border-b border-gray-50 flex items-center justify-between lg:justify-start">
                    <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2 text-gray-900">
                        Bihar<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Yaatra</span>
                    </Link>
                    <button className="lg:hidden text-gray-500" onClick={() => setMobileMenuOpen(false)}>
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-5 space-y-1.5 custom-scroll no-scrollbar">
                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-2">Menu</p>
                    {menu.map(item => {
                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                                className={`sidebar-link w-full flex items-center gap-3.5 px-4 py-3.5 font-medium rounded-xl transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'}`}>
                                <i className={`${item.icon} w-5 text-center`}></i> {item.label}
                            </Link>
                        );
                    })}

                    <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 mt-8">Settings</p>
                    {settings.map(item => {
                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                                className={`sidebar-link w-full flex items-center gap-3.5 px-4 py-3.5 font-medium rounded-xl transition-all ${isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'}`}>
                                <i className={`${item.icon} w-5 text-center`}></i> {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-gray-100 shrink-0">
                    <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-3 hover:bg-gray-100 transition cursor-pointer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-100 font-bold text-sm tracking-wide">
                        <i className="fas fa-sign-out-alt"></i> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto custom-scroll w-full flex flex-col relative">
                
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 lg:px-10 lg:py-5 flex justify-between items-center transition-all duration-300 shrink-0">
                    <div className="lg:hidden flex items-center gap-3">
                        <button onClick={() => setMobileMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100">
                            <i className="fas fa-bars text-lg"></i>
                        </button>
                        <span className="font-display font-bold text-lg text-gray-900 tracking-tight">Dashboard</span>
                    </div>

                    <div className="hidden lg:block">
                        <h1 className="text-xl lg:text-2xl font-display font-black text-gray-900 flex items-center gap-2 tracking-tight">
                            Hello, <span className="text-orange-500">{user.name}</span> <span className="animate-pulse origin-bottom" style={{display: 'inline-block'}}>👋</span>
                        </h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Ready for your next adventure?</p>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        <button className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-gray-500 transition shadow-sm relative active:scale-95 duration-200">
                            <i className="far fa-bell text-lg"></i>
                            <span className="absolute top-2.5 right-2.5 md:right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-200">
                            <div className="text-right">
                                <p className="font-bold text-sm text-gray-900 leading-tight">{user.name}</p>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mt-1">{user.location}</p>
                            </div>
                            <div className="relative cursor-pointer hover:opacity-80 transition hover:scale-105 duration-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-gray-100" />
                                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-6 lg:p-10 pb-24 relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
