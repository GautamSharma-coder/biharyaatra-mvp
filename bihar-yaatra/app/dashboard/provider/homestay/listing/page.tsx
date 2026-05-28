"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function HomestayListingPage() {
    const { user } = useAuth();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Form state for creating/editing
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        location: '',
        address: '',
        price_per_night: '',
        max_guests: '',
        amenities: [] as string[],
        description: '',
    });
    const [newAmenity, setNewAmenity] = useState('');

    useEffect(() => {
        if (!user) return;
        fetchListings();
    }, [user]);

    const fetchListings = async () => {
        try {
            const res = await apiClient.get('/homestays/my/listings');
            setListings(res.data || []);
        } catch (err) {
            console.error('Error fetching listings:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleChange = (field: string, value: string) => {
        setForm(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'name') {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };

    const addAmenity = () => {
        if (newAmenity.trim() && !form.amenities.includes(newAmenity.trim())) {
            setForm(prev => ({ ...prev, amenities: [...prev.amenities, newAmenity.trim()] }));
            setNewAmenity('');
        }
    };

    const removeAmenity = (am: string) => {
        setForm(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== am) }));
    };

    const startEdit = (listing: any) => {
        setEditingId(listing.id);
        setForm({
            name: listing.name || '',
            slug: listing.slug || '',
            location: listing.location || '',
            address: listing.address || '',
            price_per_night: listing.price_per_night?.toString() || '',
            max_guests: listing.max_guests?.toString() || '',
            amenities: listing.amenities || [],
            description: listing.description || '',
        });
        setSuccessMsg('');
        setErrorMsg('');
    };

    const startCreate = () => {
        setEditingId(null);
        setForm({ name: '', slug: '', location: '', address: '', price_per_night: '', max_guests: '', amenities: [], description: '' });
        setSuccessMsg('');
        setErrorMsg('');
    };

    const handleSave = async () => {
        setSaving(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const payload = {
                name: form.name,
                slug: form.slug,
                location: form.location,
                address: form.address,
                price_per_night: parseFloat(form.price_per_night) || 0,
                max_guests: parseInt(form.max_guests) || 1,
                amenities: form.amenities,
            };

            if (editingId) {
                await apiClient.put(`/homestays/${editingId}`, payload);
                setSuccessMsg('Listing updated successfully!');
            } else {
                await apiClient.post('/homestays', payload);
                setSuccessMsg('New listing created successfully!');
            }
            await fetchListings();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to save listing.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            await apiClient.delete(`/homestays/${id}`);
            setSuccessMsg('Listing deleted.');
            await fetchListings();
            if (editingId === id) startCreate();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to delete.');
        }
    };

    const toggleAvailability = async (id: string, currentAvail: boolean) => {
        try {
            await apiClient.patch(`/homestays/${id}/availability`, { is_available: !currentAvail });
            await fetchListings();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to update availability.');
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in max-w-5xl mx-auto flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-6 pb-10">
            {/* Existing Listings */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/50">
                    <h2 className="text-2xl font-black font-display text-gray-900">My Listings ({listings.length})</h2>
                    <button onClick={startCreate} className="text-white font-bold text-sm bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl active:scale-95 duration-200 shadow-md shadow-orange-500/20 transition">
                        <i className="fas fa-plus mr-2"></i> New Listing
                    </button>
                </div>

                {listings.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <i className="fas fa-home text-4xl mb-4"></i>
                        <p className="font-bold text-lg">No listings yet</p>
                        <p className="text-sm mt-1">Create your first homestay listing to start receiving bookings.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {listings.map((listing) => (
                            <div key={listing.id} className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 text-xl border border-orange-100">
                                        <i className="fas fa-home"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">{listing.name}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{listing.location} • ₹{Number(listing.price_per_night).toLocaleString('en-IN')}/night • {listing.max_guests} guests</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`w-2 h-2 rounded-full ${listing.is_available ? 'bg-green-500' : 'bg-red-400'}`}></span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{listing.is_available ? 'Available' : 'Unavailable'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => toggleAvailability(listing.id, listing.is_available)} className={`px-4 py-2 rounded-xl text-xs font-bold transition border shadow-sm ${listing.is_available ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'}`}>
                                        {listing.is_available ? 'Pause' : 'Activate'}
                                    </button>
                                    <button onClick={() => startEdit(listing)} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition shadow-sm">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button onClick={() => handleDelete(listing.id)} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition shadow-sm">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create / Edit Form */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-gray-50/50">
                    <h2 className="text-2xl font-black font-display text-gray-900">{editingId ? 'Edit Listing' : 'Create New Listing'}</h2>
                    <button onClick={handleSave} disabled={saving || !form.name} className="text-orange-600 font-bold text-sm hover:text-white transition bg-orange-50 hover:bg-orange-600 px-6 py-3 rounded-xl border border-orange-100 active:scale-95 duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i> {saving ? 'Saving...' : 'Save & Submit'}
                    </button>
                </div>

                {/* Status Messages */}
                {successMsg && (
                    <div className="mx-6 md:mx-8 mt-6 p-4 rounded-2xl border flex items-start gap-4 bg-green-50 border-green-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                            <i className="fas fa-check-circle text-green-600 text-lg"></i>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-green-800">{successMsg}</p>
                        </div>
                    </div>
                )}
                {errorMsg && (
                    <div className="mx-6 md:mx-8 mt-6 p-4 rounded-2xl border flex items-start gap-4 bg-red-50 border-red-200 shadow-sm">
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                            <i className="fas fa-exclamation-circle text-red-600 text-lg"></i>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-red-800">{errorMsg}</p>
                        </div>
                    </div>
                )}
                
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Property Name *</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Bodh Gaya Serenity Stay" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Location *</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Near Mahabodhi Temple, Gaya" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Address</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="Full address" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Price / Night (₹)</label>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.price_per_night} onChange={e => handleChange('price_per_night', e.target.value)} placeholder="2500" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Max Guests</label>
                                <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold text-gray-800 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.max_guests} onChange={e => handleChange('max_guests', e.target.value)} placeholder="4" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Amenities</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                                {form.amenities.map(am => (
                                    <span key={am} onClick={() => removeAmenity(am)} className="bg-gray-100 border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-600 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition cursor-pointer group">
                                        {am}
                                        <i className="fas fa-times text-gray-400 group-hover:text-red-500"></i>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white outline-none transition" value={newAmenity} onChange={e => setNewAmenity(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())} placeholder="Add amenity..." />
                                <button onClick={addAmenity} className="text-xs text-orange-600 font-bold border-2 border-dashed border-orange-200 px-4 py-1.5 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition">+ Add</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">URL Slug</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-500 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="auto-generated-from-name" />
                            <p className="text-[10px] text-gray-400 mt-1">Auto-generated from name. Used in the public URL.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
