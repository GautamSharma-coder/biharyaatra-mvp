"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

import { apiClient } from '@/lib/api-client';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const onSubmit = async (data: ForgotPasswordValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiClient.post('/auth/forgot-password', { email: data.email });

            // Redirect to reset password page with email
            router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
        } catch (error) {
            const err = error as any;
            setError(err.response?.data?.error || err.message || 'Failed to request password reset');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center p-6 relative bg-gray-50 min-h-screen pt-24">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-lg w-full border border-gray-100 relative z-10 p-8 md:p-12">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                        <i className="fas fa-lock"></i>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="font-display text-3xl font-bold mb-2">Forgot Password?</h3>
                    <p className="text-gray-500 text-sm">
                        No worries! Enter your email address below and we'll send you a code to reset your password.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                        <input type="email" 
                               {...register('email')}
                               className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                               placeholder="name@example.com" />
                        {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <button type="submit" disabled={isLoading}
                            className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                            <>
                                <span>Send Reset Code</span>
                                <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/auth/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-arrow-left"></i>
                        Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
