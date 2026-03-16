'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PricingPage() {
    return (
        <div className="bg-white min-h-screen font-body text-slate-900 antialiased selection:bg-primary/20">
            <main className="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-24 relative">
                {/* Visual Atmosphere */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 blur-[100px] rounded-full -z-10"></div>

                {/* Hero Section */}
                <section className="text-center mb-24 relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-5 py-2 mb-10 rounded-full bg-slate-50 border border-slate-200 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Investment Architecture
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-[8rem] font-display font-black tracking-[-0.04em] mb-10 text-slate-900 leading-[0.85]"
                    >
                        Predictable <br /> <span className="text-primary italic font-serif font-light">growth</span> costs.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        Scale your recruitment infrastructure without the complexity. Simple, transparent plans designed for high-velocity teams.
                    </motion.p>
                </section>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40 relative px-4">
                    <PricingCard
                        index={0}
                        plan="Starter"
                        price="49"
                        desc="Essential tools for early-stage companies building their core engineering team."
                        features={["5 active recruitment pipelines", "High-fidelity candidate cards", "Standard AI scoring", "Custom career micro-site"]}
                    />
                    <PricingCard
                        index={1}
                        plan="Professional"
                        price="149"
                        desc="Optimized for scaling organizations with multi-department hiring needs."
                        recommended={true}
                        features={["Unlimited active pipelines", "Advanced AI candidate matching", "Automated interview orchestration", "Departmental collaboration", "Priority architectural support"]}
                    />
                    <PricingCard
                        index={2}
                        plan="Enterprise"
                        price="Custom"
                        desc="Uncompromised security and customization for global enterprise scale."
                        features={["Dedicated Success Architect", "SSO & Advanced Security Auth", "Custom API & Webhook Layer", "Audit infrastructure & Compliance"]}
                    />
                </div>

                {/* Feature Comparison - Refined Light Design */}
                <section className="mb-40">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tight">Technical <span className="text-primary">Capabilities</span></h2>
                        <p className="text-slate-500 font-medium">Deep dive into our recruitment operating system features.</p>
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-3xl shadow-slate-200/50"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="p-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Architecture</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">Starter</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.1em] text-primary">Professional</th>
                                        <th className="p-10 text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <TableRow label="AI Candidate Scoring Engine" starter={false} pro={true} enterprise={true} />
                                    <TableRow label="Candidate Portal" starter="Standard" pro="Advanced Custom" enterprise="White-labeled" />
                                    <TableRow label="Interview Orchestration" starter={false} pro={true} enterprise={true} />
                                    <TableRow label="API Data Access" starter={false} pro="Read-only" enterprise="Full Read/Write" />
                                    <TableRow label="SSO & Security Layer" starter={false} pro={false} enterprise={true} />
                                    <TableRow label="Operational Support" starter="Self-serve" pro="Priority" enterprise="24/7 Dedicated" />
                                    <TableRow label="SLA Commitment" starter={false} pro="99.5%" enterprise="99.99%" />
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </section>

                {/* FAQ - Elegant Minimalist Style */}
                <section className="max-w-4xl mx-auto pb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-6">Operations <span className="text-primary italic">FAQ</span></h2>
                        <p className="text-slate-500 font-medium">Common questions about deploying HireSphere in your organization.</p>
                    </div>
                    
                    <div className="grid gap-6">
                        <FAQItem
                            question="Can we modify our plan as we scale?"
                            answer="Yes. HireSphere is designed for dynamic growth. You can adjust your deployment level at any time, with prorated billing adjustments applied immediately to your dashboard."
                        />
                        <FAQItem
                            question="What happens when we exceed job limits?"
                            answer="On the Starter tier, reaching the pipeline limit will prompt a notification to archive inactive roles or upgrade to Professional for unlimited throughput."
                        />
                        <FAQItem
                            question="Is there an initial deployment trial?"
                            answer="Every architecture starts with a 14-day full-access trial of the Professional tier. No commitment required until you're ready to deploy at scale."
                        />
                        <FAQItem
                            question="Are there volume discounts for larger teams?"
                            answer="Our Enterprise solutions are custom-calculated based on your specific recruitment volume and required integrations. Connect with our architects for a custom quote."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

function PricingCard({ plan, price, desc, features, recommended = false, index }: { plan: string; price: string; desc: string; features: string[]; recommended?: boolean; index: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className={`flex flex-col gap-12 rounded-[3rem] border p-12 transition-all duration-700 hover:-translate-y-2 group relative ${recommended ? 'bg-slate-900 border-slate-900 shadow-3xl shadow-slate-900/40 z-10 scale-105' : 'bg-white border-slate-200 hover:shadow-2xl hover:shadow-slate-200/50'}`}
        >
            {recommended && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-white text-[9px] font-black uppercase tracking-[0.3em] px-8 py-3 rounded-full shadow-2xl">
                    SYSTEM FAVORITE
                </div>
            )}
            
            <div className="space-y-6">
                <h3 className={`text-2xl font-display font-black ${recommended ? 'text-white' : 'text-slate-900'}`}>{plan}</h3>
                <p className={`text-sm font-medium leading-relaxed ${recommended ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                <div className="flex items-baseline gap-2 pt-6">
                    {price !== 'Custom' && (
                        <>
                            <span className={`text-7xl font-display font-black tracking-tighter ${recommended ? 'text-white' : 'text-slate-900'}`}>${price}</span>
                            <span className={`text-sm font-bold ${recommended ? 'text-slate-500' : 'text-slate-400'}`}>/mo</span>
                        </>
                    )}
                    {price === 'Custom' && <span className={`text-6xl font-display font-black tracking-tighter ${recommended ? 'text-white' : 'text-slate-900'}`}>Custom</span>}
                </div>
            </div>

            <button className={`w-full h-18 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 active:scale-95 ${recommended ? 'bg-white text-slate-900 hover:bg-slate-50 shadow-xl' : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/10'}`}>
                {price === 'Custom' ? 'Contact Architects' : 'Initialize Plan'}
            </button>

            <div className={`space-y-6 border-t pt-10 ${recommended ? 'border-white/10' : 'border-slate-100'}`}>
                {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-4 text-[13px] font-medium leading-tight">
                        <span className={`material-symbols-outlined text-lg ${recommended ? 'text-primary' : 'text-slate-300'}`}>check_circle</span>
                        <span className={recommended ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function TableRow({ label, starter, pro, enterprise }: { label: string; starter: any; pro: any; enterprise: any }) {
    const renderValue = (val: any, isPro = false) => {
        if (typeof val === 'boolean') {
            return val ? (
                <span className={`material-symbols-outlined text-2xl font-black ${isPro ? 'text-primary' : 'text-slate-900'}`}>check</span>
            ) : (
                <span className="material-symbols-outlined text-slate-100 text-2xl">remove</span>
            );
        }
        return <span className={`text-[13px] font-bold ${isPro ? 'text-primary' : 'text-slate-500'}`}>{val}</span>;
    };

    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="p-10 text-sm font-bold text-slate-900">{label}</td>
            <td className="p-10">{renderValue(starter)}</td>
            <td className="p-10 bg-primary/[0.01]">{renderValue(pro, true)}</td>
            <td className="p-10">{renderValue(enterprise)}</td>
        </tr>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="p-10 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-slate-200/30 transition-all group cursor-default"
        >
            <h4 className="text-xl font-heading font-black mb-4 text-slate-900 group-hover:text-primary transition-colors tracking-tight">{question}</h4>
            <p className="text-slate-500 font-medium leading-relaxed text-sm">{answer}</p>
        </motion.div>
    );
}

