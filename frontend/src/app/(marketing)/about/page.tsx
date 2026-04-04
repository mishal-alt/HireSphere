'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-surface text-on-surface antialiased font-body min-h-screen selection:bg-secondary-fixed selection:text-on-secondary-fixed">
            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[716px] flex items-center overflow-hidden py-24">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container to-primary opacity-5"></div>
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-tertiary-fixed/20 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary-fixed/10 rounded-full blur-[100px]"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
                        <div className="max-w-4xl">
                            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase bg-secondary-fixed text-on-secondary-fixed-variant rounded-full font-heading">Evolution of Talent</span>
                            <h1 className="text-6xl md:text-8xl font-extrabold text-primary leading-[0.95] tracking-tight mb-8 font-heading">
                                RECRUITMENT SIMPLIFIED: <br />
                                <span className="text-secondary">TAILORED FOR EXCELLENCE</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-on-surface-variant font-body max-w-2xl leading-relaxed">
                                We are architects of professional growth, designing the infrastructure that connects world-class talent with the world's most ambitious enterprises.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Company Section */}
                <section className="py-24 bg-surface-container-low">
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Left Side: Overlapping Images */}
                        <div className="relative">
                            <div className="aspect-[4/5] w-full max-w-md ml-auto rounded-xl overflow-hidden border-[12px] border-secondary-fixed/30 editorial-shadow relative z-0">
                                <img
                                    alt="Professional executive"
                                    className="w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh6f5BMfLD6rbBu0cmTqeal-89JToC5TNBkLB4lfBXXwaPzjhxBen8_NXvC0_W0LKpB-AAYe0DsMXMBM6l1hrIKOUB34oofT3n2EoMN0PpmCQQ6DwJd5h-XRbknewy29d5O7p_NeBR09AAc3vLJuwA0c4Z39unvOkWYclbTTMdiTi1LVSAEg_o2Xs50HNsevpABUAojC2hPdfjYxBrCArjdiMr0G_h_rB6kY883q0cpcKx7jQCuQCAa9j-K3Dl3VzmsZzQsF2uCcQ"
                                />
                            </div>
                            {/* Overlapping Glass Card */}
                            <div className="absolute -bottom-10 -left-6 md:-left-12 w-64 md:w-80 dark-glass-card p-8 rounded-xl editorial-shadow z-10 border border-white/10 [background:rgba(24,40,28,0.85)] [backdrop-filter:blur(20px)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined filled">insights</span>
                                    </div>
                                    <span className="text-tertiary-fixed font-bold text-sm tracking-widest uppercase font-heading">Live Metrics</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary-fixed w-[85%]"></div>
                                    </div>
                                    <div className="flex justify-between text-white/60 text-xs font-medium">
                                        <span>Optimization</span>
                                        <span>85%</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/10">
                                        <p className="text-white text-lg font-bold font-heading">Editorial Precision</p>
                                        <p className="text-white/50 text-xs mt-1">High-fidelity candidate curation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Content */}
                        <div className="flex flex-col gap-10">
                            <div>
                                <h2 className="text-sm font-extrabold tracking-[0.3em] text-secondary mb-4 uppercase font-heading">Our Company</h2>
                                <h3 className="text-4xl md:text-5xl font-extrabold text-primary mb-8 leading-tight font-heading">Cultivating a Higher Standard of Executive Search.</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-outline-variant/10">
                                            <span className="material-symbols-outlined">visibility</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-primary mb-2 font-heading">Vision</h4>
                                            <p className="text-on-surface-variant leading-relaxed">To redefine human capital management through intuitive AI and seamless digital workflows.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary border border-outline-variant/10">
                                            <span className="material-symbols-outlined">rocket_launch</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-primary mb-2 font-heading">Mission</h4>
                                            <p className="text-on-surface-variant leading-relaxed">Empowering recruiters to find the perfect match with speed, precision, and ethical integrity.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-surface-container-highest/30 p-8 rounded-2xl border-l-4 border-secondary-fixed">
                                <h4 className="text-xl font-bold text-primary mb-4 font-heading">Our Story</h4>
                                <p className="text-on-surface-variant leading-relaxed">
                                    Founded at the intersection of psychology and technology, HireSphere was born from a simple observation: enterprise hiring tools were functional but lacked "soul." We built a platform that treats recruitment as a high-stakes editorial process rather than just a data entry task. Today, we serve global enterprises by providing a "Greenhouse View" of their talent pipeline—structured for growth, transparent by design, and authoritative in its execution.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Infrastructure / Values Section */}
                <section className="py-24 bg-surface">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <h2 className="text-4xl font-extrabold text-primary mb-6 font-heading">Core Infrastructure</h2>
                            <p className="text-on-surface-variant text-lg">Our architectural pillars are designed to handle the complexity of global talent acquisition with surgical precision.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InfrastructureCard
                                icon="hub"
                                title="Multi-Portal Architecture"
                                description="A unified engine powering bespoke portals for candidates, agencies, and internal stakeholders simultaneously."
                                action="EXPLORE SYSTEM"
                            />
                            <InfrastructureCard
                                icon="record_voice_over"
                                title="Professional Interview System"
                                description="High-fidelity communication channels integrated with AI-driven sentiment analysis and editorial feedback loops."
                                action="VIEW INTERFACES"
                            />
                            <InfrastructureCard
                                icon="all_inclusive"
                                title="Candidate Lifecycle"
                                description="End-to-end transparency from the first touchpoint to executive onboarding, visualized in a central greenhouse view."
                                action="MAP JOURNEY"
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-primary-container rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent opacity-50"></div>
                            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]"></div>
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 font-heading">Ready to transform your recruitment?</h2>
                                <p className="text-primary-fixed-dim text-lg md:text-xl mb-12">Join the elite enterprises managing their human capital with the clarity of HireSphere.</p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <Link href="/register" className="bg-secondary-fixed text-on-secondary-fixed px-10 py-5 rounded-xl font-extrabold text-lg shadow-xl hover:bg-tertiary-fixed transition-all active:scale-95 font-heading">
                                        Get Started Today
                                    </Link>
                                    <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-xl font-extrabold text-lg border border-white/20 hover:bg-white/20 transition-all font-heading">
                                        Request a Demo
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

function InfrastructureCard({ icon, title, description, action }: { icon: string; title: string; description: string; action: string }) {
    return (
        <div className="bg-surface-container-low p-10 rounded-[2rem] shadow-sm hover:bg-white transition-colors duration-500 group border border-outline-variant/10">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-secondary-fixed mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <h4 className="text-2xl font-bold text-primary mb-4 font-heading">{title}</h4>
            <p className="text-on-surface-variant leading-relaxed mb-6">{description}</p>
            <div className="flex items-center text-secondary font-bold text-sm tracking-widest gap-2 cursor-pointer font-heading">
                {action} <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
        </div>
    );
}
