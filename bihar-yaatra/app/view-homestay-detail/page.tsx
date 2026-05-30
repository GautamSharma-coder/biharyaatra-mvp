"use client";

import React, { useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

type Homestay = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge: string;
  amenities: string[];
  description: string;
};

const HOMESTAYS: Homestay[] = [
  {
    id: "00000000-0000-0000-0000-300000000001",
    name: "Ganga Kinare Haveli",
    location: "Patna",
    price: 1500,
    rating: 4.8,
    reviews: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
    badge: "Superhost",
    amenities: ["Wifi", "Kitchen", "AC"],
    description:
      "A beautifully restored heritage haveli right on the banks of the Ganges. Experience old-world charm with modern amenities, authentic Bihari hospitality, and home-cooked meals. Perfect for families and solo travelers seeking cultural immersion.",
  },
  {
    id: "00000000-0000-0000-0000-300000000002",
    name: "Bodhi Tree Retreat",
    location: "Bodh Gaya",
    price: 2200,
    rating: 4.9,
    reviews: 245,
    imageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800",
    badge: "Popular",
    amenities: ["Wifi", "Spa", "Garden"],
    description:
      "A serene retreat near the sacred Mahabodhi Temple. Wake up to meditation bells, enjoy organic meals, and find inner peace in lush gardens. Ideal for spiritual seekers and wellness enthusiasts.",
  },
  {
    id: "00000000-0000-0000-0000-300000000003",
    name: "Village Mud House",
    location: "Madhubani",
    price: 900,
    rating: 4.6,
    reviews: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800",
    badge: "Cultural",
    amenities: ["Art Studio", "Bonfire", "Organic Food"],
    description:
      "Live in a traditional Mithila mud house adorned with Madhubani paintings. Learn folk art from local artists, enjoy bonfires under the stars, and taste authentic Maithili cuisine.",
  },
];

function ViewHomestayDetailPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = searchParams.get("id");
  const item = HOMESTAYS.find((h) => h.id === id) ?? null;

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleBookNow = () => {
    if (!user) {
      alert("Please login to book a homestay.");
      return;
    }
    if (!item) return;

    const draft = {
      title: item.name,
      type: "Homestay",
      price: item.price,
      service_id: item.id,
      service_type: "homestay",
      service_name: item.name,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
    };
    localStorage.setItem("bookingDraft", JSON.stringify(draft));
    router.push("/dashboard/user/checkout");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <Link href="/homestays" className="text-sm font-bold text-orange-600 inline-flex items-center gap-2 hover:underline">
          <i className="fas fa-arrow-left"></i> Back to homestays
        </Link>

        {!item ? (
          <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Homestay not found</h1>
            <p className="text-gray-600 mt-2">
              The requested homestay id is invalid or missing.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <article className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="relative h-72 md:h-96 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                    {item.badge}
                  </div>
                </div>
                <div className="p-8">
                  <h1 className="text-3xl md:text-4xl font-display font-bold">{item.name}</h1>
                  <div className="flex items-center gap-4 mt-3 text-gray-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className="fas fa-map-marker-alt text-orange-400"></i> {item.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <i className="fas fa-star text-yellow-400"></i> {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed mt-6 text-lg">
                    {item.description}
                  </p>

                  <div className="mt-6">
                    <h3 className="font-bold text-lg mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.amenities.map((a, i) => (
                        <span key={i} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold border border-gray-200">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-8 sticky top-28">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                    <h3 className="text-3xl font-bold font-display text-gray-900">
                      ₹{item.price.toLocaleString("en-IN")}{" "}
                      <span className="text-base font-normal text-gray-500">/ night</span>
                    </h3>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Check-in</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Check-out</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split("T")[0]}
                      className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-orange-500 transition cursor-pointer"
                    />
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="bg-gray-50 p-4 rounded-xl mb-6">
                    <div className="flex justify-between text-sm mb-2 text-gray-600">
                      <span>
                        {Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))} night(s) × ₹{item.price.toLocaleString("en-IN")}
                      </span>
                      <span className="font-bold">
                        ₹{(item.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-bold text-lg text-gray-900">
                      <span>Total</span>
                      <span>
                        ₹{(item.price * Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  className="w-full py-4 bg-linear-to-r from-orange-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 flex justify-center items-center gap-2"
                >
                  <span>Book Now</span>
                  <i className="fas fa-arrow-right"></i>
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 flex justify-center items-center gap-1">
                  <i className="fas fa-shield-alt text-green-500"></i> 100% Secure & Verified Hosts
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

          </main>
  );
}

export default function ViewHomestayDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
      <ViewHomestayDetailPageContent />
    </Suspense>
  );
}
