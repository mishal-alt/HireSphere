'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, stagger } from 'animejs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Logo Animation - Staggered reveal
        animate('.logo-letter', {
            opacity: [0, 1],
            translateY: [10, 0],
            delay: stagger(60, { start: 300 }),
            duration: 800,
            easing: 'easeOutExpo'
        });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Platform', href: '/' },
        { name: 'Solutions', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About Us', href: '/about' },
    ];

    return (
        <header
            className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled
                ? 'bg-white/80 backdrop-blur-md border-b border-outline-variant/30 py-4 shadow-sm'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-8 relative">
                {/* Logo Section */}
                <Link href="/" className="text-2xl font-black tracking-tighter text-primary flex items-center font-heading group">
                    <div className="size-8 mr-3 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                        <img src="/favicon.png" alt="HireSphere Logo" className="size-full object-cover" />
                    </div>
                    <div>
                        {"Hire".split("").map((char, i) => (
                            <span key={i} className="logo-letter inline-block" style={{ opacity: 0 }}>
                                {char}
                            </span>
                        ))}
                        {"Sphere".split("").map((char, i) => (
                            <span key={i + 4} className="logo-letter inline-block text-secondary" style={{ opacity: 0 }}>
                                {char}
                            </span>
                        ))}
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed ml-0.5 group-hover:animate-ping"></span>
                    </div>
                </Link>

                {/* Desktop Nav Links - Centered */}
                <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-semibold transition-all relative group font-heading ${pathname === link.href
                                ? 'text-primary'
                                : 'text-on-surface-variant hover:text-primary transition-colors duration-300'
                                }`}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-secondary-fixed rounded-full"></span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Auth Buttons - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-6 font-heading font-semibold">
                    <Link href="/login" className="text-primary hover:opacity-70 transition-all text-sm">
                        Log In
                    </Link>
                    <Link href="/register" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg hover:scale-95 transition-all text-sm shadow-lg shadow-primary/20">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 text-primary"
                >
                    <span className="material-symbols-outlined">
                        {isMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white border-b border-outline-variant overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-bold text-primary"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-outline-variant/30 my-2" />
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-primary font-bold"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-primary text-on-primary px-6 py-4 rounded-xl text-center font-bold"
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
