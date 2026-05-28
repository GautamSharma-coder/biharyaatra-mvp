"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { useAuth } from "@/components/providers/AuthProvider";

type ItineraryDay = {
  day: string;
  title: string;
  desc: string;
};

type Package = {
  id: string;
  title: string;
  category: string;
  duration: string;
  price: string;
  image: string;
  route: string;
  rating: number;
  reviews: number;
  description: string;
  itinerary: ItineraryDay[];
};

const PACKAGES: Package[] = [
  {
    id: "1",
    title: "The Buddhist Circuit",
    category: "Spiritual",
    duration: "5 Days / 4 Nights",
    price: "₹12,999",
    image: "https://images.unsplash.com/photo-1591264247204-74d15024b420?q=80&w=800",
    route: "Patna → Bodh Gaya",
    rating: 4.9,
    reviews: 320,
    description: "Walk in the footsteps of Lord Buddha. Trace the origins of deep spirituality across Bodh Gaya, Rajgir, and Nalanda with expert historians.",
    itinerary: [
      { day: "Day 1", title: "Patna Arrival & Sightseeing", desc: "Arrival at Patna airport/junction, premium hotel check-in. Evening tour of the historical Golghar granary and Ganges riverfront walk." },
      { day: "Day 2", title: "Spiritual Bodh Gaya", desc: "Travel to Bodh Gaya. Meditate under the holy Bodhi Tree at the Mahabodhi Temple complex and explore international monasteries." },
      { day: "Day 3", title: "Ancient Hills of Rajgir", desc: "Excursion to Rajgir. Ride the thrilling ropeway to the Vishwa Shanti Stupa and unwind in the therapeutic Brahmakund hot sulfur springs." },
      { day: "Day 4", title: "Intellectual Nalanda Ruins", desc: "Walk through the UNESCO brick ruins of the 5th-century Nalanda University. Visit the Nalanda museum and Chinese traveler memorial." },
      { day: "Day 5", title: "Return Departure", desc: "Breakfast at hotel, drive back to Patna for your onward journey with rich memories." }
    ]
  },
  {
    id: "2",
    title: "Wild Champaran Safaris",
    category: "Wildlife",
    duration: "3 Days / 2 Nights",
    price: "₹6,499",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Valmiki_Nagar_Tiger_Reserve.jpg/800px-Valmiki_Nagar_Tiger_Reserve.jpg",
    route: "Valmiki Nagar",
    rating: 4.7,
    reviews: 180,
    description: "Immerse yourself in nature. Take open-jeep safaris through the Valmiki Tiger Reserve, spot diverse fauna, and enjoy scenic river rafting.",
    itinerary: [
      { day: "Day 1", title: "Forest Arrival & Safari Brief", desc: "Check in at the eco-lodge inside Valmiki Nagar. Meet your expert guides for a briefing, followed by a cozy campfire dinner." },
      { day: "Day 2", title: "Jungle Jeep Safari & Rafting", desc: "Embark on an early morning open-jeep safari. In the afternoon, enjoy scenic boating or rafting on the Gandak river." },
      { day: "Day 3", title: "Birdwatching & Departure", desc: "Guided forest canopy walk for morning birdwatching, followed by departure to your onward destination." }
    ]
  }
];

function PackageDetailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const item = PACKAGES.find((p) => p.id === id) ?? null;
  const [activeDay, setActiveDay] = useState(0);

  const handleBooking = () => {
    if (!user) {
      router.push("/auth/login?redirect=view-package-detail?id=" + id);
      return;
    }
    // Save booking draft to localStorage so the checkout page can read it
    const draft = {
      service_id: item?.id,
      service_type: 'package',
      service_name: item?.title,
      title: item?.title,
      type: 'Package',
      price: parseFloat(String(item?.price).replace(/[^0-9.]/g, '')) || 0,
      image: item?.image,
    };
    localStorage.setItem('bookingDraft', JSON.stringify(draft));
    router.push('/dashboard/user/checkout');
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24 pb-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 text-2xl mx-auto mb-4">
            <i className="fas fa-search"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h2>
          <p className="text-gray-500 mb-6">The requested tour package ID is invalid or has been archived.</p>
          <Link href="/packages" className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg">
            Browse All Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] text-gray-900 font-sans min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative h-[450px] overflow-hidden">
          <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-orange-500 rounded-lg text-xs font-bold shadow-lg tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold border border-white/20">
                    <i className="fas fa-clock mr-1.5"></i> {item.duration}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight drop-shadow-md">
                  {item.title}
                </h1>
                <p className="text-gray-300 mt-2 flex items-center gap-2 font-medium">
                  <i className="fas fa-map-marker-alt text-orange-500"></i> {item.route}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-sm w-fit shrink-0">
                <i className="fas fa-star text-yellow-400"></i>
                <span className="font-bold text-sm">{item.rating}</span>
                <span className="text-gray-300 text-xs">({item.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <section className="max-w-7xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Main Details Column */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Back button */}
              <Link href="/packages" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition">
                <i className="fas fa-arrow-left"></i> Back to all packages
              </Link>

              {/* Description */}
              <div className="bg-white rounded-4xl p-8 md:p-10 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold font-display">About the Experience</h2>
                <p className="text-gray-600 leading-relaxed text-base font-medium">{item.description}</p>
              </div>

              {/* Day-by-Day Interactive Timeline */}
              <div className="bg-white rounded-4xl p-8 md:p-10 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold font-display mb-8 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm shadow-md shadow-orange-100"><i className="fas fa-route"></i></span>
                  Detailed Itinerary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* Left Tab Buttons */}
                  <div className="md:col-span-1 flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 scroll-hidden border-b md:border-b-0 md:border-r border-gray-100">
                    {item.itinerary.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDay(idx)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm text-left whitespace-nowrap transition-all duration-300 ${activeDay === idx ? "bg-orange-500 text-white shadow-lg shadow-orange-100" : "bg-gray-50 text-gray-500 hover:bg-gray-100"}`}
                      >
                        {day.day}
                      </button>
                    ))}
                  </div>

                  {/* Right Tab Content */}
                  <div className="md:col-span-3 space-y-4 min-h-[200px] animate-fade-in">
                    <span className="inline-block px-3 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg uppercase">
                      {item.itinerary[activeDay].day} Detail
                    </span>
                    <h3 className="text-xl font-bold font-display text-gray-900 leading-tight">
                      {item.itinerary[activeDay].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100 font-medium">
                      {item.itinerary[activeDay].desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Booking Sidebar Column */}
            <div className="space-y-8">
              <div className="bg-white rounded-4xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 sticky top-28 space-y-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Starting From</p>
                  <p className="text-4xl font-display font-bold text-gray-900">{item.price} <span className="text-xs text-gray-400 font-bold uppercase font-sans">/ Person</span></p>
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-hotel text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-400 uppercase">Stays</h4>
                      <p className="font-bold text-sm text-gray-800">Premium Hotel Stay</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-car text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-400 uppercase">Transport</h4>
                      <p className="font-bold text-sm text-gray-800">AC Private Cab</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <i className="fas fa-hamburger text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-400 uppercase">Meals</h4>
                      <p className="font-bold text-sm text-gray-800">Breakfast & Dinner Incl.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full py-4.5 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:shadow-orange-100 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Book Experience Now <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>

                <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wide">
                  <i className="fas fa-shield-alt mr-1"></i> Secure Payment Gateway Verification
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <MobileBottomNav />
      <Footer />
    </div>
  );
}

export default function PackageDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
      <PackageDetailPageContent />
    </Suspense>
  );
}
