'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const FeatureCard = ({ title, desc, icon, className = "" }: { title: string, desc: string, icon: string, className?: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`group relative p-10 rounded-[2.5rem] border border-slate-200/60 bg-white hover:border-primary/30 transition-all duration-700 overflow-hidden ${className}`}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative z-10">
            <div className="size-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-body text-sm">{desc}</p>
        </div>
    </motion.div>
);

const PricingCard = ({ plan, price, features, description, popular = false }: { plan: string, price: string, features: string[], description: string, popular?: boolean }) => (
    <div className={`p-10 rounded-[2.5rem] border relative flex flex-col h-full transition-all duration-700 ${popular ? 'bg-slate-900 border-slate-900 text-white shadow-3xl shadow-slate-900/40 z-10 scale-105' : 'bg-white border-slate-200 text-slate-900 hover:border-primary/30 hover:shadow-2xl hover:shadow-slate-200/50'}`}>
        {popular && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-[9px] font-black px-8 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-xl">
                System Favorite
            </div>
        )}
        <div className="mb-10">
            <h3 className="text-xl font-heading font-black mb-3 tracking-tight">{plan}</h3>
            <p className={`text-xs font-medium leading-relaxed ${popular ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
        </div>
        <div className="mb-12">
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-display font-black tracking-tighter">{price}</span>
                {price !== 'Custom' && <span className={`text-sm font-bold ${popular ? 'text-slate-500' : 'text-slate-400'}`}>/mo</span>}
            </div>
        </div>
        <ul className="space-y-6 mb-12 flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                    <span className={`material-symbols-outlined text-lg ${popular ? 'text-primary' : 'text-slate-300'}`}>check_circle</span>
                    <span className={`text-[13px] font-medium leading-tight ${popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full h-16 font-black rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[10px] ${popular ? 'bg-white text-slate-900 hover:bg-slate-50 hover:scale-[1.02]' : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.02]'}`}>
            {price === 'Custom' ? 'Initiate Inquiry' : 'Initialize Plan'}
        </button>
    </div>
);

export default function SaaSPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [activePersona, setActivePersona] = useState<'Recruiters' | 'Managers' | 'Executives'>('Recruiters');

    return (
        <div className="bg-[#F8FAFC] text-slate-900 min-h-screen font-body selection:bg-primary/20 overflow-x-hidden relative">
            {/* Global Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] mix-blend-overlay bg-noise"></div>

            <main className="pt-24 relative z-10">
                {/* Hero Section */}
                <section className="relative pt-20 pb-40 overflow-hidden bg-white border-b border-slate-100">
                    {/* Artistic Background elements */}
                    <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-secondary/[0.02] rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4"></div>
                    
                    <div className="max-w-[1400px] mx-auto px-8 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-900 text-[10px] font-black uppercase tracking-[0.25em] shadow-sm">
                                    <span className="flex size-2">
                                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <span>v2.0 — The Future of Global Hiring</span>
                                    <span className="w-px h-4 bg-slate-200"></span>
                                    <span className="text-primary hover:underline cursor-pointer">What's new?</span>
                                </div>
                            </motion.div>

                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-[5rem] lg:text-[7.5rem] font-display font-black leading-[0.85] tracking-[-0.04em] text-slate-900"
                            >
                                Hire your team <br />
                                <span className="relative inline-block">
                                    <span className="italic font-serif font-light text-primary pr-4">faster</span>
                                    <span className="absolute -bottom-2 left-0 w-full h-2 bg-primary/10 rounded-full"></span>
                                </span>
                                than ever.
                            </motion.h1>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl lg:text-2xl text-slate-500 leading-relaxed max-w-3xl font-body font-medium"
                            >
                                HireSphere puts all your hiring tools in one simple place. Save time, find better people, and grow your team with ease.
                            </motion.p>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col items-center gap-10 pt-4"
                            >
                                <div className="flex flex-wrap justify-center gap-6">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link href="/register" className="bg-slate-900 text-white text-[11px] uppercase font-black tracking-[0.3em] h-20 px-16 rounded-[1.5rem] shadow-2xl shadow-slate-900/20 hover:bg-black transition-all flex items-center gap-4 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                            Get Started <span className="material-symbols-outlined text-sm">rocket_launch</span>
                                        </Link>
                                    </motion.div>
                                    <button className="bg-white border-2 border-slate-100 text-slate-900 text-[11px] uppercase font-black tracking-[0.25em] h-20 px-16 rounded-[1.5rem] hover:border-slate-300 transition-all shadow-sm flex items-center gap-4">
                                        Learn More
                                    </button>
                                </div>
                                <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-3">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="size-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                    <div className="size-full bg-slate-200"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <span>Join 500+ Engineering Teams</span>
                                    </div>
                                    <div className="w-px h-4 bg-slate-200 hidden md:block"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-sm filled">verified</span>
                                        <span>ISO 27001 Certified</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating "Live Activity" UX Component */}
                            <motion.div 
                                initial={{ x: 100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 2 }}
                                className="fixed bottom-12 right-12 z-[200] hidden xl:block"
                            >
                                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 p-5 pr-8 rounded-[1.5rem] shadow-2xl flex items-center gap-4 animate-float border-l-4 border-l-primary">
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">bolt</span>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Activity</div>
                                        <div className="text-xs font-black text-slate-900">Linear scheduled 18 interviews</div>
                                    </div>
                                    <button className="absolute top-2 right-2 text-slate-300 hover:text-slate-900">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* High-Fidelity Code-Based Dashboard Mockup */}
                        <motion.div 
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 1, ease: "circOut" }}
                            className="mt-32 relative group"
                        >
                            <div className="absolute -inset-10 bg-gradient-to-b from-primary/10 to-transparent rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            
                            <div className="relative rounded-[3rem] border border-slate-200 bg-white shadow-3xl overflow-hidden shadow-slate-200/60 flex h-[600px]">
                                {/* Sidebar Mockup */}
                                <div className="w-20 border-r border-slate-100 flex flex-col items-center py-8 gap-10 bg-slate-50/50">
                                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined text-xl">dataset</span>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        {['grid_view', 'person', 'work', 'calendar_month', 'settings'].map((icon, i) => (
                                            <div key={i} className={`size-10 rounded-xl flex items-center justify-center transition-all ${i === 0 ? 'bg-white text-primary shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                                                <span className="material-symbols-outlined text-xl">{icon}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto size-10 rounded-full bg-slate-200 animate-pulse"></div>
                                </div>

                                {/* Main Content Mockup */}
                                <div className="flex-1 flex flex-col">
                                    {/* Top Bar Mockup */}
                                    <div className="h-20 border-b border-slate-100 px-10 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dashboard Overview</span>
                                            <h4 className="text-xl font-heading font-black text-slate-900 tracking-tight">Active Hiring</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-48 bg-slate-50 rounded-full border border-slate-100 flex items-center px-4 gap-3">
                                                <span className="material-symbols-outlined text-sm text-slate-400">search</span>
                                                <div className="h-2 w-20 bg-slate-200 rounded-full"></div>
                                            </div>
                                            <div className="size-10 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-500">
                                                <span className="material-symbols-outlined text-xl">notifications</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dashboard Body Mockup */}
                                    <div className="flex-1 p-10 bg-slate-50/30 overflow-hidden">
                                        <div className="grid grid-cols-3 gap-6 mb-10">
                                            {[
                                                { label: 'Total Hires', val: '128', trend: '+12%', color: 'emerald' },
                                                { label: 'Interviews', val: '42', trend: '+5%', color: 'secondary' },
                                                { label: 'Time to Hire', val: '18d', trend: '-2d', color: 'primary' }
                                            ].map((stat, i) => (
                                                <div key={i} className="p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-2">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</span>
                                                    <div className="flex items-end justify-between">
                                                        <span className="text-3xl font-display font-black text-slate-900 leading-none">{stat.val}</span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100`}>
                                                            {stat.trend}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Recent Candidates</span>
                                                <div className="flex gap-2">
                                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                                    <div className="size-2 rounded-full bg-slate-300"></div>
                                                </div>
                                            </div>
                                            <div className="divide-y divide-slate-50">
                                                {[
                                                    { name: 'Marcus Miller', role: 'Staff Engineer', status: 'Final Stage', initial: 'MM', color: 'primary' },
                                                    { name: 'Elena Rodriguez', role: 'Product Designer', status: 'Technical Interview', initial: 'ER', color: 'secondary' },
                                                    { name: 'James Wilson', role: 'Solutions Architect', status: 'Offer Extended', initial: 'JW', color: 'emerald' },
                                                ].map((c, i) => (
                                                    <div key={i} className="px-8 py-5 flex items-center justify-between group/row hover:bg-slate-50/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`size-10 rounded-xl bg-${c.color}-50 text-${c.color}-600 flex items-center justify-center font-black text-xs shadow-sm`}>
                                                                {c.initial}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-900">{c.name}</div>
                                                                <div className="text-[10px] text-slate-400 font-medium">{c.role}</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest border border-slate-200 group-hover/row:bg-white group-hover/row:border-primary/20 group-hover/row:text-primary transition-all">
                                                                {c.status}
                                                            </div>
                                                            <span className="material-symbols-outlined text-slate-300 group-hover/row:text-slate-900 transition-colors cursor-pointer">more_horiz</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Floating Card */}
                            <motion.div 
                                initial={{ x: 50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                                className="absolute -right-12 top-64 bg-slate-900 text-white p-8 rounded-3xl shadow-3xl border border-white/10 max-w-[240px] hidden xl:block"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Hire Rate</span>
                                        <span className="text-xl font-black">+24.8%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '75%' }}
                                        transition={{ delay: 1.5, duration: 1.5 }}
                                        className="h-full bg-primary"
                                    ></motion.div>
                                </div>
                                <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-body">Hire faster with data you can trust.</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Trusted By Section */}
                <section className="py-32 bg-[#F8FAFC] relative">
                    <div className="max-w-[1400px] mx-auto px-8">
                        <div className="flex flex-col items-center gap-16">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Trusted by teams everywhere</p>
                            <div className="w-full overflow-hidden flex whitespace-nowrap items-center">
                                {/* Smooth Scrolling Logo Bar (Marquee UX) */}
                                <div className="flex gap-20 pr-20 animate-marquee items-center grayscale opacity-30">
                                    {['STRIPE', 'AIRBNB', 'SLACK', 'LINEAR', 'VERCEL', 'ADOBE', 'NOTION', 'FIGMA', 'RAILWAY'].map(brand => (
                                        <div key={brand} className="font-heading font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">{brand}</div>
                                    ))}
                                </div>
                                <div className="flex gap-20 pr-20 animate-marquee items-center grayscale opacity-30">
                                    {['STRIPE', 'AIRBNB', 'SLACK', 'LINEAR', 'VERCEL', 'ADOBE', 'NOTION', 'FIGMA', 'RAILWAY'].map(brand => (
                                        <div key={brand} className="font-heading font-black text-4xl tracking-tighter hover:text-primary transition-colors cursor-default">{brand}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Simple Process Section */}
                <section className="py-40 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-[1400px] mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                            <div className="space-y-16">
                                <div className="space-y-6">
                                    <h2 className="text-6xl font-display font-black tracking-tight text-slate-900">How it works.</h2>
                                    <p className="text-xl text-slate-500 font-body">Three simple steps to hiring better people.</p>
                                </div>

                                <div className="space-y-12">
                                    {[
                                        { step: '01', title: 'Set up', desc: 'Connect your tools and create your hiring plan.', icon: 'hub' },
                                        { step: '02', title: 'Schedule', desc: 'Auto-schedule meetings across different time zones.', icon: 'sync' },
                                        { step: '03', title: 'Hire', desc: 'See your data and make better hiring choices.', icon: 'trending_up' }
                                    ].map((s, i) => (
                                        <motion.div 
                                            key={i} 
                                            whileHover={{ x: 10 }}
                                            className="flex gap-8 group cursor-default"
                                        >
                                            <div className="flex flex-col items-center">
                                                <div className="size-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                                    <span className="material-symbols-outlined">{s.icon}</span>
                                                </div>
                                                {i < 2 && <div className="w-px h-16 bg-slate-200 group-hover:bg-primary/30 transition-colors"></div>}
                                            </div>
                                            <div className="space-y-2 pt-2">
                                                <h4 className="text-lg font-heading font-black text-slate-900 tracking-tight flex items-center gap-3">
                                                    <span className="text-primary text-[10px] font-black uppercase tracking-widest">{s.step}</span>
                                                    {s.title}
                                                </h4>
                                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">{s.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-square bg-white border border-slate-200 rounded-[4rem] shadow-3xl overflow-hidden p-1 bg-noise">
                                    <div className="size-full bg-slate-50 rounded-[3.8rem] flex items-center justify-center">
                                        <div className="relative flex flex-col items-center gap-8">
                                            <div className="size-32 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl animate-float">
                                                <span className="material-symbols-outlined text-5xl">rocket_launch</span>
                                            </div>
                                            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-xl flex items-center gap-6">
                                                <div className="size-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">84%</div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Efficiency Boost</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Role-Based OS (UX Persona Switcher) */}
                <section className="py-40 px-8 bg-white border-y border-slate-100">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center space-y-8 mb-24">
                            <h2 className="text-5xl lg:text-7xl font-display font-black tracking-tight text-slate-900">Made for your role.</h2>
                            <div className="flex flex-wrap justify-center gap-4 pt-4">
                                {['Recruiters', 'Managers', 'Executives'].map((tab) => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActivePersona(tab as any)}
                                        className={`h-14 px-10 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all ${activePersona === tab ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        For {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={activePersona}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
                            >
                                <div className="order-2 lg:order-1 relative h-[500px] bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden group">
                                    <div className="absolute inset-0 bg-noise opacity-50"></div>
                                    <div className="absolute inset-10 bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 flex flex-col gap-6">
                                        <div className="flex items-center justify-between">
                                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                                <span className="material-symbols-outlined">
                                                    {activePersona === 'Recruiters' ? 'schedule' : activePersona === 'Executives' ? 'monitoring' : 'group_add'}
                                                </span>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest">Live Sync</div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="h-4 w-3/4 bg-slate-100 rounded-full"></div>
                                            <div className="h-4 w-1/2 bg-slate-50 rounded-full"></div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 pt-4">
                                            {[1,2,3,4].map(i => (
                                                <div key={i} className="aspect-square bg-slate-50 rounded-xl border border-dashed border-slate-200"></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-10 right-10 left-10 p-6 bg-slate-900 rounded-2xl text-white flex items-center justify-between shadow-2xl">
                                        <span className="text-[10px] font-black uppercase tracking-widest">
                                            {activePersona === 'Executives' ? 'Profit Report' : 'Meeting Found'}
                                        </span>
                                        <button className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-lg">View More</button>
                                    </div>
                                </div>

                                <div className="order-1 lg:order-2 space-y-10">
                                    <span className="text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                                        {activePersona === 'Recruiters' ? 'Recruiter Dashboard' : activePersona === 'Executives' ? 'Business View' : 'Manager Hub'}
                                    </span>
                                    <h3 className="text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight leading-none">
                                        {activePersona === 'Recruiters' ? 'Stop wasting time on scheduling.' : activePersona === 'Executives' ? 'See your return on hiring.' : 'Build your team faster.'}
                                    </h3>
                                    <p className="text-lg text-slate-500 font-body leading-relaxed max-w-xl">
                                        {activePersona === 'Recruiters' 
                                            ? 'Recruiters save over 14 hours a month with auto-scheduling. Connect your team and candidates instantly without the back-and-forth emails.'
                                            : activePersona === 'Executives'
                                            ? 'Get clear data on how fast you are hiring and what it costs. Make better business choices with real-time reports.'
                                            : 'Help managers keep track of new people with simple scorecards and easy tools to give feedback on candidates.'}
                                    </p>
                                    <ul className="space-y-4 pt-4">
                                        {(activePersona === 'Recruiters' 
                                            ? ['Automatic Meeting Finder', 'Team Rotation', 'Slack Alerts']
                                            : activePersona === 'Executives'
                                            ? ['Business Analytics', 'Resource Planning', 'Secure Data']
                                            : ['Easy Scorecards', 'Team Feedback', 'Mobile Approvals']
                                        ).map(item => (
                                            <li key={item} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                                                <div className="size-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[14px]">done</span>
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-40 px-8 bg-white border-y border-slate-100" id="features">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
                            <div className="max-w-2xl space-y-8">
                                <h2 className="text-5xl lg:text-6xl font-display font-black tracking-tighter text-slate-900 leading-none">
                                    Everything you need to <span className="text-primary italic">grow</span> your team.
                                </h2>
                                <p className="text-xl text-slate-500 font-body">
                                    From auto-scheduling to smart candidate ranking, we have everything you need in one easy tool.
                                </p>
                            </div>
                            <Link href="/features" className="group flex items-center gap-4 text-[11px] uppercase font-black tracking-[0.2em] text-primary">
                                See all features 
                                <span className="size-10 rounded-full border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <FeatureCard 
                                className="md:col-span-8 lg:col-span-8 h-[500px]"
                                title="Easy Interview Setup" 
                                desc="Our smart system handles all the scheduling for you. No more double-booking or timezone mistakes."
                                icon="calendar_today"
                            />
                            <FeatureCard 
                                className="md:col-span-4 lg:col-span-4 h-[500px]"
                                title="Simple CRM" 
                                desc="Keep track of every person you talk to in one place."
                                icon="group"
                            />
                            <FeatureCard 
                                className="md:col-span-4 lg:col-span-4 h-[400px]"
                                title="Fair Reviews" 
                                desc="Use clear rules to review every candidate fairly."
                                icon="assignment_turned_in"
                            />
                            <FeatureCard 
                                className="md:col-span-4 lg:col-span-4 h-[400px]"
                                title="Works with your tools" 
                                desc="Connect with Slack, Google, and Outlook in seconds."
                                icon="hub"
                            />
                            <FeatureCard 
                                className="md:col-span-4 lg:col-span-4 h-[400px]"
                                title="Safe and Private" 
                                desc="Your data is always safe and locked away."
                                icon="verified_user"
                            />
                            <FeatureCard 
                                className="md:col-span-12 h-[350px]"
                                title="Simple Hiring Reports" 
                                desc="See exactly how your hiring is going with easy-to-read charts and reports. Understand what works and what doesn't."
                                icon="leaderboard"
                            />
                        </div>
                    </div>
                </section>

                {/* Editorial Section - Analytics */}
                <section className="py-40 px-8 relative overflow-hidden bg-slate-950 text-white">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8B5CF6 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
                    <div className="max-w-[1400px] mx-auto relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                            <div className="space-y-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/20 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
                                    Advanced Insights
                                </div>
                                <h2 className="text-6xl font-display font-black tracking-tight leading-none">Data to help you hire better.</h2>
                                <p className="text-xl text-slate-400 leading-relaxed font-body">
                                    Stop guessing. Measure every part of your hiring and learn how to improve with simple reports and easy data.
                                </p>
                                <div className="grid grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-2">
                                        <div className="text-4xl font-display font-black text-white">32%</div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faster Hiring</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-4xl font-display font-black text-white">85%</div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Happier Teams</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute -inset-20 bg-primary/20 rounded-full blur-[120px]"></div>
                                <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-8 shadow-2xl">
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold">Hiring Speed</span>
                                            <span className="text-primary font-black">+14.2%</span>
                                        </div>
                                        <div className="h-64 flex items-end gap-3">
                                            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 75].map((h, i) => (
                                                <div key={i} className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-5 gap-2">
                                            {['JAN', 'FEB', 'MAR', 'APR', 'MAY'].map(m => (
                                                <div key={m} className="text-[9px] text-center font-black text-slate-500">{m}</div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-40 px-8 bg-slate-50" id="pricing">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center max-w-3xl mx-auto space-y-12 mb-24">
                            <h2 className="text-6xl font-display font-black tracking-tight text-slate-900 leading-none">Simple pricing for everyone.</h2>
                            <div className="flex flex-col items-center gap-6">
                                <div className="flex items-center gap-4 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                                    <button 
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setBillingCycle('yearly')}
                                        className={`h-11 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        Yearly
                                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-md">SAVE 20%</div>
                                    </button>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">Choose a plan that works for you.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-12">
                            <PricingCard 
                                plan="Starter"
                                price={billingCycle === 'monthly' ? '$49' : '$39'}
                                description="Best for small teams starting to hire."
                                features={['Up to 5 active jobs', 'Standard scorecards', 'Basic tracking', 'Help center access']}
                            />
                            <PricingCard 
                                plan="Growth"
                                price={billingCycle === 'monthly' ? '$199' : '$159'}
                                description="Perfect for teams hiring 10+ people a month."
                                features={['Unlimited active jobs', 'Custom hiring steps', 'Auto-scheduling', 'Email support', 'Full reports']}
                                popular={true}
                            />
                            <PricingCard 
                                plan="Enterprise"
                                price="Custom"
                                description="Built for large companies with many needs."
                                features={['Your own branding', 'Single Sign-On (SSO)', 'Full API access', 'Dedicated manager', 'Custom reports']}
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-40 px-8 bg-[#F8FAFC] border-b border-slate-100">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                            <div className="lg:col-span-4 space-y-8">
                                <h2 className="text-5xl font-display font-black tracking-tighter text-slate-900 leading-[0.9]">Trusted by the best.</h2>
                                <p className="text-lg text-slate-500 font-body leading-relaxed">
                                    Join thousands of teams who use HireSphere to build their companies.
                                </p>
                                <div className="flex gap-4">
                                    <div className="size-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined">west</span>
                                    </div>
                                    <div className="size-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer">
                                        <span className="material-symbols-outlined">east</span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-8 flex gap-8 overflow-x-auto pb-12 custom-scrollbar snap-x">
                                {[
                                    { name: 'SARAH JENKINS', role: 'Head of People, Vercel', text: 'HireSphere is the best way to manage our hiring. It saves us many hours every single week.' },
                                    { name: 'DAVID CHEN', role: 'Talent Lead, Linear', text: 'A very simple and beautiful tool. It makes hiring people feel easy.' },
                                    { name: 'ELENA ROSSI', role: 'Chief People Officer, Stripe', text: 'The reports are amazing. We can finally see exactly what is happening with our hiring.' }
                                ].map((test, i) => (
                                    <div key={i} className="min-w-[450px] snap-center p-14 rounded-[3rem] bg-white border border-slate-100/80 shadow-sm flex flex-col justify-between group/test hover:border-primary/20 transition-all duration-500">
                                        <div className="space-y-10">
                                            <div className="flex gap-1 text-primary">
                                                {[1,2,3,4,5].map(star => (
                                                    <span key={star} className="material-symbols-outlined text-sm filled">star</span>
                                                ))}
                                            </div>
                                            <p className="text-2xl text-slate-900 font-serif italic leading-relaxed font-light">
                                                &quot;{test.text}&quot;
                                            </p>
                                        </div>
                                        <div className="mt-16 flex items-center gap-5">
                                            <div className="size-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black uppercase text-xs group-hover/test:bg-primary transition-colors duration-500">
                                                {test.name[0]}{test.name.split(' ')[1][0]}
                                            </div>
                                            <div>
                                                <div className="font-heading font-black text-slate-900 text-sm tracking-tight">{test.name}</div>
                                                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-0.5">{test.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-60 px-8 relative">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="bg-slate-900 rounded-[5rem] p-32 text-center relative overflow-hidden group shadow-3xl shadow-slate-900/40">
                            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-1000"></div>
                            
                            <div className="relative z-10 space-y-16">
                                <h2 className="text-7xl md:text-8xl lg:text-[10rem] font-display font-black text-white leading-[0.8] tracking-[-0.04em]">
                                    One tool to <br />
                                    <span className="text-primary italic font-serif font-light">hire</span> everyone.
                                </h2>
                                <p className="text-slate-400 text-xl lg:text-2xl max-w-2xl mx-auto font-body font-medium leading-relaxed">Join thousands of teams already hiring better and faster with HireSphere.</p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-6">
                                    <Link href="/register" className="bg-white text-slate-900 text-[11px] uppercase font-black tracking-[0.3em] h-20 px-16 rounded-[1.5rem] shadow-xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                                        Get Started
                                    </Link>
                                    <button className="bg-transparent border-2 border-white/10 text-white text-[11px] uppercase font-black tracking-[0.3em] h-20 px-16 rounded-[1.5rem] hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center">
                                        Talk to us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </div>
    );
}


