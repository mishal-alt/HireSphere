'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    Calendar,
    BarChart3,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    Globe,
    Building2,
    Search,
    ChevronRight,
    Star,
    Quote,
    Layers,
    LayoutDashboard,
    Briefcase,
    PieChart,
    MessageSquare,
    Target
} from 'lucide-react';

const FeatureCard = ({ title, desc, icon: Icon, className = "" }: { title: string, desc: string, icon: any, className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`group p-6 rounded-2xl border border-slate-200 bg-white hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 ${className}`}
    >
        <div className="size-14 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-none border border-slate-100">
            <Icon className="size-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
    </motion.div>
);

const PricingCard = ({ plan, price, features, description, popular = false }: { plan: string, price: string, features: string[], description: string, popular?: boolean }) => (
    <div className={`p-6 rounded-2xl border relative flex flex-col h-full transition-all duration-500 ${popular ? 'bg-slate-900 border-slate-900 text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] z-10 lg:scale-105' : 'bg-white border-slate-200 text-slate-900 hover:border-primary'}`}>
        {popular && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-8 py-2.5 rounded-full uppercase tracking-[0.2em] shadow-none">
                Most Popular
            </div>
        )}
        <div className="mb-10">
            <h3 className="text-2xl font-bold mb-3 tracking-tight">{plan}</h3>
            <p className={`text-sm font-medium leading-relaxed ${popular ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
        </div>
        <div className="mb-12">
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{price}</span>
                {price !== 'Custom' && <span className={`text-sm font-bold ${popular ? 'text-slate-500' : 'text-slate-400'}`}>/mo</span>}
            </div>
        </div>
        <ul className="space-y-6 mb-12 flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 className={`size-5 shrink-0 ${popular ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    <span className={`text-sm font-semibold leading-tight ${popular ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full h-16 font-bold rounded-2xl transition-all duration-300 uppercase tracking-[0.2em] text-[11px] ${popular ? 'bg-primary text-white hover:opacity-90 hover:scale-[1.01]' : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.01]'}`}>
            {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </button>
    </div>
);

export default function MarketingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const [activePersona, setActivePersona] = useState<'Talent Leads' | 'Managers' | 'Executives'>('Talent Leads');

    return (
        <div className="bg-white text-slate-900 min-h-screen font-body selection:bg-slate-900 selection:text-white overflow-x-hidden relative">

            <main className="pt-24 relative z-10">
                {/* Hero Section */}
                <section className="relative pt-24 lg:pt-32 pb-48 overflow-hidden bg-white">
                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-12">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-900 text-[11px] font-bold uppercase tracking-widest shadow-none"
                            >
                                <span className="flex size-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>The next generation of hiring is here</span>
                                <span className="w-px h-4 bg-slate-200"></span>
                                <Link href="/about" className="text-slate-900 hover:underline">Read Release Note</Link>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold leading-[0.9] tracking-tight text-slate-950"
                            >
                                Hire your team <br />
                                <span className="text-slate-400 font-medium">faster</span> than ever.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl font-medium"
                            >
                                HireSphere unifies your entire recruitment workflow. From sourcing to onboarding, save time and find the world's best talent in one place.
                            </motion.p>

                             <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap justify-center gap-6 pt-6"
                            >
                                <Link href="/register" className="h-20 px-12 bg-primary text-white text-[12px] uppercase font-bold tracking-widest rounded-[1.5rem] shadow-2xl shadow-primary/20 hover:opacity-90 transition-all hover:scale-105 flex items-center gap-3">
                                    Start Your Free Trial
                                    <ChevronRight className="size-4" />
                                </Link>
                                <button className="h-20 px-12 bg-white border border-slate-200 text-slate-900 text-[12px] uppercase font-bold tracking-widest rounded-[1.5rem] hover:border-primary transition-all shadow-none flex items-center justify-center">
                                    Watch Product Demo
                                </button>
                            </motion.div>

                            <div className="pt-12 flex flex-wrap justify-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                    No credit card required
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                    14-day free trial
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                    GDPR & SOC2 Compliant
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Preview Section */}
                    <div className="mt-32 max-w-7xl mx-auto px-6 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 border border-slate-200 rounded-[3.5rem] p-4 lg:p-8 shadow-2xl"
                        >
                            <div className="relative aspect-[16/9] lg:aspect-[16/7] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex">
                                {/* Sidebar Mockup */}
                                <div className="w-20 lg:w-24 border-r border-slate-100 flex flex-col items-center py-10 gap-8 bg-slate-50/50">
                                    <div className="size-10 lg:size-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-none shadow-primary/20">
                                        <Zap className="size-6" />
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        {[LayoutDashboard, Users, Briefcase, Calendar, BarChart3].map((Icon, i) => (
                                            <div key={i} className={`size-10 lg:size-12 rounded-xl flex items-center justify-center transition-all ${i === 2 ? 'bg-white text-slate-900 shadow-none border border-slate-200' : 'text-slate-400'}`}>
                                                <Icon className="size-5 lg:size-6" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Mockup */}
                                <div className="flex-1 flex flex-col">
                                    <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Search</span>
                                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">Software Engineer roles</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                <Search className="size-4" />
                                            </div>
                                            <div className="h-10 px-6 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-widest flex items-center shadow-none shadow-primary/10">Add New Job</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-6 space-y-8 overflow-hidden">
                                        <div className="grid grid-cols-3 gap-6">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl shadow-none"></div>
                                            ))}
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-3xl h-full shadow-none"></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Social Proof Section */}
                <section className="py-24 border-y border-slate-100 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col items-center gap-8">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em]">Integrated with the ecosystem you love</p>
                            <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-24 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                                {['Slack', 'LinkedIn', 'Google', 'Zoom', 'Notion', 'Calendly'].map(brand => (
                                    <div key={brand} className="text-3xl font-bold tracking-tighter text-slate-900">{brand}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Deep Dive */}
                <section className="py-40 bg-white" id="features">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-32">
                            <div className="max-w-2xl space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-widest">
                                    Unified Talent Discovery
                                </div>
                                <h2 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-950 leading-none">
                                    Unleash the full potential of your <span className="text-slate-400">talent</span> team.
                                </h2>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                    Stop jumping between spreadsheets and disconnected tools. HireSphere brings everything under one high-performance roof.
                                </p>
                            </div>
                            <Link href="/features" className="group flex items-center gap-5 text-[12px] uppercase font-bold tracking-widest text-slate-900">
                                Explorer Features
                                <div className="size-12 rounded-2xl border border-slate-200 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                                    <ArrowRight className="size-4" />
                                </div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <FeatureCard
                                className="md:col-span-8 lg:col-span-8"
                                title="Enterprise-Grade AI Assessment"
                                desc="Analyze candidate proficiency with precision. Our automated tools prioritize candidates based on objective metrics and real-world skills."
                                icon={Layers}
                            />
                            <FeatureCard
                                className="md:col-span-4 lg:col-span-4"
                                title="Advanced CRM"
                                desc="Keep track of every interaction and nurture your talent database for future roles."
                                icon={Building2}
                            />
                            <FeatureCard
                                className="md:col-span-4 lg:col-span-4"
                                title="Automated Scheduling"
                                desc="Synchronize everyone's calendar instantly and eliminate the email back-and-forth."
                                icon={Calendar}
                            />
                            <FeatureCard
                                className="md:col-span-4 lg:col-span-4"
                                title="Collaborative Hiring"
                                desc="Unified scorecards and team feedback loops to maintain assessment consistency."
                                icon={Users}
                            />
                            <FeatureCard
                                className="md:col-span-4 lg:col-span-4"
                                title="Analytics & Data"
                                desc="Real-time reporting on time-to-hire, funnel conversion, and assessment quality."
                                icon={PieChart}
                            />
                        </div>
                    </div>
                </section>

                {/* Persona Section */}
                <section className="py-40 px-6 bg-slate-50 border-y border-slate-200">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-24">
                            <div className="max-w-2xl space-y-6">
                                <h2 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 leading-none">Intelligence for everyone.</h2>
                                <p className="text-xl text-slate-500 font-medium">Enterprise workflows tailored to every member of your organization.</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Talent Leads', 'Managers', 'Executives'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActivePersona(tab as any)}
                                        className={`h-14 px-10 rounded-2xl text-[11px] uppercase font-bold tracking-widest transition-all ${activePersona === tab ? 'bg-primary text-white shadow-none shadow-primary/20 scale-105' : 'bg-white border border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}`}
                                    >
                                        For {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePersona}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
                            >
                                <div className="space-y-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                                        Role Optimization
                                    </div>
                                    <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-none">
                                        {activePersona === 'Talent Leads' ? 'Scale your sourcing without scaling your team.' : activePersona === 'Executives' ? 'Strategic oversight of your human capital.' : 'Build elite teams with predictable outcomes.'}
                                    </h3>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                                        {activePersona === 'Talent Leads'
                                            ? 'Empower your recruiters with automation that handles the administrative burden, allowing them to focus on what matters: interpersonal relationships.'
                                            : activePersona === 'Executives'
                                                ? 'Gain high-level insights into your hiring funnel efficiency and cost-per-hire. Make data-driven decisions that impact the bottom line.'
                                                : 'Stop guessing on candidate quality. Provide your hiring managers with structured data and collaborative tools to ensure every hire is the right hire.'}
                                    </p>
                                    <div className="flex flex-col gap-6 pt-6">
                                        {(activePersona === 'Talent Leads'
                                            ? ['automated interview routing', 'multi-channel sourcing', 'standardized assessments']
                                            : activePersona === 'Executives'
                                                ? ['enterprise ROI dashboard', 'compliance & audit logs', 'resource capacity planning']
                                                : ['structured scorecard system', 'team calibration tools', 'collaborative feedback hub']
                                        ).map(item => (
                                            <div key={item} className="flex items-center gap-4 text-sm font-bold text-slate-900 uppercase tracking-widest">
                                                <div className="size-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-none shadow-primary/10">
                                                    <CheckCircle2 className="size-3.5" />
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative group">
                                    <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden h-[500px]">
                                        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-50 to-transparent"></div>
                                        <div className="relative z-10 flex flex-col gap-6">
                                            <div className="flex items-center justify-between">
                                                <div className="size-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-none shadow-primary/20">
                                                    {activePersona === 'Talent Leads' ? <Target className="size-8" /> : activePersona === 'Executives' ? <BarChart3 className="size-8" /> : <Users className="size-8" />}
                                                </div>
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 border border-emerald-200/40 font-bold text-[10px] uppercase tracking-widest">
                                                    Live Syncing
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-4">
                                                <div className="h-4 w-3/4 bg-slate-100 rounded-full animate-pulse"></div>
                                                <div className="h-4 w-1/2 bg-slate-50 rounded-full"></div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-10">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-20 bg-slate-50 border border-slate-100 rounded-2xl"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-40 bg-white" id="pricing">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center max-w-3xl mx-auto space-y-10 mb-24">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest leading-none">
                                Transparent Economics
                            </div>
                            <h2 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-950 leading-none">Simple pricing for high performance.</h2>
                            <div className="flex flex-col items-center gap-6 pt-4">
                                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                     <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`h-12 px-10 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-none shadow-primary/20' : 'text-slate-500 hover:text-primary'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('yearly')}
                                        className={`h-12 px-10 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all relative ${billingCycle === 'yearly' ? 'bg-primary text-white shadow-none shadow-primary/20' : 'text-slate-500 hover:text-primary'}`}
                                    >
                                        Yearly
                                        <div className="absolute -top-3 -right-3 bg-emerald-500 text-white text-[9px] px-2 py-1 rounded-md shadow-none shadow-emerald-500/20 font-black">SAVE 20%</div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
                            <PricingCard
                                plan="Growth"
                                price={billingCycle === 'monthly' ? '$49' : '$39'}
                                description="Best for scaling teams recruiting up to 5 positions."
                                features={['Active Talent Database', 'Automated Scorecards', 'Career Link Generation', 'Priority Support']}
                            />
                            <PricingCard
                                plan="Professional"
                                price={billingCycle === 'monthly' ? '$199' : '$159'}
                                description="Comprehensive toolkit for enterprise talent acquisition."
                                features={['Unlimited Active Roles', 'Advanced AI Screening', 'White-labeled Portals', 'Data Analytics Hub', 'Full API Access']}
                                popular={true}
                            />
                            <PricingCard
                                plan="Enterprise"
                                price="Custom"
                                description="Advanced solutions for global organizations with custom needs."
                                features={['Dedicated Account Manager', 'SSO & Multi-tenancy', 'Compliance Audit Trails', 'Custom Integration Dev', 'SLA Guarantees']}
                            />
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="pb-40 pt-20 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-slate-950 rounded-[4rem] p-16 lg:p-32 text-center relative overflow-hidden shadow-[0_64px_128px_-24px_rgba(0,0,0,0.5)]">
                            <div className="relative z-10 space-y-16">
                                <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-bold text-white leading-[0.85] tracking-tight">
                                    One platform to <br />
                                    <span className="text-slate-500">hire</span> everyone.
                                </h2>
                                <p className="text-slate-400 text-xl md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
                                    Join the world's most innovative organizations already using HireSphere to build their future.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-6">
                                    <Link href="/register" className="h-20 px-16 bg-white text-slate-900 text-[12px] uppercase font-black tracking-[0.2em] rounded-[1.5rem] shadow-none hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
                                        Start Your Journey
                                    </Link>
                                    <button className="h-20 px-16 border-2 border-white/10 text-white text-[12px] uppercase font-black tracking-[0.2em] rounded-[1.5rem] hover:bg-white/5 hover:border-white/30 transition-all flex items-center justify-center">
                                        Talk to an Expert
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
