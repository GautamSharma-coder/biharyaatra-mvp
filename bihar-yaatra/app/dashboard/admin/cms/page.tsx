"use client";
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function AdminCMSPage() {
    const [activeTab, setActiveTab] = useState<'packages' | 'destinations' | 'homestays'>('packages');
    const [items, setItems] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Record<string, any> | null>(null);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: string }>({ show: false, message: '', type: 'success' });

    // Form state
    const [form, setForm] = useState<Record<string, any>>({});

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const showToast = (message: string, type: string = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'packages' ? '/packages' : activeTab === 'destinations' ? '/destinations' : '/homestays';
            const res = await apiClient.get(endpoint);
            setItems(res.data || []);
        } catch (err) {
            console.error('Error fetching items:', err);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const openCreateModal = () => {
        setEditingItem(null);
        if (activeTab === 'packages') {
            setForm({ title: '', slug: '', duration_days: 3, duration_nights: 2, price_per_person: 0, cover_image_url: '', destination_ids: [], itinerary: [{ day: 1, title: '', description: '', meals: '' }], includes: [], excludes: [], max_group_size: 20, difficulty: 'easy', is_published: false });
        } else if (activeTab === 'destinations') {
            setForm({ name: '', slug: '', tagline: '', category: 'heritage', location: '', hero_image_url: '', highlights: [], best_time: '', is_published: false });
        } else {
            setForm({ name: '', slug: '', description: '', location: '', price_per_night: 0, max_guests: 4, amenities: [], cover_image_url: '', is_available: true });
        }
        setIsModalOpen(true);
    };

    const openEditModal = (item: Record<string, any>) => {
        setEditingItem(item);
        if (activeTab === 'packages') {
            setForm({
                title: item.title || '', slug: item.slug || '', duration_days: item.duration_days || 3,
                duration_nights: item.duration_nights || 2, price_per_person: item.price_per_person || 0,
                cover_image_url: item.cover_image_url || '', destination_ids: item.destination_ids || [],
                itinerary: item.itinerary || [{ day: 1, title: '', description: '', meals: '' }],
                includes: item.includes || [], excludes: item.excludes || [],
                max_group_size: item.max_group_size || 20, difficulty: item.difficulty || 'easy',
                is_published: item.is_published ?? false,
            });
        } else if (activeTab === 'destinations') {
            setForm({
                name: item.name || '', slug: item.slug || '', tagline: item.tagline || '',
                category: item.category || 'heritage', location: item.location || '',
                hero_image_url: item.hero_image_url || '', highlights: item.highlights || [],
                best_time: item.best_time || '', is_published: item.is_published ?? false,
            });
        } else {
            setForm({
                name: item.name || '', slug: item.slug || '', description: item.description || '',
                location: item.location || '', price_per_night: item.price_per_night || 0,
                max_guests: item.max_guests || 4, amenities: item.amenities || [],
                cover_image_url: item.cover_image_url || '', is_available: item.is_available ?? true,
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const endpoint = activeTab === 'packages' ? '/packages' : activeTab === 'destinations' ? '/destinations' : '/homestays';
            const payload = { ...form };

            // Auto-generate slug
            if (activeTab === 'packages' && !payload.slug && payload.title) payload.slug = generateSlug(payload.title);
            if (activeTab === 'destinations' && !payload.slug && payload.name) payload.slug = generateSlug(payload.name);
            if (activeTab === 'homestays' && !payload.slug && payload.name) payload.slug = generateSlug(payload.name);

            // Ensure numeric types
            if (activeTab === 'packages') {
                payload.duration_days = Number(payload.duration_days);
                payload.duration_nights = Number(payload.duration_nights);
                payload.price_per_person = Number(payload.price_per_person);
                payload.max_group_size = Number(payload.max_group_size);
            }
            if (activeTab === 'homestays') {
                payload.price_per_night = Number(payload.price_per_night);
                payload.max_guests = Number(payload.max_guests);
            }

            if (editingItem) {
                await apiClient.put(`${endpoint}/${editingItem.id}`, payload);
                showToast('Updated successfully!');
            } else {
                await apiClient.post(endpoint, payload);
                showToast('Created successfully!');
            }
            setIsModalOpen(false);
            await fetchItems();
        } catch (err: unknown) {
            console.error('Save error:', err);
            const error = err as { response?: { data?: { error?: string } } };
            showToast(error.response?.data?.error || 'Failed to save', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (item: Record<string, any>) => {
        if (!confirm(`Delete "${item.title || item.name}"? This cannot be undone.`)) return;
        try {
            const endpoint = activeTab === 'packages' ? '/packages' : activeTab === 'destinations' ? '/destinations' : '/homestays';
            await apiClient.delete(`${endpoint}/${item.id}`);
            showToast('Deleted successfully!', 'warn');
            await fetchItems();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            showToast(error.response?.data?.error || 'Failed to delete', 'error');
        }
    };

    const renderFormFields = () => {
        if (activeTab === 'packages') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title *</label>
                        <input type="text" value={form.title} onChange={e => setForm((p: Record<string, any>) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition text-sm" placeholder="e.g. Royal Bodh Gaya Tour" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration (Days)</label>
                        <input type="number" value={form.duration_days} onChange={e => setForm((p: Record<string, any>) => ({ ...p, duration_days: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration (Nights)</label>
                        <input type="number" value={form.duration_nights} onChange={e => setForm((p: Record<string, any>) => ({ ...p, duration_nights: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price / Person (₹)</label>
                        <input type="number" value={form.price_per_person} onChange={e => setForm((p: Record<string, any>) => ({ ...p, price_per_person: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Difficulty</label>
                        <select value={form.difficulty} onChange={e => setForm((p: Record<string, any>) => ({ ...p, difficulty: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm">
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="challenging">Challenging</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                        <input type="url" value={form.cover_image_url} onChange={e => setForm((p: Record<string, any>) => ({ ...p, cover_image_url: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={form.is_published} onChange={e => setForm((p: Record<string, any>) => ({ ...p, is_published: e.target.checked }))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                        <span className="text-sm font-bold text-gray-700">Published</span>
                    </div>
                </div>
            );
        }
        if (activeTab === 'destinations') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm((p: Record<string, any>) => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="e.g. Bodh Gaya" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category *</label>
                        <select value={form.category} onChange={e => setForm((p: Record<string, any>) => ({ ...p, category: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm">
                            <option value="heritage">Heritage</option>
                            <option value="spiritual">Spiritual</option>
                            <option value="nature">Nature</option>
                            <option value="cultural">Cultural</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location *</label>
                        <input type="text" value={form.location} onChange={e => setForm((p: Record<string, any>) => ({ ...p, location: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="e.g. Gaya, Bihar" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tagline</label>
                        <input type="text" value={form.tagline} onChange={e => setForm((p: Record<string, any>) => ({ ...p, tagline: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="A peaceful spiritual journey..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Best Time to Visit</label>
                        <input type="text" value={form.best_time} onChange={e => setForm((p: Record<string, any>) => ({ ...p, best_time: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="Oct — Mar" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hero Image URL</label>
                        <input type="url" value={form.hero_image_url} onChange={e => setForm((p: Record<string, any>) => ({ ...p, hero_image_url: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="https://..." />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={form.is_published} onChange={e => setForm((p: Record<string, any>) => ({ ...p, is_published: e.target.checked }))} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                        <span className="text-sm font-bold text-gray-700">Published</span>
                    </div>
                </div>
            );
        }
        // Homestays
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm((p: Record<string, any>) => ({ ...p, name: e.target.value, slug: generateSlug(e.target.value) }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="e.g. Bodh Gaya Heritage Home" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea rows={2} value={form.description} onChange={e => setForm((p: Record<string, any>) => ({ ...p, description: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="Describe the property..." />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                    <input type="text" value={form.location} onChange={e => setForm((p: Record<string, any>) => ({ ...p, location: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="e.g. Bodh Gaya" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price / Night (₹)</label>
                    <input type="number" value={form.price_per_night} onChange={e => setForm((p: Record<string, any>) => ({ ...p, price_per_night: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Guests</label>
                    <input type="number" value={form.max_guests} onChange={e => setForm((p: Record<string, any>) => ({ ...p, max_guests: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                    <input type="url" value={form.cover_image_url} onChange={e => setForm((p: Record<string, any>) => ({ ...p, cover_image_url: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 outline-none transition text-sm" placeholder="https://..." />
                </div>
            </div>
        );
    };

    return (
        <>
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 md:px-8 shrink-0">
                <div className="flex gap-6 h-full">
                    {(['packages', 'destinations', 'homestays'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`font-bold h-full border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
                <button onClick={openCreateModal} className="bg-black hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md flex items-center gap-2">
                    <i className="fas fa-plus"></i>
                    <span className="capitalize">Add {activeTab.slice(0, -1)}</span>
                </button>
            </header>

            <div className="flex-1 overflow-auto p-6 md:p-8 custom-scroll">
                {loading ? (
                    <div className="flex items-center justify-center h-48"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>
                ) : items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                        <p className="text-gray-400 font-medium">No {activeTab} found. Click &quot;Add&quot; to create one.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 group relative">
                                <div className="h-48 overflow-hidden bg-gray-100 relative">
                                    {(item.cover_image_url || item.hero_image_url) ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.cover_image_url || item.hero_image_url} className="w-full h-full object-cover" alt={item.title || item.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-400">
                                            <i className="fas fa-image text-4xl"></i>
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEditModal(item)} className="w-8 h-8 rounded-full bg-white text-blue-600 shadow-md flex items-center justify-center hover:bg-blue-50">
                                            <i className="fas fa-pencil-alt text-xs"></i>
                                        </button>
                                        <button onClick={() => handleDelete(item)} className="w-8 h-8 rounded-full bg-white text-red-500 shadow-md flex items-center justify-center hover:bg-red-50">
                                            <i className="fas fa-trash text-xs"></i>
                                        </button>
                                    </div>
                                    {/* Published badge */}
                                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                        (item.is_published || item.is_available) ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                        {(item.is_published || item.is_available) ? 'Published' : 'Draft'}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight truncate pr-2">{item.title || item.name}</h3>
                                        {(item.price_per_person || item.price_per_night) && (
                                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-md shrink-0">
                                                ₹{(item.price_per_person || item.price_per_night || 0).toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.tagline || item.description || 'No description'}</p>
                                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium flex-wrap">
                                        {item.category && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>}
                                        {item.location && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.location}</span>}
                                        {item.duration_days && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.duration_days}D/{item.duration_nights}N</span>}
                                        {item.difficulty && <span className="bg-gray-100 px-2 py-0.5 rounded">{item.difficulty}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg capitalize">{editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scroll">
                            {renderFormFields()}
                            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                <button onClick={handleSave} disabled={saving}
                                    className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-200 max-w-sm animate-in slide-in-from-right duration-300">
                    <div className={`flex items-center gap-3 p-4 rounded-2xl border shadow-2xl ${
                        toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                        toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                        <i className={`${toast.type === 'success' ? 'fas fa-check-circle text-green-500' : toast.type === 'error' ? 'fas fa-times-circle text-red-500' : 'fas fa-exclamation-triangle text-amber-500'}`}></i>
                        <p className="text-sm font-bold">{toast.message}</p>
                    </div>
                </div>
            )}
        </>
    );
}
