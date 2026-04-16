'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/services/api';
import Script from 'next/script';
import { motion } from 'framer-motion';
import {
    Check, Rocket, Zap, Sparkles, Crown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdminPricingPage() {
    const { user, company } = useAuthStore();

    const handleUpgrade = async (planType: string) => {
        if (!user) return alert('No user session found');

        let planId = null;
        if (planType === 'Premium') planId = "plan_SaxbAXzKZr0gyM";
        if (planType === 'Pro') planId = "plan_Sazs1DQjGzPSgp";

        if (!planId) return;

        try {
            const response = await api.post('/payments/subscribe', { planId });
            const data = response.data;

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                console.error("Razorpay Key ID is missing in environment variables!");
                alert("Payment system configuration error. Please contact support.");
                return;
            }

            const options = {
                key: razorpayKey,
                subscription_id: data.subscriptionId,
                name: "HireSphere",
                description: `Upgrade to ${planType} Plan`,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: planId // Send the planId to verify the tier
                        });

                        if (verifyRes.data.success) {
                            alert("Payment Successful! Your subscription is now active.");
                            window.location.reload();
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: "#18281C" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error: any) {
            console.error('Subscription error:', error);
            alert(error.response?.data?.message || "Failed to initialize payment");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />

            <header className="text-center space-y-4">
                <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    Pricing Plans
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                    Ready to scale your <span className="text-primary underline decoration-primary/30 underline-offset-8">hiring?</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                    Simple, transparent pricing for teams of all sizes. No hidden fees.
                </p>
            </header>

            {/* Current Status */}
            <Card className="bg-slate-50 border-slate-200 shadow-sm relative overflow-hidden">
                <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="size-12 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary border border-slate-200">
                            <Crown className="size-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Workspace Status</p>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-slate-900 capitalize">{company?.subscriptionPlan || 'Free'} Plan</h2>
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-500 text-white rounded-full text-[10px]">ACTIVE</Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PricingCard 
                    title="Free" 
                    price="0" 
                    description="Essential tools for small teams."
                    icon={<Rocket className="size-5" />}
                    features={[
                        "5 Active Job Postings",
                        "Basic Resume Parsing",
                        "100 Monthly Emails",
                        "3 Video Interviews"
                    ]}
                    current={company?.subscriptionPlan === 'free' || !company?.subscriptionPlan}
                />

                <PricingCard 
                    title="Premium" 
                    price="99" 
                    description="Advanced automation for growing teams."
                    isPopular={true}
                    icon={<Zap className="size-5" />}
                    features={[
                        "50 Active Job Postings",
                        "Automated ATS Scoring",
                        "2,000 Monthly Emails",
                        "Video Interview Integration"
                    ]}
                    current={company?.subscriptionPlan === 'premium'}
                    onUpgrade={() => handleUpgrade('Premium')}
                />

                <PricingCard 
                    title="Pro" 
                    price="199" 
                    description="The ultimate powerhouse for large scale hiring."
                    icon={<Sparkles className="size-5" />}
                    features={[
                        "Unlimited Active Jobs",
                        "Video Interview Integration",
                        "AI-Driven Candidate Shortlisting",
                        "10,000 Monthly Emails",
                        "Priority 24/7 Support"
                    ]}
                    current={company?.subscriptionPlan === 'pro'}
                    onUpgrade={() => handleUpgrade('Pro')}
                />
            </div>

            <footer className="text-center pt-8">
                <p className="text-sm text-slate-400">
                    Need a custom solution for enterprise? <a href="mailto:sales@hiresource.com" className="text-primary font-semibold hover:underline">Contact Sales</a>
                </p>
            </footer>
        </div>
    );
}

function PricingCard({ title, price, description, icon, features, current = false, isPopular = false, onUpgrade }: any) {
    return (
        <Card className={cn(
            "flex flex-col transition-all duration-300 relative overflow-hidden h-full",
            isPopular ? "border-primary shadow-xl ring-1 ring-primary/20 scale-[1.02] z-10" : "border-slate-200 hover:border-slate-300 shadow-sm"
        )}>
            {isPopular && (
                <div className="bg-primary text-white text-[10px] font-bold uppercase py-1 text-center tracking-widest">
                    Most Popular
                </div>
            )}

            <CardHeader className="space-y-2 pt-8">
                <div className={cn(
                    "size-10 rounded-md flex items-center justify-center mb-2 shadow-sm border",
                    isPopular ? "bg-primary text-white border-primary" : "bg-white text-slate-500 border-slate-200"
                )}>
                    {icon}
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">{title}</CardTitle>
                <CardDescription className="text-slate-500 font-medium leading-tight">
                    {description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6 pt-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-slate-900">${price}</span>
                    <span className="text-slate-400 text-sm font-medium">/month</span>
                </div>

                <div className="h-px bg-slate-100" />

                <ul className="space-y-3">
                    {features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                            <div className="size-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                <Check className="size-3" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pb-8">
                {current ? (
                    <Button disabled variant="outline" className="w-full bg-slate-50 text-slate-400 border-slate-200 font-bold uppercase text-[10px] tracking-widest">
                        Current Plan
                    </Button>
                ) : (
                    <Button
                        onClick={onUpgrade}
                        variant={isPopular ? "default" : "outline"}
                        className={cn(
                            "w-full font-bold uppercase text-[10px] tracking-widest py-6 transition-all active:scale-95",
                            isPopular ? "shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90" : "hover:bg-slate-50"
                        )}
                    >
                        {title === 'Free' ? 'Current Plan' : `Upgrade to ${title}`}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
