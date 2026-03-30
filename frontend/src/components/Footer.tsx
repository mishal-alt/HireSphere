'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Twitter,
    Linkedin,
    Github,
    Instagram,
    CheckCircle2,
    ShieldCheck,
    Globe,
    Mail
} from 'lucide-react';

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on specific pages
    const hideOnPaths = ['/login', '/register', '/forgot-password', '/admin', '/interviewer'];
    const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

    if (shouldHide) return null;

    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 px-6 lg:px-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-none shadow-slate-900/10 transition-transform hover:scale-105 overflow-hidden">
                                <img src="/logo.png" className="size-full object-contain p-1" alt="HireSphere" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">HireSphere</h2>
                        </Link>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-sm">
                            The enterprise-grade <span className="text-slate-900 font-semibold tracking-tight">Recruitment Intelligence</span> platform for high-growth global teams.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Twitter, href: '#' },
                                { icon: Linkedin, href: '#' },
                                { icon: Github, href: '#' },
                                { icon: Instagram, href: '#' }
                            ].map((social, i) => (
                                <Link
                                    key={i}
                                    href={social.href}
                                    className="size-10 rounded-xl border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
                                >
                                    <social.icon className="size-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Solutions</h5>
                            <ul className="space-y-4">
                                {['AI Assessment', 'Scheduling', 'Analytics', 'Candidate CRM'].map(item => (
                                    <li key={item}>
                                        <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="/features">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Company</h5>
                            <ul className="space-y-4">
                                {['About Us', 'Pricing', 'Legal Info', 'Contact'].map(item => (
                                    <li key={item}>
                                        <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href={item === 'About Us' ? '/about' : item === 'Pricing' ? '/pricing' : item === 'Contact' ? '/contact' : '#'}>{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Support</h5>
                            <ul className="space-y-4">
                                {['Help Center', 'API Docs', 'Status Page', 'Security'].map(item => (
                                    <li key={item}>
                                        <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" href="#">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6 border-l border-slate-200 pl-8">
                            <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">Newsletter</h5>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">Join 2,000+ talent leads for monthly hiring insights.</p>
                            <div className="relative group">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full h-10 px-4 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                />
                                <button className="absolute right-1 top-1 bottom-1 px-3 bg-slate-900 text-white rounded-md text-[10px] font-bold uppercase tracking-widest">Join</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 leading-none">
                            © {new Date().getFullYear()} HireSphere Inc. All Rights Reserved.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="#" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors leading-none">Privacy</Link>
                            <Link href="#" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors leading-none">Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Globe className="size-3.5 text-slate-400" />
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">English (US)</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">All Systems Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
