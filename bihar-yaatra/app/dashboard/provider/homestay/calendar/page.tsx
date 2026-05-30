"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProviderBooking {
    id: string;
    service_name?: string;
    service_type: string;
    status: string;
    check_in?: string;
    check_out?: string;
    created_at: string;
    total_amount?: number | string;
    guests?: number | string;
}

export default function ProviderBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<ProviderBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/bookings/provider');
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
        const bId = String(b.id || '');
        const matchSearch = !q || bService.toLowerCase().includes(q) || bId.toLowerCase().includes(q);
        const matchStatus = !filterStatus || b.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        confirmed: 'bg-green-100 text-green-700 border-green-200',
        completed: 'bg-blue-100 text-blue-700 border-blue-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-6 pb-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Calendar & Bookings</h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage your homestay reservations and track guest arrivals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-3 text-gray-400 text-sm"></i>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search booking ID or name..."
                            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm font-medium rounded-xl outline-none focus:border-orange-500 transition shadow-sm" />
                    </div>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                        className="py-2.5 px-4 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-xl outline-none focus:border-orange-500 transition shadow-sm cursor-pointer">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh] bg-white rounded-3xl border border-gray-100">
                    <i className="fas fa-circle-notch fa-spin text-4xl text-orange-500"></i>
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 text-center flex flex-col justify-center items-center min-h-[40vh] text-gray-400 shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-6 text-orange-500 text-3xl">
                        <i className="fas fa-calendar-times"></i>
                    </div>
                    <h3 className="text-xl font-bold font-display text-gray-900 mb-2">No Bookings Found</h3>
                    <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto leading-relaxed">
                        {search || filterStatus ? "We couldn't find any bookings matching your filters." : "You don't have any reservations yet."}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Booking ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Property / Service</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Check-in / Check-out</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Guests</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Earnings</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(booking => (
                                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{booking.id.substring(0, 8)}...</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-gray-900 text-sm max-w-[200px] truncate">{booking.service_name || 'Homestay'}</p>
                                            <p className="text-xs text-gray-400 font-medium capitalize mt-1">{booking.service_type}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0"><i className="far fa-calendar-alt text-xs"></i></div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-700">
                                                        {booking.check_in ? new Date(booking.check_in).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No Date'}
                                                    </p>
                                                    {booking.check_out && (
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                                                            Out: {new Date(booking.check_out).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1.5 w-fit">
                                                <i className="fas fa-user-group text-gray-400 text-[10px]"></i> {booking.guests || 1}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-bold text-gray-900">₹{Number(booking.total_amount).toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg border ${statusColors[booking.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <select 
                                                value={booking.status} 
                                                onChange={e => handleStatusChange(booking.id, e.target.value)}
                                                className="text-xs font-bold bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-orange-500 cursor-pointer shadow-sm hover:bg-gray-50 transition"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirm Booking</option>
                                                <option value="completed">Mark Completed</option>
                                                <option value="cancelled">Cancel</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-fade-in">
                    <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-xl ${toast.type === 'success' ? 'bg-black border-gray-800 text-white' : 'bg-red-50 border-red-200 text-red-700'}`}>
                        <i className={`${toast.type === 'success' ? 'fas fa-check-circle text-green-400' : 'fas fa-times-circle'}`}></i>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
