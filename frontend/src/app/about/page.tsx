'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-slate-50 font-display text-slate-900 min-h-screen selection:bg-primary/20">
            <main className="flex flex-col items-center relative overflow-hidden">
                {/* Background Aura */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] -z-10 rounded-full translate-x-1/4 -translate-y-1/4"></div>
                <div className="absolute bottom-1/2 left-0 w-[600px] h-[600px] bg-secondary/5 blur-[120px] -z-10 rounded-full -translate-x-1/2"></div>

                <div className="max-w-[1400px] w-full px-6 py-16 lg:py-32">
                    <div className="flex flex-col gap-24 lg:flex-row lg:items-center">
                        <div className="w-full lg:w-1/2 group relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary to-secondary rounded-[3rem] blur-2xl opacity-[0.05] group-hover:opacity-10 transition-all duration-1000"></div>
                            <div className="relative aspect-square md:aspect-video bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100 group-hover:border-primary/20 transition-all duration-500">
                                <img
                                    alt="Team Collaboration"
                                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-105"
                                    src="/images/about-hero.png"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 lg:w-1/2">
                            <div className="inline-flex items-center px-5 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-primary text-xs font-black uppercase tracking-[0.2em] w-fit">
                                OUR MISSION
                            </div>
                            <h1 className="text-slate-900 text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">
                                Humanizing <br /> the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">hiring</span> process.
                            </h1>
                            <p className="text-slate-600 text-xl leading-relaxed font-medium max-w-xl">
                                We believe every candidate is more than just a resume. HireSphere was founded to bridge the gap between talent and opportunity using intelligent, data-driven tools that prioritize empathy and efficiency.
                            </p>
                            <div className="flex flex-wrap gap-6 pt-4">
                                <button className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95">Join the Journey</button>
                                <button className="bg-white text-slate-900 font-black h-16 px-10 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">Learn More</button>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mt-48">
                        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Our Core <span className="text-primary italic">Values</span></h2>
                            <p className="text-xl text-slate-500 font-medium">The principles that guide every feature we build and every decision we make at HireSphere.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <ValueCard
                                icon="visibility"
                                title="Transparency"
                                description="Open communication is the bedrock of trust. We champion clear feedback loops."
                            />
                            <ValueCard
                                icon="diversity_3"
                                title="Inclusion"
                                description="Biases have no place here. Our tools surface best talent regardless of background."
                            />
                            <ValueCard
                                icon="bolt"
                                title="Innovation"
                                description="We leverage AI to automate the mundane, letting you focus on human connection."
                            />
                            <ValueCard
                                icon="timer"
                                title="Efficiency"
                                description="Time is everyone's most valuable asset. We build workflows that cut noise."
                            />
                        </div>
                    </div>

                    {/* Leadership Section */}
                    <div className="mt-48">
                        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">Meet the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Visionaries</span></h2>
                            <p className="text-xl text-slate-500 font-medium">Experienced builders dedicated to revolutionizing the global talent industry.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                            <LeaderCard
                                name="David Chen"
                                role="Founder & CEO"
                                description="Former Head of Talent at GlobalTech with 15+ years in recruitment tech."
                                image="/images/team-david.png"
                            />
                            <LeaderCard
                                name="Sarah Jenkins"
                                role="CTO"
                                description="AI specialist and engineering leader. Previously at major SaaS platforms."
                                image="/images/team-sarah.png"
                            />
                            <LeaderCard
                                name="Marcus Thorne"
                                role="COO"
                                description="Operations veteran with a focus on scaling culture-first companies."
                                image="/images/team-marcus.png"
                            />
                        </div>
                    </div>

                    {/* Careers CTA */}
                    <div className="mt-48 mb-24">
                        <div className="relative w-full rounded-[4rem] bg-slate-900 px-12 py-28 overflow-hidden text-center shadow-3xl shadow-slate-300 group">
                            {/* Animated Background Gradients */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 group-hover:bg-secondary/30 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col items-center gap-10 text-white">
                                <h2 className="text-5xl md:text-8xl font-black max-w-4xl tracking-tight leading-[0.9]">Shape the future of <br /> hiring with us.</h2>
                                <div className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-full font-black border border-white/10 tracking-widest text-xs uppercase">12+ ROLES CURRENTLY OPEN</div>
                                <p className="text-white/70 text-xl max-w-2xl font-medium leading-relaxed">
                                    We're always looking for passionate designers, engineers, and visionaries who want to make a global impact.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6 pt-4">
                                    <button className="bg-white text-slate-900 text-lg font-black h-20 px-14 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95">View Open Roles</button>
                                    <button className="bg-transparent border-2 border-white/20 text-white text-lg font-black h-20 px-14 rounded-2xl hover:bg-white/10 transition-all">Culture Handbook</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ValueCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex flex-col gap-8 rounded-[2.5rem] bg-white p-12 border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-primary/20 transition-all duration-500 group hover:-translate-y-2">
            <div className="size-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:shadow-primary/30">
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <div className="space-y-4">
                <h3 className="text-slate-900 text-2xl font-black">{title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed text-sm">{description}</p>
            </div>
        </div>
    );
}

function LeaderCard({ name, role, description, image }: { name: string; role: string; description: string; image: string }) {
    return (
        <div className="group space-y-8 text-center sm:text-left">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative group shadow-2xl shadow-slate-200 border border-slate-100">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                <img
                    alt={name}
                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110"
                    src={image}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="space-y-3 px-2">
                <h4 className="text-3xl font-black text-slate-900 group-hover:text-primary transition-colors">{name}</h4>
                <p className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-primary font-black text-[10px] tracking-widest uppercase">{role}</p>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{description}</p>
            </div>
        </div>
    );
}
