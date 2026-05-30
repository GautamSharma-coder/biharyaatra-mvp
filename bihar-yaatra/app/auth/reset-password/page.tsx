"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

import { apiClient } from '@/lib/api-client';

const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Verification code must be exactly 6 digits'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { user, loading } = useAuth();
    
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin' || user.role === 'superadmin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/user');
            }
        }
    }, [user, loading, router]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema)
    });

    // If no email is provided in the URL, prompt the user.
    if (!email) {
        return (
            <main className="flex-1 flex items-center justify-center p-6 relative bg-gray-50 min-h-screen pt-24">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 text-center max-w-lg w-full">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner mx-auto mb-6">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4">Missing Information</h3>
                    <p className="text-gray-500 mb-8">We couldn&apos;t find an email address to reset the password for. Please start the process again.</p>
                    <Link href="/auth/forgot-password"
                          className="w-full inline-block py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 transition-all duration-300">
                        Back to Forgot Password
                    </Link>
                </div>
            </main>
        );
    }

    const onSubmit = async (data: ResetPasswordValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiClient.post('/auth/reset-password', {
                email, 
                otp: data.otp, 
                newPassword: data.newPassword 
            });

            // Redirect to login page with success message
            router.push('/auth/login?verified=true'); // we can reuse verified or use a custom message if needed, but verified works nicely as a green toast.
        } catch (error: unknown) {
            const err = error as { response?: { data?: { error?: string } }; message?: string };
            setError(err.response?.data?.error || err.message || 'Failed to reset password');
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
                        <i className="fas fa-key"></i>
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h3 className="font-display text-3xl font-bold mb-2">Reset Password</h3>
                    <p className="text-gray-500 text-sm">
                        Enter the 6-digit code sent to <span className="font-bold text-gray-800">{email}</span> and your new password.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Verification Code</label>
                        <input type="text" 
                               {...register('otp')}
                               maxLength={6}
                               className={`w-full p-4 bg-gray-50 rounded-2xl border text-center tracking-[0.5em] font-bold text-lg ${errors.otp ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                               placeholder="------" />
                        {errors.otp && <p className="text-xs font-bold text-red-500 mt-1">{errors.otp.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">New Password</label>
                        <div className="relative">
                            <input type={showPass ? 'text' : 'password'} 
                                   {...register('newPassword')}
                                   className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                   placeholder="••••••••" />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.newPassword && <p className="text-xs font-bold text-red-500 mt-1">{errors.newPassword.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Confirm New Password</label>
                        <div className="relative">
                            <input type={showConfirmPass ? 'text' : 'password'} 
                                   {...register('confirmPassword')}
                                   className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                   placeholder="••••••••" />
                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <i className={`fas ${showConfirmPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-xs font-bold text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button type="submit" disabled={isLoading}
                            className="w-full py-4 mt-2 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                        {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                            <>
                                <span>Reset Password</span>
                                <i className="fas fa-check-circle group-hover:scale-110 transition-transform"></i>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/auth/login" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-arrow-left"></i>
                        Cancel and back to login
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
            <ResetPasswordPageContent />
        </Suspense>
    );
}
