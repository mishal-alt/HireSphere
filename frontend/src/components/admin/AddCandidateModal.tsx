'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateCandidate } from '@/hooks/useCandidates';
import Portal from '@/components/Portal';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
                            className="relative w-full max-w-lg bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-3xl"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">person_add</span>
                            </div>

                            <div className="p-6 border-b border-gray-200/50 relative z-10 bg-gray-50">
                                <h2 className="text-3xl font-heading font-semibold text-gray-900 tracking-tight">Add Candidate</h2>
                                <p className="text-sm uppercase font-semibold tracking-[0.2em] text-gray-500 mt-2 italic">Add a new candidate to the system</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-10 relative z-10">
                                {error && (
                                    <div className="p-5 bg-gray-50 border border-gray-200/50 rounded-xl text-gray-600 text-sm font-semibold uppercase tracking-[0.1em] flex items-center gap-3">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Full Name</label>
                                        <Input
                                            required
                                            type="text"
                                            placeholder="Name"
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Email Address</label>
                                        <Input
                                            required
                                            type="email"
                                            placeholder="Email"
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Phone Number</label>
                                        <Input
                                            type="tel"
                                            placeholder="Phone"
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Experience (Years)</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. 5+ Years"
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            value={formData.experience}
                                            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Highest Education</label>
                                        <Input
                                            type="text"
                                            placeholder="e.g. B.Tech Computer Science"
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            value={formData.education}
                                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-900 font-medium ml-1">Resume (PDF/IMG)</label>
                                        <div className="relative group">
                                            <Input
                                                type="file"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                accept=".pdf,image/*"
                                            />
                                            <div className="h-28 w-full rounded-xl border border-gray-200/50 border-dashed bg-gray-50 flex flex-col items-center justify-center group-hover:bg-gray-50 group-hover:bg-gray-100 group-hover: transition-all">
                                                <span className="material-symbols-outlined text-gray-500 mb-2 group-hover:scale-110 transition-transform">cloud_upload</span>
                                                <p className="text-sm text-gray-500 uppercase tracking-[0.1em]">
                                                    {file ? file.name : 'Upload Resume'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-4">
                                    <Button variant="secondary"
                                        type="button"
                                        onClick={onClose}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="outline"
                                        disabled={createMutation.isPending}
                                        className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {createMutation.isPending ? (
                                            <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            'Add Candidate'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Portal>
    );
}
