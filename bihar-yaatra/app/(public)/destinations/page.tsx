"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

import dynamic from 'next/dynamic';

function ExploreDestinationPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    
    // Mock user state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('Traveler');
    const [userAvatar, setUserAvatar] = useState('https://ui-avatars.com/api/?name=Traveler&background=f97316&color=fff');

    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Spiritual', 'Historical', 'Nature', 'Wildlife'];
    
    const seedData = [
        { id: 1, name: 'Bodh Gaya', category: 'Spiritual', location: 'Gaya District', image: 'https://images.unsplash.com/photo-1569485896349-49c0d9a6c65e?q=80&w=1200', rating: 4.9, reviews: 320, price: '₹1,500', description: 'The holiest of Buddhist pilgrimage centers, where Lord Buddha attained enlightenment under the Bodhi tree. A serene place filled with monasteries from various countries.' },
        { id: 2, name: 'Nalanda Ruins', category: 'Historical', location: 'Nalanda', image: 'https://images.unsplash.com/photo-1628063597843-085732c57569?q=80&w=1200', rating: 4.8, reviews: 215, price: '₹1,200', description: 'Explore the red brick ruins of one of the world\'s oldest universities, a UNESCO World Heritage site that once hosted 10,000 students.' },
        { id: 3, name: 'Rajgir Hills', category: 'Nature', location: 'Rajgir', image: 'https://images.unsplash.com/photo-1622303037987-2cb2a3364f76?q=80&w=1200', rating: 4.7, reviews: 180, price: '₹2,000', description: 'A scenic town set in a green valley, famous for its hot springs, ropeway, and the Vishwa Shanti Stupa atop the Ratnagiri Hill.' },
        { id: 4, name: 'Valmiki Reserve', category: 'Wildlife', location: 'West Champaran', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Valmiki_Nagar_Tiger_Reserve.jpg/800px-Valmiki_Nagar_Tiger_Reserve.jpg', rating: 4.6, reviews: 95, price: '₹3,500', description: 'The only tiger reserve in Bihar, offering thrilling jungle safaris and eco-friendly cottage stays amidst dense sal forests.' },
        { id: 5, name: 'Sher Shah Suri Tomb', category: 'Historical', location: 'Sasaram', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sher_Shah_Suri_Tomb.jpg/800px-Sher_Shah_Suri_Tomb.jpg', rating: 4.5, reviews: 150, price: '₹800', description: 'An architectural masterpiece of Indo-Islamic style, this red sandstone mausoleum stands majestically in the middle of a man-made lake.' },
        { id: 6, name: 'Kakolat Falls', category: 'Nature', location: 'Nawada', image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiN3a9_M-6gqL8O733H_0wN2Q5w4z4-8z8z8z8z8z8z8z8z8z8z8z8z8z8z8z8/s1600/Kakolat-Waterfall-Nawada-Bihar.jpg', rating: 4.4, reviews: 210, price: '₹600', description: 'A stunning waterfall cascading down from a height of 160 feet, perfect for a refreshing summer dip and picnic.' },
        { id: 7, name: 'Vikramshila', category: 'Historical', location: 'Bhagalpur', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Vikramshila_Ruins.jpg/800px-Vikramshila_Ruins.jpg', rating: 4.3, reviews: 80, price: '₹1,000', description: 'The ruins of another great ancient university, known for Tantric Buddhism, located on the banks of the Ganges.' },
        { id: 8, name: 'Jal Mandir', category: 'Spiritual', location: 'Pawapuri', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jal_Mandir%2C_Pawapuri.jpg/800px-Jal_Mandir%2C_Pawapuri.jpg', rating: 4.8, reviews: 130, price: '₹900', description: 'A beautiful white marble temple dedicated to Lord Mahavira, situated in the middle of a lotus-filled tank.' },
        { id: 9, name: 'Kesaria Stupa', category: 'Historical', location: 'East Champaran', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Kesariya_Stupa.jpg/800px-Kesariya_Stupa.jpg', rating: 4.6, reviews: 110, price: '₹700', description: 'One of the tallest Buddhist stupas in the world, dating back to the Gupta period.' }
    ];

    const [destinations, setDestinations] = useState<typeof seedData>([]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 60);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Mock data fetch
        setTimeout(() => {
            setDestinations(seedData);
            setLoading(false);
        }, 800);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const filteredDestinations = destinations.filter(item => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
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
                            <Link href="/destinations" className="nav-item font-medium text-orange-600">Destinations</Link>
                            
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
                            <Link href="/guide-support" className="flex items-center gap-4 text-lg font-medium hover:text-orange-600 transition">
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

            <main className="flex-1">
                <section className="relative pt-40 pb-16 bg-gray-50 overflow-hidden">
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-orange-50 to-transparent pointer-events-none"></div>
                    <div className="absolute -left-24 top-24 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
                            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Hidden Gems</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
                            From ancient ruins to untouched forests, find your perfect getaway in the heart of India.
                        </p>

                        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-2 flex items-center border border-gray-100 transform transition-transform focus-within:scale-105">
                            <div className="pl-4 text-gray-400">
                                <i className="fas fa-search text-xl"></i>
                            </div>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name (e.g., Rajgir, Falls, Stupa)..." 
                                className="w-full p-4 bg-transparent border-none outline-none text-lg placeholder-gray-400" 
                            />
                        </div>
                    </div>
                </section>

                <section className="py-12 bg-white min-h-screen">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap justify-center gap-3 mb-16">
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 border border-transparent ${activeCategory === cat ? 'bg-black text-white shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20 text-gray-400">
                                <i className="fas fa-circle-notch fa-spin text-3xl text-orange-500"></i>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredDestinations.map((item) => (
                                        <div key={item.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full animate-fade-in-up">
                                            <div className="relative h-64 overflow-hidden">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm uppercase tracking-wide">
                                                    {item.category}
                                                </div>
                                            </div>

                                            <div className="p-8 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-2xl font-bold font-display group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                                            <i className="fas fa-map-marker-alt text-orange-400 mr-2"></i>
                                                            <span>{item.location}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                                                        <i className="fas fa-star text-yellow-500 text-sm mr-1"></i>
                                                        <span className="font-bold text-sm">{item.rating}</span>
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">{item.description}</p>

                                                <div className="mt-auto pt-6 border-t border-gray-100">
                                                    <Link href={`/view-detail?id=${item.id}`} className="block w-full py-3 text-center bg-black text-white font-bold rounded-xl shadow-md hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300">
                                                        View Detail
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredDestinations.length === 0 && (
                                    <div className="text-center py-20">
                                        <h3 className="text-xl font-bold text-gray-600">No destinations found</h3>
                                        <button 
                                            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                                            className="mt-4 text-orange-600 font-bold hover:underline"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>

            <MobileBottomNav />
        </div>
    );
}

export default dynamic(() => Promise.resolve(ExploreDestinationPage), { ssr: false });
