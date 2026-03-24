"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

type Destination = {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
};

const DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Bodh Gaya",
    category: "Spiritual",
    location: "Gaya District",
    image:
      "https://images.unsplash.com/photo-1569485896349-49c0d9a6c65e?q=80&w=1200",
    rating: 4.9,
    reviews: 320,
    price: "₹1,500",
    description:
      "The holiest Buddhist pilgrimage center where Lord Buddha attained enlightenment under the Bodhi tree.",
  },
  {
    id: "2",
    name: "Nalanda Ruins",
    category: "Historical",
    location: "Nalanda",
    image:
      "https://images.unsplash.com/photo-1628063597843-085732c57569?q=80&w=1200",
    rating: 4.8,
    reviews: 215,
    price: "₹1,200",
    description:
      "Explore the UNESCO-listed ruins of one of the world's oldest universities.",
  },
  {
    id: "3",
    name: "Rajgir Hills",
    category: "Nature",
    location: "Rajgir",
    image:
      "https://images.unsplash.com/photo-1622303037987-2cb2a3364f76?q=80&w=1200",
    rating: 4.7,
    reviews: 180,
    price: "₹2,000",
    description:
      "A scenic valley town known for ropeway rides, hot springs, and the Vishwa Shanti Stupa.",
  },
];

export default function ViewDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const item = DESTINATIONS.find((d) => d.id === id) ?? null;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 pb-24">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <Link href="/destinations" className="text-sm font-bold text-orange-600">
          ← Back to destinations
        </Link>

        {!item ? (
          <div className="mt-12 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold">Destination not found</h1>
            <p className="text-gray-600 mt-2">
              The requested destination id is invalid or missing.
            </p>
          </div>
        ) : (
          <article className="mt-8 bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <img src={item.image} alt={item.name} className="w-full h-72 object-cover" />
            <div className="p-8">
              <p className="text-xs font-bold uppercase tracking-wider text-orange-600">
                {item.category}
              </p>
              <h1 className="text-4xl font-bold mt-2">{item.name}</h1>
              <p className="text-gray-500 mt-2">{item.location}</p>
              <p className="text-gray-700 mt-6 leading-relaxed">{item.description}</p>
              <div className="mt-8 flex items-center justify-between">
                <p className="text-lg font-bold">{item.price}</p>
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
