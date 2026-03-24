"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BecomePartnerPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submittedId, setSubmittedId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const steps = ['Partner Type', 'Business Info', 'Contact & Submit'];

    const [form, setForm] = useState({
        partnerType: '',
        businessName: '', location: '', description: '',
        rooms: '', capacity: '',
        vehicleType: '', fleetSize: '',
        languages: '', speciality: '',
        name: '', email: '', phone: '',
        agreed: false
    });

    const updateForm = (key: keyof typeof form, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (step < 3) setStep(prev => prev + 1);
    };

    const submitApplication = async () => {
        setErrorMsg('');
        setSubmitting(true);
        try {
            // Mock submission for now
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmittedId(`P-${Math.floor(100000 + Math.random() * 900000)}`);
            setSubmitted(true);
        } catch (e: any) {
            setErrorMsg('Submission failed: ' + e.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-950 text-white min-h-screen font-sans">
            {/* Custom Styles that were in HTML head */}
            <style jsx>{`
                .hero-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); }
                .card-hover { transition: all 0.25s ease; }
                .card-hover:hover { transform: translateY(-3px); }
                .partner-card.selected { border-color: #6366f1; background: rgba(99, 102, 241, 0.1); }
                .step-line { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
                .input-field { transition: border-color 0.2s, box-shadow 0.2s; }
                .input-field:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
                .btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); transition: all 0.2s; }
                .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4); }
                .floating-blob { filter: blur(80px); opacity: 0.15; animation: float 8s ease-in-out infinite; }
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                .progress-bar { background: linear-gradient(90deg, #6366f1, #8b5cf6); transition: width 0.4s ease; }
                .success-ring { animation: ring-pulse 1.5s ease-out forwards; }
                @keyframes ring-pulse { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
            `}</style>

            {/* Floating Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="floating-blob absolute w-96 h-96 bg-indigo-600 rounded-full top-10 -left-32"></div>
                <div className="floating-blob absolute w-80 h-80 bg-purple-600 rounded-full bottom-20 -right-20" style={{ animationDelay: "3s" }}></div>
                <div className="floating-blob absolute w-64 h-64 bg-violet-500 rounded-full top-1/2 left-1/2" style={{ animationDelay: "5s" }}></div>
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                {/* ── Nav ───────────────────────────────────────── */}
                <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
                            <i className="fas fa-route text-white text-sm"></i>
                        </div>
                        <span className="font-display font-bold text-lg">Bihar Yaatra</span>
                    </Link>
                    <Link href="/" className="text-sm text-slate-400 hover:text-white transition flex items-center gap-2">
                        <i className="fas fa-arrow-left text-xs"></i> Back to Home
                    </Link>
                </nav>

                {/* ── Hero Header ───────────────────────────────── */}
                <div className="text-center pt-16 pb-10 px-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-5">
                        Partner Program
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight">
                        Grow Your Business<br />
                        <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            With Bihar Yaatra
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Join our network of verified homestay hosts, transport providers, and local guides. Reach thousands of travellers.
                    </p>
                </div>

                {/* ── Progress Bar ──────────────────────────────── */}
                {!submitted && (
                    <div className="max-w-2xl mx-auto w-full px-4 mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {steps.map((label, i) => (
                                <div key={i} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 
                                            ${step > i + 1 ? 'bg-indigo-600 text-white' : step === i + 1 ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/30' : 'bg-slate-800 text-slate-500'}`}
                                        >
                                            {step > i + 1 ? (
                                                <i className="fas fa-check text-[10px]"></i>
                                            ) : (
                                                <span>{i + 1}</span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] mt-1 font-bold ${step >= i + 1 ? 'text-indigo-400' : 'text-slate-600'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all duration-500 ${step > i + 1 ? 'bg-indigo-600' : 'bg-slate-800'}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Main Form Card ────────────────────────────── */}
                <div className="max-w-2xl mx-auto w-full px-4 pb-20">

                    {/* SUCCESS STATE */}
                    {submitted && (
                        <div className="text-center py-16 px-8 animate-fade-in-up">
                            <div className="success-ring w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border-2 border-green-500">
                                <i className="fas fa-check text-green-400 text-3xl"></i>
                            </div>
                            <h2 className="font-display text-3xl font-black text-white mb-3">Application Submitted!</h2>
                            <p className="text-slate-400 mb-2">Your partner application has been received.</p>
                            <p className="text-slate-500 text-sm mb-8">Reference ID: <span className="font-mono text-indigo-400">{submittedId}</span></p>
                            
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-left max-w-sm mx-auto mb-8">
                                <h3 className="font-bold text-sm text-white mb-3">What happens next?</h3>
                                <div className="space-y-3 text-sm text-slate-400">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</div>
                                        <p>Our team reviews your application within <strong className="text-white">24–48 hours</strong>.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</div>
                                        <p>If approved, you&apos;ll receive your <strong className="text-white">login credentials</strong> on your provided contact.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</div>
                                        <p>Log in and <strong className="text-white">complete your profile</strong> to start receiving bookings.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <Link href="/" className="btn-primary inline-block px-8 py-3 rounded-xl font-bold text-sm text-white">
                                <i className="fas fa-home mr-2"></i> Back to Home
                            </Link>
                        </div>
                    )}

                    {/* STEP 1 — PARTNER TYPE */}
                    {!submitted && step === 1 && (
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 animate-fade-in-up">
                            <h2 className="font-display text-2xl font-black mb-2">What type of partner are you?</h2>
                            <p className="text-slate-400 text-sm mb-8">Select the service you want to offer to Bihar Yaatra travellers.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                {/* Homestay */}
                                <button type="button" onClick={() => updateForm('partnerType', 'homestay')} 
                                    className={`partner-card card-hover p-6 rounded-2xl border-2 text-left transition-all ${form.partnerType === 'homestay' ? 'selected border-indigo-500' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-home text-amber-400 text-xl"></i>
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Homestay Host</h3>
                                    <p className="text-slate-500 text-xs">Offer authentic local accommodation to travellers visiting Bihar.</p>
                                    {form.partnerType === 'homestay' && (
                                        <div className="mt-3 text-indigo-400 text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Selected</div>
                                    )}
                                </button>

                                {/* Transport */}
                                <button type="button" onClick={() => updateForm('partnerType', 'transport')} 
                                    className={`partner-card card-hover p-6 rounded-2xl border-2 text-left transition-all ${form.partnerType === 'transport' ? 'selected border-indigo-500' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-car text-blue-400 text-xl"></i>
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Transport Partner</h3>
                                    <p className="text-slate-500 text-xs">Provide vehicles and drivers for guest transportation and tours.</p>
                                    {form.partnerType === 'transport' && (
                                        <div className="mt-3 text-indigo-400 text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Selected</div>
                                    )}
                                </button>

                                {/* Guide */}
                                <button type="button" onClick={() => updateForm('partnerType', 'guide')} 
                                    className={`partner-card card-hover p-6 rounded-2xl border-2 text-left transition-all ${form.partnerType === 'guide' ? 'selected border-indigo-500' : 'border-slate-800 hover:border-slate-700'}`}>
                                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                                        <i className="fas fa-flag text-green-400 text-xl"></i>
                                    </div>
                                    <h3 className="font-bold text-white mb-1">Tour Guide</h3>
                                    <p className="text-slate-500 text-xs">Lead guided tours across Bihar&apos;s cultural and heritage sites.</p>
                                    {form.partnerType === 'guide' && (
                                        <div className="mt-3 text-indigo-400 text-xs font-bold"><i className="fas fa-check-circle mr-1"></i> Selected</div>
                                    )}
                                </button>
                            </div>

                            <button onClick={nextStep} disabled={!form.partnerType}
                                className="btn-primary w-full py-4 rounded-xl font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none">
                                Continue <i className="fas fa-arrow-right ml-2"></i>
                            </button>
                        </div>
                    )}

                    {/* STEP 2 — BUSINESS DETAILS */}
                    {!submitted && step === 2 && (
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 animate-fade-in-up">
                            {/* Type badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center 
                                    ${form.partnerType === 'homestay' ? 'bg-amber-500/10' : form.partnerType === 'transport' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                                    <i className={form.partnerType === 'homestay' ? 'fas fa-home text-amber-400' : form.partnerType === 'transport' ? 'fas fa-car text-blue-400' : 'fas fa-flag text-green-400'}></i>
                                </div>
                                <div>
                                    <h2 className="font-display text-xl font-black">Business Information</h2>
                                    <p className="text-slate-400 text-xs capitalize">{form.partnerType} partner application</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {/* Business / Property Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                                        <span>{form.partnerType === 'homestay' ? 'Property Name' : form.partnerType === 'transport' ? 'Business / Fleet Name' : 'Your Name / Guild Name'}</span>
                                        <span className="text-indigo-400 ml-1">*</span>
                                    </label>
                                    <input type="text" value={form.businessName} onChange={e => updateForm('businessName', e.target.value)} required placeholder="e.g. Mithila Cultural Cottage"
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Location / District <span className="text-indigo-400">*</span></label>
                                    <input type="text" value={form.location} onChange={e => updateForm('location', e.target.value)} required placeholder="e.g. Madhubani, Bihar"
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                </div>

                                {/* Type-specific fields */}
                                {form.partnerType === 'homestay' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Number of Rooms</label>
                                            <input type="number" value={form.rooms} onChange={e => updateForm('rooms', e.target.value)} min="1" placeholder="e.g. 4"
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Max Guest Capacity</label>
                                            <input type="number" value={form.capacity} onChange={e => updateForm('capacity', e.target.value)} min="1" placeholder="e.g. 10"
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                        </div>
                                    </div>
                                )}

                                {form.partnerType === 'transport' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Vehicle Type</label>
                                            <select value={form.vehicleType} onChange={e => updateForm('vehicleType', e.target.value)}
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm appearance-none">
                                                <option value="">Select type</option>
                                                <option value="sedan">Sedan / Taxi</option>
                                                <option value="suv">SUV / Innova</option>
                                                <option value="tempo">Tempo Traveller</option>
                                                <option value="bus">Mini Bus</option>
                                                <option value="auto">Auto Rickshaw</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Fleet Size</label>
                                            <input type="number" value={form.fleetSize} onChange={e => updateForm('fleetSize', e.target.value)} min="1" placeholder="e.g. 3"
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                        </div>
                                    </div>
                                )}

                                {form.partnerType === 'guide' && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Languages Spoken</label>
                                            <input type="text" value={form.languages} onChange={e => updateForm('languages', e.target.value)} placeholder="e.g. Hindi, English, Maithili"
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Speciality / Focus Areas</label>
                                            <input type="text" value={form.speciality} onChange={e => updateForm('speciality', e.target.value)} placeholder="e.g. Bodh Gaya, Madhubani Art, Wildlife"
                                                className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">About Your Service</label>
                                    <textarea value={form.description} onChange={e => updateForm('description', e.target.value)} rows={3} placeholder="Briefly describe what you offer to travellers..."
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600 resize-none"></textarea>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition">
                                    <i className="fas fa-arrow-left mr-2"></i> Back
                                </button>
                                <button onClick={nextStep} disabled={!form.businessName || !form.location}
                                    className="btn-primary flex-1 py-4 rounded-xl font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none">
                                    Continue <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 — CONTACT & SUBMIT */}
                    {!submitted && step === 3 && (
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-8 animate-fade-in-up">
                            <h2 className="font-display text-2xl font-black mb-2">Contact Details</h2>
                            <p className="text-slate-400 text-sm mb-8">We&apos;ll use these details to send you login credentials upon approval.</p>

                            <div className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Your Full Name <span className="text-indigo-400">*</span></label>
                                    <input type="text" value={form.name} onChange={e => updateForm('name', e.target.value)} required placeholder="e.g. Suresh Kumar Jha"
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address <span className="text-indigo-400">*</span></label>
                                    <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} required placeholder="you@gmail.com"
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Phone Number <span className="text-indigo-400">*</span></label>
                                    <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} required placeholder="+91 98765 43210"
                                        className="input-field w-full p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-600" />
                                </div>

                                {/* Terms */}
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input type="checkbox" checked={form.agreed} onChange={e => updateForm('agreed', e.target.checked)} className="mt-1 w-4 h-4 rounded accent-indigo-600 cursor-pointer" />
                                    <span className="text-slate-400 text-sm">
                                        I agree to Bihar Yaatra&apos;s <Link href="/privacy-policy" className="text-indigo-400 underline">Partner Terms & Conditions</Link> and confirm that all information provided is accurate.
                                    </span>
                                </label>

                                {/* Error */}
                                {errorMsg && (
                                    <div className="p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">{errorMsg}</div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setStep(2)} className="py-4 px-6 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition">
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <button onClick={submitApplication} disabled={!form.name || !form.email || !form.phone || !form.agreed || submitting}
                                    className="btn-primary flex-1 py-4 rounded-xl font-bold text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2">
                                    {!submitting ? (
                                        <>
                                            <i className="fas fa-paper-plane mr-2"></i> Submit Application
                                        </>
                                    ) : (
                                        <span className="flex items-center gap-2"><i className="fas fa-spinner fa-spin"></i> Submitting...</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
