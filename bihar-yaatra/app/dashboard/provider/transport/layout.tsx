"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TransportDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menu = [
        { id: 'home', href: '/dashboard/provider/transport', label: 'Dashboard', icon: 'fas fa-th-large', exact: true },
        { id: 'live', href: '/dashboard/provider/transport/live', label: 'Live Operations', icon: 'fas fa-map-location-dot' },
        { id: 'fleet', href: '/dashboard/provider/transport/fleet', label: 'Fleet & Inventory', icon: 'fas fa-car' },
        { id: 'drivers', href: '/dashboard/provider/transport/drivers', label: 'Personnel', icon: 'fas fa-id-card' },
        { id: 'payments', href: '/dashboard/provider/transport/payments', label: 'Revenue', icon: 'fas fa-wallet' },
        { id: 'pricing', href: '/dashboard/provider/transport/pricing', label: 'Surge Control', icon: 'fas fa-bolt' }
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="fixed md:relative left-0 top-0 h-screen w-20 lg:w-64 bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300 shrink-0">
                <div className="p-6 flex items-center justify-center lg:justify-start gap-3 h-20 shrink-0 border-b border-gray-50">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shrink-0 shadow-md">
                        <i className="fas fa-bus"></i>
                    </div>
                    <span className="font-display font-bold text-xl hidden lg:block">
                        Bihar<span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Yaatra</span>
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 hidden lg:block">Fleet Management</p>
                    {menu.map(item => {
                        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link key={item.id} href={item.href} 
                                className={`w-full flex items-center lg:px-4 py-3 rounded-xl transition-all group lg:justify-start justify-center ${isActive ? 'bg-black text-white shadow-lg shadow-gray-400/30' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}>
                                <i className={`${item.icon} text-lg lg:text-base lg:w-6 text-center lg:mr-3 transition-transform group-hover:scale-110`}></i>
                                <span className="hidden lg:block font-bold text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto shrink-0 border-t border-gray-50">
                    <div className="bg-orange-50/80 p-5 rounded-2xl hidden lg:block border border-orange-100 shadow-sm">
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Support</p>
                        <p className="text-xs text-gray-800 mt-1.5 font-bold">Need dispatch help?</p>
                        <button className="mt-4 w-full bg-white text-black py-2.5 rounded-xl text-xs font-bold shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:bg-gray-50 border border-gray-100 transition active:scale-95">Contact HQ</button>
                    </div>
                    {/* Mobile logout/support icon */}
                    <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl text-lg flex items-center justify-center lg:hidden hover:bg-gray-200 transition">
                        <i className="fas fa-headset"></i>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto ml-20 md:ml-0 p-4 md:p-6 lg:p-10 custom-scroll relative">
                {children}
            </main>
        </div>
    );
}
