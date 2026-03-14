'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
        <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
            <span className="material-symbols-outlined text-[32px]">{icon}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </motion.div>
);

const PricingCard = ({ plan, price, features, description, popular = false, darker = false }: { plan: string, price: string, features: string[], description: string, popular?: boolean, darker?: boolean }) => (
    <div className={`p-10 rounded-2xl border relative flex flex-col h-full ${darker ? 'bg-slate-900 border-white/10 text-white' : 'bg-white/[0.03] border-white/10 text-white'} ${popular ? 'border-primary shadow-2xl scale-105 z-10' : ''}`}>
        {popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                Most Popular
            </div>
        )}
        <h3 className="text-xl font-bold mb-2">{plan}</h3>
        <p className={`${darker ? 'text-slate-400' : 'text-slate-500'} text-xs mb-6`}>{description}</p>
        <div className="text-4xl font-black mb-8">{price}<span className="text-lg text-slate-500 font-normal">{price !== 'Custom' ? '/mo' : ''}</span></div>
        <ul className="space-y-4 mb-10 text-sm flex-grow">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-sm">check</span>
                    <span className="text-slate-300">{feature}</span>
                </li>
            ))}
        </ul>
        <button className={`w-full h-12 font-bold rounded-xl transition-all ${popular ? 'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90' : darker ? 'bg-white/10 hover:bg-white/20 border border-white/10' : 'border border-white/10 hover:border-primary/40 hover:bg-white/5'}`}>
            {price === 'Custom' ? 'Contact Sales' : 'Get Started'}
        </button>
    </div>
);

export default function SaaSPage() {
    return (
        <div className="bg-background text-white min-h-screen font-body selection:bg-primary/30">
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-32">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none"></div>
                    
                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-8 max-w-2xl"
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                                    <span className="material-symbols-outlined text-[16px]">verified</span>
                                    <span>Enterprise recruitment platform</span>
                                </div>
                                <h1 className="text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                                    Streamline Your Hiring Process with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">HireSphere</span>
                                </h1>
                                <p className="text-xl text-slate-400 leading-relaxed">
                                    Automate recruitment workflows, manage complex interview schedules, and hire top talent faster with our intelligent enterprise-grade SaaS platform.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Link href="/register" className="bg-primary hover:bg-primary/90 text-white text-lg font-bold h-14 px-10 rounded-xl shadow-xl shadow-primary/25 transition-all flex items-center gap-2">
                                        Start Free Trial <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                    <button className="bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 text-white text-lg font-bold h-14 px-10 rounded-xl transition-all">
                                        Book Demo
                                    </button>
                                </div>
                                <div className="flex items-center gap-6 pt-4 text-slate-500 text-sm">
                                    <div className="flex -space-x-2">
                                        {[
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuABKoLVCUSPE-II27c5neLievOn0U7qXVXj2BihIzfFZJcMQdhE2mCyagMmPK1Flpa8aZKZZPOi-hLOzWVZzeKFEPCrRGZd7Jf90oFWCojLF3Ckhf5L4rLkE2coqbxBQfSiRgAgxgE-WP2l1Aad3rr29wEAjOWHdZdEdkZHM3dXih7KlzmDX55w26AoEfD9jqWJeXpy3bipeHnpsso0IGkQ310AtHByo5zQ3ICsuz9g3QnTe5uSYU_ov9vkrChwYMB2TxWqNn8iVnc",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuAWAJmaIVFB6aSfXmzb997Fc8dLJys-kJhwqUaa6vIgwaH5s1cVgDZJYbkVs1Yx743rVLaAv9vOxotL6lcCP1f-3mw9gVZjZu7ZxM90huELTYmkNMoEs5Cf-hYBVhXyjC8VNYHALkK_EdDxxZk_BFcZz7VNaLoOs_zQ8k7HvCNoVxqcmF_vXWubbInQJQ4Z6WNUxkWLiqxbJGOmP0p5FGDkXRCRED9iDWBTynN7R8CsRFykcLegYPOujRGevSjai_UVByp1qji04PQ",
                                            "https://lh3.googleusercontent.com/aida-public/AB6AXuDlnvoQJ30fqhfW_WPycbVH9dDGaDrbFuBrwqCwubYxnSJYXrJATOMKweoMZTQMOeY-JHaKPYPhWniVQyS4--e4PVdZsvqM605J04IEC2GrypTOs_UTGO7xMidyy_0sU0Cggf0OhTcCfAA_hhixq2lhLVaZJo5rlkWx8GLSmuUiwd850o_pTZpTipnJyNYzaFls-a4QwGqKpw2iBRlLxdy79YMr8h28p60ysoWIsd_VJNulpPgCu8eUaF6wP-cu3aDf76Yer7bQPJA"
                                        ].map((url, i) => (
                                            <div key={i} className="size-8 rounded-full border-2 border-[#101622] bg-slate-800 overflow-hidden">
                                                <img 
                                                    src={url} 
                                                    alt="Avatar" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <p>Trusted by over 2,000+ HR teams globally</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-3xl group-hover:bg-primary/15 transition-colors"></div>
                                <div className="relative bg-[#0A0A0A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                                    <div className="h-10 border-b border-white/5 bg-white/[0.02] flex items-center px-4 gap-1.5">
                                        <div className="size-2.5 rounded-full bg-red-500/20"></div>
                                        <div className="size-2.5 rounded-full bg-amber-500/20"></div>
                                        <div className="size-2.5 rounded-full bg-emerald-500/20"></div>
                                    </div>
                                    <div className="p-6 grid grid-cols-12 gap-6">
                                        <div className="col-span-12 md:col-span-4 space-y-4">
                                            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase pb-2">Pipeline Health</div>
                                                <div className="text-2xl font-bold text-white">84.2%</div>
                                                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                                                    <div className="bg-primary w-4/5 h-full rounded-full"></div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                                                <div className="text-[10px] font-bold text-slate-500 uppercase pb-2">Active Roles</div>
                                                <div className="text-2xl font-bold text-white">42</div>
                                                <div className="flex gap-1 mt-2 items-end">
                                                    <div className="h-8 w-2 bg-primary/20 rounded-sm"></div>
                                                    <div className="h-12 w-2 bg-primary/40 rounded-sm"></div>
                                                    <div className="h-10 w-2 bg-primary/60 rounded-sm"></div>
                                                    <div className="h-14 w-2 bg-primary rounded-sm"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-12 md:col-span-8">
                                            <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 h-full">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-xs font-bold text-slate-300">Recent Candidates</span>
                                                    <span className="text-[10px] text-primary font-bold">View All</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {[
                                                        { name: 'Jane Smith', role: 'Senior Product Designer', status: 'Final Stage', color: 'blue' },
                                                        { name: 'Mike Kean', role: 'Fullstack Engineer', status: 'Interviewing', color: 'purple' }
                                                    ].map((candidate, i) => (
                                                        <div key={i} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg border border-white/5 shadow-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-8 rounded bg-${candidate.color}-500/20 text-${candidate.color}-500 flex items-center justify-center font-bold text-[10px]`}>
                                                                    {candidate.name.split(' ').map(n => n[0]).join('')}
                                                                </div>
                                                                <div>
                                                                    <div className="text-[11px] font-bold text-white">{candidate.name}</div>
                                                                    <div className="text-[9px] text-slate-500">{candidate.role}</div>
                                                                </div>
                                                            </div>
                                                            <div className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[9px] font-bold">{candidate.status}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Brands Section */}
                <section className="border-y border-white/5 bg-black/40 py-12 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-10">Trusted by modern industry leaders</p>
                        <div className="flex flex-wrap justify-center lg:justify-between items-center gap-12 opacity-30 grayscale invert">
                            {['STRIPE', 'AIRBNB', 'SLACK', 'LINEAR', 'VERCEL', 'ADOBE'].map(brand => (
                                <div key={brand} className="flex items-center gap-2 font-black text-2xl text-white">{brand}</div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col gap-4 text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Everything you need to manage your recruitment pipeline at scale</h2>
                            <p className="text-lg text-slate-400">Enterprise features built for high-growth teams and rigorous hiring standards.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard 
                                title="Interview Scheduling" 
                                desc="Automated calendar syncing, time-zone detection, and one-click invite management for your entire team."
                                icon="calendar_today"
                            />
                            <FeatureCard 
                                title="Candidate Management" 
                                desc="Centralized visual database for all applicants with powerful tagging, filtering, and history tracking."
                                icon="group"
                            />
                            <FeatureCard 
                                title="Evaluation System" 
                                desc="Standardized scorecards, collaborative feedback loops, and interview kits to remove bias from hiring."
                                icon="assignment_turned_in"
                            />
                            <FeatureCard 
                                title="Real-Time Notifications" 
                                desc="Instant Slack and email alerts for interview updates, feedback requests, and stage changes."
                                icon="notifications_active"
                            />
                            <FeatureCard 
                                title="Analytics Dashboard" 
                                desc="Deep insights into hiring velocity, source quality, and pass-through rates for data-driven decisions."
                                icon="leaderboard"
                            />
                            <FeatureCard 
                                title="SaaS Architecture" 
                                desc="Multi-tenant, SOC2 compliant infrastructure with SSO support for the world's most secure global enterprises."
                                icon="hub"
                            />
                        </div>
                    </div>
                </section>

                {/* Analytics Deep Dive */}
                <section className="bg-white/[0.02] py-32 border-y border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/2 space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">Deep Analytics for the Modern Recruiting Stack</h2>
                                <p className="text-slate-400 text-lg leading-relaxed">Stop guessing where your talent pipeline is leaking. HireSphere provides end-to-end visibility into every interview stage, time-to-hire, and recruiter performance.</p>
                                <ul className="space-y-6">
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <div>
                                            <h4 className="font-bold text-white">Automated Pipeline Tracking</h4>
                                            <p className="text-slate-500 text-sm">Visualize candidate flow across custom stages with drag-and-drop ease.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="material-symbols-outlined text-primary">check_circle</span>
                                        <div>
                                            <h4 className="font-bold text-white">SLA & Bottleneck Alerts</h4>
                                            <p className="text-slate-500 text-sm">Get notified when a candidate has been stuck in a stage for too long.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <div className="bg-slate-900 rounded-2xl border border-white/10 p-2 shadow-2xl scale-110 rotate-3 transition-transform hover:rotate-0 duration-700">
                                    <img 
                                        className="rounded-xl w-full h-auto opacity-80" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsct-T6n1gYel6OL1ORFwK4JoFl3SE-xHHAfksJOrF1CIOrJqUSMXyecSKE4i8P8o6139mbhspe1frxmhKz2L8brwuK5_4Iv_WBwL4EigXCbolr9EbE0xnkmJ1uVfkr8z248Ykcag6y3tkMXMUTRjGidFoxsRtzX5CG1M5vZXOdbe1SoRBzM46GONunzxc9B-6H1Zj0UA4WM3zVcduQPeOVK--O7Ft-6CAgE3h5sASwykCW-dfzjWPVkNvdg9lG7YdRrDhgHMDYzU" 
                                        alt="Dashboard Visualization" 
                                    />
                                </div>
                                <div className="absolute -bottom-10 -left-10 bg-white/5 backdrop-blur-xl p-6 rounded-2xl text-white shadow-2xl -rotate-6 border border-white/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                            <span className="material-symbols-outlined">trending_up</span>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 font-black uppercase">Hire Velocity</div>
                                            <div className="text-2xl font-black">+24.8%</div>
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-500">Comparing last 30 days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black text-center mb-20 text-white">How HireSphere Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-[1px] bg-white/5 border-t border-dashed"></div>
                            {[
                                { step: 1, title: 'Centralize Candidates', desc: 'Sync with job boards or upload CSVs to bring all your talent into one unified platform.', icon: 'cloud_upload' },
                                { step: 2, title: 'Automate Workflows', desc: 'Set up custom interview loops and automated feedback reminders for your hiring team.', icon: 'dynamic_feed' },
                                { step: 3, title: 'Hire the Best', desc: 'Use data-backed scorecards to compare candidates objectively and close top talent faster.', icon: 'verified_user' }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center gap-6 relative group">
                                    <div className="size-24 rounded-full bg-[#0A0A0A] border-4 border-white/5 shadow-xl flex items-center justify-center text-primary z-10 group-hover:border-primary/40 transition-all">
                                        <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{item.step}. {item.title}</h3>
                                    <p className="text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-32 px-6 relative">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black text-white">Simple, Transparent Pricing</h2>
                            <p className="text-slate-400">Choose the plan that fits your growth ambitions.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
                            <PricingCard 
                                plan="Starter"
                                price="$49"
                                description="For small teams making up to 5 hires/mo."
                                features={['3 Active Roles', 'Basic Candidate CRM', 'Email Support']}
                            />
                            <PricingCard 
                                plan="Professional"
                                price="$199"
                                description="For scale-ups with active hiring needs."
                                features={['Unlimited Active Roles', 'Advanced Workflows', 'Calendar Automations', 'Priority Support']}
                                popular={true}
                            />
                            <PricingCard 
                                plan="Enterprise"
                                price="Custom"
                                description="For large global organizations."
                                features={['Unlimited Everything', 'SSO & Advanced Security', 'Dedicated Success Manager', 'Custom API Integration']}
                                darker={true}
                            />
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-32 bg-white/[0.01] px-6 border-y border-white/5">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="text-center mb-16 space-y-4">
                            <h2 className="text-4xl font-black text-white">Loved by recruiting teams everywhere</h2>
                            <p className="text-slate-500">Read how thousands of companies scaled their hiring with HireSphere</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { text: "HireSphere completely transformed how we coordinate global interviews. Our time-to-hire dropped by 30% in the first quarter.", name: "Sarah Chen", role: "VP of People, TechScale", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcuyD-edkqiPyVEyrjBH8dlvkb1nFLs1mYC6bCqoTi89MvqcQIN-LqZSq5LLmU0ZxokcskBp1xITfxLLc8cr6AkJNutdd-s8OT8orHcH9yeBILvxS9MhTGYLImFWHD_lA6pmcV2HD1fO49fKxqCGYMdTqbXq_LXePdaRACIUveYuTpwEczCRywRPigsqXvbSSPHO3cSXAJ9kUXBbcKlDtsUl6U-J-I0LsDV_2ShfBTwB-VtGTB9_P_1F136qhgTtPD5mcl-sWUzsM" },
                                { text: "The scheduling engine is world-class. No more manual back-and-forth emails. It just works seamlessly with our enterprise calendar stack.", name: "Marcus Wright", role: "Talent Acquisition, Global Solutions", accent: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBJFmtiHn4HBWAOa8eB9KH4E84lBt-WlwDza1ZIY1fjN_YvbNKSIyxgV4uNrLHlP5kpi0H8MqAj6zHcoD3DuZOTXO0t6ujO-fR6Yh-gqlvyF8-flApOYTw0H1OGLe5vxa7rHNbsFa-e4jJqn0n5y89J-MgxcitL98DWmDFFAYV6VkiT3br2i5mRgctRahans8LoX-JK0eLtBK1NnSODJmnbT74vf3RbLtkVaIIvbaXdQ9VEMB1LPx11W3TukikiNfSqVQ4Upkj2mI" },
                                { text: "The analytics are what set HireSphere apart. We can finally see exactly where our recruitment pipeline is slowing down.", name: "Elena Rodriguez", role: "Recruiting Ops, InnovateX", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxYhZj5xt4QAUjrAd4vRaQGinPl_QeB_tb5J7-YK7OswogTQF3XucPwmbrCvgeBTwag1Dz9F6gZECzL6tPeuWIiIdB_O56X8Nb3NylpTXpJE2Ne0Nb7pvQfTVP483aeptCMpJANhwgaS-ro8kss0XFDH0t1017tzI6kdMBjjBlNVUPyC1QOusys1uEZVohvBLKa7_YsM832EgfF0RETtrKwrKUwqBfzv_UZGbh6NaieEzU3crwBUFFOuMjKA5g-T8wvE2tUQmRmmk" }
                            ].map((testimonial, i) => (
                                <div key={i} className={`p-10 rounded-2xl border flex flex-col justify-between ${testimonial.accent ? 'border-primary/20 bg-primary/5 shadow-lg shadow-primary/5' : 'border-white/5 bg-white/[0.02]'}`}>
                                    <p className="text-slate-300 italic text-lg leading-relaxed mb-8">"{testimonial.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-slate-800 overflow-hidden">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{testimonial.name}</div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32 px-6">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="bg-primary rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] group-hover:scale-110 transition-transform duration-700"></div>
                            
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative z-10 space-y-10"
                            >
                                <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight">Ready to upgrade your hiring?</h2>
                                <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">Join 2,000+ teams who are hiring faster and smarter with HireSphere. Start your free trial today.</p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Link href="/register" className="h-16 px-12 bg-white text-primary text-lg font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
                                        Get Started for Free
                                    </Link>
                                    <button className="h-16 px-12 bg-transparent border-2 border-white/30 text-white text-lg font-black rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center">
                                        Schedule a Demo
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

