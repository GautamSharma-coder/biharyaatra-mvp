"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export default function GuideSupportPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    
    // Mock user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Traveler');
    const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Traveler&background=f97316&color=fff');

    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All');
    const [selectedLang, setSelectedLang] = useState('All');
    const [loading, setLoading] = useState(true);

    const guidesData = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            location: 'Bodh Gaya',
            languages: ['English', 'Hindi', 'Japanese'],
            specialization: 'Buddhist Circuit',
            rating: 4.9,
            reviews: 128,
            price: 800,
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
            verified: true,
            status: 'online'
        },
        {
            id: 2,
            name: 'Anjali Singh',
            location: 'Patna',
            languages: ['English', 'Hindi', 'Maithili'],
            specialization: 'History & Heritage',
            rating: 4.8,
            reviews: 95,
            price: 600,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
            verified: true,
            status: 'offline'
        },
        {
            id: 3,
            name: 'Md. Irfan',
            location: 'Rajgir',
            languages: ['Hindi', 'Urdu', 'English'],
            specialization: 'Eco-Tourism',
            rating: 4.7,
            reviews: 210,
            price: 700,
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400',
            verified: true,
            status: 'online'
        },
        {
            id: 4,
            name: 'Sita Devi',
            location: 'Madhubani',
            languages: ['Maithili', 'Hindi'],
            specialization: 'Art & Culture',
            rating: 5.0,
            reviews: 60,
            price: 500,
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400',
            verified: true,
            status: 'online'
        }
    ];

    const [guides, setGuides] = useState<typeof guidesData>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Mock data fetch
        setTimeout(() => {
            setGuides(guidesData);
            setLoading(false);
        }, 800);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredGuides = guides.filter(g => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            g.name.toLowerCase().includes(q) ||
            g.specialization.toLowerCase().includes(q);

        const matchesLoc =
            selectedLocation === 'All' ||
            g.location === selectedLocation;

        const matchesLang =
            selectedLang === 'All' ||
            g.languages.includes(selectedLang);

        return matchesSearch && matchesLoc && matchesLang;
    });

    return (
        <div className="bg-gray-50 text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
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
                                        <Link href="/packages" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-calendar-alt w-4 mr-2 text-blue-500"></i> Tour Packages</Link>
                                        <Link href="/aiplanner" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-compass w-4 mr-2 text-purple-500"></i> AI Trip Planner</Link>
                                        <Link href="/homestays" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-heart w-4 mr-2 text-orange-500"></i> Homestays</Link>
                                        <Link href="/transport" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"><i className="fas fa-bus-alt w-4 mr-2 text-green-500"></i> Transport</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link href="/guide-support" className="block px-4 py-2 text-orange-600 bg-orange-50 rounded-lg transition-colors"><i className="fas fa-user-tie w-4 mr-2 text-teal-500"></i> Expert Guides</Link>
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
                            <Link href="/packages" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
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
                            <Link href="/guide-support" className="flex items-center gap-4 text-lg font-medium text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600"><i className="fas fa-user-tie"></i></div>
                                Guides
                            </Link>
                            <Link href="/about" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-600"><i className="fas fa-info-circle"></i></div>
                                About
                            </Link>
                            <Link href="/contact" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
                                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600"><i className="fas fa-envelope"></i></div>
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-6 py-24 pt-32 flex-1">
                <div className="text-center mb-10">
                    <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Expert Guides for <span className="text-orange-600">Every Step</span></h1>
                    <p className="text-gray-500 max-w-2xl mx-auto mb-8">Connect with government-approved locals who know the history, culture, and hidden gems of Bihar.</p>

                    <div className="max-w-3xl mx-auto bg-white rounded-full shadow-lg border border-gray-100 p-2 flex items-center">
                        <i className="fas fa-search text-gray-400 ml-4"></i>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, expertise (e.g. Buddhist Circuit)..." 
                            className="flex-1 p-3 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                        />
                        <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition hidden sm:block">Search</button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-1/4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-24">
                        <div className="flex justify-between items-center mb-4 lg:mb-6">
                            <h3 className="font-bold text-lg"><i className="fas fa-filter text-orange-500 mr-2"></i> Filters</h3>
                            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden text-gray-500"><i className={`fas fa-chevron-${showFilters ? 'up' : 'down'}`}></i></button>
                        </div>

                        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Destination</label>
                                <select 
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:border-orange-500 outline-none"
                                >
                                    <option value="All">All Locations</option>
                                    <option value="Patna">Patna</option>
                                    <option value="Bodh Gaya">Bodh Gaya</option>
                                    <option value="Rajgir">Rajgir</option>
                                    <option value="Madhubani">Madhubani</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Language</label>
                                <div className="space-y-2 max-h-32 overflow-y-auto filter-scroll">
                                    {['All', 'English', 'Hindi', 'Japanese'].map(lang => (
                                        <label key={lang} className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="lang" 
                                                value={lang} 
                                                checked={selectedLang === lang}
                                                onChange={() => setSelectedLang(lang)}
                                                className="accent-orange-600"
                                            /> 
                                            <span className="text-sm">{lang === 'All' ? 'Any' : lang}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Hourly Rate</label>
                                <input type="range" min="200" max="2000" className="w-full accent-orange-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer text-orange-600" />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>₹200</span>
                                    <span>₹2000+</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="mb-4 flex justify-between items-center">
                            <p className="text-sm text-gray-500">Showing <span className="font-bold text-gray-900">{filteredGuides.length}</span> guides</p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow"></span> Online
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20 text-gray-400">
                                <i className="fas fa-circle-notch fa-spin text-3xl text-orange-500"></i>
                            </div>
                        ) : filteredGuides.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredGuides.map(guide => (
                                    <div key={guide.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition group animate-fade-in-up">
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />

                                            <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 ${guide.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}>
                                                <span className={`w-2 h-2 rounded-full ${guide.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                <span>{guide.status === 'online' ? 'Available Now' : 'Offline'}</span>
                                            </div>

                                            {guide.verified && (
                                                <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                                                    <i className="fas fa-check-circle"></i> Gov. Verified
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors">{guide.name}</h3>
                                                    <p className="text-xs text-gray-500"><i className="fas fa-map-marker-alt text-orange-400 mr-1"></i> <span>{guide.location}</span></p>
                                                </div>
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded text-xs font-bold text-yellow-700">
                                                    <span>{guide.rating}</span> <i className="fas fa-star"></i>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {guide.languages.map((lang, i) => (
                                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">{lang}</span>
                                                ))}
                                            </div>

                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">Specialist in <span className="font-bold text-gray-800">{guide.specialization}</span> tours.</p>

                                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase font-bold">Starting from</p>
                                                    <p className="font-bold text-lg">₹<span>{guide.price}</span><span className="text-xs font-normal text-gray-500">/hr</span></p>
                                                </div>
                                                <Link href={`/guide-profile?id=${guide.id}`} className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition shadow-lg">
                                                    View Profile
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <i className="fas fa-user-slash text-4xl text-gray-300 mb-4"></i>
                                <h3 className="font-bold text-gray-600">No guides found</h3>
                                <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <MobileBottomNav />
        </div>
    );
}
