"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic admin check (client-side simulation)
        if (!email.includes('admin') && !email.includes('biharyaatra')) {
            setError('Access Denied: Unauthorized Email.');
            setLoading(false);
            return;
        }

        try {
            // Simulate login delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/dashboard/admin');
        } catch {
            setError('Invalid Admin ID or Password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gray-100">
            {/* Background map */}
            <div className="absolute inset-0 z-0 opacity-10">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Map_of_Bihar.jpg"
                    className="w-full h-full object-cover grayscale"
                    alt="Bihar Map"
                />
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <i className="fas fa-shield-alt text-orange-600 text-3xl"></i>
                        <span className="font-display font-bold text-2xl tracking-tighter text-gray-900">
                            Bihar<span className="text-orange-500">Yaatra</span>
                        </span>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                        Admin Control Panel
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold animate-in fade-in duration-300">
                        <i className="fas fa-exclamation-circle mt-0.5"></i>
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Admin ID</label>
                            <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-orange-500 transition group">
                                <i className="fas fa-user-shield text-gray-400 mr-3 group-focus-within:text-orange-500"></i>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@biharyaatra.com"
                                    className="w-full bg-transparent border-none outline-none font-bold text-gray-900 placeholder-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                            <div className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-200 focus-within:border-orange-500 transition group">
                                <i className="fas fa-lock text-gray-400 mr-3 group-focus-within:text-orange-500"></i>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-none outline-none font-bold text-gray-900 placeholder-gray-300"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="accent-orange-600 h-4 w-4"
                                />
                                <span className="text-gray-600 font-medium">Remember me</span>
                            </label>
                            <button type="button" className="text-orange-600 font-bold hover:underline">
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <i className="fas fa-circle-notch fa-spin"></i>
                            ) : (
                                <>
                                    <span>Secure Login</span>
                                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-400 font-medium">Restricted Access. IP Logged.</p>
                    <p className="text-[10px] text-gray-300 mt-1">Demo: admin@biharyaatra.com / admin123</p>
                </div>
            </div>
        </div>
    );
}
