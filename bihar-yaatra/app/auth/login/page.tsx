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
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(
        searchParams.get('registered') ? 'Registration successful! Please login.' : null
    );

    const [activeTab, setActiveTab] = useState<'login' | 'phone'>('login');
    const [currentFact, setCurrentFact] = useState(0);
    const [showPass, setShowPass] = useState(false);
    
    // Phone Auth State
    const [phoneStep, setPhoneStep] = useState(1);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFact((prev) => (prev + 1) % FACTS.length);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            await login(data);
            // Redirect is handled in AuthProvider context
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setPhoneStep(2);
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        router.push('/dashboard/user');
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
                        <img src="/assets/images/Lumbini.jpg"
                             className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] hover:scale-110"
                             onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1598556776374-0f5f78165537?q=80&w=1965&auto=format&fit=crop' }}
                             alt="Lumbini" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

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
                    
                    <div className="flex justify-center mb-8 bg-gray-50 p-1 rounded-full w-fit mx-auto border border-gray-100">
                        <button onClick={() => { setActiveTab('login'); setPhoneStep(1); }}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'login' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                            Login
                        </button>
                        <button onClick={() => setActiveTab('phone')}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeTab === 'phone' ? 'bg-white shadow-md text-black' : 'text-gray-400 hover:text-gray-600'}`}>
                            Phone
                        </button>
                        <Link href="/auth/register"
                                className="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 text-gray-400 hover:text-gray-600">
                            Sign Up
                        </Link>
                    </div>

                    {activeTab === 'login' && (
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
                                        <button type="button" className="text-xs text-orange-600 font-bold hover:underline">Forgot Password?</button>
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
                    )}

                    {activeTab === 'phone' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="text-center mb-6">
                                <h3 className="font-display text-3xl font-bold mb-2">Phone Login</h3>
                                <p className="text-gray-500 text-sm">
                                    {phoneStep === 1 ? 'Enter your mobile number to get OTP.' : 'Enter the code sent to your phone.'}
                                </p>
                            </div>

                            {phoneStep === 1 && (
                                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Mobile Number</label>
                                        <div className="flex gap-2">
                                            <div className="p-4 bg-gray-100 rounded-2xl font-bold text-gray-600 select-none">+91</div>
                                            <input type="tel" required pattern="[0-9]{10}" maxLength={10}
                                                   value={phone} onChange={(e) => setPhone(e.target.value)}
                                                   className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none transition font-medium tracking-wide"
                                                   placeholder="98765 43210" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                            className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                                        {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                                            <>
                                                <span>Get OTP</span>
                                                <i className="fas fa-paper-plane group-hover:translate-x-1 transition-transform"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {phoneStep === 2 && (
                                <form onSubmit={handleOtpSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Verification Code</label>
                                        <input type="text" maxLength={6}
                                               value={otp} onChange={(e) => setOtp(e.target.value)}
                                               className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none transition text-center text-2xl tracking-[0.5em] font-bold"
                                               placeholder="------" />
                                    </div>

                                    <button type="submit" disabled={isLoading}
                                            className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg hover:bg-green-700 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                                        {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                                            <>
                                                <span>Verify & Login</span>
                                                <i className="fas fa-check-circle"></i>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center mt-4">
                                        <button type="button" onClick={() => setPhoneStep(1)}
                                                className="text-xs text-gray-500 hover:text-black font-bold">
                                            Change Number?
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

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
