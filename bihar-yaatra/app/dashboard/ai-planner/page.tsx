"use client";
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { askSaarthi } from '@/app/actions';

interface Activity {
    day: number;
    title: string;
    activities: string[];
    food: string;
}

interface ItineraryResult {
    trip_title: string;
    summary: string;
    days: Activity[];
}

export default function AIPlannerPage() {
    const [duration, setDuration] = useState<number>(3);
    const [travelers, setTravelers] = useState('Couple');
    const [budget, setBudget] = useState('Standard');
    const [interests, setInterests] = useState<string[]>(['Heritage', 'Nature']);
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ItineraryResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('Analyzing your preferences...');
    const [isSaved, setIsSaved] = useState(false);

    const availableInterests = ['Heritage', 'Spiritual', 'Nature', 'Wildlife', 'Food', 'Adventure', 'Rural Life', 'Photography'];

    const toggleInterest = (i: string) => {
        setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (interests.length === 0) {
            alert("Please select at least one interest!");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const messages = [
            "Mapping Bihar's hidden gems...",
            "Finding the best litti-chokha spots...",
            "Optimizing travel routes...",
            "Curating heritage sites...",
            "Calculating budget estimates..."
        ];
        
        let msgIndex = 0;
        const msgInterval = setInterval(() => {
            setLoadingMessage(messages[msgIndex]);
            msgIndex = (msgIndex + 1) % messages.length;
        }, 1500);

        try {
            const prompt = `
                Act as an expert travel planner for Bihar, India. 
                Create a ${duration}-day detailed itinerary for a ${travelers} trip.
                Budget Level: ${budget}.
                Interests: ${interests.join(', ')}.
                
                Return a JSON object with this EXACT structure (no markdown):
                {
                    "trip_title": "Creative Title",
                    "summary": "Inspiring summary (max 30 words)",
                    "days": [
                        {
                            "day": 1,
                            "title": "Theme/Location",
                            "activities": ["Activity 1", "Activity 2", "Activity 3"],
                            "food": "Dish name"
                        }
                    ]
                }
            `;

            // Call Saarthi AI Server Action using the Gemini API
            const aiResponse = await askSaarthi(prompt);
            if (!aiResponse.ok) {
                throw new Error(aiResponse.error);
            }

            const jsonText = aiResponse.text;
            let cleanedText = jsonText.trim();
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.substring(7);
                if (cleanedText.endsWith('```')) {
                    cleanedText = cleanedText.substring(0, cleanedText.length - 3);
                }
            } else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.substring(3);
                if (cleanedText.endsWith('```')) {
                    cleanedText = cleanedText.substring(0, cleanedText.length - 3);
                }
            }
            const data = JSON.parse(cleanedText);
            setResult(data);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Network error");
        } finally {
            clearInterval(msgInterval);
            setLoading(false);
        }
    };

    const resetForm = () => {
        setResult(null);
        setError(null);
        setIsSaved(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="text-gray-900 font-sans min-h-screen bg-[#FAFAFA]">
            <Navbar />

            <section className="pt-32 pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full text-orange-600 text-sm font-bold mb-6 border border-orange-100 shadow-sm">
                        <i className="fas fa-sparkles"></i> Powered by Saarthi AI
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Plan Your Perfect <br />
                        <span className="text-gradient">Bihar Trip in Seconds</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">
                        Tell us your preferences, and our AI will craft a personalized day-by-day itinerary just for you.
                    </p>
                </div>

                {!result && !loading && (
                    <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 border border-gray-100 relative overflow-hidden transition-all duration-500 transform translate-y-0 opacity-100">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-[10rem] -z-10 pointer-events-none"></div>

                        <form onSubmit={handleGenerate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Trip Duration</label>
                                    <div className="relative">
                                        <input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value) || 1)} min="1" max="15"
                                            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-bold text-lg text-gray-900 placeholder-gray-300"
                                            placeholder="e.g. 3" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">Days</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Who is traveling?</label>
                                    <div className="relative">
                                        <select value={travelers} onChange={(e) => setTravelers(e.target.value)}
                                            className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-orange-500 focus:bg-white outline-none transition font-bold text-lg text-gray-900 appearance-none cursor-pointer">
                                            <option value="Solo">Solo Traveler</option>
                                            <option value="Couple">Couple</option>
                                            <option value="Family">Family (with kids)</option>
                                            <option value="Friends">Group of Friends</option>
                                        </select>
                                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Budget Style</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Budget', 'Standard', 'Luxury'].map((level) => (
                                        <label key={level} className="cursor-pointer group">
                                            <input type="radio" name="budget" value={level} checked={budget === level} onChange={() => setBudget(level)} className="peer sr-only" />
                                            <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 peer-checked:border-orange-500 peer-checked:bg-orange-50 peer-checked:text-orange-700 text-center transition hover:border-orange-200">
                                                <div className="text-2xl mb-1 opacity-70 group-hover:opacity-100 transition">
                                                    {level === 'Budget' ? '💸' : level === 'Standard' ? '💼' : '👑'}
                                                </div>
                                                <span className="font-bold text-sm">{level}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-10">
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Interests (Select multiple)</label>
                                <div className="flex flex-wrap gap-3">
                                    {availableInterests.map((interest) => (
                                        <label key={interest} className="cursor-pointer">
                                            <input type="checkbox" checked={interests.includes(interest)} onChange={() => toggleInterest(interest)} className="custom-checkbox sr-only peer" />
                                            <div className="px-5 py-2.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 font-bold text-sm transition-all hover:bg-white hover:shadow-md select-none border-transparent peer-checked:bg-orange-500 peer-checked:text-white peer-checked:scale-105 peer-checked:border-orange-500">
                                                <span>{interest}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="submit"
                                className="w-full py-5 bg-black text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-orange-600 hover:shadow-orange-200 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 group">
                                <i className="fas fa-magic group-hover:animate-pulse"></i> Generate My Itinerary
                            </button>
                        </form>
                    </div>
                )}

                {loading && (
                    <div className="max-w-xl mx-auto text-center py-20">
                        <div className="w-12 h-12 border-4 border-white border-b-orange-500 rounded-full inline-block animate-spin mb-8"></div>
                        <h3 className="text-3xl font-display font-bold mb-4 text-gray-900">Crafting your journey...</h3>
                        <p className="text-gray-500 animate-pulse font-medium">{loadingMessage}</p>
                    </div>
                )}

                {result && !loading && (
                    <div className="max-w-4xl mx-auto transition-all duration-700 transform translate-y-0 opacity-100">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <button onClick={resetForm}
                                className="flex items-center gap-2 text-gray-500 hover:text-black font-bold transition px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                <i className="fas fa-arrow-left"></i> Plan Another
                            </button>
                            <div className="flex gap-3">
                                <button onClick={() => setIsSaved(true)}
                                    className="px-5 py-2 rounded-xl bg-black text-white font-bold flex items-center gap-2 hover:bg-green-600 transition shadow-lg">
                                    <i className="fas fa-save"></i> <span>{isSaved ? 'Saved!' : 'Save Trip'}</span>
                                </button>
                                <button onClick={() => window.print()}
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition text-gray-500 shadow-sm">
                                    <i className="fas fa-print"></i>
                                </button>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl mb-12 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-64 h-full bg-white/5 skew-x-12"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <div className="inline-block px-3 py-1 bg-orange-500 rounded-lg text-[10px] font-bold uppercase mb-4 tracking-wider shadow-lg">
                                    Custom Itinerary
                                </div>
                                <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 leading-tight">{result.trip_title}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl font-light">{result.summary}</p>

                                <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                            <i className="fas fa-clock text-orange-400"></i></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Duration</p>
                                            <p className="font-bold">{duration} Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                            <i className="fas fa-wallet text-green-400"></i></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Budget</p>
                                            <p className="font-bold">{budget}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                            <i className="fas fa-users text-blue-400"></i></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Travelers</p>
                                            <p className="font-bold">{travelers}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 relative">
                            <div className="absolute left-4 md:left-8 top-8 bottom-8 w-0.5 bg-gray-200 border-l border-dashed border-gray-300"></div>

                            {result.days?.map((day, idx) => (
                                <div key={idx} className="relative pl-12 md:pl-20 group">
                                    <div className="absolute left-0 md:left-4 top-0 w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center font-bold text-sm border-4 border-gray-100 shadow-md z-10 group-hover:border-orange-100 group-hover:text-orange-600 transition-colors">
                                        {day.day}
                                    </div>

                                    <div className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100">
                                        <h3 className="text-xl font-bold font-display mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">
                                            {day.title}
                                        </h3>
                                        <ul className="space-y-4">
                                            {day.activities?.map((activity, actIdx) => (
                                                <li key={actIdx} className="flex gap-4 items-start">
                                                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                                                        <i className="fas fa-check text-green-500 text-xs"></i>
                                                    </div>
                                                    <span className="text-gray-600 leading-relaxed font-medium">{activity}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {day.food && (
                                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                                    <i className="fas fa-utensils text-orange-500 text-xs"></i>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Food Recommendation</span>
                                                    <span className="text-gray-800 font-bold text-sm">{day.food}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center bg-white rounded-[2rem] p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                            <h3 className="text-2xl font-bold font-display mb-2 text-gray-900">Ready to make this real?</h3>
                            <p className="text-gray-500 mb-8 font-medium">Our local experts can book this exact itinerary for you.</p>
                            <a href="/contact"
                                className="inline-block px-10 py-4 bg-black text-white font-bold rounded-xl shadow-xl hover:bg-orange-600 hover:shadow-orange-200 transition-all transform hover:-translate-y-1">
                                Request Quote
                            </a>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto text-center py-20">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 text-3xl mx-auto mb-6">
                            <i className="fas fa-wifi"></i>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Connection Interrupted</h3>
                        <p className="text-gray-500 mb-8">{error}</p>
                        <button onClick={resetForm}
                            className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition">Try Again</button>
                    </div>
                )}
            </section>

            <MobileBottomNav />
            <Footer />
        </main>
    );
}
