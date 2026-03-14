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
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background-light dark:bg-background-dark bg-mesh font-display">
            {/* Logo Section */}
            <div className="mb-10 flex items-center gap-2">
                <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                        <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885L42.4404 38.098ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098" />
                    </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">HireSphere</span>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Sign in to your account</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Welcome back! Please enter your details.</p>
                    {error && (
                        <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="email">Email address</label>
                        <input
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
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
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                            <Link className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors" href="#">Forgot password?</Link>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary cursor-pointer"
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                        />
                        <label className="ml-2 block text-sm text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="remember-me">Remember me for 30 days</label>
                    </div>

                    {/* Sign In Button */}
                    <button
                        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                        {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google Login Failed")}
                            theme="outline"
                            size="large"
                            width="384"
                        />
                    </div>
                </form>
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?
                    <Link className="font-semibold text-primary hover:text-primary/80 transition-colors ml-1" href="/register">Sign up for free</Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link>
                    <span>•</span>
                    <Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link>
                    <span>•</span>
                    <Link className="hover:text-primary transition-colors" href="#">Support</Link>
                </div>
            </div>
        </div>
    );
}