"use client";
import React, { useState } from "react";
import Image from "next/image";

// Sample Data matching index.html
const destinationsData = [
    {
        id: 1,
        name: "Bodh Gaya",
        category: "Spiritual",
        tabCategory: "spiritual",
        image: "https://i.pinimg.com/736x/ab/2c/80/ab2c80083514a7dd02e3bed8ccec0464.jpg",
        badgeColor: "text-orange-400",
        desc: "The place of enlightenment. Visit the Mahabodhi Temple and the Bodhi Tree.",
        price: "₹1,500",
        duration: "2 Days"
    },
    {
        id: 2,
        name: "Nalanda Ruins",
        category: "Historical",
        tabCategory: "history",
        image: "https://i.pinimg.com/736x/b5/5b/81/b55b81e65445766877f062297692e427.jpg",
        badgeColor: "text-pink-400",
        desc: "Explore the ancient seat of learning and the archaeological museum.",
        price: "₹1,200",
        duration: "1 Day"
    },
    {
        id: 3,
        name: "Rajgir",
        category: "Nature & History",
        tabCategory: "history", // Can also be nature, we'll handle in filter
        image: "https://i.pinimg.com/736x/e1/a5/df/e1a5dfac0b5d116096114a797a641e8c.jpg",
        badgeColor: "text-green-400",
        desc: "Glass bridge, ropeway, and ancient cyclopean walls.",
        price: "₹2,000",
        duration: "2 Days"
    },
    {
        id: 4,
        name: "Valmiki Reserve",
        category: "Wildlife",
        tabCategory: "nature",
        image: "https://i.pinimg.com/736x/bc/c8/04/bcc8049f278aef46044c749158637637.jpg",
        badgeColor: "text-yellow-400",
        desc: "The only tiger reserve in Bihar. Jungle safari and eco-huts.",
        price: "₹3,500",
        duration: "3 Days"
    }
];

export default function Destinations() {
    const [activeTab, setActiveTab] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState<any>(null);

    // Filter logic handling Rajgir specifically for both history/nature to match HTML logic
    const filtered = destinationsData.filter(d => {
        if (activeTab === "all") return true;
        if (d.name === "Rajgir" && (activeTab === "nature" || activeTab === "history")) return true;
        return d.tabCategory === activeTab;
    });

    const openModal = (tour: any) => {
        setSelectedTour(tour);
        setShowModal(true);
    };

    return (
        <section id="destinations" className="py-24 bg-gray-50 text-gray-900">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl font-display font-bold mb-4">Explore Destinations</h2>
                        <p className="text-gray-600">Handpicked places for every kind of traveler.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setActiveTab('all')} className={`px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm ${activeTab === 'all' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>All</button>
                        <button onClick={() => setActiveTab('spiritual')} className={`px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm ${activeTab === 'spiritual' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Spiritual</button>
                        <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm ${activeTab === 'history' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Historical</button>
                        <button onClick={() => setActiveTab('nature')} className={`px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm ${activeTab === 'nature' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>Nature</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((place) => (
                        <div key={place.id} className="destination-card group rounded-3xl h-96 relative cursor-pointer bg-gray-200 animate-fade-in-up">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 w-full p-6 z-10 bg-linear-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                                <span className={`${place.badgeColor} text-xs font-bold tracking-wider uppercase mb-1 block`}>{place.category}</span>
                                <h3 className="text-2xl font-bold text-white mb-2">{place.name}</h3>
                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{place.desc}</p>
                                    <button 
                                        onClick={() => openModal(place)}
                                        className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-orange-50 transition"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedTour && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setShowModal(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full relative z-10 shadow-2xl flex flex-col md:flex-row animate-scale-up">
                        <div className="w-full md:w-2/5 h-48 md:h-auto relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selectedTour.image} className="w-full h-full object-cover" alt="Tour Image" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent md:hidden"></div>
                            <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl md:hidden">{selectedTour.name}</h3>
                        </div>

                        <div className="w-full md:w-3/5 p-8 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold font-display hidden md:block">{selectedTour.name}</h3>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 transition">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            <div className="space-y-4 flex-1">
                                <p className="text-gray-600">{selectedTour.desc}</p>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <span className="text-xs text-gray-500 uppercase font-bold">Duration</span>
                                        <p className="font-semibold text-gray-900">{selectedTour.duration}</p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl">
                                        <span className="text-xs text-gray-500 uppercase font-bold">Price</span>
                                        <p className="font-semibold text-orange-600">{selectedTour.price}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm font-semibold">Included:</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Guide</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Transport</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">Entry Fees</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="w-full py-3 bg-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                    Book This Tour
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}