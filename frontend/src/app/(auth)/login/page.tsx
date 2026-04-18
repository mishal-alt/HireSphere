'use client';

import React, { useState } from 'react';
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
        <div className="bg-white font-body text-on-surface antialiased overflow-hidden min-h-screen">
            <main className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
                {/* Left Column: Authentication Form */}
                <section className="bg-white flex flex-col px-8 md:px-24 py-12 relative overflow-y-auto custom-scrollbar">
                    {/* Navigation Anchor */}
                    <nav className="flex justify-between items-center w-full mb-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="size-10 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-all">
                                <img src="/favicon.png" className="size-full object-cover" alt="Logo" />
                            </div>
                            <span className="font-heading text-2xl font-extrabold tracking-tight text-primary">HireSphere</span>
                        </Link>
                    </nav>

                    <div className="max-w-md w-full mx-auto my-auto py-10">
                        <header className="mb-10">
                            <div className="size-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-md mb-8">
                                <img src="/favicon.png" className="size-full object-cover" alt="Logo" />
                            </div>
                            <h1 className="font-heading text-4xl font-extrabold text-primary tracking-tight mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-on-surface-variant text-sm">
                                Ready to find your next great hire?
                            </p>
                        </header>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs font-bold flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ml-1" htmlFor="email">Email Address</label>
                                <input
                                    className="w-full px-5 py-4 bg-surface-container border-none rounded-xl focus:ring-0 focus:outline-none transition-all duration-200 text-on-surface placeholder:text-on-surface-variant/50"
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant" htmlFor="password">Password</label>
                                    <Link className="text-[10px] font-bold text-secondary uppercase tracking-wider hover:opacity-80 transition-opacity" href="/forgot-password">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full px-5 py-4 bg-surface-container border-none rounded-xl focus:ring-0 focus:outline-none transition-all duration-200 text-on-surface placeholder:text-on-surface-variant/50"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 hover:text-primary transition-colors"
                                        type="button"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <button
                                disabled={isLoading}
                                className="w-full py-4 bg-primary text-white font-heading font-bold rounded-xl hover:opacity-90 transition-all duration-200 shadow-xl shadow-primary/10 disabled:opacity-70"
                                type="submit"
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>

                            <div className="relative py-4 flex items-center justify-center">
                                <div className="flex-grow border-t border-surface-container"></div>
                                <span className="flex-shrink mx-4 text-[9px] font-bold text-on-surface-variant/60 tracking-widest uppercase italic font-heading">OR CONTINUE WITH</span>
                                <div className="flex-grow border-t border-surface-container"></div>
                            </div>

                            <div className="flex justify-center w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    shape="pill"
                                />
                            </div>
                        </form>

                        <footer className="mt-12 text-center">
                            <p className="text-xs text-on-surface-variant">
                                Don't have an account? <Link className="text-primary font-bold hover:underline decoration-2 underline-offset-4" href="/register">Create one for free</Link>
                            </p>
                        </footer>
                    </div>

                    <div className="mt-auto pt-10 flex gap-6">
                        <span className="text-[9px] font-bold text-on-surface-variant/40 tracking-widest uppercase cursor-pointer hover:text-primary">Privacy Policy</span>
                        <span className="text-[9px] font-bold text-on-surface-variant/40 tracking-widest uppercase cursor-pointer hover:text-primary">Terms of Service</span>
                    </div>
                </section>

                {/* Right Column: Visual/Marketing */}
                <aside className="hidden md:flex bg-surface-container-low relative items-center justify-center overflow-hidden">
                    {/* Background Large Typography */}
                    <div className="pointer-events-none absolute bottom-[-5%] left-0 select-none opacity-[0.03]">
                        <h2 className="font-heading text-[25rem] font-extrabold leading-none tracking-tighter text-primary">Hiring</h2>
                    </div>
                    <div className="pointer-events-none absolute right-[-5%] top-[-5%] select-none opacity-[0.02]">
                        <h2 className="font-heading text-[20rem] font-extrabold leading-none tracking-tighter text-primary">Future</h2>
                    </div>
                    {/* Visual Elements */}
                    <div className="relative z-10 w-full max-w-lg p-12">
                        {/* Talent Hub Card */}
                        <div className="bg-white/80 backdrop-blur-3xl mb-12 -translate-x-12 rotate-[-3deg] rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-white/50">
                            <div className="flex items-center gap-5">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary-fixed text-on-secondary-fixed">
                                    <span className="material-symbols-outlined text-3xl filled">groups</span>
                                </div>
                                <div>
                                    <h3 className="font-heading text-xl font-bold text-primary">TALENT HUB</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Advanced Sourcing</p>
                                </div>
                            </div>
                            <div className="mt-8 flex -space-x-4">
                                <img alt="P1" className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHvM2sX0G9gLyiShgGIhj79gYSXtsyeVpgODGpwvcS6rT9o2u58Ui_14IfOy3CJyYSkA0jrC4QS-ycJWkS6usbHiDjqE2jMml5gsXYeeGhbxHjt-xcRAzCoNsQsq5nZhxWHXi_36PLZ0I8L1t6EUu-xp-FoTZbzDrPQZXlwLfCZnmjWCoRMDw6hcW1ET_q4aIl9FCIh_xFkpeWG6RrKj8iKT0KNMCASGh1ZoJQTgb3kGvYviwxDqLDhEst6VgbwbITMGlvzRP7l9g" />
                                <img alt="P2" className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkzwUnFVXVPqUC8O_GKufetrQb4n1S4DzYwHxGPCflQs2SzdyKz-n5sI9AaHJquJep-FWs_c5RBbTtPHDk0CYrtkvNRCsBJGVeVHRbBrXKF9dnT7CNCx6V4r5YEc1g5n1zFTx46Q-JuTJYCtad-df4cDpd-dlplLbmjEOwL5-YTV8ZNp9dDcW-hPsTEN2KQ4nAF3iQVSlWMp-QfDzZHWMgWB4J2i6eu5bc6hrx7ECLgHnyuJvf52I-YUB-iAqSJicWkETau3NyGfQ" />
                                <img alt="P3" className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZzYkicSMLdZpe8030H2bVuQs4QHvSlHR-Ek935DTDNeUkjol5GNOOCVKjp1hAEOrUI44oPxW5B1o9zAWnIUPayd22bOGxu88leGfVz007EjEvBxeGGakajDtOxMKmb6tHKMO0quACG2OX4DEWEV42ACOigT2cRf7-vXf2HGp0R2PUJgDWVcdV64aheZfaruYgWETji_I3dzcJiKt2gDbtsJ7PRxQKwJkIeHGpV22XoOc7EcGXMFC2dm1RZdEhJ8v2p1s8N7IYgJQ" />
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-tertiary-fixed text-[11px] font-bold text-on-tertiary-fixed shadow-sm">+42</div>
                            </div>
                        </div>

                        {/* Active Hiring Card */}
                        <div className="bg-white/80 backdrop-blur-3xl ml-auto w-80 translate-x-12 rotate-[4deg] rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-white/50">
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Active Hiring</span>
                                <span className="text-sm font-bold text-primary">84%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                                <div className="h-full w-[84%] rounded-full bg-secondary shadow-[0_0_8px_rgba(88,100,33,0.3)]"></div>
                            </div>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-secondary filled text-xl">check_circle</span>
                                    <span className="text-sm font-medium text-on-surface-variant font-heading">Automated screening complete</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="material-symbols-outlined text-secondary filled text-xl">check_circle</span>
                                    <span className="text-sm font-medium text-on-surface-variant font-heading">Interview scheduled (3)</span>
                                </div>
                            </div>
                        </div>

                        {/* Descriptive text overlay */}
                        <div className="mt-24 px-6">
                            <p className="font-heading text-4xl font-extrabold leading-tight text-primary">
                                Experience the new <br />
                                <span className="text-secondary font-heading">standard of Hiring, today.</span>
                            </p>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}
