"use client";
import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function GuideProfilePage() {
    const { user } = useAuth();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        bio: '',
        location: '',
        languages: [] as string[],
        skills: [] as string[],
        price_per_day: '',
        is_available: true,
    });
    const [newLanguage, setNewLanguage] = useState('');
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        if (!user) return;
        fetchProfiles();
    }, [user]);

    const fetchProfiles = async () => {
        try {
            const res = await apiClient.get('/guides/my/listings');
            setProfiles(res.data || []);
            // Auto-load the first profile into the form for editing
            if (res.data && res.data.length > 0) {
                startEdit(res.data[0]);
            }
        } catch (err) {
            console.error('Error fetching guide profiles:', err);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleChange = (field: string, value: any) => {
        setForm(prev => {
            const updated = { ...prev, [field]: value };
            if (field === 'name') {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };

    const addLanguage = () => {
        if (newLanguage.trim() && !form.languages.includes(newLanguage.trim())) {
            setForm(prev => ({ ...prev, languages: [...prev.languages, newLanguage.trim()] }));
            setNewLanguage('');
        }
    };
    const removeLanguage = (l: string) => {
        setForm(prev => ({ ...prev, languages: prev.languages.filter(x => x !== l) }));
    };

    const addSkill = () => {
        if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
            setForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };
    const removeSkill = (s: string) => {
        setForm(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
    };

    const startEdit = (profile: any) => {
        setEditingId(profile.id);
        setForm({
            name: profile.name || '',
            slug: profile.slug || '',
            bio: profile.bio || '',
            location: profile.location || '',
            languages: profile.languages || [],
            skills: profile.skills || [],
            price_per_day: profile.price_per_day?.toString() || '',
            is_available: profile.is_available ?? true,
        });
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
                bio: form.bio,
                location: form.location,
                languages: form.languages,
                skills: form.skills,
                price_per_day: parseFloat(form.price_per_day) || 0,
                is_available: form.is_available,
            };

            if (editingId) {
                await apiClient.put(`/guides/${editingId}`, payload);
                setSuccessMsg('Guide profile updated successfully!');
            } else {
                await apiClient.post('/guides', payload);
                setSuccessMsg('Guide profile created successfully!');
            }
            await fetchProfiles();
        } catch (err: any) {
            setErrorMsg(err.response?.data?.error || 'Failed to save profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in space-y-6 flex items-center justify-center min-h-[50vh]">
                <i className="fas fa-spinner fa-spin text-3xl text-orange-500"></i>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-6 pb-10">
            <header className="mb-4">
                <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Guide Profile</h1>
                <p className="text-gray-500 mt-2 font-medium">{editingId ? 'Edit your public guide profile' : 'Create your guide profile to start receiving tour bookings'}</p>
            </header>

            <div className="bg-white rounded-4xl border border-gray-100 p-8 md:p-10 shadow-sm">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Display Name *</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Rajesh Kumar" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Location *</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Bodh Gaya, Bihar" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Price per Day (₹)</label>
                            <input type="number" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm font-bold focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.price_per_day} onChange={e => handleChange('price_per_day', e.target.value)} placeholder="2000" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Bio</label>
                            <textarea className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm h-28 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-50 outline-none transition" value={form.bio} onChange={e => handleChange('bio', e.target.value)} placeholder="Describe your experience, specialties, and what makes your tours special..."></textarea>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Languages</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                                {form.languages.map(l => (
                                    <span key={l} onClick={() => removeLanguage(l)} className="bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition cursor-pointer group">
                                        {l} <i className="fas fa-times text-blue-300 group-hover:text-red-500"></i>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addLanguage())} placeholder="e.g. Hindi, English..." />
                                <button onClick={addLanguage} className="text-xs text-blue-600 font-bold border-2 border-dashed border-blue-200 px-4 rounded-xl hover:bg-blue-50 transition">+ Add</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">Skills / Specialties</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                                {form.skills.map(s => (
                                    <span key={s} onClick={() => removeSkill(s)} className="bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-600 flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition cursor-pointer group">
                                        {s} <i className="fas fa-times text-purple-300 group-hover:text-red-500"></i>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input type="text" className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:border-orange-500 outline-none transition" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} placeholder="e.g. Buddhist History, Meditation..." />
                                <button onClick={addSkill} className="text-xs text-purple-600 font-bold border-2 border-dashed border-purple-200 px-4 rounded-xl hover:bg-purple-50 transition">+ Add</button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">URL Slug</label>
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-500 focus:border-orange-500 focus:bg-white outline-none transition" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="auto-generated" />
                        </div>

                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={form.is_available} onChange={e => handleChange('is_available', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            </label>
                            <span className="text-sm font-bold text-gray-700">Available for bookings</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                    <button onClick={handleSave} disabled={saving || !form.name} className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-600 transition active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i> {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}
