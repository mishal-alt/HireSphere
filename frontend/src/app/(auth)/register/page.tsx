'use client';

import React, { useState } from 'react';
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

        if (passwordStrength <= 1 && formData.password.length > 0) {
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
        <div className="bg-white font-body text-on-surface antialiased overflow-hidden min-h-screen">
            <div className="flex min-h-screen">
                {/* Left Column: Sign Up Form */}
                <main className="flex w-full flex-col bg-white overflow-y-auto custom-scrollbar md:w-1/2">
                    {/* Header Section */}
                    <div className="p-8 lg:px-12">
                        <Link href="/" className="font-heading text-2xl font-extrabold tracking-tight text-primary">
                            HireSphere
                        </Link>
                    </div>

                    <div className="flex-grow flex items-center justify-center p-8 lg:p-12">
                        <div className="w-full max-w-md">
                            <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary">Get Started</h1>
                            <p className="mt-2 text-on-surface-variant text-sm">Join 500+ companies automating their hiring process</p>

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs font-bold flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">error</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="mt-10 space-y-5">
                                {/* Full Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Full Name</label>
                                    <input
                                        className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none transition-all"
                                        placeholder="John Doe"
                                        name="fullName"
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Company Name */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Company</label>
                                    <input
                                        className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none transition-all"
                                        placeholder="Acme Inc."
                                        name="companyName"
                                        type="text"
                                        required
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Work Email */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Work Email</label>
                                    <input
                                        className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none transition-all"
                                        placeholder="noakri@gmail.com"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Password */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                                        <span className={`text-[9px] font-bold tracking-widest uppercase transition-colors ${passwordStrength <= 2 ? 'text-error' : 'text-secondary'}`}>
                                            SECURITY: {strengthLabel}
                                        </span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none transition-all"
                                            placeholder="••••••••"
                                            name="password"
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
                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confirm Password</label>
                                    <input
                                        className="w-full rounded-lg border-none bg-surface-container px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 focus:outline-none transition-all"
                                        placeholder="••••••••"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {/* Submit Button */}
                                <button
                                    disabled={isLoading}
                                    className="mt-2 w-full rounded-lg bg-primary py-4 font-heading font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.99] disabled:opacity-70"
                                    type="submit"
                                >
                                    {isLoading ? 'Processing...' : 'Get Started'}
                                </button>

                                {/* Separator */}
                                <div className="relative py-4 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-surface-container"></div>
                                    </div>
                                    <div className="relative px-4 bg-white text-[9px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60 font-heading italic">
                                        OR CONTINUE WITH
                                    </div>
                                </div>

                                {/* Google Sign In */}
                                <div className="flex justify-center w-full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Google Authentication Failed")}
                                        theme="outline"
                                        size="large"
                                        shape="pill"
                                        width="100%"
                                    />
                                </div>
                            </form>
                            <p className="mt-8 text-center text-xs text-on-surface-variant">
                                Already have an account? <Link className="font-bold text-primary hover:underline decoration-2 underline-offset-4" href="/login">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </main>

                {/* Right Column: Visual Narrative */}
                <aside className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-surface-container-low md:flex">
                    {/* Background Large Typography */}
                    <div className="pointer-events-none absolute bottom-[-5%] left-0 select-none opacity-[0.03]">
                        <h2 className="font-heading text-[25rem] font-extrabold leading-none tracking-tighter text-primary">Hiring</h2>
                    </div>
                    <div className="pointer-events-none absolute right-[-5%] top-[-5%] select-none opacity-[0.02]">
                        <h2 className="font-heading text-[20rem] font-extrabold leading-none tracking-tighter text-primary">Future</h2>
                    </div>

                    {/* Floating UI Elements */}
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
                                <img className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHvM2sX0G9gLyiShgGIhj79gYSXtsyeVpgODGpwvcS6rT9o2u58Ui_14IfOy3CJyYSkA0jrC4QS-ycJWkS6usbHiDjqE2jMml5gsXYeeGhbxHjt-xcRAzCoNsQsq5nZhxWHXi_36PLZ0I8L1t6EUu-xp-FoTZbzDrPQZXlwLfCZnmjWCoRMDw6hcW1ET_q4aIl9FCIh_xFkpeWG6RrKj8iKT0KNMCASGh1ZoJQTgb3kGvYviwxDqLDhEst6VgbwbITMGlvzRP7l9g" alt="Talent" />
                                <img className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkzwUnFVXVPqUC8O_GKufetrQb4n1S4DzYwHxGPCflQs2SzdyKz-n5sI9AaHJquJep-FWs_c5RBbTtPHDk0CYrtkvNRCsBJGVeVHRbBrXKF9dnT7CNCx6V4r5YEc1g5n1zFTx46Q-JuTJYCtad-df4cDpd-dlplLbmjEOwL5-YTV8ZNp9dDcW-hPsTEN2KQ4nAF3iQVSlWMp-QfDzZHWMgWB4J2i6eu5bc6hrx7ECLgHnyuJvf52I-YUB-iAqSJicWkETau3NyGfQ" alt="Talent" />
                                <img className="h-12 w-12 rounded-full border-4 border-white object-cover shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZzYkicSMLdZpe8030H2bVuQs4QHvSlHR-Ek935DTDNeUkjol5GNOOCVKjp1hAEOrUI44oPxW5B1o9zAWnIUPayd22bOGxu88leGfVz007EjEvBxeGGakajDtOxMKmb6tHKMO0quACG2OX4DEWEV42ACOigT2cRf7-vXf2HGp0R2PUJgDWVcdV64aheZfaruYgWETji_I3dzcJiKt2gDbtsJ7PRxQKwJkIeHGpV22XoOc7EcGXMFC2dm1RZdEhJ8v2p1s8N7IYgJQ" alt="Talent" />
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
                        <div className="mt-20 px-6">
                            <p className="font-heading text-4xl font-extrabold leading-tight text-primary">
                                Experience the new <br />
                                <span className="text-secondary font-heading">standard of Hiring, today.</span>
                            </p>
                        </div>
                    </div>

                    {/* Bottom Subtle Branding */}
                    <div className="absolute bottom-8 flex w-full justify-between px-10 text-[9px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                        <span>© 2024 HIRESPHERE GLOBAL</span>
                        <span>EDITORIAL EXCELLENCE</span>
                    </div>
                </aside>
            </div>
        </div>
    );
}
