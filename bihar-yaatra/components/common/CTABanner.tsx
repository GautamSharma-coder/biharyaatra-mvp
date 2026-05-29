"use client";
import React from "react";
import Link from "next/link";

export default function CTABanner() {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient z-0 opacity-90"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay z-0 opacity-20"></div>

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="bg-white rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Plan Your Journey Today</h2>
                            <p className="text-gray-600 mb-8 text-lg">
                                Don&apos;t just visit Bihar, experience it. From booking hotels to finding the best local street food spots, we handle it all.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/packages" className="inline-flex justify-center items-center px-8 py-4 bg-black text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                    Start Booking
                                </Link>
                                <Link href="/contact" className="inline-flex justify-center items-center px-8 py-4 bg-white text-black border border-gray-200 font-medium rounded-full shadow-md hover:bg-gray-50 transition-all duration-300">
                                    Talk to Expert
                                </Link>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-4 -bottom-4 w-full h-full bg-gradient rounded-3xl -z-10 rotate-3"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://i.pinimg.com/1200x/9f/dd/c1/9fddc15bac879b338d92b1fa1a74a18e.jpg"
                                alt="Traveler in India"
                                className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
