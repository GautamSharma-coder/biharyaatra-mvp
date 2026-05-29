"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useAuth } from '@/components/providers/AuthProvider';

export default function PackagesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const seedData = [
        {
            id: '00000000-0000-0000-0000-000000000001', 
            title: 'The Buddhist Circuit', 
            category: 'Spiritual', 
            duration: '5 Days / 4 Nights', 
            price: '₹12,999',
            image: 'https://images.unsplash.com/photo-1591264247204-74d15024b420?q=80&w=800', 
            route: 'Patna → Bodh Gaya', 
            rating: 4.9,
            description: 'Walk in the footsteps of Lord Buddha. Covers Mahabodhi Temple, Nalanda, and Rajgir.',
            itinerary: [
                { day: 'Day 1', title: 'Patna', desc: 'Arrival at Patna, check-in. Evening free for local sightseeing.' }, 
                { day: 'Day 2', title: 'Bodh Gaya', desc: 'Travel to Bodh Gaya. Visit Mahabodhi Temple and local monasteries.' }
            ]
        },
        {
            id: '00000000-0000-0000-0000-000000000002', 
            title: 'Wild Champaran', 
            category: 'Wildlife', 
            duration: '3 Days / 2 Nights', 
            price: '₹6,499',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Valmiki_Nagar_Tiger_Reserve.jpg/800px-Valmiki_Nagar_Tiger_Reserve.jpg', 
            route: 'Valmiki Nagar', 
            rating: 4.7,
            description: 'Jungle safari in Valmiki Tiger Reserve.',
            itinerary: [
                { day: 'Day 1', title: 'Arrival', desc: 'Jungle Stay & Safari brief.' },
                { day: 'Day 2', title: 'Safari', desc: 'Morning and evening jungle safaris in Valmiki Reserve.' }
            ]
        }
    ];

    const [packages] = useState(seedData);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const filteredPackages = packages.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative pt-32 pb-16 bg-white overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-orange-50/50 pointer-events-none skew-x-12 origin-top-right"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-40"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Curated Journeys</span>
                        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                            Packages Designed for <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Memories</span>
                        </h1>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 font-medium">
                            Choose from our expertly crafted itineraries that blend culture, nature, and spirituality seamlessly.
                        </p>

                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-2 flex flex-col md:flex-row items-center border border-gray-100 gap-2">
                            <div className="flex-1 flex items-center w-full pl-4 h-12">
                                <i className="fas fa-search text-gray-400 text-lg"></i>
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by destination or theme..." 
                                    className="w-full h-full px-4 bg-transparent border-none outline-none text-lg placeholder-gray-400 font-medium" 
                                />
                            </div>
                            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 px-2 md:px-0">
                                {['All', 'Spiritual', 'Wildlife', 'Heritage', 'Nature'].map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)} 
                                        className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Packages Grid */}
                <section className="py-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-6">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <i className="fas fa-circle-notch fa-spin text-4xl mb-4 text-orange-500"></i>
                                <p className="font-bold">Curating packages...</p>
                            </div>
                        ) : filteredPackages.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPackages.map(pkg => (
                                    <Link 
                                        key={pkg.id} 
                                        href={`/view-package-detail?id=${pkg.id}`}
                                        className="group bg-white rounded-4xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer animate-fade-in-up"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>

                                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-2">
                                                <i className="fas fa-clock text-orange-500"></i>
                                                <span>{pkg.duration}</span>
                                            </div>

                                            <div className="absolute bottom-4 left-4 text-white">
                                                <span className="px-2.5 py-1 bg-orange-500 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 inline-block shadow-lg">
                                                    {pkg.category}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-bold font-display group-hover:text-orange-600 transition-colors leading-tight">
                                                    {pkg.title}
                                                </h3>
                                                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg gap-1 border border-yellow-100">
                                                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                                                    <span className="font-bold text-gray-800 text-xs">{pkg.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                <i className="fas fa-map-signs text-orange-400"></i>
                                                <span className="truncate">{pkg.route}</span>
                                            </div>

                                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
                                                {pkg.description}
                                            </p>

                                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Starting From</p>
                                                    <p className="text-xl font-bold text-gray-900">{pkg.price}</p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-orange-600 transition shadow-lg">
                                                    <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-4xl border border-dashed border-gray-200">
                                <div className="inline-block p-6 rounded-full bg-gray-50 mb-4">
                                    <i className="fas fa-suitcase-rolling text-4xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No packages found</h3>
                                <p className="text-gray-500 mt-2">Try searching for a different destination or category.</p>
                                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="mt-6 text-orange-600 font-bold hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
            <MobileBottomNav />
        </div>
    );
}
