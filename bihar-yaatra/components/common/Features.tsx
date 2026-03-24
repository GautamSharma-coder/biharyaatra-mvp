import React from 'react';

const features = [
    {
        title: "Explore Destinations",
        desc: "Discover hidden gems and must-see historical sites across Bihar.",
        colorClass: "bg-teal-400-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 15h10a1 1 0 0 0 .9-.5l2-4a1 1 0 0 0 0-.8L21.9.5a1 1 0 0 0-1.8-.7L12 11.5a1 1 0 0 0 .3 1.2l.5.3M12 21.7l-1-2.2-4-8.8m-2 4a5.5 5.5 0 1 0 11 0 5.5 5.5 0 0 0-11 0Z" />
                <path d="m17 21 2 2 4-4" />
            </svg>
        )
    },
    {
        title: "Tour Packages",
        desc: "Curated, all-inclusive packages for every traveler type and budget.",
        colorClass: "bg-blue-500-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M21 17h-2.5a.5.5 0 0 1-.5-.5v-13" />
                <rect x="3" y="11" width="18" height="12" rx="2" />
            </svg>
        )
    },
    {
        title: "AI Trip Planner",
        desc: "Smart, personalized planning for your perfect, optimized Bihar trip itinerary.",
        colorClass: "bg-purple-500-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
        )
    },
    {
        title: "Expert Guides",
        desc: "Local, knowledgeable guides with deep insight into Bihar's history and culture.",
        colorClass: "bg-green-500-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 21a8 8 0 0 0-16 0" />
                <circle cx="10" cy="8" r="5" />
                <path d="M22 20c0-2.76-2.24-5-5-5s-5 2.24-5 5" />
                <path d="M17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            </svg>
        )
    },
    {
        title: "Authentic Homestays",
        desc: "Experience true local Bihar culture with vetted, comfortable homestay options.",
        colorClass: "bg-orange-500-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.23 3-5.5a5.5 5.5 0 0 0-11-1c-.05.5-.16 1.07-.35 1.77L12 21l-7.7-7.7c-.19-.7-.3-1.27-.35-1.77a5.5 5.5 0 0 0-11 1c0 2.27 1.51 4.04 3 5.5L12 21Z" />
            </svg>
        )
    },
    {
        title: "Safe & Secure",
        desc: "Verified services and reliable 24/7 support for a worry-free travel experience.",
        colorClass: "bg-gray-800-custom",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 13V5.5L12 2 4 5.5V13c0 5 4 8 8 8s8-3 8-8Z" />
                <path d="M9 12l2 2 4-4" />
            </svg>
        )
    }
];

export default function Features() {
    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <span className="text-orange-600 font-bold tracking-widest text-sm uppercase mb-2 block">Why Choose Us</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Experience Bihar <br />Like Never Before</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We provide a seamless platform to explore the hidden gems of Bihar with modern amenities and local expertise.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 bg-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transition duration-300 hover:shadow-2xl hover:-translate-y-1">
                                    <div className="mb-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${feature.colorClass} text-white icon-shadow`}>
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-500">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}