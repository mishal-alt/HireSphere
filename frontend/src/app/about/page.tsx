'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="bg-background font-display text-slate-100 min-h-screen selection:bg-primary/30">
            <main className="flex flex-col items-center relative overflow-hidden">
                {/* Background Aura */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] -z-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>

                <div className="max-w-[1400px] w-full px-6 py-16 lg:py-24">
                    <div className="flex flex-col gap-24 lg:flex-row lg:items-center">
                        <div className="w-full lg:w-1/2 group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-25 group-hover:opacity-50 transition-all duration-1000"></div>
                            <div className="relative aspect-square md:aspect-video bg-card rounded-3xl overflow-hidden shadow-3xl border border-primary/30 group-hover:border-primary transition-all duration-500">
                                <img
                                    alt="Team Collaboration"
                                    className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110"
                                    src="/images/about-hero.png"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>
                                <div className="absolute inset-0 border-[3px] border-primary/20 rounded-3xl pointer-events-none group-hover:border-primary/50 transition-all duration-500"></div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-10 lg:w-1/2 glow-aura">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-effect text-primary text-xs font-black uppercase tracking-widest border-glow w-fit">
                                OUR MISSION
                            </div>
                            <h1 className="text-white text-5xl md:text-8xl font-black leading-[0.95] tracking-tighter">
                                Humanizing the <br /> <span className="text-gradient">hiring</span> process.
                            </h1>
                            <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-xl">
                                We believe every candidate is more than just a resume. HireSphere was founded to bridge the gap between talent and opportunity using intelligent, data-driven tools that prioritize empathy and efficiency.
                            </p>
                            <div className="flex gap-6 pt-4">
                                <button className="bg-primary hover:bg-primary/90 text-white font-black h-16 px-10 rounded-2xl shadow-2xl transition-all">Join the Journey</button>
                                <button className="glass-effect text-white font-black h-16 px-10 rounded-2xl border border-white/10 hover:bg-white/5 transition-all">Learn More</button>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="mt-40">
                        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Our Core <span className="text-primary">Values</span></h2>
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
                    <div className="mt-40">
                        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Meet the <span className="text-gradient">Visionaries</span></h2>
                            <p className="text-xl text-slate-500 font-medium">Experienced builders dedicated to revolutionizing the global talent industry.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
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
                        <div className="relative w-full rounded-[3.5rem] bg-gradient-to-r from-primary to-secondary px-12 py-24 overflow-hidden text-center shadow-3xl group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
                            <div className="relative z-10 flex flex-col items-center gap-10 text-white">
                                <h2 className="text-4xl md:text-7xl font-black max-w-4xl tracking-tight">Shape the future of hiring <br /> with us.</h2>
                                <div className="glass-effect text-white px-8 py-3 rounded-2xl font-black border border-white/20 tracking-widest text-sm uppercase">12+ ROLES CURRENTLY OPEN</div>
                                <p className="text-white/80 text-xl max-w-2xl font-medium leading-relaxed">
                                    We're always looking for passionate designers, engineers, and visionaries who want to make a global impact.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6 pt-4">
                                    <button className="bg-white text-primary text-xl font-black h-20 px-14 rounded-[2rem] shadow-2xl hover:scale-105 transition-all active:scale-95">View Open Roles</button>
                                    <button className="bg-transparent border-2 border-white/30 text-white text-xl font-black h-20 px-14 rounded-[2rem] hover:bg-white/10 transition-all">Culture Handbook</button>
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
        <div className="flex flex-col gap-8 rounded-3xl glass-effect bg-white/5 p-10 border border-white/5 hover:border-primary/40 transition-all duration-500 group hover:-translate-y-2">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all shadow-xl group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-4xl">{icon}</span>
            </div>
            <div className="space-y-4">
                <h3 className="text-white text-2xl font-black">{title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{description}</p>
            </div>
        </div>
    );
}

function LeaderCard({ name, role, description, image }: { name: string; role: string; description: string; image: string }) {
    return (
        <div className="group space-y-8 text-center sm:text-left">
            <div className="aspect-square rounded-3xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                <img
                    alt={name}
                    className="w-full h-full object-cover group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110"
                    src={image}
                />
            </div>
            <div className="space-y-3">
                <h4 className="text-3xl font-black text-white">{name}</h4>
                <p className="text-primary font-black text-sm tracking-widest uppercase">{role}</p>
                <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{description}</p>
            </div>
        </div>
    );
}
