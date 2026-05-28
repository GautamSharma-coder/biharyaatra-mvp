"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await apiClient.get('/bookings');
            setBookings(res.data || []);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: string = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const handleStatusChange = async (bookingId: string, newStatus: string) => {
        try {
            await apiClient.patch(`/bookings/${bookingId}/status`, { status: newStatus });
            showToast(`Booking status updated to "${newStatus}"`);
            await fetchBookings();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            showToast(error.response?.data?.error || 'Failed to update', 'error');
        }
    };

    const filtered = bookings.filter(b => {
        const q = search.toLowerCase();
        const bService = String(b.service_name || '');
        const bType = String(b.service_type || '');
        const bId = String(b.id || '');
        const matchSearch = !q || bService.toLowerCase().includes(q) || bType.toLowerCase().includes(q) || bId.toLowerCase().includes(q);
        const matchStatus = !filterStatus || b.status === filterStatus;
        const matchType = !filterType || b.service_type === filterType;
        return matchSearch && matchStatus && matchType;
    });

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        confirmed: 'bg-green-100 text-green-700 border-green-200',
        completed: 'bg-blue-100 text-blue-700 border-blue-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    const totalRevenue = filtered
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 flex justify-between items-center px-8 shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold font-display">All Bookings</h2>
                    <span className="bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">
                        {filtered.length} bookings
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                            className="w-48 pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-sm rounded-xl outline-none focus:border-orange-500 transition" />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="py-2 px-3 bg-gray-50 border border-gray-200 text-sm rounded-xl outline-none focus:border-orange-500 transition">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}
                        className="py-2 px-3 bg-gray-50 border border-gray-200 text-sm rounded-xl outline-none focus:border-orange-500 transition">
                        <option value="">All Types</option>
                        <option value="homestay">Homestay</option>
                        <option value="transport">Transport</option>
                        <option value="guide">Guide</option>
                        <option value="package">Package</option>
                    </select>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scroll">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-yellow-500"><i className="fas fa-clock"></i></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Pending</p>
                            <p className="text-lg font-bold">{bookings.filter(b => b.status === 'pending').length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500"><i className="fas fa-check-circle"></i></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Confirmed</p>
                            <p className="text-lg font-bold">{bookings.filter(b => b.status === 'confirmed').length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"><i className="fas fa-times-circle"></i></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Cancelled</p>
                            <p className="text-lg font-bold">{bookings.filter(b => b.status === 'cancelled').length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-500"><i className="fas fa-wallet"></i></div>
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Revenue</p>
                            <p className="text-lg font-bold text-green-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-48"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-400 font-medium">No bookings found.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Booking ID</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Service</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Type</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Dates</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(booking => (
                                        <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{String(booking.id || '').substring(0, 8)}...</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800 truncate max-w-[180px]">{String(booking.service_name || '—')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-lg capitalize">{String(booking.service_type)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                {booking.check_in ? (
                                                    <>{new Date(booking.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} → {new Date(booking.check_out).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</>
                                                ) : (
                                                    new Date(booking.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900">₹{Number(booking.total_amount).toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${statusColors[String(booking.status)] || 'bg-gray-100 text-gray-600'}`}>
                                                    {String(booking.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select defaultValue={String(booking.status)} onChange={e => handleStatusChange(String(booking.id), e.target.value)}
                                                    className="text-xs font-bold bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-orange-500 cursor-pointer">
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-200 max-w-sm animate-in slide-in-from-right duration-300">
                    <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        <i className={`${toast.type === 'success' ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'}`}></i>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </>
    );
}
