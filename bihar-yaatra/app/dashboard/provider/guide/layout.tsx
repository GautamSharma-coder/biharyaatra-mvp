"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function GuideDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { id: 'home', href: '/dashboard/provider/guide', label: 'My Schedule', icon: 'fas fa-calendar-day', exact: true },
        { id: 'bookings', href: '/dashboard/provider/guide/bookings', label: 'Booking Requests', icon: 'fas fa-hand-pointer' },
        { id: 'itineraries', href: '/dashboard/provider/guide/itineraries', label: 'Tour Itineraries', icon: 'fas fa-route' },
        { id: 'revenue', href: '/dashboard/provider/guide/revenue', label: 'Wallet & Payouts', icon: 'fas fa-wallet' },
        { id: 'profile', href: '/dashboard/provider/guide/profile', label: 'My Certificates', icon: 'fas fa-certificate' }
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            <aside className="fixed md:relative left-0 top-0 h-screen w-20 lg:w-64 bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 shrink-0">
                <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-gray-50 h-20 shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-200">
                        <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <span className="font-display font-bold text-xl hidden lg:block">
                        Guide<span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Portal</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 hidden lg:block">Main Menu</p>
                    {menu.map(item => {
                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link key={item.id} href={item.href} 
                                className={`w-full flex items-center lg:px-4 py-3 rounded-xl transition-all group lg:justify-start justify-center ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}>
                                <i className={`${item.icon} text-lg lg:text-base lg:w-6 text-center lg:mr-3 transition-transform group-hover:scale-110`}></i>
                                <span className="hidden lg:block font-bold text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-gray-50 shrink-0">
                    <button className="w-full bg-gray-900 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition shadow-lg">
                        <i className="fas fa-sign-out-alt"></i>
                        <span className="hidden lg:block">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto ml-20 md:ml-0 p-4 lg:p-8 custom-scroll relative">
                {children}
            </main>
        </div>
    );
}
