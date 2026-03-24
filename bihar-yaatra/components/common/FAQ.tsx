"use client";
import React, { useState } from 'react';

const faqs = [
    {
        id: 1,
        question: "What is the best time to visit Bihar?",
        answer: "The best time to visit is between October and March. The weather is pleasant and cool, perfect for walking tours in Bodh Gaya and Nalanda. Summers (April-June) can be quite hot."
    },
    {
        id: 2,
        question: "Is it safe for solo female travelers?",
        answer: "Absolutely. Bihar tourism has improved significantly in safety. We provide verified guides and tracked transportation options. For major hubs like Bodh Gaya and Rajgir, there are dedicated tourist police stations as well."
    },
    {
        id: 3,
        question: "Do you offer customized packages?",
        answer: "Yes! While we have pre-made packages, our AI Trip Planner can build a custom itinerary based on your budget, days, and interests (Historical, Spiritual, or Nature)."
    },
    {
        id: 4,
        question: "How do I book a guide?",
        answer: "You can book a government-approved guide directly through our \"Expert Guides\" section. You can view their profile, languages spoken, and rating before booking."
    }
];

export default function FAQ() {
    const [activeAccordion, setActiveAccordion] = useState<number | null>(1);

    const toggleAccordion = (id: number) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
        <section className="py-24 bg-white relative text-gray-900">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Have Questions?</h2>
                        <p className="text-gray-600">Everything you need to know about traveling in Bihar.</p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <div 
                                key={faq.id} 
                                className={`bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${activeAccordion === faq.id ? 'shadow-lg ring-1 ring-orange-100' : 'shadow-sm'}`}
                            >
                                <button 
                                    onClick={() => toggleAccordion(faq.id)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="font-bold text-lg font-display text-gray-900">{faq.question}</span>
                                    <span className={`w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 transition-transform duration-300 ${activeAccordion === faq.id ? 'rotate-180 bg-orange-100 text-orange-600' : ''}`}>
                                        <i className="fas fa-chevron-down text-sm"></i>
                                    </span>
                                </button>
                                
                                <div 
                                    className={`transition-all duration-300 overflow-hidden ${activeAccordion === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-6 pb-6 pt-0">
                                        <p className="text-gray-600 leading-relaxed border-t border-gray-100 pt-4" dangerouslySetInnerHTML={{ __html: faq.answer.replace(/(October and March|verified guides|AI Trip Planner|historical, spiritual, or nature)/gi, '<span class="font-semibold text-gray-900">$&</span>') }}></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
