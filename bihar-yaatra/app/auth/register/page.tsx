"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { GoogleLogin } from '@react-oauth/google';

// Zod schema for Registration
const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().regex(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'Must be a valid Indian phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const FACTS = [
    { title: "Nalanda University", desc: "Once the center of learning for the world, hosting over 10,000 students from across Asia in the 5th century." },
    { title: "Bodh Gaya", desc: "The place where Prince Siddhartha attained enlightenment and became the Buddha. A UNESCO World Heritage site." },
    { title: "Sher Shah Suri", desc: "The ruler from Bihar who defeated the Mughals and built the Grand Trunk Road, connecting East to West." }
];

export default function RegisterPage() {
    const router = useRouter();
    const { register: authRegister, loginWithGoogle, user, loading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentFact, setCurrentFact] = useState(0);
    const [showPass, setShowPass] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [selectedRole, setSelectedRole] = useState<'traveller' | 'provider'>('traveller');
    const [providerType, setProviderType] = useState('homestay');

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const watchPassword = watch('password', '');

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

    useEffect(() => {
        // Evaluate password strength
        const val = watchPassword || '';
        let score = 0;
        if (val.length > 5) score++;
        if (val.length > 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;

        if (val.length < 1) score = 0;
        else if (score > 4) score = 4;
        
        setPasswordStrength(score);
    }, [watchPassword]);

    const getStrengthText = () => {
        const texts = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
        return texts[passwordStrength] || 'Too short';
    };

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);
        try {
            // Map fullName to name for backend, include selected role and provider type
            const { fullName, ...rest } = data;
            await authRegister({ name: fullName, ...rest, role: selectedRole, provider_type: selectedRole === 'provider' ? providerType : undefined });
        } catch (err: any) {
            setError(err);
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
                             alt="Nalanda" />
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
                <div className="p-8 md:p-12 flex flex-col justify-center relative bg-white overflow-y-auto custom-scroll max-h-[85vh] md:max-h-none">

                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 grow">
                        <div className="text-center mb-6">
                            <h3 className="font-display text-3xl font-bold mb-2">Create Account</h3>
                            <p className="text-gray-500 text-sm">Join as a traveller or become a partner.</p>
                        </div>

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button type="button" onClick={() => setSelectedRole('traveller')}
                                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                                    selectedRole === 'traveller'
                                        ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/10'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                                }`}>
                                {selectedRole === 'traveller' && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                        <i className="fas fa-check text-white text-[10px]"></i>
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2.5 transition-colors ${
                                    selectedRole === 'traveller' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                }`}>
                                    <i className="fas fa-suitcase-rolling"></i>
                                </div>
                                <p className={`font-bold text-sm ${selectedRole === 'traveller' ? 'text-orange-800' : 'text-gray-700'}`}>Traveller</p>
                                <p className={`text-[11px] mt-0.5 ${selectedRole === 'traveller' ? 'text-orange-600' : 'text-gray-400'}`}>Explore & book trips</p>
                            </button>
                            <button type="button" onClick={() => setSelectedRole('provider')}
                                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group ${
                                    selectedRole === 'provider'
                                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                                        : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                                }`}>
                                {selectedRole === 'provider' && (
                                    <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                        <i className="fas fa-check text-white text-[10px]"></i>
                                    </div>
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-2.5 transition-colors ${
                                    selectedRole === 'provider' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                }`}>
                                    <i className="fas fa-handshake"></i>
                                </div>
                                <p className={`font-bold text-sm ${selectedRole === 'provider' ? 'text-blue-800' : 'text-gray-700'}`}>Partner</p>
                                <p className={`text-[11px] mt-0.5 ${selectedRole === 'provider' ? 'text-blue-600' : 'text-gray-400'}`}>List homestays, transport & guides</p>
                            </button>
                        </div>

                        {selectedRole === 'provider' && (
                            <div className="mb-6 animate-fade-in">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">What will you offer?</label>
                                <select 
                                    value={providerType}
                                    onChange={(e) => setProviderType(e.target.value)}
                                    className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition font-bold text-gray-700 cursor-pointer"
                                >
                                    <option value="homestay">Homestay & Accommodation</option>
                                    <option value="guide">Local Tour Guide</option>
                                    <option value="transport">Transport & Vehicles</option>
                                </select>
                            </div>
                        )}

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                                <i className="fas fa-exclamation-circle mr-2"></i>
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Full Name</label>
                                <input type="text" 
                                       {...register('fullName')}
                                       className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                       placeholder="John Doe" />
                                {errors.fullName && <p className="text-xs font-bold text-red-500 mt-1">{errors.fullName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Email Address</label>
                                <input type="email" 
                                       {...register('email')}
                                       className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                       placeholder="name@example.com" />
                                {errors.email && <p className="text-xs font-bold text-red-500 mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Phone Number <span className="text-gray-300 normal-case font-medium">(Optional)</span></label>
                                <input type="tel" 
                                       {...register('phone')}
                                       className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition font-medium`}
                                       placeholder="+91 9876543210 (optional)" />
                                {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
                                <div className="relative">
                                    <input type={showPass ? 'text' : 'password'} 
                                           {...register('password')}
                                           className={`w-full p-4 bg-gray-50 rounded-2xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-transparent focus:ring-orange-500'} focus:ring-2 outline-none transition`}
                                           placeholder="Create a strong password" />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                                
                                <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-300 ${
                                         passwordStrength === 1 ? 'bg-red-500 w-1/4' :
                                         passwordStrength === 2 ? 'bg-yellow-500 w-2/4' :
                                         passwordStrength === 3 ? 'bg-blue-500 w-3/4' :
                                         passwordStrength === 4 ? 'bg-green-500 w-full' : 'w-0'
                                    }`}></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    {errors.password ? (
                                        <p className="text-xs font-bold text-red-500">{errors.password.message}</p>
                                    ) : <div></div>}
                                    <p className="text-[10px] text-gray-400 font-medium">{getStrengthText()}</p>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading}
                                    className="w-full py-4 mt-2 bg-black text-white font-bold rounded-2xl shadow-lg hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group">
                                {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : (
                                    <>
                                        <span>Create Account</span>
                                        <i className="fas fa-user-plus group-hover:scale-110 transition-transform"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="relative my-6 shrink-0">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or continue with</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 shrink-0">
                        <div className="flex items-center justify-center h-[46px] overflow-hidden rounded-xl border border-gray-200">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    if (credentialResponse.credential) {
                                        setIsLoading(true);
                                        loginWithGoogle(credentialResponse.credential, selectedRole).catch(err => {
                                            setError(typeof err === 'string' ? err : 'Google login failed');
                                            setIsLoading(false);
                                        });
                                    }
                                }}
                                onError={() => {
                                    setError('Google login failed. Please try again.');
                                }}
                                useOneTap
                                type="standard"
                                theme="outline"
                                size="large"
                                text="signup_with"
                                shape="rectangular"
                            />
                        </div>
                        <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition font-medium opacity-50 cursor-not-allowed text-sm" title="Coming Soon">
                            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
                            <span>Facebook</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-gray-500 font-medium shrink-0">
                        Already have an account? <Link href="/auth/login" className="text-orange-600 font-bold hover:underline">Log in</Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
