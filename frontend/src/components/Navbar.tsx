'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function Navbar() {
    const pathname = usePathname();
    const { user, checkAuth, logout } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Hide navbar on specific paths
    const hideOnPaths = ['/login', '/register', '/admin', '/interviewer'];
    const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

    if (shouldHide) return null;

    const navLinks = [
        { name: 'Features', href: '/features' },
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
        <header className="fixed top-0 inset-x-0 z-[100] flex items-center justify-between px-6 lg:px-20 h-24 pointer-events-none">
            {/* Logo Section */}
            <div className="flex items-center gap-4 pointer-events-auto">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="size-10 bg-gradient-to-br from-primary to-accent rounded-sm flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-500">
                        <div className="-rotate-45 group-hover:rotate-0 transition-transform">
                            <svg className="size-5 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-white text-2xl font-heading font-black italic tracking-tighter">HireSphere</h2>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-12 pointer-events-auto bg-white/5 backdrop-blur-xl border border-white/10 px-10 h-14 rounded-full">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`text-[10px] uppercase font-black tracking-[0.2em] transition-all hover:text-white relative group ${pathname === link.href ? 'text-white' : 'text-slate-400'}`}
                    >
                        {link.name}
                        <span className={`absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full ${pathname === link.href ? 'w-full' : ''}`}></span>
                    </Link>
                ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex gap-6 items-center pointer-events-auto">
                {user ? (
                    <>
                        <Link href={getDashboardLink()} className="text-[11px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <button 
                            onClick={() => logout()}
                            className="h-12 px-8 bg-white/5 border border-white/10 text-white text-[11px] uppercase font-black tracking-[0.2em] rounded-full hover:bg-white/10 transition-all"
                        >
                            Log out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-[11px] uppercase font-black tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="h-12 px-8 bg-white text-black text-[11px] uppercase font-black tracking-[0.2em] rounded-full hover:scale-105 transition-all shadow-xl shadow-white/5 flex items-center justify-center">
                            Sign up
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
