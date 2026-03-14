'use client';

import React from 'react';
import Link from 'next/link';

export default function FeaturesPage() {
    return (
        <div className="bg-background text-slate-100 min-h-screen font-display selection:bg-primary/30">
            <main className="flex flex-col items-center relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] -z-10"></div>
                <div className="absolute top-[1000px] right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

                {/* Hero Section */}
                <section className="w-full max-w-[1440px] px-6 lg:px-20 pt-16 pb-20 text-center">
                    <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 glow-aura">
                        <span className="px-4 py-1.5 rounded-full glass-effect text-primary text-xs font-black uppercase tracking-widest border-glow">
                            POWERFUL CAPABILITIES
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.05] tracking-tight">
                            Build your <span className="text-gradient">Dream Team</span> with confidence.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed font-medium">
                            A high-performance suite of recruitment tools designed for modern engineering and product organizations.
                        </p>
                    </div>
                </section>

                {/* Interview Automation */}
                <section className="w-full max-w-[1440px] px-6 lg:px-20 py-24 relative" id="interview-automation">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col gap-6">
                                <div className="size-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-2xl shadow-primary/20">
                                    <span className="material-symbols-outlined text-4xl">event_repeat</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Zero-Touch <br /><span className="text-primary">Scheduling</span></h2>
                                <p className="text-xl text-slate-400 font-medium">Eliminate the back-and-forth and give candidates a premium booking experience.</p>
                            </div>
                            <div className="space-y-4">
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
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all"></div>
                            <div className="relative glass-effect rounded-3xl p-8 border border-white/10 aspect-square flex items-center justify-center overflow-hidden">
                                <div className="w-full h-full bg-card rounded-2xl shadow-3xl p-8 border border-white/5 animate-float">
                                    <div className="space-y-8">
                                        <div className="h-4 w-1/4 bg-white/5 rounded-full"></div>
                                        <div className="grid grid-cols-7 gap-3">
                                            {[...Array(21)].map((_, i) => (
                                                <div key={i} className={`h-12 rounded-lg border ${i % 7 === 2 || i % 7 === 4 ? 'bg-primary/20 border-primary/40' : 'bg-white/5 border-white/5'}`}></div>
                                            ))}
                                        </div>
                                        <div className="p-6 glass-effect bg-white/5 rounded-2xl border border-white/5 flex gap-6 items-center">
                                            <div className="size-14 rounded-full bg-primary/20 ring-4 ring-primary/10"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-3 w-1/2 bg-white/10 rounded-full"></div>
                                                <div className="h-3 w-1/4 bg-white/5 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Candidate CRM */}
                <section className="w-full max-w-[1440px] px-6 lg:px-20 py-24" id="candidate-crm">
                    <div className="glass-effect rounded-[3rem] p-12 lg:p-24 border border-white/10 relative overflow-hidden glow-aura">
                        <div className="flex flex-col items-center text-center mb-20 gap-6">
                            <div className="size-16 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary border border-secondary/30">
                                <span className="material-symbols-outlined text-4xl">groups</span>
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Enterprise Talent <span className="text-gradient">Graph</span></h2>
                            <p className="text-xl text-slate-400 max-w-2xl font-medium">Build lasting relationships with a candidate database that feels like magic.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-10">
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
                <section className="w-full max-w-[1440px] px-6 lg:px-20 py-24" id="analytics">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1 relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-3xl blur opacity-10 group-hover:opacity-30 transition-all duration-1000"></div>
                            <div className="relative glass-effect rounded-3xl p-10 border border-white/10 bg-card/50">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="glass-effect p-6 rounded-2xl h-48 flex flex-col justify-end gap-4 border border-white/5">
                                        <div className="flex items-end gap-2 h-24">
                                            {[30, 50, 80, 60, 90].map((h, i) => (
                                                <div key={i} className="flex-1 bg-primary/30 rounded-t-lg relative group/bar hover:bg-primary/50 transition-all" style={{ height: `${h}%` }}>
                                                    <div className="absolute bottom-0 w-full bg-primary h-1/3 blur-sm"></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="h-2 w-2/3 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="glass-effect p-6 rounded-2xl h-48 flex flex-col items-center justify-center gap-4 border border-white/5">
                                        <div className="size-24 rounded-full border-[10px] border-white/5 border-t-accent animate-spin-slow"></div>
                                        <div className="h-2 w-1/2 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="glass-effect p-8 rounded-2xl col-span-2 border border-white/5 space-y-6">
                                        <div className="h-2 w-1/4 bg-white/10 rounded-full"></div>
                                        <div className="space-y-3">
                                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden hover:bg-white/10 transition-colors">
                                                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
                                            </div>
                                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden hover:bg-white/10 transition-colors">
                                                <div className="bg-secondary h-full w-[60%] rounded-full opacity-70"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex flex-col gap-10">
                            <div className="flex flex-col gap-6">
                                <div className="size-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent border border-accent/30 shadow-2xl shadow-accent/10 font-black">
                                    <span className="material-symbols-outlined text-4xl">insights</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white">Full-Stack <br /><span className="text-accent">Recruitment Ops</span></h2>
                                <p className="text-xl text-slate-400 font-medium">Predictive analytics that show you exactly where your pipeline is leaking.</p>
                            </div>
                            <ul className="grid gap-6">
                                <BenefitPoint text="Predictive time-to-hire forecasting powered by AI" />
                                <BenefitPoint text="Real-time cost-per-hire breakdown by source" />
                                <BenefitPoint text="Advanced DEI representation & equity tracking" />
                                <BenefitPoint text="Customized dashboard for every stakeholder" />
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full max-w-[1440px] px-6 lg:px-20 py-32">
                    <div className="bg-gradient-to-br from-primary to-secondary rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-3xl group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px] group-hover:bg-white/20 transition-all duration-700"></div>
                        <h2 className="text-4xl lg:text-7xl font-black text-white max-w-4xl mx-auto leading-tight relative z-10">Ready to build your <br /> next-gen engineering team?</h2>
                        <div className="mt-12 flex flex-wrap justify-center gap-6 relative z-10">
                            <button className="bg-white text-primary text-xl font-black h-20 px-14 rounded-3xl shadow-2xl hover:scale-105 transition-all active:scale-95">Start your 14-day trial</button>
                            <button className="bg-transparent border-2 border-white/30 text-white text-xl font-black h-20 px-14 rounded-3xl hover:bg-white/10 transition-all">Talk to an expert</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function FeatureItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="flex gap-6 p-6 rounded-2xl hover:glass-effect border border-transparent hover:border-white/10 transition-all duration-300 group">
            <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">{icon}</span>
            <div>
                <h4 className="text-lg font-black text-white mb-1">{title}</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CrmCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="p-10 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all duration-500 group flex flex-col items-start gap-6">
            <span className="material-symbols-outlined text-primary text-4xl group-hover:scale-125 transition-transform duration-500">{icon}</span>
            <div className="space-y-3">
                <h3 className="text-2xl font-black text-white">{title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function BenefitPoint({ text }: { text: string }) {
    return (
        <li className="flex items-start gap-4 group">
            <span className="material-symbols-outlined text-accent font-black text-2xl group-hover:scale-110 transition-transform">verified</span>
            <span className="text-slate-300 font-medium text-lg leading-tight">{text}</span>
        </li>
    );
}
