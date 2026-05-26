"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';

export default function UserProfilePage() {
    const { user, refreshUser } = useAuth();
    const [saving, setSaving] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Bihar, India');
    const [bio, setBio] = useState('Explorer of history and culture.');
    const [avatar, setAvatar] = useState('');
    const [preferences, setPreferences] = useState<string[]>(['Heritage', 'Food']);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAvatar(user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Traveler')}&background=FF7D29&color=fff`);
        }
    }, [user]);

    const tripsCount = 4;
    const bookingsCount = 2;

    const togglePref = (pref: string) => {
        setPreferences(prev => prev.includes(pref)
            ? prev.filter(p => p !== pref)
            : [...prev, pref]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiClient.put('/auth/me', {
                name,
                phone,
                avatar_url: avatar
            });
            await refreshUser();
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to save profile details.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-display font-black text-gray-900 mb-2">Profile Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col - Avatar & Stats */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 h-fit text-center relative overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                     <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-400 to-pink-500"></div>
                     <div className="relative w-32 h-32 mx-auto mt-4 mb-4 group/avatar cursor-pointer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={avatar} alt="Avatar" className="w-full h-full rounded-full border-4 border-white shadow-xl object-cover bg-white" />
                        <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                            <i className="fas fa-camera text-2xl"></i>
                        </div>
                    </div>
                    <h3 className="font-black font-display text-2xl text-gray-900 mt-2">{name}</h3>
                    <p className="text-gray-500 font-medium mb-8">{email}</p>
                    
                    <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                        <div>
                            <div className="text-3xl font-black font-display text-orange-500">{tripsCount}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Trips</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black font-display text-blue-500">{bookingsCount}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Bookings</div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Form */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                        <div>
                            <h3 className="font-display font-black text-2xl text-gray-900">Personal Details</h3>
                            <p className="text-sm text-gray-400 font-medium mt-1">Update your personal information and preferences.</p>
                        </div>
                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-orange-500 transition-colors shadow-lg hover:shadow-orange-500/20 disabled:opacity-70 flex items-center gap-2"
                        >
                            {!saving ? (
                                <>Save Changes <i className="fas fa-check text-xs"></i></>
                            ) : (
                                <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                            )}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Location</label>
                            <input 
                                type="text" 
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone</label>
                            <input 
                                type="text" 
                                placeholder="+91" 
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Bio</label>
                            <input 
                                type="text" 
                                placeholder="Digital Nomad..." 
                                value={bio}
                                onChange={e => setBio(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 font-bold text-gray-900 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all" 
                            />
                        </div>
                    </div>

                    <h3 className="font-display font-black text-xl text-gray-900 mb-4">Travel Preferences</h3>
                    <div className="flex flex-wrap gap-3">
                        {['Spiritual', 'Nature', 'Heritage', 'Food', 'Luxury', 'Adventure'].map(pref => {
                            const isSelected = preferences.includes(pref);
                            return (
                                <button 
                                    key={pref}
                                    onClick={() => togglePref(pref)} 
                                    className={`px-5 py-2.5 rounded-[1rem] border text-sm font-bold transition-all duration-300 shadow-sm ${
                                        isSelected 
                                        ? 'bg-orange-50 border-orange-500 text-orange-600 shadow-orange-500/10' 
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {pref} {isSelected && <i className="fas fa-check ml-1"></i>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
