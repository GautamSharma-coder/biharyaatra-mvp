"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

type Homestay = {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  imageUrl: string;
  badge: string;
};

const HOMESTAYS: Homestay[] = [
  {
    id: "1",
    name: "Ganga Kinare Haveli",
    location: "Patna",
    price: 1500,
    rating: 4.8,
    reviews: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
    badge: "Superhost",
  },
  {
    id: "2",
    name: "Bodhi Tree Retreat",
    location: "Bodh Gaya",
    price: 2200,
    rating: 4.9,
    reviews: 245,
    imageUrl:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800",
    badge: "Popular",
  },
  {
    id: "3",
    name: "Village Mud House",
    location: "Madhubani",
    price: 900,
    rating: 4.6,
    reviews: 85,
    imageUrl:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800",
    badge: "Cultural",
  },
];

export default function ViewHomestayDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const item = HOMESTAYS.find((h) => h.id === id) ?? null;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <Link href="/homestays" className="text-sm font-bold text-orange-600">
          ← Back to homestays
        </Link>

        {!item ? (
          <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Homestay not found</h1>
            <p className="text-gray-600 mt-2">
              The requested homestay id is invalid or missing.
            </p>
          </div>
        ) : (
          <article className="mt-8 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <img src={item.imageUrl} alt={item.name} className="w-full h-72 object-cover" />
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {item.badge}
              </p>
              <h1 className="text-4xl font-bold mt-2">{item.name}</h1>
              <p className="text-gray-500 mt-2">{item.location}</p>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-lg font-bold">₹{item.price} / night</p>
                <p className="text-sm text-gray-500">
                  ★ {item.rating} ({item.reviews} reviews)
                </p>
              </div>
            </div>
          </article>
        )}
      </div>

      <MobileBottomNav />
    </main>
  );
}
