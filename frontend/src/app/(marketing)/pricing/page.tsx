'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CheckCircle2, 
    X, 
    Ship, 
    Zap, 
    Layers, 
    ShieldCheck, 
    ArrowRight, 
    Globe, 
    LifeBuoy, 
    Settings,
    ChevronDown,
    Plus,
    Minus
} from 'lucide-react';

export default function PricingPage() {
    return (
        <div className="bg-white min-h-screen font-body text-slate-900 antialiased selection:bg-slate-900 selection:text-white">
            <main className="max-w-7xl mx-auto w-full px-6 py-40">
                
                {/* Hero Section */}
                <section className="text-center mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 mb-10 rounded-full bg-slate-50 border border-slate-200 text-slate-950 text-[11px] font-bold uppercase tracking-widest shadow-none"
                    >
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Transparent Performance Pricing
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight mb-10 text-slate-950 leading-[0.9]"
                    >
                        Scale your <br /> <span className="text-slate-400">talent</span> team.
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed"
                    >
                        Professional-grade recruitment infrastructure for teams that prioritize quality. Simple, transparent plans for every stage of growth.
                    </motion.p>
                </section>

                {/* Pricing Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-48 relative">
                    <PricingCard
                        index={0}
                        plan="Growth"
                        price="49"
                        desc="Essential intelligence tools for high-growth startups scaling their core engineering."
                        features={["5 Active Hiring Funnels", "Standard Candidate CRM", "Automated Scorecards", "Basic Career Portal"]}
                    />
                    <PricingCard
                        index={1}
                        plan="Professional"
                        price="159"
                        desc="Advanced features for companies scaling across multiple departments."
                        recommended={true}
                        features={["Unlimited Hiring Funnels", "AI Assessment Engine", "Advanced CRM Workflows", "Whitelabel Career Portals", "Priority Support SLA"]}
                    />
                    <PricingCard
                        index={2}
                        plan="Enterprise"
                        price="Custom"
                        desc="Uncompromised security and deep integrations for global enterprise scale."
                        features={["Dedicated Success Manager", "SSO & Advanced Security", "Full API & Webhook Layer", "Compliance & Audit Hub"]}
                    />
                </div>

                {/* FAQ Section */}
                <section className="max-w-4xl mx-auto">
                    <div className="text-center mb-24">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 text-slate-900 text-[10px] font-bold uppercase tracking-widest mb-6">
                            Operations Support
                         </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-6 tracking-tight">Technical FAQ</h2>
                        <p className="text-lg text-slate-500 font-medium">Common questions about deploying HireSphere in your organization.</p>
                    </div>
                    
                    <div className="grid gap-6">
                        <FAQItem
                            question="Can we modify our seats and plans as we grow?"
                            answer="Absolutely. HireSphere is built for dynamic scaling. You can upgrade or adjust your organizational structure at any time with prorated billing applied instantly."
                        />
                        <FAQItem
                            question="What happens when we exceed our role limits?"
                            answer="On the Growth tier, reaching your active role limit will pause new job creations. You can archive filled roles to free up capacity or upgrade for unlimited throughput."
                        />
                        <FAQItem
                            question="Is there a trial period for new organizations?"
                            answer="Yes, every new workspace begins with a 14-day full-access trial of our Professional features. No credit card is required to initialize your environment."
                        />
                        <FAQItem
                            question="Do you offer discounts for non-profit organizations?"
                            answer="We are committed to supporting organizations with a positive global impact. Reach out to our sales team to discuss specialized pricing for certified non-profits."
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
            className={`flex flex-col gap-8 rounded-[3.5rem] border p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 relative ${recommended ? 'bg-slate-950 border-slate-950 text-white shadow-2xl lg:scale-105 z-10' : 'bg-white border-slate-200 hover:border-slate-900'}`}
        >
            {recommended && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-8 py-3 rounded-full shadow-2xl">
                    RECOMMENDED
                </div>
            )}
            
            <div className="space-y-6">
                <h3 className={`text-2xl font-bold tracking-tight ${recommended ? 'text-white' : 'text-slate-950'}`}>{plan}</h3>
                <p className={`text-sm font-semibold leading-relaxed ${recommended ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
                <div className="flex items-baseline gap-2 pt-6">
                    {price !== 'Custom' && (
                        <>
                            <span className={`text-7xl font-bold tracking-tighter ${recommended ? 'text-white' : 'text-slate-950'}`}>${price}</span>
                            <span className={`text-sm font-bold ${recommended ? 'text-slate-500' : 'text-slate-400'}`}>/mo</span>
                        </>
                    )}
                    {price === 'Custom' && <span className={`text-6xl font-bold tracking-tighter ${recommended ? 'text-white' : 'text-slate-950'}`}>Custom</span>}
                </div>
            </div>

            <button className={`w-full h-18 rounded-[1.5rem] font-bold uppercase tracking-widest text-[11px] transition-all duration-300 active:scale-95 ${recommended ? 'bg-white text-slate-950 hover:bg-slate-100' : 'bg-slate-950 text-white hover:bg-black'}`}>
                {price === 'Custom' ? 'Contact Sales' : 'Get Started Now'}
            </button>

            <div className={`space-y-6 border-t pt-10 ${recommended ? 'border-white/10' : 'border-slate-100'}`}>
                {features.map((f, i) => (
                    <div key={i} className="flex items-start gap-4 text-[13px] font-semibold leading-tight">
                        <CheckCircle2 className={`size-5 shrink-0 ${recommended ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={recommended ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div 
            className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden transition-all hover:border-slate-900 group"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-8 flex items-center justify-between text-left"
            >
                <h4 className="text-xl font-bold tracking-tight text-slate-950">{question}</h4>
                <div className={`size-8 rounded-full border border-slate-200 flex items-center justify-center transition-all ${isOpen ? 'bg-slate-950 text-white border-slate-950 rotate-180' : 'bg-white text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900'}`}>
                    <ChevronDown className="size-4" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-8 pb-8"
                    >
                        <p className="text-slate-500 font-semibold leading-relaxed text-sm">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
