'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
    const { login, googleLogin } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await login(formData);
            // redirection is handled in the store
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
            toast.error(err.response?.data?.message || "Google Login Failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-brand-green-dark flex items-center justify-center p-4 lg:p-8 antialiased text-gray-800 font-sans overflow-hidden">
            {/* Main Container */}
            <main className="w-full max-w-[1300px] h-full max-h-[850px] bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative">
                
                {/* Left Column (Login Form) */}
                <section className="w-full lg:w-1/2 p-6 lg:p-12 xl:p-16 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar" data-purpose="login-section">
                    <div className="w-full max-w-sm">
                        {/* Brand Logo - Top */}
                        <div className="mb-12 flex justify-start">
                            <Link href="/">
                                <h1 className="text-3xl font-serif italic text-brand-green font-semibold tracking-tight">HireSphere</h1>
                            </Link>
                        </div>

                        {/* Form Container */}
                        <div className="w-full">
                            {/* Logo Icon */}
                            <div className="w-14 h-14 bg-brand-green rounded-2xl flex items-center justify-center mb-8 shadow-md">
                                <img src="/logo.png" className="w-8 h-8 object-contain brightness-0 invert" alt="HireSphere" />
                            </div>

                            {/* Headings */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                            <p className="text-gray-500 mb-8 font-medium">Ready to find your next great hire?</p>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 text-sm border border-red-100 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                                    <input 
                                        className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                        id="email" 
                                        name="email" 
                                        placeholder="you@company.com" 
                                        required 
                                        type="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 font-medium" htmlFor="password">Password</label>
                                        <Link className="text-sm font-medium text-gray-900 hover:text-brand-green transition-colors" href="/forgot-password">Forgot?</Link>
                                    </div>
                                    <div className="relative">
                                        <input 
                                            className="block w-full rounded-lg border-gray-300 px-4 py-3 text-gray-900 focus:border-brand-green focus:ring-brand-green sm:text-sm shadow-sm font-medium" 
                                            id="password" 
                                            name="password" 
                                            required 
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button 
                                        disabled={isLoading}
                                        className="w-full h-14 flex justify-center items-center px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold uppercase tracking-widest text-white bg-gradient-to-r from-brand-green-dark to-brand-green hover:from-brand-green hover:to-brand-green-light focus:outline-none transition-all duration-300 disabled:opacity-70" 
                                        type="submit"
                                    >
                                        {isLoading ? 'Signing in...' : 'Sign in to platform'}
                                    </button>
                                </div>
                            </form>

                            {/* Divider line */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-400 uppercase tracking-widest text-[9px] font-black">or carry on with</span>
                                </div>
                            </div>

                            {/* Google Login */}
                            <div className="flex justify-center social-login-pill">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                    width="320px"
                                    shape="pill"
                                />
                            </div>

                            {/* Signup Link */}
                            <p className="mt-8 text-center text-sm text-gray-500 font-medium tracking-tight">
                                Don't have an account? 
                                <Link className="font-bold text-gray-900 hover:text-brand-green ml-1 underline transition-colors" href="/register">Create Account</Link>
                            </p>
                        </div>
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
                                <span className="italic font-light opacity-60">Find</span><br />
                                <span className="italic font-light opacity-80">the Perfect</span><br />
                                <span className="text-white drop-shadow-lg">Talent,</span><br />
                                <span className="text-white drop-shadow-lg">today</span>
                            </h2>
                        </div>

                        {/* Visual Mockup Container */}
                        <div className="relative z-10 flex items-center justify-end">
                            {/* Card Mockup */}
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-80 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <svg className="size-6" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path></svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-widest text-emerald-400/80">Success Rate</p>
                                        <p className="text-2xl font-black text-white">94%</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-3/4 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Platform Efficiency</p>
                                </div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute bottom-[-40px] left-[-20px] bg-white rounded-2xl p-4 shadow-2xl -rotate-6">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center text-brand-green">
                                        <svg className="size-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                                    </div>
                                    <span className="text-xl font-black text-gray-900 tracking-tighter italic">2.4k</span>
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