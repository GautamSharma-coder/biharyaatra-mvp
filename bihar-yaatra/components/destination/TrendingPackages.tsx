"use client";
import React from "react";
import Image from "next/image";

export default function TrendingPackages() {
    return (
        <section className="py-24 bg-white overflow-hidden text-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-display font-bold mb-12">Trending Packages</h2>

                <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-hidden">
                    {/* Package 1 */}
                    <div className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="h-48 overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://i.pinimg.com/1200x/a7/a7/b6/a7a7b6f07530bd5efaac43688b8bf5be.jpg" alt="Buddhist Circuit" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                                5 Days
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-1 text-yellow-400 text-xs mb-2">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="text-gray-400 ml-1">(120 Reviews)</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">The Buddhist Circuit</h3>
                            <p className="text-gray-500 text-sm mb-4">Patna - Vaishali - Kesaria - Kushinagar</p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">₹12,999</span>
                                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Package 2 */}
                    <div className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="h-48 overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://i.pinimg.com/1200x/7b/cd/bb/7bcdbb3d0eb704974bbb291ffc3664e4.jpg" alt="Kakolat Falls" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm">
                                3 Days
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-1 text-yellow-400 text-xs mb-2">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
                                <span className="text-gray-400 ml-1">(85 Reviews)</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Kakolat Falls & Nature</h3>
                            <p className="text-gray-500 text-sm mb-4">Nawada - Kakolat - Rajgir Hills</p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">₹6,499</span>
                                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Package 3 */}
                    <div className="min-w-[300px] md:min-w-[350px] snap-center bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="h-48 overflow-hidden relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://i.pinimg.com/1200x/31/ad/ae/31adae19090db0f84f1e1678068e99d2.jpg" alt="Patna Sahib" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                1 Day
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-1 text-yellow-400 text-xs mb-2">
                                <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                                <span className="text-gray-400 ml-1">(200+ Reviews)</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Patna City Heritage</h3>
                            <p className="text-gray-500 text-sm mb-4">Golghar - Museum - Patna Sahib Gurudwara</p>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <span className="text-2xl font-bold text-gray-900">₹1,999</span>
                                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-orange-600 transition-colors">
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            
            {/* CTA section after Trending Packages */}
            <div className="py-24 relative overflow-hidden mt-12 bg-white">
                <div className="absolute inset-0 bg-gradient opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0 opacity-20"></div>

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Plan Your Journey Today</h2>
                                <p className="text-gray-600 mb-8 text-lg">
                                    Don't just visit Bihar, experience it. From booking hotels to finding the best local street food spots, we handle it all.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="/packages" className="inline-flex justify-center items-center px-8 py-4 bg-black text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                        Start Booking
                                    </a>
                                    <a href="#" className="inline-flex justify-center items-center px-8 py-4 bg-white text-black border border-gray-200 font-medium rounded-full shadow-md hover:bg-gray-50 transition-all duration-300">
                                        Talk to Expert
                                    </a>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-4 -bottom-4 w-full h-full bg-gradient rounded-3xl -z-10 rotate-3"></div>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop"
                                    alt="Traveler in India" className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
