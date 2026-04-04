'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    // Hide footer on specific pages
    const hideOnPaths = ['/login', '/register', '/admin', '/interviewer'];
    const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));

    if (shouldHide) return null;

    return (
        <footer className="bg-primary dark:bg-black w-full border-t border-white/10 mt-20 tonal-transition">
            <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-on-primary">
                <div className="flex flex-col gap-4">
                    <div className="text-2xl font-bold tracking-tighter text-surface">HireSphere</div>
                    <p className="text-surface/60 text-sm max-w-xs leading-relaxed">
                        Modernizing the executive search and high-volume recruitment experience with botanical precision.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-10 font-body text-sm tracking-normal">
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-secondary-fixed">Platform</span>
                        <ul className="flex flex-col gap-2">
                            {['ATS Core', 'Portal Engine', 'Analytics Hub'].map(link => (
                                <li key={link}><Link href="#" className="text-surface/60 hover:text-surface transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <span className="text-xs font-black uppercase tracking-widest text-secondary-fixed">Company</span>
                        <ul className="flex flex-col gap-2">
                            {['About Us', 'Careers', 'Contact'].map(link => (
                                <li key={link}><Link href="#" className="text-surface/60 hover:text-surface transition-colors">{link}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <span className="text-xs font-black uppercase tracking-widest text-secondary-fixed">Legal</span>
                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                            {['Privacy Policy', 'Terms of Service', 'Security', 'Accessibility'].map(link => (
                                <Link key={link} className="text-surface/60 hover:text-surface underline decoration-secondary-fixed/30 underline-offset-4 transition-all duration-200" href="#">{link}</Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 text-surface/40">
                    <div className="text-[10px] uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} HireSphere Enterprise.
                    </div>
                    <div className="flex gap-4">
                        <span className="material-symbols-outlined text-sm cursor-pointer hover:text-surface transition-colors">language</span>
                        <span className="material-symbols-outlined text-sm cursor-pointer hover:text-surface transition-colors">share</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
