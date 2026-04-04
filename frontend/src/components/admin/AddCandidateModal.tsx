'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCreateCandidate } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';
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
    const { data: jobs = [] } = useJobs();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
        jobId: '',
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
            if (formData.jobId) {
                data.append('jobId', formData.jobId);
            }
            if (file) {
                data.append('resume', file);
            }

            await createMutation.mutateAsync(data);
            onClose();
            setFormData({ name: '', email: '', phone: '', experience: '', education: '', jobId: '' });
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
                            className="relative w-full max-w-2xl bg-white border border-gray-200/50 rounded-2xl overflow-hidden shadow-3xl flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                <span className="material-symbols-outlined text-[10rem]">person_add</span>
                            </div>

                            <div className="p-6 border-b border-gray-200/50 relative z-10 bg-gray-50/80 backdrop-blur-sm flex-shrink-0">
                                <h2 className="text-3xl font-heading font-semibold text-gray-900 tracking-tight">Add Candidate</h2>
                                <p className="text-sm uppercase font-semibold tracking-[0.2em] text-gray-500 mt-2 italic">Add a new candidate to the system</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 relative z-10 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="space-y-6">
                                    {error && (
                                        <div className="p-4 bg-red-50/50 border border-red-200/50 rounded-xl text-red-600 text-sm font-semibold uppercase tracking-[0.1em] flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Full Name</label>
                                            <Input
                                                required
                                                type="text"
                                                placeholder="e.g. John Doe"
                                                className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all shadow-sm"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Email Address</label>
                                            <Input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all shadow-sm"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Phone Number</label>
                                            <Input
                                                type="tel"
                                                placeholder="+1 (555) 000-0000"
                                                className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all shadow-sm"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Experience (Years)</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. 5+ Years"
                                                className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all shadow-sm"
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Highest Education</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. B.Tech Computer Science"
                                                className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-rose-500/20 focus-visible:border-rose-500/50 transition-all shadow-sm"
                                                value={formData.education}
                                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Assign to Job Role</label>
                                            <div className="relative">
                                                <select
                                                    className="w-full h-11 bg-gray-50/50 border border-gray-200/60 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/50 px-3 cursor-pointer appearance-none transition-all shadow-sm"
                                                    value={formData.jobId}
                                                    onChange={(e) => setFormData({ ...formData, jobId: e.target.value })}
                                                >
                                                    <option value="" className="text-gray-500">Select a job (Optional)</option>
                                                    {jobs.map((job) => (
                                                        <option key={job._id} value={job._id} className="text-gray-900">{job.title} - {job.department}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                                    <span className="material-symbols-outlined text-xl">expand_more</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 md:col-span-2 mt-2">
                                            <label className="text-sm font-semibold text-gray-900 ml-1">Resume (PDF/IMG)</label>
                                            <div className="relative group mt-1">
                                                <Input
                                                    type="file"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                                    accept=".pdf,image/*"
                                                />
                                                <div className="h-32 w-full rounded-2xl border-2 border-dashed border-gray-200/60 bg-gray-50/50 flex flex-col items-center justify-center group-hover:bg-gray-50 transition-all group-hover:border-rose-500/30 group-hover:shadow-sm">
                                                    <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                                        <span className="material-symbols-outlined text-gray-400 group-hover:text-rose-500 transition-colors">cloud_upload</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {file ? file.name : 'Click to upload resume'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 mt-6 border-t border-gray-200/50 flex-shrink-0">
                                    <Button variant="secondary"
                                        type="button"
                                        onClick={onClose}
                                        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 shadow-sm border border-gray-200/60 h-11 rounded-xl text-sm font-semibold transition-all"
                                    >
                                        Cancel
                                    </Button>
                                    <Button variant="default"
                                        disabled={createMutation.isPending}
                                        className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        {createMutation.isPending ? (
                                            <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
