"use client";
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function AboutPage() {
    return (
        <main className="text-gray-900 bg-white font-sans min-h-screen">
            <Navbar />

            <section className="relative pt-40 pb-20 overflow-hidden bg-white">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-50 skew-x-12 opacity-50 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Our Story</span>
                            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Redefining Tourism in the <span className="text-gradient">Land of Buddha</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                                Bihar is not just a state; it's an emotion, a history lesson, and a spiritual journey wrapped
                                into one. Bihar Yaatra was born from a simple desire: to show the world the true, untold glory
                                of our homeland.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-3xl font-bold text-orange-500">5+</h3>
                                    <p className="text-sm text-gray-500 font-bold uppercase">Years of Trust</p>
                                </div>
                                <div className="text-center px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="text-3xl font-bold text-green-600">10k+</h3>
                                    <p className="text-sm text-gray-500 font-bold uppercase">Happy Yatris</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1628063597843-085732c57569?q=80&w=1200"
                                    alt="Nalanda Ruins"
                                    className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-display font-bold mb-6">Our Mission & Vision</h2>
                        <p className="text-gray-600 text-lg">We are on a mission to put Bihar on the global tourism map, ensuring safe,
                            comfortable, and enlightening journeys for travelers from every corner of the world.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-heart"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Authenticity</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">We promise real experiences. From local cuisine to
                                village walks, we show you the Bihar that guidebooks often miss.</p>
                        </div>
                        <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Safety First</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Your safety is our priority. Our network of
                                verified guides, drivers, and hotels ensures a worry-free journey.</p>
                        </div>
                        <div className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl mb-6 group-hover:scale-110 transition-transform">
                                <i className="fas fa-hand-holding-heart"></i>
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Sustainable Tourism</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">We believe in giving back. A part of our revenue
                                goes towards the preservation of heritage sites and local communities.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-gray-900 text-white rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        <i className="fas fa-quote-left text-4xl text-orange-500 mb-6 block"></i>
                        <h3 className="text-2xl md:text-4xl font-display font-bold leading-relaxed mb-10">
                            &quot;Bihar is the land where the concept of non-violence was born, where democracy found its first
                            roots. We invite you to walk on this sacred soil and feel the vibrations of history.&quot;
                        </h3>

                        <div className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl text-orange-400">V</div>
                            <div className="text-left">
                                <div className="font-bold text-lg">Vishal Kumar</div>
                                <div className="text-sm text-gray-400">Founder, Bihar Yaatra</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">

                    <div className="text-center mb-16">
                        <p className="text-orange-500 font-bold tracking-[0.2em] text-xs uppercase mb-4">The Minds Behind It</p>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 uppercase tracking-tighter">
                            Meet The <span className="text-gradient">Core Team</span>
                        </h2>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-gray-800 mb-8 border-l-4 border-orange-500 pl-4">
                        💻 Development & Tech
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {/* Member 1 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/images/team/vishal.jpg" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Vishal+Kumar&size=500'; }} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Vishal" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Vishal</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Founder • Tech Lead</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Vishal</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Architectural mind behind Bihar Yaatra. Oversees full-stack development with a focus on scalability and secure payments. Driven by a passion to showcase Bihar&apos;s glory.</p>
                            </div>
                        </div>

                        {/* Member 2 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Aditya" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Aditya</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Founder • Full Stack</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Aditya</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Project Lead & Full Stack virtuoso. Ensures seamless DB integration and performance optimization. Keep the platform fast, reliable, and bug-free.</p>
                            </div>
                        </div>

                        {/* Member 3 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gautam" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Gautam</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Frontend Lead</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Gautam</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Responsible for the visual magic. Turns complex designs into responsive interfaces using Tailwind CSS. Ensures a smooth user journey.</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-2xl font-display font-bold text-gray-800 mb-8 border-l-4 border-orange-500 pl-4">
                        🚀 Growth & Strategy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {/* Member 4 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Sonam" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Sonam</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Content & Growth</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Sonam</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Spearheads content strategy and SEO. Curates authentic travel guides and stories to reach a global audience. Passionate about cultural accuracy.</p>
                            </div>
                        </div>

                        {/* Member 5 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Nikhil" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Nikhil</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Marketing</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Nikhil</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Manages digital campaigns and partnerships. Analyzes market trends to position Bihar Yaatra as the premier choice for travelers.</p>
                            </div>
                        </div>

                        {/* Member 6 */}
                        <div className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Pawan" />
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-20">
                                <h3 className="text-white text-3xl font-bold font-display mb-1">Pawan</h3>
                                <p className="text-orange-400 font-bold text-sm uppercase tracking-wider">Strategy</p>
                            </div>
                            <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-white bg-black/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-30 text-center">
                                <h3 className="text-3xl font-bold font-display mb-4 text-orange-400">Pawan</h3>
                                <p className="text-sm leading-relaxed text-gray-300">Focuses on long-term business development. Forges partnerships with local guides and homestays to ensure sustainable operations.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className="py-20 bg-gray-50 text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-display font-bold mb-6">Ready to Experience the Magic?</h2>
                    <p className="text-gray-600 mb-8 text-lg">Join thousands of travelers who have discovered the soul of India with us.</p>
                    <a href="/contact"
                        className="inline-block px-10 py-4 bg-orange-600 text-white font-bold rounded-full shadow-xl hover:bg-orange-700 hover:scale-105 transition-all transform">
                        Contact Us Today
                    </a>
                </div>
            </section>

            <MobileBottomNav />
            <Footer />
        </main>
    );
}
