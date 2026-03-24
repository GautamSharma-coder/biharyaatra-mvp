"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function ComingSoonPage() {
    const [timeLeft, setTimeLeft] = useState({
        days: 15,
        hours: 10,
        minutes: 30,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [email, setEmail] = useState('');

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thanks! We'll notify ${email} when we launch!`);
        setEmail('');
    };

    return (
        <div className="bg-gray-50 text-gray-900 h-screen flex flex-col font-sans relative overflow-hidden">
            <header className="absolute w-full top-0 z-50 py-6">
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
                        Bihar<span className="text-gradient hover:text-orange-500">Yaatra</span>
                    </Link>
                    <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition flex items-center gap-2">
                        <i className="fas fa-arrow-left"></i> <span className="hidden sm:inline">Back to Home</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6 relative">
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10 bg-white">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60 animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                </div>

                <div className="max-w-4xl w-full text-center relative z-10 pt-20">
                    <div className="inline-block px-4 py-1.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                        Something Big is Coming
                    </div>
                    
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter text-gray-900">
                        Get Ready For The<br/>
                        <span className="text-gradient block mt-2 pb-2">Ultimate Yaatra</span>
                    </h1>
                    
                    <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                        We are crafting an experience that will change how you explore the spiritual and historical heart of India. Hang tight!
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-28 md:h-28 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center mb-3">
                                <span className="text-4xl md:text-5xl font-display font-bold text-gray-900">{timeLeft.days}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Days</span>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center mb-10">
                            <span className="text-4xl text-gray-200 font-bold">:</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-28 md:h-28 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center mb-3">
                                <span className="text-4xl md:text-5xl font-display font-bold text-gray-900">{timeLeft.hours}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hours</span>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center mb-10">
                            <span className="text-4xl text-gray-200 font-bold">:</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-28 md:h-28 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center mb-3">
                                <span className="text-4xl md:text-5xl font-display font-bold text-gray-900">{timeLeft.minutes}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Minutes</span>
                        </div>
                        <div className="hidden md:flex flex-col items-center justify-center mb-10">
                            <span className="text-4xl text-gray-200 font-bold">:</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 md:w-28 md:h-28 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center mb-3 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-orange-500 translate-y-full transition-transform"></div>
                                <span className="text-4xl md:text-5xl font-display font-bold text-orange-500 relative z-10">{timeLeft.seconds}</span>
                            </div>
                            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Seconds</span>
                        </div>
                    </div>

                    <div className="max-w-md mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <form onSubmit={handleNotify} className="relative flex items-center bg-white p-2 rounded-full shadow-2xl border border-gray-100">
                            <div className="pl-4 text-gray-400"><i className="fas fa-envelope"></i></div>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full py-4 px-4 bg-transparent outline-none text-gray-700 font-medium placeholder-gray-400" placeholder="Enter your email address" />
                            <button type="submit" className="shrink-0 bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors shadow-md flex items-center gap-2">
                                Notify Me <i className="fas fa-arrow-right text-sm"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="absolute bottom-10 w-full text-center hidden md:block z-10">
                    <div className="flex justify-center gap-6">
                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-orange-500 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100">
                            <i className="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100">
                            <i className="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-800 hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-100">
                            <i className="fab fa-facebook-f text-xl"></i>
                        </a>
                    </div>
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
}
