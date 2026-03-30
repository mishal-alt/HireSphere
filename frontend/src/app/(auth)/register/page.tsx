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
        <div className="bg-slate-50 min-h-screen flex flex-col font-body text-slate-900 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative z-10">
                <Link href="/" className="mb-12 flex items-center gap-4 group">
                    <div className="bg-primary p-1 rounded-full shadow-none shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500 size-12 flex items-center justify-center overflow-hidden">
                        <img src="/logo.png" className="size-full object-contain" alt="HireSphere" />
                    </div>
                    <span className="text-3xl font-display font-black tracking-tighter text-slate-900 italic">HireSphere</span>
                </Link>

                <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-200/60 p-6 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-2xl pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-display font-black text-slate-900 mb-3 tracking-tight">Create your account</h2>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">Join 500+ companies automating their hiring process</p>
                            {error && (
                                <div className="mt-6 p-4 rounded-2xl bg-gray-50 text-gray-600 text-[13px] font-bold border border-gray-200 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mb-8">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => toast.error("Google Authentication Failed")}
                                theme="outline"
                                size="large"
                                width="100%"
                                shape="circle"
                                text="signup_with"
                            />
                        </div>

                        <div className="relative mb-8">
                            <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px]">
                                <span className="bg-white px-4 text-slate-400 font-bold uppercase tracking-widest">or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                    <input
                                        className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                        placeholder="John Doe"
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Company</label>
                                    <input
                                        className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                        placeholder="Acme Inc."
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Work Email</label>
                                <input
                                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                    placeholder="john@company.com"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${passwordStrength <= 2 ? 'text-gray-600' :
                                            passwordStrength <= 4 ? 'text-emerald-700' : 'text-emerald-500'
                                        }`}>
                                        Security: {strengthLabel}
                                    </span>
                                </div>
                                <input
                                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                    placeholder="••••••••"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="flex gap-1.5 px-1 pt-1">
                                    {[1, 2, 3, 4, 5].map((step) => (
                                        <div
                                            key={step}
                                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step <= passwordStrength
                                                    ? (passwordStrength <= 2 ? 'bg-gray-50' : passwordStrength <= 4 ? 'bg-emerald-50' : 'bg-emerald-400')
                                                    : 'bg-slate-100'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm Password</label>
                                <input
                                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-900 placeholder-slate-300 focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all outline-none font-bold text-sm"
                                    placeholder="••••••••"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex items-start gap-4 pt-4 ml-1">
                                <div className="relative flex items-center shrink-0">
                                    <input className="peer appearance-none size-5 rounded-lg border-2 border-slate-200 checked:bg-primary checked:border-primary transition-all cursor-pointer" id="terms" type="checkbox" required />
                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <svg className="size-3" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    </span>
                                </div>
                                <label className="text-[11px] font-bold text-slate-500 leading-relaxed cursor-pointer select-none" htmlFor="terms">
                                    I agree to the <Link className="text-primary hover:underline" href="#">Terms</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
                                </label>
                            </div>
                            <button
                                className="w-full h-16 bg-primary hover:opacity-90 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-none shadow-primary/10 transition-all flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Initializing...' : 'Create my account'}
                                {!isLoading && <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">rocket_launch</span>}
                            </button>
                        </form>
                        <p className="text-center text-[13px] font-bold text-slate-500 mt-10">
                            Already have an account?
                            <Link className="text-primary hover:text-primary/80 transition-colors ml-2" href="/login">Sign in</Link>
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8">Trusted by global innovators</p>
                    <div className="flex flex-wrap justify-center gap-8 opacity-30 grayscale items-center">
                        {['STRIPE', 'AIRBNB', 'SLACK', 'LINEAR', 'VERCEL'].map(brand => (
                            <div key={brand} className="font-heading font-black text-xl tracking-tighter">{brand}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
