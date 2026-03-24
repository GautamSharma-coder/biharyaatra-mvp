"use client";
import React from 'react';

export default function Testimonials() {
    return (
        <section className="py-24 bg-white relative overflow-hidden text-gray-900">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 -right-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2 block">Community Love</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Stories from the Road</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Real experiences from travelers who discovered the hidden gems of Bihar with us.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="group bg-gray-50 rounded-4xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" className="w-14 h-14 rounded-full object-cover border-2 border-orange-200" alt="Traveler" />
                                <div>
                                    <h4 className="font-bold font-display text-lg">Aisha Kapoor</h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Mumbai, India</p>
                                </div>
                                <div className="ml-auto text-orange-400 text-2xl opacity-20">
                                    <i className="fas fa-quote-right"></i>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 text-sm mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                &quot;I always thought Bihar was just for history buffs, but the <span className="text-orange-600 font-medium">Rajgir Glass Bridge</span> and the safari at Valmiki Nagar blew my mind. The arrangements were top-notch!&quot;
                            </p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="group bg-gray-50 rounded-4xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" className="w-14 h-14 rounded-full object-cover border-2 border-orange-200" alt="Traveler" />
                                <div>
                                    <h4 className="font-bold font-display text-lg">Kenji Tanaka</h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Kyoto, Japan</p>
                                </div>
                                <div className="ml-auto text-orange-400 text-2xl opacity-20">
                                    <i className="fas fa-quote-right"></i>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 text-sm mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                &quot;Finding a reliable guide for the <span className="text-orange-600 font-medium">Buddhist Circuit</span> was my main concern. Bihar Yaatra connected me with a guide who spoke fluent Japanese. Arigato!&quot;
                            </p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="group bg-gray-50 rounded-4xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop" className="w-14 h-14 rounded-full object-cover border-2 border-orange-200" alt="Traveler" />
                                <div>
                                    <h4 className="font-bold font-display text-lg">Priya Singh</h4>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Patna, Bihar</p>
                                </div>
                                <div className="ml-auto text-orange-400 text-2xl opacity-20">
                                    <i className="fas fa-quote-right"></i>
                                </div>
                            </div>
                            <div className="flex text-yellow-400 text-sm mb-4">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                &quot;Living in Patna, I never visited <span className="text-orange-600 font-medium">Nalanda Ruins</span> properly. The &apos;Weekend Heritage Walk&apos; package gave me a completely new perspective on my own culture.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
