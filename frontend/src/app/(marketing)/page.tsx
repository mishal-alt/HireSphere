'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [activePersona, setActivePersona] = useState<'Talent Leads' | 'Managers' | 'Executives'>('Talent Leads');

    return (
        <div className="bg-surface text-on-surface antialiased font-body min-h-screen">


            {/* Hero Section */}
            <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden min-h-screen flex items-center">
                <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[radial-gradient(circle_at_70%_30%,#dbea9833_0%,transparent_50%)]"></div>
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="relative z-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/30 text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-6">
                            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                            The Executive Greenhouse
                        </div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-primary leading-[1] md:leading-[0.9] mb-8 font-heading"
                        >
                            Cultivate Talent with <span className="text-secondary">Precision.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0"
                        >
                            HireSphere is the high-fidelity ATS designed for enterprise teams who view recruitment as an art of growth, not just a process of filling seats.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                            className="flex flex-wrap gap-4 justify-center lg:justify-start"
                        >
                            <button className="px-8 py-4 bg-secondary-fixed text-on-secondary-fixed rounded-xl font-bold text-lg shadow-xl shadow-secondary-fixed/20 hover:translate-y-[-2px] transition-all w-full sm:w-auto">
                                Experience the Platform
                            </button>
                        </motion.div>
                        <div className="flex items-center gap-3 px-4 py-2 sm:py-0 mt-10 justify-center lg:justify-start">
                            <div className="flex -space-x-3">
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" />
                                <img alt="User" className="w-10 h-10 rounded-full border-2 border-surface" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" />
                            </div>
                            <div className="text-sm text-left">
                                <div className="flex items-center gap-1 text-secondary">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-sm filled">star</span>
                                    ))}
                                </div>
                                <span className="font-bold text-primary">4.9/5</span> <span className="text-on-surface-variant">from 2k+ leaders</span>
                            </div>
                        </div>
                    </div>

                    {/* Floating UI Elements */}
                    <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] mt-12 lg:mt-0 scale-75 sm:scale-90 lg:scale-100">
                        <div className="absolute top-0 right-1/2 translate-x-1/2 lg:right-0 lg:translate-x-0 w-full max-w-[540px] h-[350px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl shadow-black/10 z-0 lg:rotate-1 bg-surface-container-lowest border border-outline-variant">
                            <div className="p-6 bg-primary text-white flex justify-between items-center">
                                <span className="font-bold">Pipeline Overview</span>
                                <span className="material-symbols-outlined">more_horiz</span>
                            </div>
                            <div className="p-8 space-y-6 text-on-surface">
                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 bg-surface-container-low rounded-xl">
                                        <div className="text-xs text-on-surface-variant mb-1">New Candidates</div>
                                        <div className="text-2xl font-bold">124</div>
                                    </div>
                                    <div className="flex-1 p-4 bg-secondary-container rounded-xl">
                                        <div className="text-xs text-on-secondary-container mb-1">Hired This Month</div>
                                        <div className="text-2xl font-bold">18</div>
                                    </div>
                                </div>
                                <div className="w-full h-24 sm:h-32 bg-surface-container rounded-lg flex items-end p-4 gap-2">
                                    {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                        <div key={i} className="flex-1 bg-secondary rounded-t-sm" style={{ height: `${h}%` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-32 -left-4 sm:-left-12 w-64 sm:w-72 glass p-5 rounded-2xl shadow-2xl z-20 -rotate-2 border border-white/20">
                            <div className="flex items-center gap-4 mb-4">
                                <img alt="Candidate" className="w-12 h-12 rounded-full object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" />
                                <div>
                                    <div className="font-bold text-primary">Marcus Thorne</div>
                                    <div className="text-xs text-on-surface-variant italic">Senior Architect</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="px-2 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded text-[10px] font-bold uppercase">Interviewing</span>
                                <div className="flex -space-x-2">
                                    <div className="w-6 h-6 rounded-full bg-primary border border-surface text-[8px] flex items-center justify-center text-white">HR</div>
                                    <div className="w-6 h-6 rounded-full bg-secondary border border-surface text-[8px] flex items-center justify-center text-white">ENG</div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 sm:bottom-12 right-0 sm:right-12 glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-xl z-10 flex items-center gap-4 animate-bounce border border-white/20">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                                <span className="material-symbols-outlined filled text-sm sm:text-base">bolt</span>
                            </div>
                            <div>
                                <div className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest text-on-surface">Quick Transfer</div>
                                <div className="text-sm sm:text-base font-bold text-primary">Move to Hired</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-surface-container-low">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold tracking-tight text-primary mb-4 font-heading">Collaboration as a Catalyst</h2>
                        <p className="text-on-surface-variant">Break down silos between recruitment and engineering with integrated, real-time decision tools.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="md:col-span-2 bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative border border-outline-variant"
                        >
                            <div className="relative z-10 text-on-surface">
                                <span className="material-symbols-outlined text-4xl text-secondary mb-6 filled">group_work</span>
                                <h3 className="text-2xl font-bold text-primary mb-4 font-heading">Real-time Collaboration</h3>
                                <p className="text-on-surface-variant mb-8 max-w-sm">Every interview, note, and score is synced instantly across the entire hiring team. No more manual updates or missed signals.</p>
                                <div className="flex items-center gap-2 text-secondary font-bold cursor-pointer">
                                    Learn more <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                            <div className="absolute -right-20 -bottom-10 w-80 h-80 bg-secondary-fixed/10 rounded-full blur-3xl group-hover:bg-secondary-fixed/20 transition-all"></div>
                        </motion.div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-primary p-8 rounded-[2rem] shadow-xl text-white flex flex-col justify-between"
                        >
                            <div>
                                <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-6 filled">monitoring</span>
                                <h3 className="text-2xl font-bold mb-4 font-heading">Predictive Analytics</h3>
                                <p className="text-white/70">Forecast hiring speeds and identify bottlenecks before they impact your growth targets.</p>
                            </div>
                            <div className="mt-8 pt-8 border-t border-white/10">
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-secondary-fixed">+24%</span>
                                    <span className="text-xs mb-2 opacity-60 uppercase">Efficiency Gain</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Persona Section */}
            <section className="py-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center text-on-surface">
                        <div className="order-2 lg:order-1 relative">
                            <div className="relative bg-surface-container-high rounded-3xl p-4 shadow-2xl border border-outline-variant">
                                <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-inner border border-outline-variant">
                                    <div className="border-b border-surface-variant p-6 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary-fixed-dim"></div>
                                            <div className="h-2 w-24 bg-surface-variant rounded"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-12 h-6 bg-surface-container rounded-full"></div>
                                            <div className="w-6 h-6 bg-surface-container rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="h-4 w-3/4 bg-surface-container-low rounded"></div>
                                        <div className="h-4 w-full bg-surface-container-low rounded"></div>
                                        <div className="h-4 w-5/6 bg-surface-container-low rounded"></div>
                                        <div className="grid grid-cols-2 gap-4 mt-8">
                                            <div className="h-24 bg-secondary-fixed/20 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined text-secondary text-3xl filled">chat_bubble</span>
                                            </div>
                                            <div className="h-24 bg-tertiary-fixed/20 rounded-xl flex items-center justify-center">
                                                <span className="material-symbols-outlined text-tertiary text-3xl filled">event_available</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -z-10 -top-12 -left-12 w-64 h-64 bg-secondary-fixed/20 rounded-full blur-3xl"></div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="flex gap-2 p-1 bg-surface-container-high rounded-xl w-fit mb-10 border border-outline-variant">
                                {(['Talent Leads', 'Managers', 'Executives'] as const).map((persona) => (
                                    <button
                                        key={persona}
                                        onClick={() => setActivePersona(persona)}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative ${
                                            activePersona === persona 
                                            ? 'text-on-primary' 
                                            : 'text-on-surface-variant hover:text-primary'
                                        }`}
                                    >
                                        {activePersona === persona && (
                                            <motion.div 
                                                layoutId="activePersona"
                                                className="absolute inset-0 bg-primary rounded-lg -z-10"
                                            />
                                        )}
                                        {persona}
                                    </button>
                                ))}
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activePersona}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight mb-8 font-heading">
                                        Tailored for <br />{activePersona}.
                                    </h2>
                                    <div className="space-y-10">
                                        {activePersona === 'Talent Leads' && [
                                            { icon: 'lan', title: 'High-Velocity Sourcing', desc: 'Centralize every channel into a single high-fidelity pipeline with automated screening.' },
                                            { icon: 'group_add', title: 'Candidate Experience', desc: 'A premium, white-labeled portal that reflects your brand and respects the candidate’s time.' },
                                            { icon: 'bolt', title: 'Automation Engine', desc: 'Reduce time-to-hire by 40% with smart workflows that handle the manual heavy lifting.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-6">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant">
                                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-primary mb-2 font-heading">{item.title}</h4>
                                                    <p className="text-on-surface-variant">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {activePersona === 'Managers' && [
                                            { icon: 'dashboard_customize', title: 'Decision Dashboard', desc: 'Everything you need—scorecards, resumes, and history—in one single-pane-of-glass view.' },
                                            { icon: 'chat', title: 'Direct Collaboration', desc: 'Eliminate feedback loops with real-time @mentions and shared interview notes.' },
                                            { icon: 'verified', title: 'Quality of Hire', desc: 'Evidence-based hiring decisions powered by structured interview scorecards.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-6">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant">
                                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-primary mb-2 font-heading">{item.title}</h4>
                                                    <p className="text-on-surface-variant">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {activePersona === 'Executives' && [
                                            { icon: 'security', title: 'Enterprise Governance', desc: 'Role-based access controls and SOC2 compliance built into the foundation of every portal.' },
                                            { icon: 'insights', title: 'Strategic Analytics', desc: 'Forecast hiring speeds and identify bottlenecks before they impact your growth targets.' },
                                            { icon: 'account_balance', title: 'Recruitment ROI', desc: 'Visualize the impact of your hiring strategy on the company’s bottom line.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-6">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center border border-outline-variant">
                                                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-bold text-primary mb-2 font-heading">{item.title}</h4>
                                                    <p className="text-on-surface-variant">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto hero-gradient rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tighter mb-8 font-heading">Ready to evolve your hiring?</h2>
                        <p className="text-white/70 text-xl max-w-2xl mx-auto mb-12">Join 500+ forward-thinking enterprises that have turned their recruitment into a strategic advantage.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-10 py-5 bg-secondary-fixed text-on-secondary-fixed rounded-2xl font-extrabold text-xl shadow-lg hover:scale-105 transition-all">Book a VIP Demo</button>
                            <button className="px-10 py-5 bg-white/10 text-white rounded-2xl font-bold text-xl backdrop-blur-md hover:bg-white/20 transition-all border border-white/10">View Pricing</button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
                </div>
            </section>


        </div>
    );
}
