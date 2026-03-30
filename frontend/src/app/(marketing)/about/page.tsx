'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    Globe, 
    ShieldCheck, 
    Zap, 
    Users, 
    CheckCircle2, 
    ArrowRight, 
    Award, 
    Gem, 
    BarChart3,
    Heart,
    Handshake,
    Rocket
} from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-white font-body text-slate-900 min-h-screen selection:bg-slate-950 selection:text-white">
            <main className="flex flex-col items-center relative overflow-hidden">
                
                <div className="max-w-7xl w-full px-6 pt-40 pb-24">
                    <div className="flex flex-col gap-24 lg:flex-row lg:items-center">
                        <div className="w-full lg:w-1/2">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square bg-slate-50 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200"
                            >
                                <img
                                    alt="Team Collaboration"
                                    className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                                    src="/images/about-hero.png"
                                />
                                <div className="absolute inset-0 bg-slate-900/10"></div>
                            </motion.div>
                        </div>
                        <div className="flex flex-col gap-8 lg:w-1/2">
                            <div className="inline-flex items-center px-4 py-1.5 rounded-lg bg-slate-100 text-slate-900 text-[11px] font-bold uppercase tracking-widest w-fit">
                                OVERVIEW
                            </div>
                            <h1 className="text-slate-950 text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight">
                                Humanizing <br /> the <span className="text-slate-400">recruitment</span> lifecycle.
                            </h1>
                            <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-xl">
                                We believe every candidate represents untapped potential. HireSphere was founded to bridge the gap between world-class talent and high-growth organizations using intelligent, data-driven systems.
                            </p>
                            <div className="flex flex-wrap gap-6 pt-4">
                                <Link href="/register" className="bg-slate-950 text-white font-bold h-16 px-10 rounded-2xl shadow-none shadow-slate-950/20 transition-all hover:scale-105 flex items-center tracking-widest uppercase text-xs">Join our platform</Link>
                                <Link href="/contact" className="bg-white text-slate-950 font-bold h-16 px-10 rounded-2xl border border-slate-200 hover:border-slate-950 transition-all flex items-center tracking-widest uppercase text-xs">Learn More</Link>
                            </div>
                        </div>
                    </div>

                    {/* Mission Section */}
                    <div className="mt-48 grid grid-cols-1 lg:grid-cols-2 gap-24 py-24 border-y border-slate-100 items-center">
                         <div className="space-y-8">
                             <h2 className="text-4xl md:text-5xl font-bold text-slate-950 tracking-tight">Our mission is to build the world's most <span className="text-slate-400">efficient</span> talent engine.</h2>
                             <p className="text-lg text-slate-500 font-medium leading-relaxed">We empower hiring managers and talent leaders with the tools they need to make unbiased, high-integrity decisions at scale. No more guesswork, just data.</p>
                             <div className="grid grid-cols-2 gap-8 pt-6">
                                  <div className="space-y-2">
                                       <div className="text-4xl font-bold text-slate-950">12k+</div>
                                       <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Placements Facilitated</div>
                                  </div>
                                  <div className="space-y-2">
                                       <div className="text-4xl font-bold text-slate-950">500+</div>
                                       <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Organizations</div>
                                  </div>
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                              <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-4 group hover:bg-slate-950 hover:text-white transition-all duration-500">
                                   <Globe className="size-10" />
                                   <span className="text-[11px] font-bold uppercase tracking-widest">Global Reach</span>
                              </div>
                              <div className="h-64 mt-12 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-4 group hover:bg-slate-950 hover:text-white transition-all duration-500">
                                   <ShieldCheck className="size-10" />
                                   <span className="text-[11px] font-bold uppercase tracking-widest">Security First</span>
                              </div>
                         </div>
                    </div>

                    {/* Values Section */}
                    <div className="mt-48 text-center">
                        <div className="mb-24 max-w-3xl mx-auto space-y-6">
                            <h2 className="text-4xl md:text-6xl font-bold text-slate-950 tracking-tight leading-none">Our Core Values</h2>
                            <p className="text-xl text-slate-500 font-medium">The architectural principles that guide every feature we commit to our repository.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <ValueCard
                                icon={Handshake}
                                title="Integrity"
                                description="We champion transparency in evaluation and honest feedback loops for all participants."
                            />
                            <ValueCard
                                icon={Heart}
                                title="Empathy"
                                description="Behind every resume is a human journey. We build systems that treat talent with respect."
                            />
                            <ValueCard
                                icon={Rocket}
                                title="Velocity"
                                description="We prioritize time-to-hire without compromising on the depth of the assessment."
                            />
                            <ValueCard
                                icon={Gem}
                                title="Precision"
                                description="Our AI tools are engineered for accuracy, reducing noise and highlighting true talent."
                            />
                        </div>
                    </div>

                    {/* Careers CTA */}
                    <div className="mt-48 mb-24">
                        <div className="relative w-full rounded-[4rem] bg-slate-950 px-12 py-32 overflow-hidden text-center shadow-2xl">
                            <div className="relative z-10 flex flex-col items-center gap-8 text-white">
                                <h2 className="text-5xl md:text-8xl font-bold max-w-5xl tracking-tight leading-[0.9]">Shape the future of <br /> talent with us.</h2>
                                <div className="px-5 py-2 rounded-full border border-white/20 bg-white/5 text-white/60 font-bold tracking-widest text-[10px] uppercase">Join Our Global Team</div>
                                <p className="text-white/40 text-xl max-w-2xl font-medium leading-relaxed">
                                    We're searching for engineers, designers, and visionaries who want to redefine how the world's best teams are built.
                                </p>
                                <div className="flex flex-wrap justify-center gap-6 pt-6">
                                    <Link href="/contact" className="bg-white text-slate-950 text-[12px] uppercase font-bold h-20 px-16 rounded-2xl shadow-none hover:scale-105 transition-all flex items-center tracking-widest">View Openings</Link>
                                    <Link href="/about" className="bg-transparent border-2 border-white/10 text-white text-[12px] uppercase font-bold h-20 px-16 rounded-2xl hover:bg-white/5 transition-all flex items-center tracking-widest">Read Culture Docs</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ValueCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
    return (
        <div className="flex flex-col gap-8 rounded-2xl bg-slate-50 p-6 border border-slate-100 transition-all duration-500 hover:border-slate-950 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group">
            <div className="size-16 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 shadow-none">
                <Icon className="size-7" />
            </div>
            <div className="space-y-4 text-left">
                <h3 className="text-slate-950 text-2xl font-bold tracking-tight">{title}</h3>
                <p className="text-slate-500 font-semibold leading-relaxed text-sm">{description}</p>
            </div>
        </div>
    );
}
