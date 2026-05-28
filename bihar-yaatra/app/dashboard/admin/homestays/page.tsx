"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Homestay {
    id: string;
    name: string;
    location: string;
    price_per_night: number;
    status: string;
    owner_name?: string;
    owner_email?: string;
    rating?: number;
    created_at: string;
}

export default function AdminHomestaysPage() {
    const [homestays, setHomestays] = useState<Homestay[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHomestays();
    }, []);

    const fetchHomestays = async () => {
        try {
            const res = await apiClient.get('/homestays');
            setHomestays(res.data || []);
        } catch (err) {
            console.error('Error fetching homestays:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = homestays.filter(h => {
        const q = search.toLowerCase();
        return !q || h.name?.toLowerCase().includes(q) || h.location?.toLowerCase().includes(q);
    });

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                <h2 className="text-xl font-bold font-display">Homestays</h2>
                <span className="text-xs text-gray-400">{filtered.length} properties</span>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                <div className="animate-fade-in max-w-7xl mx-auto space-y-6">

                    {/* Search */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <div className="relative">
                            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name or location..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-orange-500 outline-none font-medium text-sm"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center min-h-64 bg-white border border-gray-100 rounded-2xl">
                            <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                                <i className="fas fa-home text-gray-300 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No homestays found</h3>
                            <p className="text-sm text-gray-500">Homestays will appear here once providers list them.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(h => (
                                <div key={h.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-900">{h.name}</h3>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <i className="fas fa-map-marker-alt text-orange-400"></i> {h.location}
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${
                                                h.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>{h.status || 'pending'}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">Price/Night</p>
                                                <p className="font-bold text-gray-900">₹{Number(h.price_per_night).toLocaleString('en-IN')}</p>
                                            </div>
                                            {h.rating && (
                                                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                                                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                                                    <span className="text-xs font-bold">{h.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-3">
                                            Listed {new Date(h.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
