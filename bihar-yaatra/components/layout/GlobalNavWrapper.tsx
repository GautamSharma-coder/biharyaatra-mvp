"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';
import Footer from './Footer';

export default function GlobalNavWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Do not show global nav components on dashboard pages
    const isExcluded = pathname.startsWith('/dashboard');

    if (isExcluded) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            {children}
            <MobileBottomNav />
            <Footer />
        </>
    );
}
