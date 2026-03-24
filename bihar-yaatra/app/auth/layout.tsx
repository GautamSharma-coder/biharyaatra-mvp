import React from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
            {/* Minimal Header */}
            <header className="absolute top-0 w-full p-6 z-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
                <Link href="/" className="font-display font-black text-2xl tracking-tighter hover:scale-105 transition-transform">
                    Bihar<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Yaatra</span>
                </Link>
                <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-2">
                    <i className="fas fa-arrow-left"></i> Back to Home
                </Link>
            </header>

            {/* Main Auth Content */}
            <main className="flex-1 flex w-full">
                {children}
            </main>
        </div>
    );
}
