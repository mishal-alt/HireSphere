'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer({ theme = 'dark' }: { theme?: 'light' | 'dark' }) {
    const pathname = usePathname();
    const isLight = theme === 'light' || pathname === '/' || pathname === '/features' || pathname === '/contact' || pathname === '/about' || pathname === '/pricing';
    
    // Hide footer on specific pages
    const hideOnPaths = ['/login', '/register', '/forgot-password', '/admin', '/interviewer'];
    const shouldHide = hideOnPaths.some(path => pathname.startsWith(path));
    
    if (shouldHide) return null;

    return (
        <footer className={`relative w-full px-6 lg:px-20 py-32 overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#000]'}`}>
            {/* Aesthetic Background Element */}
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none ${isLight ? 'bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.05)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.1)_0%,transparent_70%)]'}`}></div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-20 pb-20 border-b ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="size-12 bg-gradient-to-tr from-primary to-accent rounded-xl flex items-center justify-center p-3 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                <svg className="text-white w-full h-full" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                                    <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                            </div>
                            <h2 className={`${isLight ? 'text-slate-900' : 'text-white'} text-3xl font-heading font-black tracking-tighter italic`}>HireSphere</h2>
                        </Link>
                        <p className={`text-xl max-w-sm font-body leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                            The intelligent <span className={`${isLight ? 'text-slate-900 font-bold' : 'text-white'}`}>Recruitment OS</span> for the world's most ambitious teams.
                        </p>
                        <div className="flex gap-6">
                            {['twitter', 'linkedin', 'github', 'instagram'].map((social) => (
                                <Link key={social} href="#" className={`size-10 rounded-full border flex items-center justify-center transition-all ${isLight ? 'border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-900' : 'border-white/10 text-slate-400 hover:text-white hover:border-white/30'}`}>
                                    <span className="material-symbols-outlined text-lg">{social === 'instagram' ? 'photo_camera' : 'terminal'}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h5 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Platform</h5>
                            <ul className="space-y-4">
                                {['Features', 'Pricing', 'Integrations', 'Enterprise'].map(item => (
                                    <li key={item}><Link className={`text-sm font-bold transition-all underline-offset-4 hover:underline ${isLight ? 'text-slate-600 hover:text-primary' : 'text-slate-400 hover:text-primary'}`} href={item === 'Features' ? '/features' : item === 'Pricing' ? '/pricing' : '#'}>{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Company</h5>
                            <ul className="space-y-4">
                                {['About Us', 'Careers', 'Customers', 'Contact'].map(item => (
                                    <li key={item}><Link className={`text-sm font-bold transition-all underline-offset-4 hover:underline ${isLight ? 'text-slate-600 hover:text-primary' : 'text-slate-400 hover:text-primary'}`} href={item === 'About Us' ? '/about' : item === 'Contact' ? '/contact' : '#'}>{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-8">
                            <h5 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Legal & Support</h5>
                            <ul className="space-y-4">
                                {['Privacy Policy', 'Terms of Service', 'Help Center', 'Cookie Policy'].map(item => (
                                    <li key={item}><Link className={`text-sm font-bold transition-all underline-offset-4 hover:underline ${isLight ? 'text-slate-600 hover:text-primary' : 'text-slate-400 hover:text-primary'}`} href="#">{item}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-10">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                        © 2024 HireSphere Inc. — Built for the future of work.
                    </p>
                    <div className="flex items-center gap-3">
                        <div className={`size-2 rounded-full animate-pulse ${isLight ? 'bg-primary' : 'bg-accent'}`}></div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-primary' : 'text-accent'}`}>System Online</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
