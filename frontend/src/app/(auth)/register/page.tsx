'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
    const { signup, googleLogin } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyName: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordStrength, setPasswordStrength] = useState(0);
    const [strengthLabel, setStrengthLabel] = useState('None');

    const calculateStrength = (pass: string) => {
        let score = 0;
        if (!pass) return { score: 0, label: 'None' };
        if (pass.length > 6) score += 1;
        if (pass.length > 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Epic'];
        return { score: Math.min(score, 5), label: labels[Math.min(score - 1, 4)] || 'Weak' };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(null);

        if (name === 'password') {
            const result = calculateStrength(value);
            setPasswordStrength(result.score);
            setStrengthLabel(result.label);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordStrength <= 1) {
            const msg = 'Password is too weak. Please use a stronger password.';
            setError(msg);
            toast.error(msg);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await signup({
                name: formData.companyName,
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });
            // redirection is handled in the store
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        try {
            if (credentialResponse.credential) {
                await googleLogin(credentialResponse.credential);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Google Authentication Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-brand-green-dark flex items-center justify-center p-4 lg:p-8 antialiased text-gray-800 font-sans overflow-hidden">
            {/* Main Container */}
            <main className="w-full max-w-[1400px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full max-h-[900px]">
                
                {/* Left Column (Signup Form) */}
                <section className="w-full lg:w-1/2 p-6 lg:p-12 xl:px-20 py-12 flex flex-col justify-between overflow-y-auto custom-scrollbar" data-purpose="signup-section">
                    {/* Brand Logo */}
                    <div className="mb-8">
                        <Link href="/">
                            <h1 className="text-3xl font-serif italic text-brand-green font-semibold tracking-tight">HireSphere</h1>
                        </Link>
                    </div>

                    {/* Form Container */}
                    <div className="max-w-md mx-auto w-full">
                        {/* Logo Icon */}
                        <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center mb-6 shadow-md">
                            <img src="/logo.png" className="w-10 h-10 object-contain brightness-0 invert" alt="HireSphere" />
                        </div>

                        {/* Headings */}
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h2>
                        <p className="text-gray-500 mb-6 font-medium leading-relaxed">Join 500+ companies automating their hiring process</p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100 flex items-center gap-3 font-bold">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="fullName">Full Name</label>
                                    <input 
                                        className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                        id="fullName" name="fullName" placeholder="John Doe" required type="text" value={formData.fullName} onChange={handleChange} />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="companyName">Company</label>
                                    <input 
                                        className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                        id="companyName" name="companyName" placeholder="Acme Inc." required type="text" value={formData.companyName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="email">Work Email</label>
                                <input 
                                    className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                    id="email" name="email" placeholder="you@company.com" required type="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="password">Password</label>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${passwordStrength <= 2 ? 'text-gray-400' : 'text-brand-green'}`}>
                                        Security: {strengthLabel}
                                    </span>
                                </div>
                                <div className="relative">
                                    <input 
                                        className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                        id="password" name="password" required type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} />
                                    <button 
                                        type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {/* Strength Meter */}
                                <div className="flex gap-1.5 px-0.5 pt-1.5">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step <= passwordStrength
                                                    ? (passwordStrength <= 2 ? 'bg-orange-400' : passwordStrength <= 4 ? 'bg-blue-400' : 'bg-brand-green')
                                                    : 'bg-gray-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1" htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    className="block w-full rounded-lg border-gray-300 px-4 py-2.5 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                    id="confirmPassword" name="confirmPassword" required type="password" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                            <div className="pt-2">
                                <button 
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-brand-green-dark to-brand-green hover:from-brand-green hover:to-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all duration-300 disabled:opacity-70 font-bold tracking-widest uppercase text-[11px]" 
                                    type="submit">
                                    {isLoading ? 'Processing...' : 'Create My Account'}
                                </button>
                            </div>
                        </form>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest">or continue with</span>
                            </div>
                        </div>

                        {/* Google Login */}
                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Authentication Failed")}
                                theme="outline" size="large" width="100%" shape="pill" />
                        </div>

                        {/* Signin link */}
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account? 
                            <Link className="font-bold text-gray-900 hover:text-brand-green ml-1 transition-colors" href="/login">Sign in</Link>
                        </p>
                    </div>
                    {/* Legal Links */}
                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-12">
                        <Link className="hover:text-gray-900 transition-colors" href="#">Legal</Link>
                        <span>•</span>
                        <Link className="hover:text-gray-900 transition-colors" href="#">Terms</Link>
                        <span>•</span>
                        <Link className="hover:text-gray-900 transition-colors" href="#">Help</Link>
                    </div>
                </section>
                {/* END: Left Column */}

                {/* BEGIN: Right Column (Hero/Graphic Section) */}
                <section className="hidden lg:block w-1/2 relative bg-brand-green-dark" data-purpose="hero-section">
                    <div className="h-full w-full overflow-hidden relative flex flex-col justify-between py-20 px-16">
                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-green rounded-full blur-[120px] opacity-20"></div>
                        
                        {/* Headline */}
                        <div className="relative z-10">
                            <h2 className="text-6xl xl:text-7xl font-serif text-white leading-tight">
                                <span className="italic font-light opacity-60">Join</span><br />
                                <span className="italic font-light opacity-80">the Future</span><br />
                                <span className="text-white drop-shadow-lg">of Hiring,</span><br />
                                <span className="text-white drop-shadow-lg leading-relaxed">today</span>
                            </h2>
                        </div>

                        {/* Visual Mockup Container */}
                        <div className="relative z-10 flex items-center justify-end">
                            {/* Card Mockup */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-80 shadow-2xl -rotate-2 hover:rotate-0 transition-transform duration-700">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <svg className="size-6" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z" fillRule="evenodd"></path></svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400/80">Active Hiring</p>
                                        <p className="text-2xl font-black text-white">500+</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Scale your growth</p>
                                </div>
                            </div>

                            {/* Floating UI Element */}
                            <div className="absolute top-[-30px] left-[-10px] bg-white rounded-2xl p-4 shadow-2xl rotate-6 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-brand-green">
                                        <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z"></path></svg>
                                    </div>
                                    <span className="text-sm font-black text-gray-900 tracking-tighter uppercase italic">Talent Hub</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* END: Right Column */}
            </main>
            {/* END: Main Container */}
        </div>
    );
}
