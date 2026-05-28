"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomestayDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();
    const [mobileMenu, setMobileMenu] = useState(false);

    const hostName = user?.name || 'Host';
    const hostInitials = hostName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    const hostId = user?.id?.slice(0, 8) || 'N/A';

    const navLinks = [
        { label: 'Overview', isHeader: true },
        { href: '/dashboard/provider/homestay', label: 'Dashboard', icon: 'fas fa-chart-pie', exact: true },
        { label: 'Manage', isHeader: true },
        { href: '/dashboard/provider/homestay/calendar', label: 'Calendar & Bookings', icon: 'far fa-calendar-alt' },
        { href: '/dashboard/provider/homestay/listing', label: 'My Listing', icon: 'fas fa-home' },
        { href: '/dashboard/provider/homestay/reviews', label: 'Guest Reviews', icon: 'far fa-star' },
        { label: 'Finance & Account', isHeader: true },
        { href: '/dashboard/provider/homestay/payments', label: 'Payments', icon: 'fas fa-rupee-sign' },
        { href: '/dashboard/provider/homestay/profile', label: 'Profile & Docs', icon: 'far fa-id-card' },
    ];

    return (
        <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-72 bg-white border-r border-gray-100 flex flex-col z-20 shadow-xl lg:shadow-none transition-transform duration-300 absolute lg:relative h-full shrink-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-20 flex items-center px-8 border-b border-gray-50 shrink-0">
                    <Link href="/" className="font-display font-bold text-xl tracking-tighter flex items-center gap-2">
                        <i className="fas fa-hand-holding-heart text-orange-500"></i>
                        Host<span className="text-orange-600">Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scroll no-scrollbar">
                    {navLinks.map((link, idx) => {
                        if (link.isHeader) {
                            return <p key={`header-${idx}`} className={`px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ${idx !== 0 ? 'mt-6' : ''}`}>{link.label}</p>;
                        }
                        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href as string);
                        return (
                            <Link key={link.href} href={link.href as string} onClick={() => setMobileMenu(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl lg:rounded-l-xl text-left font-medium transition-colors ${isActive ? 'bg-orange-50 text-orange-600 border-r-0 lg:border-r-4 border-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <i className={`${link.icon} w-5`}></i> {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-50 shrink-0">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">{hostInitials}</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{hostName}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase truncate">ID: {hostId}</p>
                        </div>
                        <button onClick={logout} className="text-gray-400 hover:text-red-500 transition" title="Logout">
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 bg-black/50 z-10 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenu(false)}></div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full bg-gray-50 w-full overflow-hidden">
                <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10">
                    <span className="font-bold text-lg font-display">My Dashboard</span>
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="text-gray-600"><i className="fas fa-bars text-xl"></i></button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scroll relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
