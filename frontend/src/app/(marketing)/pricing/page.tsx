'use client';
import Script from "next/script";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
}

export default function PricingPage() {
    const { user } = useAuthStore();
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

    const toggleBilling = () => {
        setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
    };

    const handleUpgrade = async (planType: string) => {
        if (!user) {
            alert('Please login to subscribe to a plan');
            window.location.href = '/login';
            return;
        }

        // Use the Razorpay Plan ID (Create these in your dashboard)
        const planId = planType === 'Premium' ? "plan_SaxbAXzKZr0gyM" : null; // Placeholder: Replace with actual Plan ID

        if (planType === 'Enterprise') {
            return window.location.href = '/contact';
        }

        if (!planId) return;

        try {
            // 2. Call backend to get Subscription ID
            const response = await api.post('/payments/subscribe', { planId });
            const data = response.data;

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                console.error("Razorpay Key ID is missing in environment variables!");
                alert("Payment system configuration error. Please contact support.");
                return;
            }

            // 3. Open Razorpay Checkout
            const options = {
                key: razorpayKey,
                subscription_id: data.subscriptionId,
                name: "HireSphere",
                description: `Upgrade to ${planType} Plan`,
                handler: async function (response: RazorpayResponse) {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! Your subscription is now active.");
                            window.location.href = '/company/profile';
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        alert("Payment succeeded but verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                notes: {
                    companyId: user.companyId
                },
                theme: { color: "#18281C" },
            };

            const rzp = new (window as unknown as { Razorpay: { new (options: unknown): { open: () => void } } }).Razorpay(options);
            rzp.open();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error('Subscription error:', err);
            alert(err.response?.data?.message || "Failed to initialize payment");
        }
    };

    return (
        <div className="bg-surface text-on-surface antialiased font-body min-h-screen selection:bg-secondary-fixed">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />


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
                            "5 Active Job Postings",
                            "Basic Resume Parsing",
                            "100 Monthly Emails",
                            "3 Video Interviews"
                        ]}
                        buttonText="Start Free Now"
                        onUpgrade={() => (window.location.href = '/signup')}
                    />
                    <PricingCard
                        type="Premium"
                        title="Enhanced Talent Experiences"
                        price={billingCycle === 'monthly' ? '$99' : '$79'}
                        subtitle="Premium Account"
                        highlight={true}
                        features={[
                            "50 Active Job Postings",
                            "Automated ATS Scoring",
                            "2,000 Monthly Emails",
                            "Video Interview Integration"
                        ]}
                        buttonText="Upgrade to Premium"
                        onUpgrade={() => handleUpgrade('Premium')}
                    />
                    <PricingCard
                        type="Pro"
                        title="Elite Recruiting Power"
                        price={billingCycle === 'monthly' ? '$199' : '$159'}
                        subtitle="Pro Account"
                        features={[
                            "Unlimited Active Jobs",
                            "Video Interview Integration",
                            "AI-Driven Candidate Shortlisting",
                            "10,000 Monthly Emails",
                            "Priority 24/7 Support"
                        ]}
                        buttonText="Upgrade to Pro"
                        onUpgrade={() => handleUpgrade('Pro')}
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

function PricingCard({ type, title, price, subtitle, features, buttonText, onUpgrade, highlight = false }: { type: string, title: string, price: string, subtitle: string, features: string[], buttonText: string, onUpgrade: () => void, highlight?: boolean }) {
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

            <button
                onClick={onUpgrade}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all relative z-10 ${highlight ? 'bg-secondary-fixed text-on-secondary-fixed hover:scale-[1.02]' : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'}`}>
                {buttonText}
            </button>
        </div>
    );
}
