"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

const roles = [
    { id: 'traveller', label: 'Traveller', icon: 'fas fa-suitcase-rolling', desc: 'Explore and book trips.' },
    { id: 'homestay', label: 'Homestay Host', icon: 'fas fa-home', desc: 'List your property.' },
    { id: 'guide', label: 'Tour Guide', icon: 'fas fa-map-marked-alt', desc: 'Manage your tours.' },
    { id: 'transport', label: 'Transport Operator', icon: 'fas fa-car', desc: 'Manage fleet.' }
] as const;

const onboardingSchema = z.object({
  role: z.enum(['traveller', 'homestay', 'guide', 'transport'], { message: 'Please select a profile type' }),
  location: z.string().min(2, 'City/Location is required')
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<OnboardingValues>({
        resolver: zodResolver(onboardingSchema)
    });

    const selectedRole = watch('role');

    const onSubmit = async (data: OnboardingValues) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        console.log('Onboarding data:', data);

        // Map role to correct dashboard
        if (data.role === 'traveller') router.push('/dashboard/user');
        else router.push(`/dashboard/provider/${data.role}`);
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="w-full max-w-2xl mx-auto p-8 pt-32 lg:pt-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Complete Your Profile</h1>
                    <p className="text-gray-500 mt-2 font-medium">How will you be using BiharYaatra?</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Role Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-700">Select Account Type</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roles.map(role => (
                                <div 
                                    key={role.id}
                                    onClick={() => setValue('role', role.id, { shouldValidate: true })}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedRole === role.id ? 'border-orange-500 bg-orange-50 shadow-md shadow-orange-100' : 'border-gray-100 bg-white hover:border-orange-200'}`}
                                >
                                    {selectedRole === role.id && (
                                        <div className="absolute top-4 right-4 text-orange-500">
                                            <i className="fas fa-check-circle text-xl"></i>
                                        </div>
                                    )}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl transition-colors ${selectedRole === role.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        <i className={role.icon}></i>
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">{role.label}</h3>
                                    <p className="text-sm text-gray-500 font-medium mt-1">{role.desc}</p>
                                </div>
                            ))}
                        </div>
                        {errors.role && <p className="text-xs font-bold text-red-500 mt-2">{errors.role.message}</p>}
                    </div>

                    {/* Location Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Your Base Location</label>
                        <input 
                            type="text" 
                            {...register('location')}
                            placeholder="e.g., Patna, Bodh Gaya"
                            className={`w-full px-4 py-3 rounded-2xl bg-gray-50 border ${errors.location ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500'} transition-all focus:ring-2 focus:ring-opacity-20 outline-none`}
                        />
                        {errors.location && <p className="text-xs font-bold text-red-500">{errors.location.message}</p>}
                    </div>

                    {/* Submit */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all active:scale-95 flex justify-center items-center shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : "Finish Setup & Jump In"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
