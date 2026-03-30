'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Calendar, 
    Bell, 
    Video, 
    Users, 
    Search, 
    Mail, 
    FileText, 
    BarChart3, 
    PieChart, 
    ShieldCheck, 
    ArrowRight,
    Zap,
    CheckCircle2,
    Target,
    Layers,
    LayoutDashboard
} from 'lucide-react';

export default function FeaturesPage() {
    return (
        <div className="bg-white text-slate-900 min-h-screen font-body selection:bg-slate-900 selection:text-white overflow-x-hidden">
            <main className="flex flex-col items-center relative">
                
                {/* Hero Section */}
                <section className="w-full max-w-7xl px-6 pt-40 pb-24 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto flex flex-col items-center gap-8"
                    >
                        <span className="px-5 py-2 rounded-full bg-slate-950 text-white text-[11px] font-bold uppercase tracking-widest shadow-none shadow-slate-950/20">
                            Enterprise Capabilities
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-slate-950 leading-[0.9] tracking-tight">
                            Build your <span className="text-slate-400">dream team</span> with precision.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl leading-relaxed font-medium">
                            A professional-grade suite of recruitment intelligence tools designed for high-growth engineering and product organizations.
                        </p>
                    </motion.div>
                </section>

                {/* Scheduling Section */}
                <section className="w-full max-w-7xl px-6 py-32" id="scheduling">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-8"
                        >
                            <div className="space-y-8">
                                <div className="size-20 rounded-2xl bg-slate-50 text-slate-950 flex items-center justify-center shadow-none border border-slate-100">
                                    <Calendar className="size-10" />
                                </div>
                                <h2 className="text-5xl md:text-6xl font-bold text-slate-950 leading-none tracking-tight">
                                    Zero-Touch <br />Scheduling
                                </h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-md">Eliminate the administrative burden and provide candidates with a premium booking experience.</p>
                            </div>
                            <div className="space-y-6">
                                <FeatureItem
                                    icon={Calendar}
                                    title="Multi-Calendar Sync"
                                    desc="Synchronize unlimited organizational calendars to find optimal slots across global timezones automatically."
                                />
                                <FeatureItem
                                    icon={Bell}
                                    title="Omnichannel Reminders"
                                    desc="Automated sequences via Email and Slack to maintain 100% interview attendance rates."
                                />
                                <FeatureItem
                                    icon={Video}
                                    title="Native Video Integration"
                                    desc="Direct deep-linking with Zoom, Google Meet, and Microsoft Teams for secure, dynamic meeting rooms."
                                />
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 border border-slate-200 rounded-[3rem] p-6 aspect-[4/3] flex items-center justify-center shadow-inner"
                        >
                             <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-8">
                                  <div className="h-4 w-1/4 bg-slate-100 rounded-full"></div>
                                  <div className="grid grid-cols-7 gap-3">
                                       {[...Array(21)].map((_, i) => (
                                            <div key={i} className={`h-8 rounded-lg border ${i % 7 === 3 ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-100'}`}></div>
                                       ))}
                                  </div>
                                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-slate-100 border border-slate-200"></div>
                                            <div className="space-y-2">
                                                 <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                                                 <div className="h-3 w-20 bg-slate-50 rounded-full"></div>
                                            </div>
                                       </div>
                                       <div className="h-10 px-6 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest flex items-center shadow-none shadow-slate-900/10">Confirm Slot</div>
                                  </div>
                             </div>
                        </motion.div>
                    </div>
                </section>

                {/* CRM Section */}
                <section className="w-full max-w-7xl px-6 py-32" id="crm">
                    <div className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 border border-slate-900 relative overflow-hidden group shadow-[0_64px_128px_-24px_rgba(0,0,0,0.4)]">
                        <div className="relative z-10 flex flex-col items-center text-center mb-24 gap-8">
                            <div className="size-20 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 shadow-none">
                                <Users className="size-10" />
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
                                Enterprise Talent CRM
                            </h2>
                            <p className="text-2xl text-slate-400 max-w-2xl font-medium leading-relaxed">Systematically nurture your talent pipeline with a centralized intelligence hub.</p>
                        </div>
                        
                        <div className="relative z-10 grid md:grid-cols-3 gap-8">
                            <CrmCard
                                icon={Search}
                                title="Intelligence Scoring"
                                desc="Our proprietary engine surfaces high-potential candidates based on historical assessment patterns."
                            />
                            <CrmCard
                                icon={Mail}
                                title="Engagement Sequences"
                                desc="Automated, personalized nurture campaigns that maintain high response rates from passive talent."
                            />
                            <CrmCard
                                icon={FileText}
                                title="Unified Dossiers"
                                desc="Centralize every feedback loop, assessment score, and resume version in one high-fidelity profile."
                            />
                        </div>
                    </div>
                </section>

                {/* Analytics Section */}
                <section className="w-full max-w-7xl px-6 py-32" id="analytics">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="order-2 lg:order-1 bg-slate-50 border border-slate-200 rounded-[3rem] p-6 aspect-[4/3] flex items-center justify-center shadow-inner"
                        >
                             <div className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col justify-between">
                                  <div className="flex items-center justify-between">
                                       <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hiring Velocity</h4>
                                       <div className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/40 rounded-full text-[10px] font-bold uppercase tracking-widest">+18.4% YoY</div>
                                  </div>
                                  <div className="flex items-end gap-3 h-48">
                                       {[40, 60, 45, 90, 75, 80, 55, 95].map((h, i) => (
                                            <div key={i} className="flex-1 bg-slate-900 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                                       ))}
                                  </div>
                                  <div className="grid grid-cols-4 gap-4">
                                       {[1,2,3,4].map(i => <div key={i} className="h-2 bg-slate-100 rounded-full"></div>)}
                                  </div>
                             </div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2 flex flex-col gap-8"
                        >
                            <div className="space-y-8">
                                <div className="size-20 rounded-2xl bg-slate-50 text-slate-950 flex items-center justify-center shadow-none border border-slate-100">
                                    <BarChart3 className="size-10" />
                                </div>
                                <h2 className="text-5xl md:text-6xl font-bold text-slate-950 leading-none tracking-tight">
                                    Predictive Hiring Ops
                                </h2>
                                <p className="text-2xl text-slate-500 font-medium leading-relaxed">High-fidelity data visualization to identify and resolve pipeline bottlenecks instantly.</p>
                            </div>
                            <ul className="grid gap-6">
                                <BenefitPoint text="Real-time time-to-hire forecasting" />
                                <BenefitPoint text="Conversion analytics across every stage" />
                                <BenefitPoint text="Hiring cost optimization engine" />
                                <BenefitPoint text="Stakeholder reporting & audit logs" />
                            </ul>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full max-w-7xl px-6 py-40">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-2xl"
                    >
                        <h2 className="text-5xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-[0.9] tracking-tight relative z-10">
                            Ready to modernize your <br /> talent acquisition?
                        </h2>
                        <div className="mt-16 flex flex-wrap justify-center gap-8 relative z-10">
                            <Link href="/register" className="bg-white text-slate-950 text-[12px] uppercase font-bold h-20 px-14 rounded-2xl shadow-none hover:bg-slate-50 transition-all flex items-center tracking-widest">
                                Start Free Trial
                            </Link>
                            <Link href="/contact" className="bg-transparent border-2 border-white/10 text-white text-[12px] uppercase font-bold h-20 px-14 rounded-2xl hover:bg-white/5 transition-all flex items-center tracking-widest">
                                Talk to Sales
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}

function FeatureItem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="flex gap-8 p-6 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 hover:border-slate-900 hover:bg-white group">
            <div className="size-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-950 shadow-none group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                <Icon className="size-7" />
            </div>
            <div className="flex-1 space-y-2">
                <h4 className="text-xl font-bold text-slate-950 tracking-tight">{title}</h4>
                <p className="text-slate-500 text-sm font-semibold leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CrmCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-500 group flex flex-col items-start gap-8">
            <div className="size-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all duration-500">
                <Icon className="size-8" />
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                <p className="text-slate-400 font-semibold leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function BenefitPoint({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-6 group">
            <div className="size-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <CheckCircle2 className="size-4" />
            </div>
            <span className="text-slate-600 font-bold text-lg leading-tight group-hover:text-slate-950 transition-colors">{text}</span>
        </li>
    );
}
