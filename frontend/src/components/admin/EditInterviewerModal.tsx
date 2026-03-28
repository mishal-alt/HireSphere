'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdateInterviewer } from '@/hooks/useInterviewers';
import Portal from '@/components/Portal';

interface EditInterviewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewer: any;
}

export default function EditInterviewerModal({ isOpen, onClose, interviewer }: EditInterviewerModalProps) {
    const updateMutation = useUpdateInterviewer();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        isActive: true
    });

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
        try {
            await updateMutation.mutateAsync({ id: interviewer._id, data: formData });
            onClose();
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <Portal>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-3xl"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">edit_square</span>
                            </div>

                            <div className="p-10 relative z-10">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform">
                                            <span className="material-symbols-outlined text-2xl">settings_account_box</span>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-black text-slate-900 tracking-tight leading-none">Modify Logic</h2>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Adjusting agent parameters</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Agent Identification</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">badge</span>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Full Legal ID"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:bg-white focus:shadow-sm transition-all placeholder:text-slate-400 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Communication Channel</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="corp-nexus@hq.sh"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:bg-white focus:shadow-sm transition-all placeholder:text-slate-400 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Operative Unit</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors text-lg">lan</span>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. CORE-ENG"
                                                className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 text-sm font-bold text-slate-900 outline-none focus:border-primary/30 focus:bg-white focus:shadow-sm transition-all placeholder:text-slate-400 shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-tight">Deployment Status</p>
                                            <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Toggle network availability</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer scale-110">
                                            <input
                                                type="checkbox"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-sm transition-colors"></div>
                                        </label>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            disabled={updateMutation.isPending}
                                            type="submit"
                                            className="w-full h-14 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {updateMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">sync_saved_locally</span>
                                                    <span>Push Configuration</span>
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
        </Portal>
    );
}
