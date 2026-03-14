'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
    const { signup, googleLogin } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyName: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
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
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-slate-100">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="mb-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="size-10 bg-primary text-white rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">HireSphere</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Enterprise Recruitment Automation</p>
                </div>

                <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Join 500+ companies automating their hiring process</p>
                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Authentication Failed")}
                            theme="outline"
                            size="large"
                            width="374"
                            text="signup_with"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with email</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                placeholder="John Doe"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                placeholder="john@company.com"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                placeholder="Acme Inc."
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-1.5">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <span className="text-xs font-medium text-emerald-500">Strong</span>
                            </div>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <div className="mt-2 flex gap-1">
                                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                                <div className="h-1 flex-1 rounded-full bg-emerald-500"></div>
                                <div className="h-1 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pt-2">
                            <div className="flex items-center h-5">
                                <input className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary cursor-pointer" id="terms" type="checkbox" required />
                            </div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 leading-normal cursor-pointer" htmlFor="terms">
                                By signing up, you agree to our <Link className="text-primary hover:underline font-medium" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline font-medium" href="#">Privacy Policy</Link>.
                            </label>
                        </div>
                        <button
                            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all shadow-lg shadow-primary/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                        Already have an account?
                        <Link className="text-primary font-semibold hover:underline ml-1" href="/login">Sign in</Link>
                    </p>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold tracking-widest uppercase mb-4">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale contrast-125">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">api</span>
                            <span className="font-bold">TECHFLOW</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">filter_drama</span>
                            <span className="font-bold">CLOUDLY</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">token</span>
                            <span className="font-bold">HEXAGON</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined">all_out</span>
                            <span className="font-bold">SPHERE</span>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="p-8 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-400">© 2024 HireSphere Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
