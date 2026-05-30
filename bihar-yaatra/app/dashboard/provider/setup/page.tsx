"use client";
import React, { useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { apiClient } from '@/lib/api-client';

export default function ProviderSetupPage() {
    const { user, refreshUser, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        aadharNumber: '',
        panNumber: '',
        businessRegistration: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!user) return null;

    if (user.provider_status === 'verified') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl mb-6">
                    <i className="fas fa-check-circle"></i>
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">You are Verified!</h1>
                <p className="text-gray-500 mb-8">Your provider account is fully verified and active.</p>
                <a href={`/dashboard/provider/${user.provider_type || 'homestay'}`} className="px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-orange-600 transition">
                    Go to Dashboard
                </a>
            </div>
        );
    }

    if (user.provider_status === 'pending_verification' || success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-4xl mb-6">
                    <i className="fas fa-clock"></i>
                </div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Verification Under Review</h1>
                <p className="text-gray-500 max-w-md mx-auto mb-8">We have received your legal documents. Our team is currently reviewing them. You will be notified once your account is live.</p>
                <button onClick={logout} className="text-sm font-bold text-gray-400 hover:text-gray-700">Logout</button>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await apiClient.post('/auth/provider-verify', { documents: formData });
            await refreshUser();
            setSuccess(true);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 text-2xl mx-auto mb-4">
                        <i className="fas fa-file-contract"></i>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Legal Verification</h1>
                    <p className="text-gray-500 font-medium">Please provide your details to get your {user.provider_type || 'provider'} account live.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Aadhar Number</label>
                        <input type="text" required maxLength={12} value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition font-medium placeholder-gray-400" placeholder="XXXX XXXX XXXX" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">PAN Number</label>
                        <input type="text" required maxLength={10} value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition font-medium placeholder-gray-400" placeholder="ABCDE1234F" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Business Registration / License ID</label>
                        <input type="text" value={formData.businessRegistration} onChange={e => setFormData({...formData, businessRegistration: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl outline-none focus:border-orange-500 transition font-medium placeholder-gray-400" placeholder="(Optional) Trade License, MSME, etc." />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-orange-600 transition flex justify-center items-center gap-2 shadow-lg shadow-gray-200">
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-check"></i> Submit for Verification</>}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={logout} className="text-sm font-bold text-gray-400 hover:text-gray-700">Cancel & Logout</button>
                </div>
            </div>
        </div>
    );
}
