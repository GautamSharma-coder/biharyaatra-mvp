"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

// Zod schema for Login
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

const FACTS = [
    { title: "Bodh Gaya", desc: "The place where Prince Siddhartha attained enlightenment and became the Buddha. A UNESCO World Heritage site." },
    { title: "Nalanda University", desc: "Once the center of learning for the world, hosting over 10,000 students from across Asia in the 5th century." },
    { title: "Sher Shah Suri", desc: "The ruler from Bihar who defeated the Mughals and built the Grand Trunk Road, connecting East to West." }
];

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(() => {
        if (searchParams.get('verified')) {
            return 'Email verified successfully! You can now log in with your credentials.';
        }
        if (searchParams.get('verify')) {
            return 'Registration successful! Please check your email for the verification code.';
        }
        return searchParams.get('registered') ? 'Registration successful! Please login.' : null;
    });

    const [currentFact, setCurrentFact] = useState(0);
    const [showPass, setShowPass] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % FACTS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'admin' || user.role === 'superadmin') {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard/user');
            }
        }
    }, [user, loading, router]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);
        try {
            await login(data);
            // Redirect is handled in AuthProvider context
        } catch (err: unknown) {
            const errorMsg = typeof err === 'string' ? err : (err instanceof Error ? err.message : 'Login failed');
            if (typeof errorMsg === 'string' && (errorMsg.includes('verification code') || errorMsg.includes('not verified'))) {
                setSuccessMsg(errorMsg);
                setError(null);
            } else {
                setError(errorMsg);
            }
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

            <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 min-h-[650px] border border-gray-100 relative z-10">
                
                {/* Left Carousel Column */}
                <div className="relative hidden md:flex flex-col justify-end p-12 text-white bg-gray-900 overflow-hidden group">
                    <div className="absolute inset-0">
                        <img src="https://images.unsplash.com/photo-1598556776374-0f5f78165537?q=80&w=1965&auto=format&fit=crop"
                             className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-110"
                             alt="Lumbini" />
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

                    <div className="relative z-10 min-h-[140px]">
                        {FACTS.map((fact, index) => (
                            <div key={index} 
                                 className={`absolute bottom-0 w-full transition-all duration-700 ease-in-out ${currentFact === index ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-4 absolute pointer-events-none'}`}>
                                <div className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md rounded-full border border-white/10 text-orange-300">
                                    Did You Know?
                                </div>
                                <h2 className="text-3xl font-display font-bold mb-3">{fact.title}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed">{fact.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="relative z-10 flex gap-2 mt-6">
                        {FACTS.map((_, index) => (
                            <button key={index} 
                                    onClick={() => setCurrentFact(index)} 
                                    className={`h-1 rounded-full transition-all duration-300 ${currentFact === index ? 'w-8 bg-orange-500' : 'w-2 bg-white/30 hover:bg-white'}`}>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Form Column */}
                <div className="p-8 md:p-12 flex flex-col justify-center relative bg-white">

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center mb-6">
                            <h3 className="font-display text-3xl font-bold mb-2">Login to Account</h3>
                            <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        {successMsg && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                                <i className="fas fa-check-circle mr-2"></i>
                                {successMsg}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                                <input type="email" 
                                       {...register('email')}
                                       className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                       placeholder="name@example.com" />
                                {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'} 
                                           {...register('password')}
                                           className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                           placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs font-bold text-red-500 mt-1">{errors.password.message}</p>}
                                <div className="flex justify-between items-center mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="accent-orange-500 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                        <span className="text-xs text-gray-500 font-medium">Remember me</span>
                                    </label>
                                    <Link href="/auth/forgot-password" className="text-xs text-orange-600 font-bold hover:underline">Forgot Password?</Link>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading}
                                    className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                                {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                                    <>
                                        <span>Sign In</span>
                                        <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-medium text-sm">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            <span>Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-medium opacity-50 cursor-not-allowed text-sm" title="Coming Soon">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Don&apos;t have an account? <Link href="/auth/register" className="text-orange-600 font-bold hover:underline">Sign up</Link>
                    </div>

                </div>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen"><i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i></div>}>
            <LoginPageContent />
        </Suspense>
    );
}
