'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-slate-50 relative overflow-hidden font-body">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 w-full flex flex-col items-center">
                {/* Logo Section */}
                <Link href="/" className="mb-10 flex items-center gap-4 group">
                    <div className="bg-primary p-1 rounded-full shadow-none shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 size-12 flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" className="size-full object-contain" alt="HireSphere" />
                    </div>
                    <span className="text-3xl font-display font-black tracking-tighter text-slate-900 italic">HireSphere</span>
                </Link>

                {/* Login Card */}
                <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/60 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">Welcome back</h1>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">Sign in to your recruitment dashboard.</p>
                            {error && (
                                <div className="mt-6 p-4 rounded-2xl bg-gray-50 text-gray-600 text-[13px] font-bold border border-gray-200 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1" htmlFor="email">Email address</label>
                                <input
                                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                    id="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400" htmlFor="password">Password</label>
                                    <Link className="text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors" href="#">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <input
                                        className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <button
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors flex items-center"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-3 ml-1">
                                <div className="relative flex items-center">
                                    <input
                                        className="peer appearance-none size-5 rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                    />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <svg className="size-3" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </div>
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none" htmlFor="remember-me">Stay signed in</label>
                            </div>

                            {/* Sign In Button */}
                            <button
                                className="w-full h-16 bg-slate-900 hover:bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-none shadow-slate-900/10 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Verifying...' : 'Sign in to platform'}
                                {!isLoading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </button>

                            {/* Divider */}
                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px]">
                                    <span className="px-4 bg-white text-slate-400 font-bold uppercase tracking-widest">or</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => toast.error("Google Login Failed")}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    shape="circle"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-12 text-center space-y-6">
                    <p className="text-[13px] font-bold text-slate-500">
                        Don't have an account?
                        <Link className="text-primary hover:text-primary/80 transition-colors ml-2" href="/register">Create an account</Link>
                    </p>
                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Link className="hover:text-slate-900 transition-colors" href="#">System Status</Link>
                        <span>•</span>
                        <Link className="hover:text-slate-900 transition-colors" href="#">Privacy</Link>
                        <span>•</span>
                        <Link className="hover:text-slate-900 transition-colors" href="#">Support</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}