'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';

interface AddCandidateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddCandidateModal({ isOpen, onClose }: AddCandidateModalProps) {
    const { createCandidate } = useAdminCandidateStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            if (file) {
                data.append('resume', file);
            }

            await createCandidate(data);
            onClose();
            setFormData({ name: '', email: '', phone: '' });
            setFile(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create candidate');
        } finally {
            setLoading(false);
        }
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
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#080808] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 border-b border-white/5">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Add New Candidate</h2>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-1">Fill in the candidate details below</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter candidate name"
                                        className="w-full h-12 px-4 rounded-xl bg-[#121212] border border-white/5 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="candidate@example.com"
                                        className="w-full h-12 px-4 rounded-xl bg-[#121212] border border-white/5 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        className="w-full h-12 px-4 rounded-xl bg-[#121212] border border-white/5 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Resume (PDF/Image)</label>
                                    <div className="relative group">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            accept=".pdf,image/*"
                                        />
                                        <div className="h-24 w-full rounded-xl border border-white/5 border-dashed bg-[#121212] flex flex-col items-center justify-center group-hover:border-primary/50 transition-all">
                                            <span className="material-symbols-outlined text-slate-500 mb-1">upload_file</span>
                                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                                {file ? file.name : 'Upload Candidate Resume'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 h-12 rounded-xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        'Create Candidate'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
