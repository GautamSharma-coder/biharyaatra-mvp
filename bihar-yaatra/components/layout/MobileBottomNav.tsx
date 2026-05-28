import React from 'react';
import Link from 'next/link';

export default function MobileBottomNav() {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 bg-white/80 backdrop-blur-xl border-t border-gray-100 px-6 py-3 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.05)]">
            <nav className="flex items-center justify-between max-w-md mx-auto">
                <a href="/" className="flex flex-col items-center gap-1 text-orange-600 transition-all duration-300">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                        <i className="fas fa-home text-lg"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
                </a>

                <a href="/destinations" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-all duration-300">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-map-marked-alt text-lg"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Explore</span>
                </a>

                <a href="/aiplanner" className="flex flex-col items-center gap-1 -translate-y-6">
                    <div className="w-14 h-14 rounded-full bg-gradient text-white flex items-center justify-center shadow-lg shadow-orange-500/30 border-4 border-white animate-pulse-slow">
                        <i className="fas fa-magic text-xl"></i>
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider translate-y-2">Saarthi AI</span>
                </a>

                <a href="/homestays" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-all duration-300">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-bed text-lg"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Stay</span>
                </a>

                <a href="/auth" className="flex flex-col items-center gap-1 text-gray-400 hover:text-orange-500 transition-all duration-300">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center">
                        <i className="fas fa-user text-lg"></i>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
                </a>
            </nav>
        </div>
    );
}
