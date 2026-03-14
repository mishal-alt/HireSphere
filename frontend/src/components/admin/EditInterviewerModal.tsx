'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';

interface EditInterviewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewer: any;
}

export default function EditInterviewerModal({ isOpen, onClose, interviewer }: EditInterviewerModalProps) {
    const { updateInterviewer } = useAdminInterviewerStore();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        department: '', 
        isActive: true 
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (interviewer) {
            setFormData({
                name: interviewer.name || '',
                email: interviewer.email || '',
                department: interviewer.department || '',
                isActive: interviewer.isActive ?? true
            });
        }
    }, [interviewer, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await updateInterviewer(interviewer._id, formData);
        if (success) {
            onClose();
        }
        setSubmitting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                        <span className="material-symbols-outlined">edit</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-white italic">Edit Profile</h2>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Update interviewer configuration</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">badge</span>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter full name"
                                            className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="name@company.com"
                                            className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                                    <div className="relative group">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">category</span>
                                        <input
                                            type="text"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Engineering, HR"
                                            className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Active Status</p>
                                        <p className="text-[8px] text-slate-500 uppercase font-bold tracking-tight">Toggle interviewer availability in system</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                            className="sr-only peer" 
                                        />
                                        <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-500 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary/50 peer-checked:after:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                    >
                                        {submitting ? (
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">save</span>
                                                <span>Update Configuration</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
