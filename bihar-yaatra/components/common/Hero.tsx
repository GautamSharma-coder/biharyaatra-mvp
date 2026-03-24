"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShown(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // ~200ms delay between elements
            },
        },
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 32 }, // translate-y-8
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center bg-gray-50 text-gray-900">
            {/* Background Animations */}
            <div className="absolute -right-64 -top-64 w-160 h-160 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
            <div className="absolute -left-20 top-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" style={{ animation: 'float 7s ease-in-out infinite reverse' }}></div>

            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column (Text Content) */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate={shown ? "visible" : "hidden"}
                        className="space-y-8 z-10"
                    >
                        {/* Spinning Badge */}
                        <motion.div variants={itemVariants} className="relative inline-block p-px overflow-hidden rounded-full mb-2">
                            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ffedd5_0%,#f97316_50%,#ffedd5_100%)]"></div>
                            <div className="relative px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold tracking-wide">
                                #1 Trusted Tourism Platform in Bihar
                            </div>
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="font-display text-5xl lg:text-7xl font-bold leading-[1.1]">
                            Discover the <br />
                            <span className="text-gradient">Soul of India</span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-lg text-gray-600 max-w-xl leading-relaxed">
                            From the enlightenment of Bodh Gaya to the ruins of Nalanda. Experience a journey through history,
                            spirituality, and untouched nature.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <Link href="/destinations" className="px-8 py-4 bg-black text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                Explore Destinations
                            </Link>
                            <button 
                                onClick={() => {
                                    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-white text-black font-medium rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
                            >
                                <i className="fas fa-play-circle text-orange-500 text-xl"></i> Watch Video
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-8 flex items-center gap-6">
                            <div>
                                <p className="text-3xl font-bold font-display">50+</p>
                                <p className="text-sm text-gray-500">Heritage Sites</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div>
                                <p className="text-3xl font-bold font-display">10k+</p>
                                <p className="text-sm text-gray-500">Happy Travelers</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div>
                                <p className="text-3xl font-bold font-display">4.9</p>
                                <p className="text-sm text-gray-500">Rating</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column (Image Component) */}
                    <div className="relative">
                        <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-all duration-700">
                            <div className={`image-reveal bg-gray-200 aspect-4/5 ${shown ? 'revealed' : ''}`}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                    src="https://i.pinimg.com/1200x/7c/59/2b/7c592b623e07cb7645b1822c39a28cd3.jpg" 
                                    alt="Mahabodhi Temple"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className={`absolute bottom-32 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/50 transform transition-all duration-700 delay-700 ${shown ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                        <i className="fas fa-map-marker-alt text-xl"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Mahabodhi Temple</h4>
                                        <p className="text-sm text-gray-600">UNESCO World Heritage Site</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Open</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Gradients for the Image */}
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient opacity-20 rounded-full filter blur-3xl"></div>
                        <div className="absolute -left-10 -top-10 w-40 h-40 border-[1.5rem] border-pink-50 rounded-full -z-10"></div>
                    </div>

                </div>
            </div>
        </section>
    );
}