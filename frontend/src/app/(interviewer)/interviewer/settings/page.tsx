'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateProfile } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'Engineering'
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || 'Engineering'
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
            toast.success('Matrix Config Updated Successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to update config');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || 'Engineering'
            });
            toast('Overrides Cancelled', { icon: '🔄' });
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            {/* Header section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Settings_</h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                    Synchronize your identity and portal preferences.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-10 border-b border-white/5">
                {['profile', 'security', 'notifications', 'availability'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : 'text-slate-600 hover:text-white'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="tab-settings" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            {/* Settings Sections */}
            <div className="space-y-12">
                {activeTab === 'profile' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                        {/* Avatar Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center py-8 border-b border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Identity Module_</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Global display image for the matrix.</p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-10">
                                <div className="relative">
                                    <div className="size-24 rounded-3xl border-2 border-primary/20 p-1.5 bg-[#080808]">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'User'}`}
                                            className="size-full rounded-2xl border border-white/10"
                                            alt="Avatar"
                                        />
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 size-8 rounded-xl bg-primary text-white flex items-center justify-center border-4 border-[#030303] shadow-lg hover:scale-110 transition-all">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    <button className="h-10 px-6 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">Upload New Image</button>
                                    <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest px-1">PNG or JPG. Min 400x400px.</p>
                                </div>
                            </div>
                        </div>

                        {/* General Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8 border-b border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Credentials_</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Update your core access information.</p>
                            </div>
                            <div className="md:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Full Identity Name</label>
                                        <input
                                            name="name"
                                            className="w-full bg-[#080808] border border-white/5 rounded-xl px-4 py-3 text-[12px] font-bold text-white italic focus:border-primary/50 outline-none transition-all"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Dept Allocation</label>
                                        <input
                                            className="w-full bg-[#080808] border border-white/5 rounded-xl px-4 py-3 text-[12px] font-bold text-white italic focus:border-primary/50 outline-none transition-all disabled:opacity-50"
                                            value={formData.department}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Communication Channel (Email)</label>
                                    <input
                                        name="email"
                                        className="w-full bg-[#080808] border border-white/5 rounded-xl px-4 py-3 text-[12px] font-bold text-white italic focus:border-primary/50 outline-none transition-all"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Time Sync Protocol (Time Zone)</label>
                                    <select className="w-full bg-[#080808] border border-white/5 rounded-xl px-4 py-3 text-[12px] font-bold text-white italic focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                                        <option>GMT-5 (Eastern Standard Time)</option>
                                        <option>GMT+1 (Greenwich Mean Time)</option>
                                        <option>GMT+5:30 (Indian Standard Time)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Integration */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-8 border-b border-white/5">
                            <div className="space-y-1">
                                <h3 className="text-[12px] font-black text-white uppercase tracking-widest italic">Sync Modules_</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Connect external scheduling nodes.</p>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="size-6" alt="G" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest">Google Calendar</p>
                                            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5 italic">Protocol: Synchronized</p>
                                        </div>
                                    </div>
                                    <button className="text-[9px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest transition-colors">Disconnect Node</button>
                                </div>
                                <button className="w-full p-6 rounded-2xl border border-white/5 border-dashed bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all group flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">add_link</span>
                                    <span className="text-[10px] font-black text-slate-600 group-hover:text-white uppercase tracking-[0.2em] transition-colors">Initialize Outlook Integration</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Submit Controls */}
                <div className="flex justify-end gap-4 pt-10">
                    <button
                        onClick={handleCancel}
                        className="h-12 px-8 rounded-xl border border-white/5 bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
                    >
                        Cancel Overrides
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-12 px-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Synchronizing...
                            </>
                        ) : 'Save Matrix Config'}
                    </button>
                </div>
            </div>
        </div>
    );
}
