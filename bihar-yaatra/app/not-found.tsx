"use client";

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
            
            <main className="flex-1 flex items-center justify-center pt-32 pb-20 px-6 relative">
                {/* Stunning Premium Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="max-w-xl w-full text-center relative z-10 space-y-8 animate-fade-in-down">
                    {/* Massive Floating 404 Graphic */}
                    <div className="relative inline-block">
                        <h1 className="font-display text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-pink-600 drop-shadow-md select-none animate-pulse">
                            404
                        </h1>
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400/20 rounded-full blur-xl animate-bounce"></div>
                    </div>

                    {/* Cultural Heritage Subtitle */}
                    <div className="space-y-3">
                        <span className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-xs font-bold text-orange-600 tracking-wider uppercase">
                            Lost in the Ruins of Nalanda? 🏛️
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
                            Path Not Found
                        </h2>
                        <p className="text-gray-500 text-base md:text-lg max-w-md mx-auto leading-relaxed font-medium">
                            It seems you have strayed off the tourist circuit. The page you are looking for has either returned to history or never existed.
                        </p>
                    </div>

                    {/* Premium Call to Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link href="/" className="w-full sm:w-auto px-8 py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-orange-600 hover:scale-105 hover:shadow-orange-100 transition-all duration-300 flex items-center justify-center gap-2 group">
                            <i className="fas fa-home text-sm"></i>
                            <span>Return to Base</span>
                        </Link>
                        
                        <Link href="/destinations" className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-black hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2">
                            <i className="fas fa-compass text-sm text-orange-500"></i>
                            <span>Explore Destinations</span>
                        </Link>
                    </div>
                </div>
            </main>

                                </div>
    );
}
