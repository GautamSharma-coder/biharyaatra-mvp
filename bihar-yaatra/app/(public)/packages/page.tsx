"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function PackagesPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    
    // Mock user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Traveler');
    const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Traveler&background=f97316&color=fff');

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    
    const [showModal, setShowModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    const seedData = [
        {
            id: '1', 
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
            id: '2', 
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

    const [packages, setPackages] = useState(seedData);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        
        setTimeout(() => {
            setLoading(false);
        }, 800);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredPackages = packages.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const openModal = (pkg: any) => {
        setSelectedPackage(pkg);
        setShowModal(true);
    };

    const bookPackage = (pkg: any) => {
        if (!isLoggedIn) {
            alert("Please login to book a package.");
            return;
        }
        alert(`Proceeding to checkout for ${pkg.title}`);
    };

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            {/* Header */}
            <header className={`fixed w-full top-0 z-[999] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="font-display font-bold text-2xl tracking-tighter flex items-center gap-2">
                            Bihar<span className="text-gradient hover:text-orange-500">Yaatra</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/destinations" className="nav-item font-medium">Destinations</Link>
                            
                            <div className="relative" onMouseLeave={() => setServicesOpen(false)}>
                                <button onMouseEnter={() => setServicesOpen(true)} className="nav-item font-medium flex items-center gap-1.5 transition-colors duration-200">
                                    Services <i className={`fas fa-chevron-down text-xs ml-1 transition-transform ${servicesOpen ? 'rotate-180' : ''}`}></i>
                                </button>
                                {servicesOpen && (
                                    <div className="absolute left-1/2 -translate-x-1/2 pt-4 w-56 transform origin-top animate-fade-in-down z-50">
                                        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2">
                                        <Link href="/packages" className="block px-4 py-2 text-orange-600 bg-orange-50 rounded-lg transition-colors"><i className="fas fa-calendar-alt w-4 mr-2 text-blue-500"></i> Tour Packages</Link>
                                        <Link href="/aiplanner" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-compass w-4 mr-2 text-purple-500"></i> AI Trip Planner</Link>
                                        <Link href="/homestays" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-heart w-4 mr-2 text-orange-500"></i> Homestays</Link>
                                        <Link href="/transport" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-bus-alt w-4 mr-2 text-green-500"></i> Transport</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link href="/guide-support" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-user-tie w-4 mr-2 text-teal-500"></i> Expert Guides</Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link href="/about" className="nav-item font-medium">About</Link>
                            <Link href="/contact" className="nav-item font-medium">Contact</Link>

                            {!isLoggedIn ? (
                                <Link href="/auth" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-medium transition-all shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-0.5">
                                    Login
                                </Link>
                            ) : (
                                <div className="relative" onMouseLeave={() => setUserMenu(false)}>
                                    <button onMouseEnter={() => setUserMenu(true)} className="flex items-center gap-2 focus:outline-none">
                                        <img src={userAvatar} className="w-10 h-10 rounded-full border-2 border-orange-100 object-cover" alt="User Pic" />
                                        <i className={`fas fa-chevron-down text-xs text-gray-400 transition-transform ${userMenu ? 'rotate-180' : ''}`}></i>
                                    </button>
                                    {userMenu && (
                                        <div className="absolute right-0 mt-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden">
                                            <a href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">Dashboard</a>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button onClick={() => setIsLoggedIn(false)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>

                        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden focus:outline-none text-gray-800">
                            <i className="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {mobileMenu && (
                <div className="fixed inset-0 z-[1000] flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenu(false)}></div>
                    <div className="relative w-full max-w-xs bg-white shadow-2xl h-full flex flex-col animate-slide-in-right">
                        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
                            <span className="font-display font-bold text-xl">Menu</span>
                            <button onClick={() => setMobileMenu(false)} className="text-gray-500 hover:text-red-500 transition">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
                            <Link href="/packages" className="flex items-center gap-4 text-lg font-medium text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600"><i className="fas fa-suitcase-rolling"></i></div>
                                Packages
                            </Link>
                            <Link href="/homestays" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600"><i className="fas fa-home"></i></div>
                                Homestays
                            </Link>
                            <Link href="/transport" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><i className="fas fa-car"></i></div>
                                Transports
                            </Link>
                            <Link href="/guide-support" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><i className="fas fa-user-tie"></i></div>
                                Guides
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1">
                <section className="relative pt-32 pb-16 bg-white overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/3 h-full bg-orange-50/50 pointer-events-none skew-x-12 origin-top-right"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-40"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Curated Journeys</span>
                        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
                            Packages Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Memories</span>
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
                                    <div 
                                        key={pkg.id} 
                                        className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col h-full cursor-pointer animate-fade-in-up"
                                        onClick={() => openModal(pkg)}
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

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
                                                <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-orange-600 transition shadow-lg">
                                                    <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200">
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

            {/* Modal */}
            {showModal && selectedPackage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
                    <div onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

                    <div className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-slide-in-up">
                        <div className="relative h-64 lg:h-72 shrink-0">
                            <img src={selectedPackage.image} className="w-full h-full object-cover" alt={selectedPackage.title} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white rounded-full text-white hover:text-black flex items-center justify-center transition-all duration-300 z-20">
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                                <div className="flex gap-3 mb-3">
                                    <span className="px-2.5 py-1 bg-orange-500 rounded-lg text-xs font-bold shadow-lg">
                                        {selectedPackage.category}
                                    </span>
                                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold border border-white/20">
                                        {selectedPackage.duration}
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight">
                                    {selectedPackage.title}
                               </h2>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Full Route</p>
                                    <p className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                                        <i className="fas fa-map-signs text-orange-500"></i>
                                        <span>{selectedPackage.route}</span>
                                    </p>
                                </div>
                                <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Package Price</p>
                                    <p className="text-2xl font-display font-bold text-gray-900">{selectedPackage.price}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2">
                                    <h3 className="text-xl font-bold mb-6 font-display flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs"><i className="fas fa-list-ul"></i></span>
                                        Day-wise Itinerary
                                    </h3>
                                    <div className="pl-2 relative border-l-2 border-gray-200 space-y-6">
                                        {selectedPackage.itinerary?.map((day: any, idx: number) => (
                                            <div key={idx} className="relative pl-6">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-orange-500 border-2 border-white"></div>
                                                <h4 className="font-bold text-gray-900 mb-2">{day.day}: {day.title}</h4>
                                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">{day.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-orange-50 p-6 rounded-[1.5rem] border border-orange-100">
                                        <h4 className="font-bold text-sm mb-4 text-orange-900 uppercase tracking-wider">What's Included</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-white text-green-500 flex items-center justify-center shadow-sm"><i className="fas fa-check text-xs"></i></div>
                                                Premium Hotel Stay
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-white text-green-500 flex items-center justify-center shadow-sm"><i className="fas fa-check text-xs"></i></div>
                                                AC Private Transport
                                            </li>
                                            <li className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-white text-green-500 flex items-center justify-center shadow-sm"><i className="fas fa-check text-xs"></i></div>
                                                Breakfast & Dinner
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] relative z-20">
                            <div className="hidden md:block">
                                <p className="text-xs text-gray-400">Total Amount</p>
                                <p className="text-xl font-bold text-gray-900">{selectedPackage.price}</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button onClick={() => setShowModal(false)} className="flex-1 md:flex-none px-6 py-4 text-gray-500 font-bold transition bg-gray-50 rounded-xl hover:bg-gray-100">Close</button>
                                <button onClick={() => bookPackage(selectedPackage)} className="flex-1 md:flex-none px-8 py-4 bg-black text-white font-bold rounded-xl shadow-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                    Book Now <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <MobileBottomNav />
        </div>
    );
}
