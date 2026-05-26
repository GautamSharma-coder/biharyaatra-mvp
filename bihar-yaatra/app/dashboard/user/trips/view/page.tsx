"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

type DayPlan = {
    day: number;
    title: string;
    activities: string[];
    food?: string;
};

type TripData = {
    id: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    days: number;
    image?: string;
    fullItinerary?: { days: DayPlan[] };
    itinerary?: DayPlan[];
};

const MOCK_TRIP: TripData = {
    id: 'trip-abc123',
    title: 'Buddhist Circuit Explorer',
    description: 'A curated journey through the most sacred Buddhist sites in Bihar, including Bodh Gaya, Nalanda, and Rajgir. Experience ancient monasteries, meditation retreats, and local culture.',
    status: 'Upcoming',
    startDate: '2026-02-10',
    endDate: '2026-02-14',
    days: 5,
    image: 'https://images.unsplash.com/photo-1628063597843-085732c57569?q=80&w=1200',
    fullItinerary: {
        days: [
            { day: 1, title: 'Arrival in Patna & Transfer to Bodh Gaya', activities: ['Airport pickup from Patna', 'Scenic 3-hour drive to Bodh Gaya', 'Check-in at heritage hotel', 'Evening visit to Mahabodhi Temple', 'Meditation session at sunset'], food: 'Litti Chokha at a local dhaba' },
            { day: 2, title: 'Bodh Gaya — Full Day Exploration', activities: ['Sunrise meditation at the Bodhi Tree', 'Visit the Great Buddha Statue', 'Explore Japanese & Thai temples', 'Sujata Stupa and village walk', 'Evening light & sound show'], food: 'Sattu Paratha for breakfast' },
            { day: 3, title: 'Rajgir — Nature & History', activities: ['Drive to Rajgir (1.5 hrs)', 'Vishwa Shanti Stupa ropeway ride', 'Explore Griddhakuta Hill (Vulture\'s Peak)', 'Bimbisara\'s Jail and Cyclopean Wall', 'Hot springs at Brahmakund'], food: 'Khaja for dessert' },
            { day: 4, title: 'Nalanda — Ancient University', activities: ['Visit Nalanda Mahavihara ruins (UNESCO)', 'Nalanda Archaeological Museum', 'Xuanzang Memorial Hall', 'Surya Mandir at Bargaon', 'Return to Bodh Gaya for farewell dinner'], food: 'Malpua with rabri' },
            { day: 5, title: 'Departure', activities: ['Leisure morning & souvenir shopping', 'Transfer to Gaya Airport/Station', 'Farewell with Bihar Yaatra team'] },
        ]
    }
};

function ViewTripContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const tripId = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState<TripData | null>(null);
    const [parsedItinerary, setParsedItinerary] = useState<DayPlan[]>([]);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        // Simulate fetching
        setTimeout(() => {
            setTrip(MOCK_TRIP);
            if (MOCK_TRIP.fullItinerary?.days) {
                setParsedItinerary(MOCK_TRIP.fullItinerary.days);
            } else if (Array.isArray(MOCK_TRIP.itinerary)) {
                setParsedItinerary(MOCK_TRIP.itinerary);
            }
            setLoading(false);
        }, 800);
    }, [tripId]);

    const formatDateRange = (start?: string, end?: string) => {
        if (!start) return 'Dates TBD';
        const s = new Date(start);
        const e = end ? new Date(end) : null;
        return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
            (e ? ' - ' + e.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this trip?')) return;
        alert('Trip deleted.');
        router.push('/dashboard/user/trips');
    };

    return (
        <div className="text-gray-800 h-screen overflow-hidden flex bg-[#FAFAFA]">
            {/* Mobile overlay */}
            {mobileMenu && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenu(false)}></div>}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 lg:static lg:inset-auto z-50 w-72 h-full bg-white lg:border-r border-l lg:border-l-0 border-gray-100 flex flex-col transition-transform duration-300 shadow-2xl lg:shadow-none ${mobileMenu ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 pb-4">
                    <Link href="/" className="font-display font-extrabold text-2xl tracking-tight flex items-center gap-2 text-gray-900">
                        Bihar<span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Yaatra</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto py-4 px-5 space-y-1.5">
                    <Link href="/dashboard/user" className="flex items-center gap-3.5 px-4 py-3.5 font-medium text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all">
                        <i className="fas fa-th-large w-5 text-center"></i> Dashboard
                    </Link>
                    <span className="flex items-center gap-3.5 px-4 py-3.5 font-medium bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200 cursor-default">
                        <i className="fas fa-map-location-dot w-5 text-center"></i> Trip Details
                    </span>
                    <Link href="/dashboard/user" className="flex items-center gap-3.5 px-4 py-3.5 font-medium text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all">
                        <i className="fas fa-arrow-left w-5 text-center"></i> Back
                    </Link>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 h-full overflow-y-auto bg-[#FAFAFA] relative w-full flex flex-col">
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileMenu(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600">
                            <i className="fas fa-bars"></i>
                        </button>
                        <h1 className="text-xl font-bold font-display text-gray-900 hidden sm:block">Trip Itinerary</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleDelete} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold transition">
                            <i className="fas fa-trash-alt mr-1"></i> Delete
                        </button>
                        <button onClick={() => window.print()} className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition flex items-center gap-2">
                            <i className="fas fa-download"></i> <span className="hidden sm:inline">Download PDF</span>
                        </button>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-40 text-gray-400">
                            <i className="fas fa-circle-notch fa-spin text-3xl text-orange-500 mb-4"></i>
                            <p>Fetching your itinerary...</p>
                        </div>
                    )}

                    {!loading && trip && (
                        <div className="space-y-8">
                            {/* Hero */}
                            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 relative group">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={trip.image || 'https://images.unsplash.com/photo-1628063597843-085732c57569?q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt={trip.title} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 text-white">
                                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-md">{trip.status}</span>
                                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">{trip.title}</h2>
                                        <p className="text-gray-200 flex items-center gap-2 text-sm md:text-base">
                                            <i className="far fa-calendar-alt"></i> {formatDateRange(trip.startDate, trip.endDate)}
                                            <span className="mx-2">•</span>
                                            <i className="fas fa-map-marker-alt"></i> {trip.days} Days
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Itinerary Timeline */}
                                <div className="lg:col-span-2">
                                    <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm"><i className="fas fa-list-ul"></i></span>
                                        Day-by-Day Plan
                                    </h3>
                                    <div className="space-y-0">
                                        {parsedItinerary.map((day, index) => (
                                            <div key={index} className="relative pb-8 pl-10">
                                                {/* Timeline line */}
                                                {index < parsedItinerary.length - 1 && (
                                                    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-100"></div>
                                                )}
                                                {/* Day marker */}
                                                <div className="absolute left-0 top-0 w-10 h-10 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center font-bold text-orange-500 shadow-sm z-10">
                                                    {day.day}
                                                </div>
                                                {/* Content */}
                                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                                    <h4 className="font-bold text-lg text-gray-900 mb-2">{day.title}</h4>
                                                    <ul className="space-y-3 mb-4">
                                                        {day.activities.map((act, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                                                                <i className="fas fa-check-circle text-green-500 mt-1 shrink-0"></i>
                                                                <span>{act}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    {day.food && (
                                                        <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                                                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 shrink-0 text-xs shadow-sm">
                                                                <i className="fas fa-utensils"></i>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Must Try</p>
                                                                <p className="text-sm font-bold text-gray-800">{day.food}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                        <h3 className="font-bold text-lg mb-4">Trip Summary</h3>
                                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{trip.description}</p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-xl">
                                                <span className="text-gray-500">Duration</span>
                                                <span className="font-bold text-gray-900">{trip.days} Days</span>
                                            </div>
                                            <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-xl">
                                                <span className="text-gray-500">Travelers</span>
                                                <span className="font-bold text-gray-900">2 Adults</span>
                                            </div>
                                            <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-xl">
                                                <span className="text-gray-500">Budget</span>
                                                <span className="font-bold text-green-600">Standard</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                        <h3 className="font-bold text-lg mb-2 relative z-10">Need a Ride?</h3>
                                        <p className="text-gray-400 text-sm mb-6 relative z-10">Book verified cabs for your trip.</p>
                                        <Link href="/transport" className="block w-full py-3 bg-white text-black font-bold text-center rounded-xl hover:bg-gray-200 transition relative z-10">
                                            Book Transport
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function ViewTripPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
            <ViewTripContent />
        </Suspense>
    );
}
