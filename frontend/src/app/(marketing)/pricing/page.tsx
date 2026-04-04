'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const toggleBilling = () => {
        setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    };

    return (
        <div className="bg-surface text-on-surface antialiased font-body min-h-screen selection:bg-secondary-fixed">


            <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <header className="text-center mb-16">
                    <h1 className="font-heading text-7xl md:text-8xl font-black tracking-tighter text-primary mb-8 uppercase">
                        Pricing Plans
                    </h1>
                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-primary' : 'text-on-surface-variant'}`}>Monthly</span>
                        <button
                            onClick={toggleBilling}
                            className="w-14 h-8 bg-surface-container-highest rounded-full p-1 flex items-center transition-all focus:outline-none"
                        >
                            <div className={`w-6 h-6 bg-primary rounded-full shadow-md transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-bold flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-primary' : 'text-on-surface-variant'}`}>
                            Yearly <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Save 20%</span>
                        </span>
                    </div>
                </header>

                {/* Pricing Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    <PricingCard
                        type="Basic"
                        title="Everyday Recruiting"
                        price="Free"
                        subtitle="Basic Account"
                        features={[
                            "No monthly fees",
                            "Basic resume parsing",
                            "1 active job post",
                            "Basic candidate tracking",
                            "Standard support"
                        ]}
                        buttonText="Start Free Now"
                    />
                    <PricingCard
                        type="Premium"
                        title="Enhanced Talent Experiences"
                        price={billingCycle === 'monthly' ? '$99' : '$79'}
                        subtitle="Premium Account"
                        highlight={true}
                        features={[
                            "Automated ATS scoring",
                            "Video interview integration",
                            "Custom workflows",
                            "Dedicated account manager",
                            "Advanced analytics"
                        ]}
                        buttonText="Upgrade to Premium"
                    />
                    <PricingCard
                        type="Enterprise"
                        title="Large Scale Talent Strategy"
                        price="Custom"
                        subtitle="Enterprise Account"
                        features={[
                            "Multi-portal architecture",
                            "Full signaling server access",
                            "Unlimited job posts",
                            "Priority 24/7 support",
                            "SOC2 compliance"
                        ]}
                        buttonText="Contact Us for Pricing"
                    />
                </div>

                {/* Trust Section */}
                <section className="mt-24 pt-16 border-t border-outline-variant/10 text-center">
                    <div className="inline-flex items-center justify-center gap-12 flex-wrap opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                        {/* Placeholders for payment icons */}
                        <div className="text-2xl font-bold text-primary">VISA</div>
                        <div className="text-2xl font-bold text-primary">Mastercard</div>
                        <div className="text-2xl font-bold text-primary">PayPal</div>
                        <div className="text-2xl font-bold text-primary">stripe</div>
                    </div>
                    <p className="mt-8 text-on-surface-variant/60 text-xs font-medium uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm filled">lock</span>
                        Safety payments with end-to-end encryption
                    </p>
                </section>
            </main>


        </div>
    );
}

function PricingCard({ type, title, price, subtitle, features, buttonText, highlight = false }: { type: string, title: string, price: string, subtitle: string, features: string[], buttonText: string, highlight?: boolean }) {
    return (
        <div className={`p-10 rounded-3xl transition-all hover:translate-y-[-8px] duration-500 shadow-sm flex flex-col h-full ${highlight ? 'bg-primary text-white shadow-[0_30px_60px_-20px_rgba(24,40,28,0.3)] relative overflow-hidden' : 'glass-card border-outline-variant/10 text-on-surface'}`}>
            {highlight && <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-fixed/10 rounded-full blur-3xl"></div>}

            <div className="mb-8 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-black tracking-[0.2em] uppercase block ${highlight ? 'text-secondary-fixed' : 'text-on-surface-variant'}`}>{subtitle}</span>
                    {highlight && <span className="bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full text-[10px] font-black uppercase">Most Popular</span>}
                </div>
                <h3 className={`font-heading text-2xl font-bold mb-2 ${highlight ? 'text-white' : 'text-primary'}`}>{title}</h3>
                <div className="flex items-baseline gap-1 mt-6">
                    <span className={`font-black ${price === 'Custom' ? 'text-4xl leading-tight' : 'text-5xl'} ${highlight ? 'text-white' : 'text-primary'}`}>{price}</span>
                    {price !== 'Free' && price !== 'Custom' && <span className={`font-bold ${highlight ? 'text-secondary-fixed/70' : 'text-on-surface-variant'}`}>/month</span>}
                </div>
            </div>

            <ul className="space-y-4 mb-10 flex-grow relative z-10">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                        <span className={`material-symbols-outlined text-lg ${highlight ? 'text-secondary-fixed' : 'text-secondary'} filled`}>
                            {highlight ? (i === 0 ? 'auto_awesome' : i === 1 ? 'videocam' : i === 2 ? 'account_tree' : i === 3 ? 'support_agent' : 'insights') : 'check_circle'}
                        </span>
                        <span className={highlight ? 'text-white/90' : 'text-on-surface-variant'}>{feature}</span>
                    </li>
                ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all relative z-10 ${highlight ? 'bg-secondary-fixed text-on-secondary-fixed hover:scale-[1.02]' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                {buttonText}
            </button>
        </div>
    );
}
