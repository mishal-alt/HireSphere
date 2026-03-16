'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FeaturesPage() {
    return (
        <div className="bg-white text-slate-900 min-h-screen font-body selection:bg-primary/20 overflow-x-hidden">
            <main className="flex flex-col items-center relative">
                {/* Refined Background Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 -z-10"></div>
                <div className="absolute top-[800px] left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/4 -translate-x-1/4 -z-10"></div>

                {/* Hero Section */}
                <section className="w-full max-w-[1400px] px-8 lg:px-20 pt-32 pb-24 text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto flex flex-col items-center gap-10"
                    >
                        <span className="px-5 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10">
                            Powerful Capabilities
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-slate-900 leading-[0.95] tracking-tighter">
                            Build your <span className="italic font-serif font-light text-primary">dream team</span> with precision.
                        </h1>
                        <p className="text-2xl text-slate-500 max-w-2xl leading-relaxed font-body">
                            A high-performance suite of recruitment tools designed for modern engineering and product organizations.
                        </p>
                    </motion.div>
                </section>

                {/* Interview Automation */}
                <section className="w-full max-w-[1400px] px-8 lg:px-20 py-32 relative" id="interview-automation">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-12"
                        >
                            <div className="space-y-8">
                                <div className="size-20 rounded-3xl bg-slate-50 text-slate-800 flex items-center justify-center shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-[40px]">event_repeat</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 leading-none tracking-tight">
                                    Zero-Touch <br /><span className="text-primary italic font-serif font-light">Scheduling</span>
                                </h2>
                                <p className="text-xl text-slate-500 font-body leading-relaxed max-w-md">Eliminate the back-and-forth and give candidates a premium booking experience.</p>
                            </div>
                            <div className="space-y-6">
                                <FeatureItem
                                    icon="calendar_month"
                                    title="Smart Availability"
                                    desc="Sync unlimited calendars to find the perfect slot across global timezones automatically."
                                />
                                <FeatureItem
                                    icon="chat_bubble"
                                    title="Multi-Channel Reminders"
                                    desc="Automated SMS, Email, and Slack alerts to ensure 100% interview attendance."
                                />
                                <FeatureItem
                                    icon="videocam"
                                    title="Native Video Sync"
                                    desc="Deep integrations with Zoom, Google Meet, and Teams with dynamic secure links."
                                />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className="absolute -inset-10 bg-primary/5 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                            <div className="relative bg-white rounded-[3rem] p-10 border border-slate-200 shadow-3xl shadow-slate-200/50 aspect-square flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100/50 animate-float">
                                    <div className="space-y-8">
                                        <div className="h-4 w-1/4 bg-slate-200 rounded-full"></div>
                                        <div className="grid grid-cols-7 gap-3">
                                            {[...Array(21)].map((_, i) => (
                                                <div key={i} className={`h-12 rounded-xl border ${i % 7 === 2 || i % 7 === 4 ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white border-slate-100'}`}></div>
                                            ))}
                                        </div>
                                        <div className="p-8 bg-white rounded-3xl border border-slate-100 flex gap-6 items-center shadow-xl shadow-slate-200/40">
                                            <div className="size-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                                                <span className="material-symbols-outlined">person</span>
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-3 w-1/2 bg-slate-200 rounded-full"></div>
                                                <div className="h-3 w-1/4 bg-slate-100 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Candidate CRM */}
                <section className="w-full max-w-[1400px] px-8 lg:px-20 py-32" id="candidate-crm">
                    <div className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 border border-slate-900 relative overflow-hidden group shadow-3xl shadow-slate-950/20">
                        {/* Abstract dark section for variety */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center mb-24 gap-8">
                            <div className="size-20 rounded-3xl bg-white/5 flex items-center justify-center text-secondary border border-white/10">
                                <span className="material-symbols-outlined text-[40px]">groups</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none">
                                Enterprise Talent <span className="italic font-serif font-light text-secondary">Graph</span>
                            </h2>
                            <p className="text-2xl text-slate-400 max-w-2xl font-body leading-relaxed">Build lasting relationships with a candidate database that feels like magic.</p>
                        </div>
                        
                        <div className="relative z-10 grid md:grid-cols-3 gap-8">
                            <CrmCard
                                icon="search_check"
                                title="AI Sourcing"
                                desc="Proprietary matching engine that uncovers top talent based on cross-skill potential."
                            />
                            <CrmCard
                                icon="forward_to_inbox"
                                title="Engagement Flows"
                                desc="Automate personalized candidate journeys that feel human, not robotic."
                            />
                            <CrmCard
                                icon="history"
                                title="360° Profiles"
                                desc="Every feedback, assessment score, and touchpoint in one high-fidelity view."
                            />
                        </div>
                    </div>
                </section>

                {/* Advanced Analytics */}
                <section className="w-full max-w-[1400px] px-8 lg:px-20 py-32" id="analytics">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1 relative group"
                        >
                            <div className="absolute -inset-10 bg-accent/5 rounded-[4rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                            <div className="relative bg-white rounded-[3rem] p-12 border border-slate-200 shadow-3xl shadow-slate-200/50">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="bg-slate-50 p-8 rounded-3xl h-56 flex flex-col justify-end gap-6 border border-slate-100/50">
                                        <div className="flex items-end gap-3 h-32">
                                            {[30, 50, 80, 60, 90].map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary/20 rounded-t-xl relative group/bar hover:bg-primary/40 transition-all" style={{ height: `${h}%` }}>
                                                    <div className="absolute bottom-0 w-full bg-primary h-1/3 blur-[4px] rounded-full"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-50 p-8 rounded-3xl h-56 flex flex-col items-center justify-center gap-6 border border-slate-100/50">
                                        <div className="size-28 rounded-full border-[12px] border-slate-100 border-t-accent animate-spin-slow"></div>
                                        <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                                    </div>
                                    <div className="bg-slate-50 p-10 rounded-[2rem] col-span-2 border border-slate-100/50 space-y-8">
                                        <div className="h-2 w-1/4 bg-slate-200 rounded-full"></div>
                                        <div className="space-y-4">
                                            <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                                                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-1000"></div>
                                            </div>
                                            <div className="w-full h-4 bg-white rounded-full overflow-hidden shadow-inner border border-slate-100">
                                                <div className="bg-secondary h-full w-[60%] rounded-full opacity-70 transition-all duration-1000"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2 flex flex-col gap-12"
                        >
                            <div className="space-y-8">
                                <div className="size-20 rounded-3xl bg-slate-50 text-accent flex items-center justify-center shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-[40px]">insights</span>
                                </div>
                                <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 leading-none tracking-tight">
                                    Full-Stack <br /><span className="text-accent italic font-serif font-light">Recruitment Ops</span>
                                </h2>
                                <p className="text-2xl text-slate-500 font-body leading-relaxed">Predictive analytics that show you exactly where your pipeline is leaking.</p>
                            </div>
                            <ul className="grid gap-8">
                                <BenefitPoint text="Predictive time-to-hire forecasting powered by AI" />
                                <BenefitPoint text="Real-time cost-per-hire breakdown by source" />
                                <BenefitPoint text="Advanced DEI representation & equity tracking" />
                                <BenefitPoint text="Customized dashboard for every stakeholder" />
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full max-w-[1400px] px-8 lg:px-20 py-40">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-3xl shadow-slate-900/40 group"
                    >
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-all duration-1000"></div>
                        
                        <h2 className="text-5xl lg:text-7xl font-display font-black text-white max-w-4xl mx-auto leading-none tracking-tighter relative z-10">
                            Ready to build your <br /> <span className="italic font-serif font-light text-primary">next-gen</span> engineering team?
                        </h2>
                        <div className="mt-16 flex flex-wrap justify-center gap-8 relative z-10">
                            <button className="bg-white text-slate-900 text-sm font-black h-20 px-14 rounded-3xl shadow-2xl hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
                                Start your 14-day trial
                            </button>
                            <button className="bg-transparent border-2 border-white/10 text-white text-sm font-black h-20 px-14 rounded-3xl hover:bg-white/5 transition-all uppercase tracking-widest">
                                Talk to an expert
                            </button>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="flex gap-8 p-10 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 group">
            <div className="size-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div className="flex-1 space-y-2">
                <h4 className="text-xl font-heading font-black text-slate-900">{title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CrmCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/[0.08] transition-all duration-700 group flex flex-col items-start gap-10">
            <div className="size-20 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-xl shadow-transparent group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-[32px]">{icon}</span>
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-heading font-black text-white">{title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function BenefitPoint({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-6 group">
            <div className="size-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <span className="material-symbols-outlined text-lg font-black">check</span>
            </div>
            <span className="text-slate-600 font-bold text-lg leading-tight group-hover:text-slate-900 transition-colors">{text}</span>
        </li>
    );
}
