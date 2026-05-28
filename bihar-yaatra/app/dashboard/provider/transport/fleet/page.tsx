"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function FleetPage() {
    const { user } = useAuth();
    const [fleet, setFleet] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        vehicle_type: 'sedan',
        model: '',
        location: '',
        price_per_km: '',
        price_per_day: '',
        capacity: '',
        ac_available: true,
    });

    useEffect(() => {
        if (!user) return;
        fetchFleet();
    }, [user]);

    const fetchFleet = async () => {
        try {
            const res = await apiClient.get('/transports/my/listings');
            setFleet(res.data || []);
        } catch (err) {
            console.error('Error fetching fleet:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const startEdit = (vehicle: any) => {
        setEditingId(vehicle.id);
        setForm({
            vehicle_type: vehicle.vehicle_type || 'sedan',
            model: vehicle.model || '',
            location: vehicle.location || '',
            price_per_km: vehicle.price_per_km?.toString() || '',
            price_per_day: vehicle.price_per_day?.toString() || '',
            capacity: vehicle.capacity?.toString() || '',
            ac_available: vehicle.ac_available ?? true,
        });
        setSuccessMsg('');
        setErrorMsg('');
    };

    const startCreate = () => {
        setEditingId(null);
        setForm({ vehicle_type: 'sedan', model: '', location: '', price_per_km: '', price_per_day: '', capacity: '', ac_available: true });
        setSuccessMsg('');
        setErrorMsg('');
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const payload = {
                vehicle_type: form.vehicle_type,
                model: form.model,
                location: form.location,
                price_per_km: parseFloat(form.price_per_km) || 0,
                price_per_day: parseFloat(form.price_per_day) || 0,
                capacity: parseInt(form.capacity) || 4,
                ac_available: form.ac_available,
            };

            if (editingId) {
                await apiClient.put(`/transports/${editingId}`, payload);
                setSuccessMsg('Vehicle updated successfully!');
            } else {
                await apiClient.post('/transports', payload);
                setSuccessMsg('Vehicle added successfully!');
            }
            await fetchFleet();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to save vehicle.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this vehicle?')) return;
        try {
            await apiClient.delete(`/transports/${id}`);
            setSuccessMsg('Vehicle removed.');
            await fetchFleet();
            if (editingId === id) startCreate();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to delete.');
        }
    };

    const vehicleTypes = ['sedan', 'suv', 'hatchback', 'tempo', 'bus', 'auto'];

    if (loading) {
        return (
            <div className="animate-fade-in space-y-6 flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6 pb-10">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Fleet Management</h1>
                    <p className="text-gray-500 mt-2 font-medium">{fleet.length} vehicle{fleet.length !== 1 ? 's' : ''} registered</p>
                </div>
                <button onClick={startCreate} className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition active:scale-95 duration-200">
                    <i className="fas fa-plus mr-2"></i> Add Vehicle
                </button>
            </header>

            {/* Fleet List */}
            <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
                {fleet.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fas fa-car text-4xl mb-4"></i>
                        <p className="font-bold text-lg">No vehicles registered</p>
                        <p className="text-sm mt-1">Add your first vehicle to start receiving transport bookings.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {fleet.map((v) => (
                            <div key={v.id} className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-xl">
                                        <i className="fas fa-car"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{v.model || v.vehicle_type}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                            {v.vehicle_type?.toUpperCase()} • {v.location} • {v.capacity} seats • {v.ac_available ? 'AC' : 'Non-AC'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">₹{v.price_per_km}/km • ₹{v.price_per_day}/day</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => startEdit(v)} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition shadow-sm">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => handleDelete(v.id)} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition shadow-sm">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Form */}
            <div className="bg-white rounded-4xl border border-gray-100 p-8 md:p-10 shadow-sm">
                <h2 className="text-xl font-display font-black text-gray-900 mb-6">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>

                {successMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold flex items-center gap-3">
                        <i className="fas fa-check-circle text-green-600"></i> {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-bold flex items-center gap-3">
                        <i className="fas fa-exclamation-circle text-red-600"></i> {errorMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Vehicle Type</label>
                        <select className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white outline-none transition capitalize" value={form.vehicle_type} onChange={e => handleChange('vehicle_type', e.target.value)}>
                            {vehicleTypes.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Model Name</label>
                        <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white outline-none transition" value={form.model} onChange={e => handleChange('model', e.target.value)} placeholder="e.g. Maruti Ertiga" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Location</label>
                        <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white outline-none transition" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Patna" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Capacity (seats)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white outline-none transition" value={form.capacity} onChange={e => handleChange('capacity', e.target.value)} placeholder="4" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Price / km (₹)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white outline-none transition" value={form.price_per_km} onChange={e => handleChange('price_per_km', e.target.value)} placeholder="12" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Price / day (₹)</label>
                        <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white outline-none transition" value={form.price_per_day} onChange={e => handleChange('price_per_day', e.target.value)} placeholder="2500" />
                    </div>
                    <div className="flex items-center gap-3 md:col-span-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={form.ac_available} onChange={e => handleChange('ac_available', e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-sm font-bold text-gray-700">AC Available</span>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button onClick={handleSave} disabled={saving || !form.model} className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i> {saving ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}
                    </button>
                    {editingId && (
                        <button onClick={startCreate} className="px-6 py-3.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
