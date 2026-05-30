"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await apiClient.put('/auth/me', {
                name: formData.name,
                phone: formData.phone
            });
            await refreshUser();
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 4000);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setErrorMsg(error.response?.data?.error || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Mask Aadhar (e.g. XXXX XXXX 1234) and PAN (e.g. XXXXX1234X)
    const maskAadhar = (aadhar: string) => {
        if (!aadhar) return 'N/A';
        const clean = aadhar.replace(/\s/g, '');
        if (clean.length < 4) return aadhar;
        return `XXXX XXXX ${clean.slice(-4)}`;
    };

    const maskPAN = (pan: string) => {
        if (!pan) return 'N/A';
        if (pan.length < 4) return pan;
        return `XXXXXX${pan.slice(-4)}`;
    };

    const getStatusConfig = (status?: string) => {
        switch (status) {
            case 'verified':
                return {
                    bg: 'bg-green-50 border-green-200 text-green-700',
                    icon: 'fa-check-circle',
                    label: 'Verified & Active'
                };
            case 'pending_verification':
                return {
                    bg: 'bg-blue-50 border-blue-200 text-blue-700',
                    icon: 'fa-clock',
                    label: 'Pending Verification'
                };
            case 'pending_setup':
            default:
                return {
                    bg: 'bg-amber-50 border-amber-200 text-amber-700',
                    icon: 'fa-exclamation-circle',
                    label: 'Pending Setup'
                };
        }
    };

    const statusConfig = getStatusConfig(user.provider_status);

    return (
        <div className="animate-fade-in space-y-6 pb-12">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight capitalize">Profile & Docs</h1>
                <p className="text-gray-500 mt-2 font-medium">Manage your host account profile and view verified documents.</p>
            </header>

            {successMsg && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm font-bold flex items-center gap-3 shadow-xs">
                    <i className="fas fa-check-circle text-green-600 text-lg animate-bounce"></i> {successMsg}
                </div>
            )}
            {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm font-bold flex items-center gap-3 shadow-xs">
                    <i className="fas fa-exclamation-circle text-red-600 text-lg"></i> {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information Form */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 md:p-10 shadow-xs space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                        <p className="text-sm text-gray-400 font-medium">Update your public name and contact number.</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition font-medium placeholder-gray-400"
                                    value={formData.name} 
                                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                    placeholder="Your Name" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Phone Number</label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition font-medium placeholder-gray-400"
                                    value={formData.phone} 
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                                    placeholder="Your Contact Number" 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Email Address</label>
                            <input 
                                type="email" 
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 text-gray-500 border border-gray-200 rounded-xl outline-none transition font-medium cursor-not-allowed"
                                value={formData.email} 
                                placeholder="email@example.com" 
                            />
                            <p className="text-[10px] text-gray-400 mt-1.5 font-medium">To change your email address, please contact support.</p>
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-black text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-orange-600 transition duration-200 active:scale-98 disabled:opacity-50"
                            >
                                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Verification Status & Legal Docs */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Verification Status</h3>
                        <div className={`p-4 rounded-2xl border flex items-center gap-3 ${statusConfig.bg}`}>
                            <i className={`fas ${statusConfig.icon} text-xl shrink-0`}></i>
                            <div>
                                <p className="font-bold text-sm leading-tight">{statusConfig.label}</p>
                                <p className="text-[10px] opacity-80 mt-0.5 font-medium">Provider Type: {user.provider_type || 'Homestay'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Legal Documents Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xs space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase">Verified Documents</h3>
                            <i className="fas fa-shield-alt text-orange-500" title="Securely stored"></i>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 text-xs shrink-0 mt-0.5">
                                    <i className="fas fa-id-card"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Aadhar Number</p>
                                    <p className="font-mono text-sm text-gray-800 font-bold mt-0.5">
                                        {maskAadhar(user.legal_documents?.aadharNumber)}
                                    </p>
                                </div>
                                <i className="fas fa-lock text-gray-300 text-xs mt-1" title="Encrypted and read-only"></i>
                            </div>

                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 text-xs shrink-0 mt-0.5">
                                    <i className="fas fa-credit-card"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">PAN Number</p>
                                    <p className="font-mono text-sm text-gray-800 font-bold mt-0.5">
                                        {maskPAN(user.legal_documents?.panNumber)}
                                    </p>
                                </div>
                                <i className="fas fa-lock text-gray-300 text-xs mt-1" title="Encrypted and read-only"></i>
                            </div>

                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 text-xs shrink-0 mt-0.5">
                                    <i className="fas fa-file-invoice"></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Business ID / License</p>
                                    <p className="text-sm text-gray-800 font-bold mt-0.5 truncate">
                                        {user.legal_documents?.businessRegistration || 'Not Provided'}
                                    </p>
                                </div>
                                <i className="fas fa-lock text-gray-300 text-xs mt-1" title="Encrypted and read-only"></i>
                            </div>
                        </div>

                        <div className="bg-orange-50/30 border border-orange-100 p-4 rounded-2xl">
                            <p className="text-[10px] text-orange-800 leading-relaxed font-medium">
                                <i className="fas fa-info-circle mr-1 text-orange-600"></i>
                                Your legal identity documents are encrypted and kept strictly confidential. For modifications or updating verified documents, please contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
