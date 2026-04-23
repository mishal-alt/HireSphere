'use client';

import React from 'react';
import Link from 'next/link';

export default function SolutionsPage() {
    return (
        <div className="bg-surface text-on-surface antialiased font-body min-h-screen">


            <main className="pt-24">
                {/* Hero Section */}
                <section className="bg-primary-container py-24 md:py-32 px-6 overflow-hidden relative">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <span className="text-secondary-fixed text-xs uppercase tracking-widest font-bold mb-6 block">Services & Solutions</span>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-surface leading-[1.1] tracking-tight mb-8 font-heading">
                            RECRUITMENT SIMPLIFIED: <br/>
                            <span className="text-tertiary-fixed font-heading">SERVICES TAILORED FOR EXCELLENCE</span>
                        </h1>
                        <p className="text-on-primary-container text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                            Scale your global hiring with an enterprise-grade ATS designed for high-fidelity interviewing and seamless candidate lifecycle management.
                        </p>
                    </div>
                    {/* Subtle Decorative Element */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>
                </section>

                {/* Company/Service Overview */}
                <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Visual Layout (Asymmetric Overlapping) */}
                        <div className="relative h-[500px] md:h-[600px]">
                            <div className="absolute top-0 left-0 w-3/4 h-4/5 rounded-2xl overflow-hidden border-8 border-secondary-fixed shadow-2xl z-20">
                                <img alt="Executive Greenhouse Atrium" className="w-full h-full object-cover" src="/images/solutions-hero.png" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3/5 h-1/2 rounded-2xl overflow-hidden shadow-2xl z-30 translate-x-4 -translate-y-12">
                                <img alt="Botanical Collaborative Meeting" className="w-full h-full object-cover" src="/images/solutions-team.png" />
                            </div>
                            <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-tertiary-fixed/30 rounded-full blur-3xl z-10"></div>
                        </div>

                        {/* Content Side */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-xs uppercase tracking-widest text-secondary font-bold mb-4 font-heading">Our Platform</h2>
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-2 font-heading">Vision</h3>
                                        <p className="text-on-surface-variant text-sm leading-relaxed">To redefine human capital management through intuitive AI and seamless digital workflows.</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary mb-2 font-heading">Mission</h3>
                                        <p className="text-on-surface-variant text-sm leading-relaxed">Empowering recruiters to find the perfect match with speed, precision, and ethical integrity.</p>
                                    </div>
                                </div>
                                <hr className="border-outline-variant/30 mb-8"/>
                                <div className="space-y-6">
                                    <h3 className="text-3xl font-bold text-primary font-heading">Our Story</h3>
                                    <p className="text-on-surface-variant leading-relaxed text-lg">
                                        Founded at the intersection of psychology and technology, HireSphere was born from a simple observation: enterprise hiring tools were functional but lacked &quot;soul.&quot; We built a platform that treats recruitment as a high-stakes editorial process rather than just a data entry task.
                                    </p>
                                    <p className="text-on-surface-variant leading-relaxed">
                                        Today, we serve global enterprises by providing a &quot;Greenhouse View&quot; of their talent pipeline—structured for growth, transparent by design, and authoritative in its execution.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Detailed Service Modules */}
                <section className="py-24 bg-surface-container-low px-6 md:px-12">
                    <div className="max-w-screen-2xl mx-auto">
                        <div className="mb-16">
                            <h2 className="text-4xl font-extrabold text-primary mb-4 tracking-tight font-heading">Core Infrastructure</h2>
                            <p className="text-on-surface-variant text-lg max-w-2xl">The pillars of the HireSphere ecosystem, engineered for enterprise reliability and world-class candidate experiences.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <SolutionCard 
                                icon="layers" 
                                title="Multi-Portal Architecture" 
                                items={[
                                    { label: 'Admin Portal', desc: 'Full control over hiring workflows and team permissions.' },
                                    { label: 'Interviewer Dashboard', desc: 'Focused UI for real-time feedback and scoring.' },
                                    { label: 'Super-Admin Interface', desc: 'System-wide settings and data compliance tools.' }
                                ]}
                            />
                            <SolutionCard 
                                icon="videocam" 
                                title="Professional Interview System" 
                                items={[
                                    { label: 'WebRTC Integration', desc: 'High-definition video without downloads or plugins.' },
                                    { label: 'Signaling Server', desc: 'Robust real-time connections for global latency-free calls.' },
                                    { label: 'Evaluation Workflow', desc: 'Integrated scorecards and collaborative notes.' }
                                ]}
                                color="secondary"
                            />
                            <SolutionCard 
                                icon="person_search" 
                                title="Candidate Lifecycle" 
                                items={[
                                    { label: 'ATS Scoring', desc: 'AI-driven resume parsing and ranking based on custom criteria.' },
                                    { label: 'Status Tracking', desc: 'Visual Kanban-style boards for every stage of the funnel.' },
                                    { label: 'Communication Tools', desc: 'Automated email triggers and built-in chat.' }
                                ]}
                                color="tertiary"
                            />
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto">
                    <div className="bg-primary rounded-3xl p-12 md:p-20 relative overflow-hidden flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-surface mb-8 max-w-3xl leading-tight font-heading">Ready to transform your talent acquisition experience?</h2>
                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            <button className="bg-secondary-fixed text-on-secondary-fixed px-10 py-4 rounded-xl font-bold text-lg hover:translate-y-[-2px] transition-transform shadow-lg shadow-black/20">Request a Live Demo</button>
                            <button className="border border-white/20 text-surface px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">Contact Sales</button>
                        </div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]"></div>
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-tertiary-fixed/10 rounded-full blur-[100px]"></div>
                    </div>
                </section>
            </main>


        </div>
    );
}

function SolutionCard({ icon, title, items, color = 'primary' }: { icon: string; title: string; items: { label: string, desc: string }[]; color?: 'primary' | 'secondary' | 'tertiary' }) {
    const colorClasses = {
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        tertiary: 'bg-tertiary-container'
    };

    return (
        <div className="glass-card p-10 rounded-2xl shadow-sm border border-outline-variant/10 flex flex-col h-full hover:border-outline-variant/30 transition-all">
            <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-8`}>
                <span className="material-symbols-outlined text-surface">{icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-primary mb-4 font-heading">{title}</h3>
            <ul className="space-y-4 mb-8 flex-grow">
                {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-lg filled">check_circle</span>
                        <span className="text-on-surface-variant text-sm">
                            <strong className="font-bold">{item.label}:</strong> {item.desc}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="text-primary font-semibold text-sm flex items-center gap-2 group cursor-pointer transition-all">
                Explore Implementation <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </div>
        </div>
    );
}
