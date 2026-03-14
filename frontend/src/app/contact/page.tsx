'use client';

import React from 'react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="bg-background font-display text-slate-100 min-h-screen selection:bg-primary/30">
            <main className="max-w-[1440px] mx-auto px-6 lg:px-20 py-16 md:py-24 relative">
                {/* Background Aura */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>

                {/* Hero Header */}
                <div className="max-w-4xl mb-16 glow-aura">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass-effect text-primary text-xs font-black uppercase tracking-widest border-glow">
                        GET IN TOUCH
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 text-white leading-[0.95]">
                        Let's build your <br /> <span className="text-gradient">dream team</span> together.
                    </h1>
                    <p className="text-xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                        Whether you're a scaling startup or an established enterprise, we have the tools to help you find the right talent.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Contact Form Section */}
                    <div className="lg:col-span-12 xl:col-span-7 group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] blur opacity-10 group-hover:opacity-25 transition-all duration-700"></div>
                        <div className="relative glass-effect p-10 md:p-14 rounded-[2.5rem] border border-white/10 shadow-3xl bg-card/40">
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormInput label="First Name" placeholder="Jane" />
                                    <FormInput label="Last Name" placeholder="Doe" />
                                </div>
                                <FormInput label="Work Email" placeholder="jane@company.com" type="email" />
                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400">Inquiry Type</label>
                                    <div className="relative">
                                        <select className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-all appearance-none cursor-pointer font-medium">
                                            <option value="" className="bg-card">Select a topic</option>
                                            <option value="sales" className="bg-card">Sales & Partnerships</option>
                                            <option value="support" className="bg-card">Customer Support</option>
                                            <option value="press" className="bg-card">Press & Media</option>
                                            <option value="careers" className="bg-card">Careers</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <span className="material-symbols-outlined text-slate-500">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-black uppercase tracking-widest text-slate-400">Message</label>
                                    <textarea className="w-full h-40 px-6 py-5 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-all resize-none font-medium" placeholder="How can we help you?"></textarea>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="relative flex items-center h-6">
                                        <input className="w-5 h-5 rounded-md border-white/10 bg-white/5 text-primary focus:ring-primary transition-all cursor-pointer" id="privacy" type="checkbox" />
                                    </div>
                                    <label className="text-sm text-slate-500 font-medium leading-relaxed" htmlFor="privacy">
                                        I agree to the <Link className="text-primary hover:underline font-bold" href="#">Privacy Policy</Link> and <Link className="text-primary hover:underline font-bold" href="#">Terms of Service</Link>.
                                    </label>
                                </div>
                                <button className="w-full h-16 bg-primary text-white font-black text-lg py-4 rounded-2xl shadow-3xl shadow-primary/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 group/btn overflow-hidden relative">
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform"></div>
                                    <span className="relative">Send Message</span>
                                    <span className="material-symbols-outlined relative group-hover/btn:translate-x-1 transition-transform">send</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Side Information Section */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-16">
                        {/* Support Info */}
                        <div className="space-y-10">
                            <h3 className="text-3xl font-black text-white">Direct <span className="text-primary">Contact</span></h3>
                            <div className="grid gap-8">
                                <ContactMethod
                                    icon="mail"
                                    title="Email Us"
                                    subtitle="Our team is here to help."
                                    actionText="hello@hiresphere.io"
                                    href="mailto:hello@hiresphere.io"
                                />
                                <ContactMethod
                                    icon="chat"
                                    title="Live Chat"
                                    subtitle="Mon-Fri from 9am to 6pm EST."
                                    actionText="Start a conversation"
                                />
                                <ContactMethod
                                    icon="call"
                                    title="Phone Support"
                                    subtitle="Toll-free for premium customers."
                                    actionText="+1 (800) 555-0123"
                                    href="tel:+18005550123"
                                />
                            </div>
                        </div>

                        {/* Office Locations */}
                        <div className="space-y-10">
                            <h3 className="text-3xl font-black text-white">Our <span className="text-primary">Offices</span></h3>
                            <div className="grid sm:grid-cols-2 xl:grid-cols-1 gap-10">
                                <OfficeLocation city="San Francisco (HQ)" address="100 Montgomery Street, Suite 1200, CA 94104" />
                                <OfficeLocation city="New York Office" address="450 Lexington Avenue, NY 10017" />
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 glass-effect group hover:border-primary/30 transition-all duration-700">
                            <div className="absolute inset-0 bg-card/40 flex flex-col items-center justify-center text-slate-500 gap-4">
                                <span className="material-symbols-outlined text-6xl text-primary animate-bounce">location_on</span>
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-white">San Francisco, CA</p>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 glass-effect bg-white/5 border border-white/10 p-5 rounded-2xl shadow-3xl flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Office Open</span>
                                </div>
                                <button className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                                    Get Directions <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </button>
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
        <div className="space-y-3">
            <label className="text-sm font-black uppercase tracking-widest text-slate-400">{label}</label>
            <input
                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary outline-none transition-all font-medium placeholder:text-slate-600"
                placeholder={placeholder}
                type={type}
            />
        </div>
    );
}

function ContactMethod({ icon, title, subtitle, actionText, href }: { icon: string; title: string; subtitle: string; actionText: string; href?: string }) {
    const Component = href ? 'a' : 'button';
    return (
        <div className="flex items-start gap-6 group">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex flex-shrink-0 items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl group-hover:shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div className="space-y-1">
                <p className="font-black text-xl text-white group-hover:text-primary transition-colors">{title}</p>
                <p className="text-slate-500 text-sm font-medium">{subtitle}</p>
                {/* @ts-ignore */}
                <Component className="inline-block pt-2 text-primary font-black hover:underline tracking-wide transition-all translate-y-0 group-hover:-translate-y-0.5" href={href}>
                    {actionText}
                </Component>
            </div>
        </div>
    );
}

function OfficeLocation({ city, address }: { city: string; address: string }) {
    return (
        <div className="space-y-3 group border-l-4 border-white/5 hover:border-primary px-8 transition-all duration-500">
            <p className="font-black text-2xl text-white group-hover:text-primary transition-colors">{city}</p>
            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{address}</p>
        </div>
    );
}
