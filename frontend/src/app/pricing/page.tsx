'use client';

import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="bg-background min-h-screen font-display text-slate-100 antialiased selection:bg-primary/30">
            <main className="max-w-[1440px] mx-auto w-full px-6 lg:px-20 py-12 relative">
                {/* Background Aura */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10"></div>

                {/* Hero Section */}
                <section className="text-center mb-16 glow-aura">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass-effect text-primary text-xs font-black uppercase tracking-widest border-glow">
                        TRANSPARENT PRICING
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
                        Plans for every <br /> <span className="text-gradient">stage of growth</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
                        Whether you're making your first hire or scaling a global workforce, we have the tools to help you find the best talent.
                    </p>
                </section>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative">
                    <PricingCard
                        plan="Starter"
                        price="49"
                        desc="Best for small teams just getting started with recruitment."
                        features={["Up to 5 active jobs", "Basic analytics dashboard", "Standard support", "Custom career page"]}
                    />
                    <PricingCard
                        plan="Professional"
                        price="149"
                        desc="Advanced features for teams looking to optimize hiring."
                        recommended={true}
                        features={["Unlimited active jobs", "AI candidate matching", "Advanced interview scheduling", "Collaborative feedback", "Priority email support"]}
                    />
                    <PricingCard
                        plan="Enterprise"
                        price="Custom"
                        desc="Full customization and security for global organizations."
                        features={["Dedicated account manager", "Single Sign-On (SSO)", "Custom API integrations", "Audit logs & data export"]}
                    />
                </div>

                {/* Comparison Table */}
                <section className="mb-32">
                    <h2 className="text-4xl font-black mb-16 text-center text-white">Compare <span className="text-primary">detailed</span> features</h2>
                    <div className="overflow-x-auto rounded-3xl glass-effect border border-white/10 shadow-3xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="p-8 text-sm font-black uppercase tracking-widest text-slate-300 w-1/3">Feature</th>
                                    <th className="p-8 text-sm font-black uppercase tracking-widest text-slate-300">Starter</th>
                                    <th className="p-8 text-sm font-black uppercase tracking-widest text-slate-300">Professional</th>
                                    <th className="p-8 text-sm font-black uppercase tracking-widest text-slate-300">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-white/[0.02]">
                                <TableRow label="AI Candidate Scoring" starter={false} pro={true} enterprise={true} />
                                <TableRow label="Custom Career Page" starter="Basic" pro="Advanced" enterprise="White-labeled" />
                                <TableRow label="Interview Auto-scheduler" starter={false} pro={true} enterprise={true} />
                                <TableRow label="Custom Application Forms" starter="3 fields" pro="Unlimited" enterprise="Unlimited + Logic" />
                                <TableRow label="API Access" starter={false} pro="Read-only" enterprise="Full Read/Write" />
                                <TableRow label="Onboarding Support" starter="Self-serve" pro="Guided" enterprise="Dedicated" />
                                <TableRow label="SLA Guarantee" starter={false} pro="99.5%" enterprise="99.99%" />
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="max-w-4xl mx-auto pb-32">
                    <h2 className="text-4xl font-black mb-16 text-center text-white">Frequently <span className="text-primary">asked</span> questions</h2>
                    <div className="grid gap-6">
                        <FAQItem
                            question="Can I switch plans later?"
                            answer="Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new pricing will be prorated for the remainder of your billing cycle."
                        />
                        <FAQItem
                            question="What happens when I reach my job limit?"
                            answer="On the Starter plan, you can have 5 active job postings. To add more, you'll need to archive an existing job or upgrade to the Professional plan."
                        />
                        <FAQItem
                            question="Is there a free trial?"
                            answer="Absolutely. Every plan comes with a 14-day free trial. No credit card required to start."
                        />
                        <FAQItem
                            question="Do you offer discounts for non-profits?"
                            answer="We love supporting organizations doing good. Contact our sales team to discuss non-profit and education discounts."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

function PricingCard({ plan, price, desc, features, recommended = false }: { plan: string; price: string; desc: string; features: string[]; recommended?: boolean }) {
    return (
        <div className={`flex flex-col gap-10 rounded-[2.5rem] border p-10 transition-all duration-500 hover:-translate-y-2 group ${recommended ? 'bg-primary border-white/20 shadow-3xl shadow-primary/25 relative z-10 scale-105' : 'glass-effect border-white/5 bg-white/5 hover:border-primary/30'}`}>
            {recommended && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-accent text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                    MOST POPULAR
                </div>
            )}
            <div className="space-y-6">
                <h3 className={`text-2xl font-black ${recommended ? 'text-white' : 'text-slate-100'}`}>{plan}</h3>
                <p className={`text-sm font-medium leading-relaxed ${recommended ? 'text-white/80' : 'text-slate-400'}`}>{desc}</p>
                <div className="flex items-baseline gap-2 pt-4">
                    {price !== 'Custom' && <span className={`text-6xl font-black tracking-tighter ${recommended ? 'text-white' : 'text-white'}`}>${price}</span>}
                    {price === 'Custom' && <span className="text-5xl font-black tracking-tighter text-white">Custom</span>}
                    {price !== 'Custom' && <span className={`text-lg font-bold ${recommended ? 'text-white/60' : 'text-slate-500'}`}>/mo</span>}
                </div>
            </div>

            <button className={`w-full h-16 rounded-2xl font-black text-lg transition-all active:scale-95 ${recommended ? 'bg-white text-primary shadow-2xl' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}>
                {price === 'Custom' ? 'Contact Sales' : 'Get Started Now'}
            </button>

            <div className={`space-y-4 border-t pt-8 ${recommended ? 'border-white/10' : 'border-white/5'}`}>
                {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-medium">
                        <span className={`material-symbols-outlined text-xl ${recommended ? 'text-white' : 'text-primary'}`}>check_circle</span>
                        <span className={recommended ? 'text-white/90' : 'text-slate-300'}>{f}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TableRow({ label, starter, pro, enterprise }: { label: string; starter: any; pro: any; enterprise: any }) {
    const renderValue = (val: any) => {
        if (typeof val === 'boolean') {
            return val ? (
                <span className="material-symbols-outlined text-primary text-2xl font-black">check</span>
            ) : (
                <span className="material-symbols-outlined text-white/5 text-2xl">remove</span>
            );
        }
        return <span className="text-sm font-bold text-slate-400">{val}</span>;
    };

    return (
        <tr className="hover:bg-white/[0.02] transition-colors">
            <td className="p-8 text-sm font-black text-slate-100">{label}</td>
            <td className="p-8">{renderValue(starter)}</td>
            <td className="p-8">{renderValue(pro)}</td>
            <td className="p-8">{renderValue(enterprise)}</td>
        </tr>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="p-8 rounded-3xl glass-effect border border-white/5 hover:border-white/10 transition-all group">
            <h4 className="text-xl font-black mb-4 text-white group-hover:text-primary transition-colors">{question}</h4>
            <p className="text-slate-400 font-medium leading-relaxed">{answer}</p>
        </div>
    );
}
