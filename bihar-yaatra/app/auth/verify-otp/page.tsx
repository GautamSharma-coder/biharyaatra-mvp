"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

function VerifyOtpContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { sendEmailOtp, verifyEmailOtp } = useAuth();
    
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect to register if no email is provided
    useEffect(() => {
        if (!email) {
            router.push('/auth/register');
        }
    }, [email, router]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

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

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pastedData[i] || '';
            }
            setOtp(newOtp);
            // Focus the appropriate input
            const focusIndex = Math.min(pastedData.length, 5);
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullOtp = otp.join('');
        if (fullOtp.length !== 6) return;

        setIsLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await verifyEmailOtp(email, fullOtp);
            setSuccessMsg('Email verified successfully! Redirecting to login...');
            // Redirect is handled by AuthProvider
        } catch (err: any) {
            setError(typeof err === 'string' ? err : 'Verification failed. Please try again.');
            // Clear OTP inputs on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);
        setError(null);
        setSuccessMsg(null);

        try {
            await sendEmailOtp(email);
            setSuccessMsg('A new verification code has been sent to your email.');
            setResendCooldown(60); // 60 second cooldown
            // Clear existing OTP
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(typeof err === 'string' ? err : 'Failed to resend code. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        const fullOtp = otp.join('');
        if (fullOtp.length === 6 && !isLoading) {
            handleVerify();
        }
    }, [otp]);

    if (!email) return null;

    // Mask the email for display (show first 2 chars + domain)
    const maskedEmail = (() => {
        const [local, domain] = email.split('@');
        if (!domain) return email;
        const visible = local.slice(0, 2);
        return `${visible}${'•'.repeat(Math.max(local.length - 2, 0))}@${domain}`;
    })();

    return (
        <div className="flex w-full min-h-screen">
            <div className="w-full flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-4xl shadow-xl border border-gray-100 text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                        <i className="fas fa-envelope-open-text"></i>
                    </div>
                    
                    <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight">Verify Your Email</h1>
                    <p className="text-gray-500 mt-2 font-medium mb-2">
                        We&apos;ve sent a 6-digit verification code to
                    </p>
                    <p className="text-gray-800 font-bold text-sm mb-8 bg-gray-50 inline-block px-4 py-1.5 rounded-full">
                        <i className="fas fa-envelope mr-2 text-orange-500"></i>
                        {maskedEmail}
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {successMsg && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl text-sm font-bold animate-in fade-in duration-300">
                            <i className="fas fa-check-circle mr-2"></i>
                            {successMsg}
                        </div>
                    )}

                    {/* OTP Input */}
                    <div className="flex justify-center gap-2 md:gap-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all bg-white"
                                disabled={isLoading}
                            />
                        ))}
                    </div>

                    {/* Verify Button */}
                    <button 
                        onClick={handleVerify}
                        disabled={isLoading || otp.join('').length !== 6}
                        className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-orange-600 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-black active:scale-95 flex justify-center items-center gap-2 group"
                    >
                        {isLoading ? (
                            <i className="fas fa-spinner fa-spin text-xl"></i>
                        ) : (
                            <>
                                <span>Verify Account</span>
                                <i className="fas fa-check-circle group-hover:scale-110 transition-transform"></i>
                            </>
                        )}
                    </button>

                    {/* Resend OTP */}
                    <div className="mt-6 space-y-3">
                        <p className="text-sm text-gray-500 font-medium">
                            Didn&apos;t receive the code?{' '}
                            {resendCooldown > 0 ? (
                                <span className="text-gray-400 font-bold">
                                    Resend in {resendCooldown}s
                                </span>
                            ) : (
                                <button 
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-orange-600 font-bold hover:text-orange-700 transition-colors disabled:opacity-50"
                                >
                                    {isResending ? 'Sending...' : 'Resend Code'}
                                </button>
                            )}
                        </p>

                        <p className="text-xs text-gray-400">
                            <Link href="/auth/register" className="text-orange-500 hover:text-orange-600 font-bold transition-colors">
                                Use a different email?
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 flex items-center justify-center min-h-screen">
                <i className="fas fa-spinner fa-spin text-2xl text-orange-500"></i>
            </div>
        }>
            <VerifyOtpContent />
        </Suspense>
    );
}
