"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface Transport {
    id: string;
    vehicle_type: string;
    vehicle_name: string;
    price_per_day: number;
    status: string;
    owner_name?: string;
    location?: string;
    created_at: string;
}

export default function AdminTransportPage() {
    const [transports, setTransports] = useState<Transport[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransports();
    }, []);

    const fetchTransports = async () => {
        try {
            const res = await apiClient.get('/transports');
            setTransports(res.data || []);
        } catch (err) {
            console.error('Error fetching transports:', err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = transports.filter(t => {
        const q = search.toLowerCase();
        return !q || t.vehicle_name?.toLowerCase().includes(q) || t.vehicle_type?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q);
    });

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                <h2 className="text-xl font-bold font-display">Transport</h2>
                <span className="text-xs text-gray-400">{filtered.length} vehicles</span>
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
                                placeholder="Search by vehicle name, type, or location..."
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
                                <i className="fas fa-bus text-gray-300 text-2xl"></i>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No transport listed</h3>
                            <p className="text-sm text-gray-500">Transport vehicles will appear here once providers list them.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Vehicle</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Location</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Price/Day</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Listed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map(t => (
                                            <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-gray-800">{t.vehicle_name || '—'}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono">{t.id.substring(0, 8)}...</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-blue-100 capitalize">
                                                        {t.vehicle_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{t.location || '—'}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900">₹{Number(t.price_per_day).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${
                                                        t.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>{t.status || 'pending'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-500">
                                                    {new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
