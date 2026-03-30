'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Mail, 
    MessageSquare, 
    Phone, 
    MapPin, 
    Send, 
    ExternalLink, 
    ChevronRight,
    Globe,
    ShieldCheck,
    CheckCircle2,
    Building2,
    Users
} from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="bg-white font-body text-slate-900 min-h-screen selection:bg-slate-950 selection:text-white overflow-x-hidden">
            <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
                
                {/* Hero Header */}
                <div className="max-w-4xl mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-lg bg-slate-50 border border-slate-200 text-slate-950 text-[11px] font-bold uppercase tracking-widest shadow-none"
                    >
                        <Globe className="size-3.5" />
                        GET IN TOUCH WITH US
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tight mb-8 text-slate-950 leading-[0.9]"
                    >
                        Let's build your <br /> <span className="text-slate-400">dream team</span> together.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed"
                    >
                        Whether you're a high-growth startup or a global enterprise, we have the architectural tools to help you identify and secure the world's best talent.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
                    {/* Contact Form Section */}
                    <div className="lg:col-span-12 xl:col-span-7">
                        <div className="bg-slate-50 border border-slate-200 p-6 md:p-16 rounded-[3.5rem] shadow-inner relative overflow-hidden">
                             <div className="relative z-10">
                                <form className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FormInput label="First Name" placeholder="Jane" />
                                        <FormInput label="Last Name" placeholder="Doe" />
                                    </div>
                                    <FormInput label="Work Email" placeholder="jane@company.com" type="email" />
                                    
                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Inquiry Category</label>
                                        <div className="relative group">
                                            <select className="w-full h-16 px-6 rounded-2xl bg-white border border-slate-200 text-slate-950 focus:border-slate-950 outline-none transition-all appearance-none cursor-pointer font-semibold text-sm shadow-none group-hover:border-slate-900">
                                                <option value="">Select a topic</option>
                                                <option value="sales">Enterprise Solutions & Sales</option>
                                                <option value="support">Technical Support</option>
                                                <option value="press">Press & Media Relations</option>
                                                <option value="careers">Careers at HireSphere</option>
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-950 transition-colors">
                                                <ChevronRight className="size-5 rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                                        <textarea className="w-full h-48 px-6 py-6 rounded-2xl bg-white border border-slate-200 text-slate-950 focus:border-slate-950 outline-none transition-all resize-none font-semibold text-sm shadow-none placeholder:text-slate-300" placeholder="Describe your organizational needs..."></textarea>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/50 border border-slate-100">
                                        <div className="relative flex items-center h-6">
                                            <input className="w-5 h-5 rounded-md border-slate-200 bg-white text-slate-950 focus:ring-slate-950 transition-all cursor-pointer shadow-none" id="privacy" type="checkbox" />
                                        </div>
                                        <label className="text-xs text-slate-500 font-semibold leading-relaxed" htmlFor="privacy">
                                            By submitting this form, I agree to HireSphere's <Link className="text-slate-950 hover:underline font-bold" href="#">Privacy Policy</Link> and <Link className="text-slate-950 hover:underline font-bold" href="#">Data Processing Agreement</Link>.
                                        </label>
                                    </div>

                                    <button className="w-full h-20 bg-slate-950 text-white font-bold text-[12px] uppercase tracking-widest py-4 rounded-[1.5rem] shadow-2xl shadow-slate-950/20 hover:bg-black transition-all flex items-center justify-center gap-4 active:scale-95 group overflow-hidden relative mt-12">
                                        Send Inquiry
                                        <Send className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                             </div>
                        </div>
                    </div>

                    {/* Side Information Section */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-16">
                        {/* Support Info */}
                        <div className="space-y-12">
                            <h3 className="text-3xl font-bold text-slate-950 tracking-tight">Direct Channels</h3>
                            <div className="grid gap-8">
                                <ContactMethod
                                    icon={Mail}
                                    title="Email Support"
                                    subtitle="Our team typically responds within 4 hours."
                                    actionText="solutions@hiresphere.io"
                                    href="mailto:solutions@hiresphere.io"
                                />
                                <ContactMethod
                                    icon={MessageSquare}
                                    title="Enterprise Chat"
                                    subtitle="Available for Premier Support customers."
                                    actionText="Launch Messenger"
                                />
                                <ContactMethod
                                    icon={Phone}
                                    title="Voice Support"
                                    subtitle="Global support for tactical deployments."
                                    actionText="+1 (800) 555-0100"
                                    href="tel:+18005550100"
                                />
                            </div>
                        </div>

                        {/* Office Locations */}
                        <div className="space-y-12 pt-12 border-t border-slate-100">
                            <h3 className="text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-3">
                                 <Building2 className="size-7" />
                                 Global Headquarters
                            </h3>
                            <div className="space-y-8">
                                <OfficeLocation city="San Francisco (HQ)" address="100 Montgomery Street, Suite 1200, California 94104" />
                                <OfficeLocation city="New York Innovation Hub" address="450 Lexington Avenue, 18th Floor, New York 10017" />
                            </div>
                        </div>

                        {/* Visual Card */}
                        <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border border-slate-200 bg-slate-50 shadow-2xl mt-12 group">
                             <img 
                                src="/images/office-team.png" 
                                className="size-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                alt="Office Interior"
                             />
                             <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors"></div>
                             <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                       <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SF Office Open</span>
                                  </div>
                                  <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-slate-950 flex items-center gap-2">
                                       Directions <ExternalLink className="size-3" />
                                  </Link>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FormInput({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
    return (
        <div className="space-y-4">
            <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
            <input
                className="w-full h-16 px-6 rounded-2xl bg-white border border-slate-200 text-slate-950 focus:border-slate-950 outline-none transition-all font-semibold text-sm shadow-none placeholder:text-slate-300"
                placeholder={placeholder}
                type={type}
            />
        </div>
    );
}

function ContactMethod({ icon: Icon, title, subtitle, actionText, href }: { icon: any; title: string; subtitle: string; actionText: string; href?: string }) {
    const Component = href ? 'a' : 'button';
    return (
        <div className="flex items-start gap-8 group">
            <div className="size-16 rounded-[1.5rem] bg-slate-50 text-slate-400 border border-slate-100 flex flex-shrink-0 items-center justify-center transition-all duration-500 group-hover:bg-slate-950 group-hover:text-white group-hover:border-slate-950 shadow-none">
                <Icon className="size-7" />
            </div>
            <div className="space-y-1">
                <p className="font-bold text-xl text-slate-950 transition-colors">{title}</p>
                <p className="text-slate-500 text-sm font-semibold">{subtitle}</p>
                {/* @ts-ignore */}
                <Component className="inline-flex items-center gap-2 pt-3 text-slate-950 font-bold text-xs uppercase tracking-widest hover:underline transition-all" href={href}>
                    {actionText}
                    <ChevronRight className="size-3" />
                </Component>
            </div>
        </div>
    );
}

function OfficeLocation({ city, address }: { city: string; address: string }) {
    return (
        <div className="space-y-2 group border-l-2 border-slate-100 hover:border-slate-950 px-8 transition-all duration-500">
            <p className="font-bold text-2xl text-slate-950 tracking-tight">{city}</p>
            <p className="text-slate-500 font-semibold leading-relaxed text-sm max-w-sm">{address}</p>
        </div>
    );
}
