import React from 'react';
import { MapPin, Briefcase, Compass, UserCheck, Home, ShieldCheck } from 'lucide-react';

const features = [
    {
        title: "Explore Destinations",
        desc: "Discover hidden gems and must-see historical sites across Bihar.",
        colorClass: "bg-teal-400-custom",
        icon: <MapPin className="w-7 h-7" />
    },
    {
        title: "Tour Packages",
        desc: "Curated, all-inclusive packages for every traveler type and budget.",
        colorClass: "bg-blue-500-custom",
        icon: <Briefcase className="w-7 h-7" />
    },
    {
        title: "AI Trip Planner",
        desc: "Smart, personalized planning for your perfect, optimized Bihar trip itinerary.",
        colorClass: "bg-purple-500-custom",
        icon: <Compass className="w-7 h-7" />
    },
    {
        title: "Expert Guides",
        desc: "Local, knowledgeable guides with deep insight into Bihar's history and culture.",
        colorClass: "bg-green-500-custom",
        icon: <UserCheck className="w-7 h-7" />
    },
    {
        title: "Authentic Homestays",
        desc: "Experience true local Bihar culture with vetted, comfortable homestay options.",
        colorClass: "bg-orange-500-custom",
        icon: <Home className="w-7 h-7" />
    },
    {
        title: "Safe & Secure",
        desc: "Verified services and reliable 24/7 support for a worry-free travel experience.",
        colorClass: "bg-gray-800-custom",
        icon: <ShieldCheck className="w-7 h-7" />
    }
];

export default function Features() {
    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2 block">Why Choose Us</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Experience Bihar <br />Like Never Before</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        We provide a seamless platform to explore the hidden gems of Bihar with modern amenities and local expertise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-50">
                                    <div className="mb-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.colorClass} text-white icon-shadow`}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}