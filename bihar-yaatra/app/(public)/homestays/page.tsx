"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Navbar from '@/components/layout/Navbar';

export default function HomestayPage() {
    const router = useRouter();

    const [searchLocation, setSearchLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [loading, setLoading] = useState(true);

    const seedData = [
        {
            id: '1',
            name: 'Ganga Kinare Haveli',
            location: 'Patna',
            price: 1500,
            rating: 4.8,
            reviews: 120,
            image: '/images/homestay-patna.jpg', // Using generic unsplash in real app, but let's use what was in HTML
            imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800',
            amenities: ['wifi', 'utensils', 'snowflake'],
            badge: 'Superhost'
        },
        {
            id: '2',
            name: 'Bodhi Tree Retreat',
            location: 'Bodh Gaya',
            price: 2200,
            rating: 4.9,
            reviews: 245,
            imageUrl: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800',
            amenities: ['wifi', 'spa', 'leaf'],
            badge: 'Popular'
        },
        {
            id: '3',
            name: 'Village Mud House',
            location: 'Madhubani',
            price: 900,
            rating: 4.6,
            reviews: 85,
            imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800',
            amenities: ['paint-brush', 'fire', 'leaf'],
            badge: 'Cultural'
        },
        {
            id: '4',
            name: 'Valmiki Jungle Cottage',
            location: 'West Champaran',
            price: 2500,
            rating: 4.9,
            reviews: 98,
            imageUrl: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=800',
            amenities: ['tree', 'binoculars', 'fire'],
            badge: 'Adventure'
        }
    ];

    const [homestays, setHomestays] = useState(seedData);

    useEffect(() => {
        
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const filteredHomestays = homestays.filter(item =>
        searchLocation === '' || 
        (item.location || '').toLowerCase().includes(searchLocation.toLowerCase()) ||
        (item.name || '').toLowerCase().includes(searchLocation.toLowerCase())
    );

    const getAmenityIcon = (amenity: string) => {
        const map: Record<string, string> = {
            'wifi': 'fas fa-wifi',
            'utensils': 'fas fa-utensils',
            'snowflake': 'far fa-snowflake',
            'spa': 'fas fa-spa',
            'leaf': 'fas fa-leaf',
            'paint-brush': 'fas fa-paint-brush',
            'fire': 'fas fa-fire',
            'mountain': 'fas fa-mountain',
            'car': 'fas fa-car',
            'tree': 'fas fa-tree',
            'binoculars': 'fas fa-binoculars',
            'landmark': 'fas fa-landmark'
        };
        return map[amenity] || 'fas fa-check';
    };

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <section className="relative pt-32 md:pt-40 pb-20 bg-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50 skew-x-12 opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-40 pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-12">
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Authentic Living</span>
                            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                                Feel at Home, <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Away from Home</span>
                            </h1>
                            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
                                Experience authentic Bihari hospitality. Stay with local families, enjoy home-cooked Maithili or Magahi cuisines, and live the culture.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto bg-white rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 transition relative focus-within:border-orange-500 focus-within:bg-white">
                                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Location</label>
                                    <div className="flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-orange-500"></i>
                                        <input 
                                            type="text" 
                                            value={searchLocation} 
                                            onChange={(e) => setSearchLocation(e.target.value)} 
                                            placeholder="Where do you want to go?"
                                            className="w-full bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-400" 
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 transition focus-within:border-orange-500 focus-within:bg-white">
                                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Check In</label>
                                    <input 
                                        type="date" 
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-gray-900 font-bold" 
                                    />
                                </div>

                                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-orange-200 transition focus-within:border-orange-500 focus-within:bg-white">
                                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Check Out</label>
                                    <input 
                                        type="date" 
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-gray-900 font-bold" 
                                    />
                                </div>

                                <div>
                                    <button className="w-full h-full py-4 bg-black text-white font-bold rounded-2xl hover:bg-orange-600 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer transform active:scale-95">
                                        <i className="fas fa-search"></i> Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl shrink-0">
                                    <i className="fas fa-utensils"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Home Cooked Food</h3>
                                    <p className="text-sm text-gray-500">Authentic local cuisines</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl shrink-0">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Cultural Exchange</h3>
                                    <p className="text-sm text-gray-500">Live with local families</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl shrink-0">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Safe & Verified</h3>
                                    <p className="text-sm text-gray-500">100% verified hosts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-white min-h-screen">
                    <div className="max-w-7xl mx-auto px-6">
                        <h2 className="text-3xl font-display font-bold mb-10 text-gray-900">Popular Stays</h2>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500 mb-4"></i>
                                <p className="font-bold">Finding perfect homes...</p>
                            </div>
                        ) : filteredHomestays.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredHomestays.map(stay => (
                                    <div 
                                        key={stay.id} 
                                        className="group bg-white rounded-4xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer animate-fade-in-up"
                                        onClick={() => router.push(`/view-homestay-detail?id=${stay.id}`)}
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img src={stay.imageUrl} alt={stay.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                                                <span>{stay.badge || 'Verified'}</span>
                                            </div>

                                            <button className="absolute top-4 right-4 w-8 h-8 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition cursor-pointer group/btn" onClick={(e) => { e.stopPropagation(); }}>
                                                <i className="far fa-heart group-hover/btn:fas"></i>
                                            </button>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold font-display text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                                                        {stay.name}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-500 mt-1 font-medium">
                                                        <i className="fas fa-map-marker-alt text-orange-400 mr-2"></i>
                                                        <span>{stay.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                    <i className="fas fa-star text-yellow-400 text-sm"></i>
                                                    <span className="font-bold text-sm text-gray-800">{stay.rating}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 my-4">
                                                {stay.amenities.slice(0, 3).map((amenity, idx) => (
                                                    <div key={idx} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-xs border border-gray-200" title={amenity}>
                                                        <i className={getAmenityIcon(amenity)}></i>
                                                    </div>
                                                ))}
                                                {stay.amenities.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-xs border border-gray-200 font-bold">
                                                        +{stay.amenities.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                                <div>
                                                    <span className="text-xl font-bold text-gray-900">₹{stay.price}</span>
                                                    <span className="text-xs text-gray-500 font-bold"> / night</span>
                                                </div>
                                                <button className="px-5 py-2.5 bg-black text-white font-bold rounded-xl shadow-md group-hover:bg-orange-600 transition-all text-sm flex items-center gap-2">
                                                    View <i className="fas fa-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-4xl border border-dashed border-gray-200">
                                <div className="inline-block p-6 rounded-full bg-white mb-4 shadow-sm">
                                    <i className="fas fa-home text-4xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No stays found</h3>
                                <p className="text-gray-500 mt-2">Try changing the location to Patna, Bodh Gaya, or Rajgir.</p>
                                <button onClick={() => setSearchLocation('')} className="mt-6 text-orange-600 font-bold text-sm hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer space could be included here or a separate component */}

            <MobileBottomNav />
        </div>
    );
}
