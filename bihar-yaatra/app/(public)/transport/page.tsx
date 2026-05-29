"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/components/providers/AuthProvider';

interface Transport {
    id: string;
    operator: string;
    type: string;
    route: string;
    time: string;
    price: string;
    numericPrice: number;
    rating: number;
    image: string;
    amenities: string[];
    status: string;
}

export default function TransportPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [searchFrom, setSearchFrom] = useState('');
    const [searchTo, setSearchTo] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [loading, setLoading] = useState(true);
    
    const [showTrackingModal, setShowTrackingModal] = useState(false);
    const [trackingVehicle, setTrackingVehicle] = useState<Transport | null>(null);

    const seedData: Transport[] = [
        {
            id: '00000000-0000-0000-0000-200000000001',
            operator: 'Bihar State Tourism Bus',
            type: 'Bus (AC)',
            route: 'Patna → Rajgir',
            time: '06:00 AM - 09:30 AM',
            price: '₹450',
            numericPrice: 450,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',
            amenities: ['AC', 'Wifi', 'Water'],
            status: 'On Time'
        },
        {
            id: '00000000-0000-0000-0000-200000000002',
            operator: 'Ganga Cabs Pvt Ltd',
            type: 'Cab (Sedan)',
            route: 'Patna → Bodh Gaya',
            time: 'Flexible',
            price: '₹2,800',
            numericPrice: 2800,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800',
            amenities: ['AC', 'Private', 'Sanitized'],
            status: 'Available'
        },
        {
            id: '00000000-0000-0000-0000-200000000003',
            operator: 'City Link Shuttle',
            type: 'Bus (Shared)',
            route: 'Patna → Nalanda',
            time: '08:00 AM - 11:00 AM',
            price: '₹300',
            numericPrice: 300,
            rating: 4.2,
            image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800',
            amenities: ['AC', 'Charging Point'],
            status: 'Departed'
        },
        {
            id: '00000000-0000-0000-0000-200000000004',
            operator: 'Royal Bihar Travels',
            type: 'Cab (SUV)',
            route: 'Gaya → Varanasi',
            time: 'Flexible',
            price: '₹4,500',
            numericPrice: 4500,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?q=80&w=800',
            amenities: ['AC', 'Premium', 'Snacks'],
            status: 'Available'
        }
    ];

    const [transports] = useState<Transport[]>(seedData);

    useEffect(() => {
        
        setTimeout(() => {
            setLoading(false);
        }, 800);
    }, []);

    const swapLocations = () => {
        setSearchFrom(searchTo);
        setSearchTo(searchFrom);
    };

    const filteredTransports = transports.filter(item => {
        const matchesType = filterType === 'All' || item.type.includes(filterType);
        const matchesFrom = searchFrom === '' || item.route.toLowerCase().includes(searchFrom.toLowerCase());
        const matchesTo = searchTo === '' || item.route.toLowerCase().includes(searchTo.toLowerCase());
        return matchesType && (matchesFrom || matchesTo);
    });

    const openTracking = (vehicle: Transport) => {
        setTrackingVehicle(vehicle);
        setShowTrackingModal(true);
    };

    const bookRide = (vehicle: Transport) => {
        if (!user) {
            alert("Please login to book a ride.");
            return;
        }
        const draft = {
            title: `${vehicle.operator} — ${vehicle.route}`,
            type: 'Transport',
            price: vehicle.numericPrice,
            service_id: vehicle.id,
            service_type: 'transport',
            service_name: vehicle.operator,
            check_in: travelDate || undefined,
        };
        localStorage.setItem('bookingDraft', JSON.stringify(draft));
        router.push('/dashboard/user/checkout');
    };

    return (
        <div className="bg-[#FAFAFA] text-gray-900 font-sans overflow-x-hidden min-h-screen flex flex-col">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes move-car {
                    0% { left: 10%; }
                    50% { left: 60%; }
                    100% { left: 90%; }
                }
                .animate-move { animation: move-car 10s linear infinite; }
                .pulse-dot {
                    box-shadow: 0 0 0 0 rgba(255, 153, 51, 0.7);
                    animation: pulse-orange 2s infinite;
                }
                @keyframes pulse-orange {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 153, 51, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 153, 51, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 153, 51, 0); }
                }
            `}} />
            <Navbar />

            <main className="flex-1">
                <section className="relative pt-32 pb-16 bg-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-10">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Seamless Connectivity</span>
                            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                                Book Your Ride & <br/><span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-pink-500">Track in Real-Time</span>
                            </h1>
                            <p className="text-gray-500 max-w-xl mx-auto font-medium">
                                From luxury cabs to affordable buses, find the best way to travel across Bihar. Safe, verified, and trackable.
                            </p>
                        </div>

                        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="relative group">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">From</label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 group-hover:border-orange-300 transition focus-within:border-orange-500 focus-within:bg-white">
                                        <i className="fas fa-map-marker-alt text-orange-500 mr-3"></i>
                                        <input 
                                            type="text" 
                                            value={searchFrom}
                                            onChange={(e) => setSearchFrom(e.target.value)}
                                            placeholder="City (e.g. Patna)" 
                                            className="w-full bg-transparent border-none outline-none font-bold text-gray-900 placeholder-gray-400" 
                                        />
                                    </div>
                                </div>

                                <div className="hidden md:flex justify-center items-center pb-3 -mx-2">
                                    <button onClick={swapLocations} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-orange-100 hover:text-orange-600 transition">
                                        <i className="fas fa-exchange-alt"></i>
                                    </button>
                                </div>

                                <div className="relative group">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">To</label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 group-hover:border-orange-300 transition focus-within:border-orange-500 focus-within:bg-white">
                                        <i className="fas fa-location-arrow text-orange-500 mr-3"></i>
                                        <input 
                                            type="text" 
                                            value={searchTo}
                                            onChange={(e) => setSearchTo(e.target.value)}
                                            placeholder="City (e.g. Rajgir)" 
                                            className="w-full bg-transparent border-none outline-none font-bold text-gray-900 placeholder-gray-400" 
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Date</label>
                                    <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 group-hover:border-orange-300 transition focus-within:border-orange-500 focus-within:bg-white">
                                        <i className="fas fa-calendar-alt text-gray-400 mr-3"></i>
                                        <input 
                                            type="date" 
                                            value={travelDate}
                                            onChange={(e) => setTravelDate(e.target.value)}
                                            className="w-full bg-transparent border-none outline-none font-bold text-gray-900" 
                                        />
                                    </div>
                                </div>

                                <button className="h-[50px] bg-black text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 transform active:scale-95">
                                    <i className="fas fa-search"></i> Search
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12 min-h-screen">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                            <h2 className="text-2xl font-bold font-display">Available Rides</h2>
                            <div className="flex gap-2 text-sm overflow-x-auto pb-2 w-full md:w-auto">
                                {['All', 'Bus', 'Cab'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-4 py-2 border rounded-full font-bold whitespace-nowrap transition ${filterType === type ? 'bg-black text-white' : 'bg-white border-gray-200 text-gray-500'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20 text-gray-400">
                                <i className="fas fa-circle-notch fa-spin text-3xl text-orange-500"></i>
                            </div>
                        ) : filteredTransports.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {filteredTransports.map(transport => (
                                    <div key={transport.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6 items-center group">
                                        <div className="md:col-span-1 flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                                                <Image src={transport.image} className="w-full h-full object-cover" alt={transport.operator} width={80} height={80} unoptimized />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight text-gray-900">{transport.operator}</h3>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{transport.type}</p>
                                                <div className="flex items-center gap-1 mt-1 bg-green-50 w-fit px-2 py-0.5 rounded-md border border-green-100">
                                                    <i className="fas fa-star text-green-600 text-[10px]"></i>
                                                    <span className="text-xs font-bold text-green-700">{transport.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                                            <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-wider">Route</p>
                                            <p className="font-bold text-gray-800 flex items-center gap-2">
                                                <span>{transport.route}</span>
                                            </p>
                                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 font-medium">
                                                <i className="far fa-clock text-orange-400"></i> 
                                                <span>{transport.time}</span>
                                            </div>
                                        </div>

                                        <div className="md:col-span-1">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {transport.amenities.map(amenity => (
                                                    <span key={amenity} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded border border-gray-200 uppercase tracking-wide">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className={`text-xs font-bold flex items-center gap-2 ${['On Time', 'Available'].includes(transport.status) ? 'text-green-600' : 'text-orange-600'}`}>
                                                <span className="relative flex h-2 w-2">
                                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${['On Time', 'Available'].includes(transport.status) ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${['On Time', 'Available'].includes(transport.status) ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                </span>
                                                <span>{transport.status}</span>
                                            </p>
                                        </div>

                                        <div className="md:col-span-1 flex flex-col items-end gap-3 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                                            <h3 className="text-2xl font-bold font-display text-gray-900">{transport.price}</h3>
                                            <div className="flex gap-2 w-full md:w-auto">
                                                <button onClick={() => openTracking(transport)} className="px-4 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition text-sm flex-1 md:flex-none" title="Live Tracking">
                                                    <i className="fas fa-map-marked-alt"></i>
                                                </button>
                                                <button onClick={() => bookRide(transport)} className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-200 text-sm flex-1 md:flex-none flex items-center justify-center gap-2">
                                                    Book Now <i className="fas fa-arrow-right"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-4xl border border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-bus-alt text-2xl text-gray-300"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No transport found</h3>
                                <p className="text-gray-500 mt-1">Try searching for Patna, Gaya, or Rajgir.</p>
                                <button onClick={() => { setSearchFrom(''); setSearchTo(''); setFilterType('All'); }} className="mt-4 text-orange-600 font-bold text-sm hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Tracking Modal */}
            {showTrackingModal && trackingVehicle && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div onClick={() => setShowTrackingModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"></div>

                    <div className="bg-white rounded-4xl w-full max-w-4xl h-[80vh] relative z-10 overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-20">
                            <div>
                                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    Live Tracking
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">Vehicle: <span className="font-bold text-gray-800">{trackingVehicle.operator}</span></p>
                            </div>
                            <button onClick={() => setShowTrackingModal(false)} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="flex-1 bg-gray-100 relative overflow-hidden group">
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Map_of_Bihar.jpg" className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 transition duration-700" alt="Map" fill unoptimized />

                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                <path d="M 100 300 Q 400 100 700 300" stroke="#FF9933" strokeWidth="4" fill="none" strokeDasharray="10 5" className="opacity-70" />
                            </svg>

                            <div className="absolute top-[40%] animate-move z-10">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-orange-600 text-lg border-2 border-orange-500 z-10 relative">
                                        <i className={`fas ${trackingVehicle.type.includes('Bus') ? 'fa-bus' : 'fa-car'}`}></i>
                                    </div>
                                    <div className="absolute top-0 left-0 w-12 h-12 rounded-full pulse-dot"></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded font-bold whitespace-nowrap shadow-lg">
                                        <span>{trackingVehicle.route}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-[45%] left-[10%] flex flex-col items-center">
                                <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow ring-2 ring-green-100"></div>
                                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow mt-1 uppercase tracking-wide">Start</span>
                            </div>

                            <div className="absolute top-[45%] left-[90%] flex flex-col items-center">
                                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow ring-2 ring-red-100"></div>
                                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded shadow mt-1 uppercase tracking-wide">End</span>
                            </div>
                        </div>

                        <div className="p-5 bg-white border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                                        <Image src="https://ui-avatars.com/api/?name=Rajesh+Kumar&background=random" className="w-full h-full" alt="Driver" width={40} height={40} unoptimized />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Driver: Rajesh Kumar</h4>
                                        <p className="text-xs text-gray-500">Vehicle: BR-01-PA-1234 • <span className="text-green-600 font-bold">Vaccinated</span></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Est. Arrival</p>
                                    <p className="text-lg font-bold font-display text-green-600">45 Mins</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <MobileBottomNav />
        </div>
    );
}
