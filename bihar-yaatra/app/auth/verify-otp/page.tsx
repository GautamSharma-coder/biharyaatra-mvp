"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyOtpPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) return;

        setIsLoading(true);
        // Simulate API Verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);

        // Success -> Move to onboarding
        router.push('/onboarding');
    };

    return (
        <div className="flex w-full min-h-screen">
            <div className="w-full flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-[2rem] shadow-xl border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        <i className="fas fa-shield-alt"></i>
                    </div>
                    
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Verify Your Email</h1>
                    <p className="text-gray-500 mt-2 font-medium mb-8">
                        We've sent a 6-digit verification code to your email address. Please enter it below.
                    </p>

                    <div className="flex justify-center gap-2 md:gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all bg-white"
                            />
                        ))}
                    </div>

                    <button 
                        onClick={handleVerify}
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-95 flex justify-center items-center"
                    >
                        {isLoading ? <i className="fas fa-spinner fa-spin text-xl"></i> : "Verify Account"}
                    </button>

                    <p className="text-center text-sm text-gray-500 font-medium mt-6">
                        Didn't receive the code? <button className="text-orange-600 font-bold hover:text-orange-700 transition-colors">Resend OTP</button>
                    </p>
                </div>
            </div>
        </div>
    );
}
