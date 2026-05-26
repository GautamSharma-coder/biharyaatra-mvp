"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || (user.role !== 'admin' && user.role !== 'superadmin'))) {
            router.push('/auth/login');
        }
    }, [user, loading, router]);

    const adminEmail = user?.email || "admin@biharyaatra.com";
    const adminRole = user?.role ? user.role.toUpperCase() : "SUPER ADMIN";

    const navLinks = [
        { href: '/dashboard/admin', label: 'Dashboard', icon: 'fa-th-large', category: 'Overview', exact: true },
        { href: '/dashboard/admin/bookings', label: 'Bookings', icon: 'fa-calendar-check', category: 'Overview' },
        { href: '/dashboard/admin/tourists', label: 'System Users', icon: 'fa-users', category: 'Management' },
        { href: '/dashboard/admin/homestays', label: 'Homestays', icon: 'fa-home', category: 'Management' },
        { href: '/dashboard/admin/transport', label: 'Transport', icon: 'fa-bus', category: 'Management' },
        { href: '/dashboard/admin/partner-approvals', label: 'Partner Approvals', icon: 'fa-handshake', category: 'Management' },
        { href: '/dashboard/admin/cms', label: 'CMS', icon: 'fa-edit', category: 'Root Admin' },
        { href: '/dashboard/admin/create', label: 'Create Identity', icon: 'fa-user-plus', category: 'Root Admin' }
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col z-20 shadow-lg shrink-0">
                <div className="h-16 flex items-center justify-center border-b border-gray-100 shrink-0">
                    <Link href="/" className="font-display font-bold text-xl tracking-tighter flex items-center gap-2">
                        <i className="fas fa-shield-alt text-orange-500"></i>
                        Admin<span className="text-orange-600">Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 space-y-1 custom-scroll">
                    <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Overview</p>
                    {navLinks.filter(l => l.category === 'Overview').map(link => {
                        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-6 py-3 font-medium transition-all ${isActive ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <i className={`fas ${link.icon} w-5`}></i> {link.label}
                            </Link>
                        );
                    })}

                    <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Management</p>
                    {navLinks.filter(l => l.category === 'Management').map(link => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-6 py-3 font-medium transition-all ${isActive ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <i className={`fas ${link.icon} w-5`}></i> {link.label}
                            </Link>
                        );
                    })}

                    <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-6">Root Admin</p>
                    {navLinks.filter(l => l.category === 'Root Admin').map(link => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-6 py-3 font-medium transition-all ${isActive ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                                <i className={`fas ${link.icon} w-5`}></i> {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 shrink-0">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                            {adminEmail.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-800 truncate">{adminEmail}</p>
                            <p className="text-[10px] text-orange-500 font-bold uppercase">{adminRole}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="w-full flex items-center gap-2 text-red-500 font-bold px-4 hover:bg-red-50 py-2 rounded-lg transition text-sm">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
