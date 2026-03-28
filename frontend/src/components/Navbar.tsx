'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Globe, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const { user, checkAuth, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        checkAuth();
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [checkAuth]);

    // Hide navbar on specific paths
    const hideOnPaths = ['/login', '/register', '/admin', '/interviewer'];
    const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

    if (shouldHide) return null;

    const navLinks = [
        { name: 'Solutions', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const getDashboardLink = () => {
        if (!user) return '/login';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'interviewer') return '/interviewer/dashboard';
        return '/candidate/dashboard';
    };

    return (
        <header 
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 lg:px-20' 
                : 'bg-transparent py-6 px-6 lg:px-24'
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10 group-hover:scale-110 transition-transform overflow-hidden">
                         <img src="/logo.png" className="size-full object-contain p-1" alt="HireSphere" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">HireSphere</h2>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Talent</span>
                    </div>
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-[13px] font-semibold transition-all relative group ${
                                pathname === link.href ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            {link.name}
                            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 transition-all group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`}></span>
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden lg:flex items-center gap-6">
                    {user ? (
                        <>
                            <Link href={getDashboardLink()} className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                                Dashboard
                            </Link>
                            <button 
                                onClick={() => logout()}
                                className="h-11 px-6 bg-slate-900 text-white text-[13px] font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-[13px] font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                                Sign In
                            </Link>
                            <Link href="/register" className="h-11 px-6 bg-slate-900 text-white text-[13px] font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2">
                                Start Free Trial
                                <ChevronRight className="size-4" />
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden size-10 flex items-center justify-center text-slate-900"
                >
                    {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-t border-slate-100 overflow-hidden mt-4"
                    >
                        <div className="py-8 space-y-4 px-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-lg font-semibold text-slate-600 hover:text-slate-900"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-slate-100" />
                            {user ? (
                                <button 
                                    onClick={() => { logout(); setIsMenuOpen(false); }}
                                    className="w-full h-12 bg-slate-950 text-white rounded-xl text-sm font-semibold"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/login" className="h-12 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-semibold text-slate-900">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="h-12 flex items-center justify-center rounded-xl bg-slate-950 text-white text-sm font-semibold">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
