'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { animate, stagger } from 'animejs';

export default function Navbar() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        // Logo Animation - Staggered reveal
        animate('.logo-letter', {
            opacity: [0, 1],
            y: [10, 0],
            translateY: [10, 0],
            delay: stagger(60, { start: 300 }),
            duration: 800,
            ease: 'outExpo'
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
                <Link href="/" className="text-2xl font-black tracking-tighter text-primary flex items-center">
                    {"HireSphere".split("").map((char, i) => (
                        <span key={i} className="logo-letter inline-block" style={{ opacity: 0 }}>
                            {char}
                        </span>
                    ))}
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

                {/* Auth Buttons */}
                <div className="flex items-center gap-6 font-heading font-semibold">
                    <Link href="/login" className="text-primary hover:opacity-70 transition-all text-sm">
                        Log In
                    </Link>
                    <Link href="/register" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg hover:scale-95 transition-all text-sm shadow-lg shadow-primary/20">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}
