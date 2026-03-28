'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateCandidate } from '@/hooks/useCandidates';
import Portal from '@/components/Portal';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
    const createMutation = useCreateCandidate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('experience', formData.experience);
            data.append('education', formData.education);
            if (file) {
                data.append('resume', file);
            }

            await createMutation.mutateAsync(data);
            onClose();
            setFormData({ name: '', email: '', phone: '', experience: '', education: '' });
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create candidate');
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
                            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-3xl"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">person_add</span>
                            </div>

                            <div className="p-10 border-b border-slate-100 relative z-10 bg-slate-50/50">
                                <h2 className="text-3xl font-heading font-black text-slate-900 tracking-tight">Add Candidate</h2>
                                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-2 italic">Add a new candidate to the system</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                                {error && (
                                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-3">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Name"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm focus:border-primary/30 focus:bg-white focus:shadow-sm outline-none transition-all shadow-inner"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm focus:border-primary/30 focus:bg-white focus:shadow-sm outline-none transition-all shadow-inner"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm focus:border-primary/30 focus:bg-white focus:shadow-sm outline-none transition-all shadow-inner"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Experience (Years)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 5+ Years"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm focus:border-primary/30 focus:bg-white focus:shadow-sm outline-none transition-all shadow-inner"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Highest Education</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. B.Tech Computer Science"
                                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 text-sm focus:border-primary/30 focus:bg-white focus:shadow-sm outline-none transition-all shadow-inner"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest ml-1">Resume (PDF/IMG)</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                accept=".pdf,image/*"
                                            />
                                            <div className="h-28 w-full rounded-2xl border border-slate-200 border-dashed bg-slate-50 flex flex-col items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:shadow-sm transition-all">
                                                <span className="material-symbols-outlined text-slate-400 mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                                                    {file ? file.name : 'Upload Resume'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 h-14 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-body"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={createMutation.isPending}
                                        className="flex-1 h-14 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center font-body"
                                    >
                                        {createMutation.isPending ? (
                                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Add Candidate'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
}
