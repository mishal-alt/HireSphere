'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: 'Zetron Systems',
        role: 'Administrator'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                company: (user as any).companyName || 'Zetron Systems',
                role: (user as any).role || 'Administrator'
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                name: formData.name,
                email: formData.email
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Page Header */}
            <div className="flex flex-col gap-3">
                <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Settings</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                    Manage your account and app preferences
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-12 border-b border-white/5 overflow-x-auto no-scrollbar">
                {['profile', 'organization', 'security', 'billing', 'notifications'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap ${
                            activeTab === tab ? 'text-primary' : 'text-slate-600 hover:text-white'
                        }`}
                    >
                        {tab.replace('-', ' ')}
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="admin-tab-active" 
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" 
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Panel: Settings Content */}
                <div className="lg:col-span-8 space-y-16">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-12"
                            >
                                {/* Admin Identity */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 border-l-4 border-primary pl-6">
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Your Profile</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Manage your personal details</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
                                        <div className="flex flex-col sm:flex-row gap-10 items-center">
                                            <div className="relative group">
                                                <div className="size-32 rounded-[2rem] border-2 border-primary/20 p-2 bg-[#030303] group-hover:border-primary transition-all">
                                                    <img
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'Admin'}`}
                                                        className="size-full rounded-2xl border border-white/10 grayscale hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                                                        alt="User Photo"
                                                    />
                                                </div>
                                                <button className="absolute -bottom-3 -right-3 size-10 rounded-2xl bg-primary text-white flex items-center justify-center border-4 border-[#030303] shadow-lg hover:scale-110 transition-all">
                                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-sm font-black text-white uppercase tracking-widest">{formData.name || 'Admin User'}</h4>
                                                    <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em]">{formData.role}</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <button className="h-10 px-6 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Change Photo</button>
                                                    <button className="h-10 size-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Full Name</label>
                                                <div className="relative group">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">person</span>
                                                    <input
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#030303] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[12px] font-bold text-white focus:border-primary/50 outline-none transition-all shadow-inner"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">Email Address</label>
                                                <div className="relative group">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">mail</span>
                                                    <input
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#030303] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[12px] font-bold text-white focus:border-primary/50 outline-none transition-all shadow-inner"
                                                        placeholder="Enter your email"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* System Preferences */}
                                <section className="space-y-8">
                                    <div className="flex items-center gap-4 border-l-4 border-accent pl-6">
                                        <div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">Display Options</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Customize your view</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl">
                                        <div className="flex items-center justify-between group cursor-pointer">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">Dark Mode</p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none">Use a dark theme for the app</p>
                                            </div>
                                            <div className="w-14 h-8 rounded-full bg-primary/20 border border-primary/30 p-1 relative">
                                                <div className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-primary shadow-lg shadow-primary/20"></div>
                                            </div>
                                        </div>
                                        
                                        <div className="h-px bg-white/5"></div>

                                        <div className="flex items-center justify-between group cursor-pointer">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">Auto-Refresh Stats</p>
                                                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none">Update dashboard data automatically</p>
                                            </div>
                                            <div className="w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 relative">
                                                <div className="absolute left-1 top-1 bottom-1 aspect-square rounded-full bg-slate-700 shadow-lg"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Controls */}
                    <div className="flex items-center justify-end gap-6 pt-12 border-t border-white/5">
                        <button className="text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-[0.3em] transition-all underline decoration-slate-800 underline-offset-8">Reset to Defaults</button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`h-14 px-12 rounded-2xl bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(80,72,229,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50`}
                        >
                            {isSaving ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-lg">save</span>
                            )}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Right Panel: Side Stats & Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 space-y-8 shadow-2xl overflow-hidden relative group">
                        <div className="absolute -right-10 -top-10 size-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] relative z-10">Security Log</h4>
                        <div className="space-y-6 relative z-10">
                            {[
                                { event: 'Login Detected', time: '2m ago', loc: 'San Francisco, US', icon: 'login', color: 'text-emerald-500' },
                                { event: 'Settings Changed', time: '1h ago', loc: 'User Action', icon: 'settings_suggest', color: 'text-amber-500' },
                                { event: 'Admin Access', time: 'Yesterday', loc: 'New Device', icon: 'shield_person', color: 'text-blue-500' }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 group/item">
                                    <div className={`size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 ${log.color} group-hover/item:scale-110 transition-all`}>
                                        <span className="material-symbols-outlined text-lg">{log.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{log.event}</p>
                                        <p className="text-[8px] text-slate-600 font-bold mt-1 uppercase tracking-[0.2em]">{log.time} • {log.loc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-accent space-y-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em] relative z-10">Security Status</h4>
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-white tracking-tighter">SECURE</span>
                            </div>
                            <p className="text-[10px] text-white/60 font-medium leading-relaxed uppercase tracking-widest">Your account is protected by industry-standard encryption protocols.</p>
                            <button className="w-full h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/20 transition-all mt-4">Security Settings</button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 size-24 bg-white/10 blur-2xl rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
