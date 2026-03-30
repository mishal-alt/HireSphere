'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJobs, useAddJob, useUpdateJob, useDeleteJob } from '@/hooks/useJobs';
import {
    Briefcase,
    Plus,
    Settings,
    Trash2,
    Users,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight,
    SearchX,
    FolderPlus,
    Target,
    Activity,
    Save,
    X,
    BadgeCheck,
    Building2,
    Layers,
    LayoutGrid,
    MoreVertical,
    Edit2
} from 'lucide-react';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const ReactQuill = dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-gray-100 rounded-xl" />
});

export default function JobsPage() {
    const { data: jobs = [], isLoading } = useJobs();
    const addMutation = useAddJob();
    const updateMutation = useUpdateJob();
    const deleteMutation = useDeleteJob();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', department: '', description: '', status: 'Active' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (value: string) => {
        setFormData(prev => ({ ...prev, description: value }));
    };

    const handleEditClick = (job: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingJob(job);
        setFormData({
            title: job.title,
            department: job.department,
            description: job.description || '',
            status: job.status
        });
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setEditingJob(null);
        setFormData({ title: '', department: '', description: '', status: 'Active' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingJob) {
                await updateMutation.mutateAsync({ id: editingJob._id, data: formData });
            } else {
                await addMutation.mutateAsync(formData);
            }
            setIsModalOpen(false);
            setFormData({ title: '', department: '', description: '', status: 'Active' });
            setEditingJob(null);
        } catch (error) {
            // Handled by hook
        }
    };

    if (isLoading && jobs.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Job Openings</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-gray-100"></span>
                        Manage and track all current {jobs.length} recruitment opportunities.
                    </p>
                </div>
                <Button variant="default"
                    onClick={handleCreateClick}
                    className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="size-4" />
                    Create Job Opening
                </Button>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-gray-200/50 rounded-xl p-6  group relative hover:bg-gray-100 transition-colors cursor-default flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-10 rounded-xl bg-white flex items-center justify-center text-gray-500 transition-all">
                                    <Briefcase className="size-5" />
                                </div>
                                <Button variant="ghost"
                                    onClick={(e) => handleEditClick(job, e)}
                                    className="size-8 rounded-lg bg-white border border-gray-200/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-200/50"
                                >
                                    <Edit2 className="size-3.5" />
                                </Button>
                            </div>

                            <div className="space-y-2 flex-1">
                                <span className="text-sm font-bold text-gray-900 font-medium block leading-none">{job.department}</span>
                                <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-tight line-clamp-2">{job.title}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-2 leading-relaxed h-8">
                                    {(job.description || "").replace(/<[^>]*>/g, '') || "No description provided."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-200/50 pt-5 mt-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-500 font-medium leading-none">Applications</p>
                                    <p className="text-xs font-bold text-gray-900 leading-none">0 Received</p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-medium ${ job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40 border-emerald-100' : job.status === 'Paused' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200/50' }`}>
                                    {job.status === 'Active' ? 'Live' : job.status === 'Paused' ? 'Paused' : 'Closed'}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-transparent border-t border-gray-200/50">
                        <div className="size-16 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Briefcase className="size-8" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 font-medium">No Job Openings</h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">Start by creating your first job posting.</p>
                    </div>
                )}
            </div>

            {/* Overall Status bar */}
            <div className="bg-white border border-gray-200/50 rounded-xl p-6  relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Recruitment Metrics</h3>
                        <p className="text-sm text-gray-500 mt-1">Platform Performance Hub</p>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-sm font-bold text-gray-900 font-medium leading-none">Optimal Velocity</span>
                    </div>
                </div>

                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner p-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-primary rounded-full"
                    />
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-white border border-gray-200/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-gray-100 flex-shrink-0">
                                <div className="flex items-center gap-5">
                                    <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-900 border border-gray-100 shadow-sm">
                                        {editingJob ? <Layers className="size-5" /> : <Plus className="size-5" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                                            {editingJob ? 'Refine Posting' : 'Publish Opening'}
                                        </h2>
                                        <p className="text-xs font-semibold text-gray-500 mt-1.5 uppercase tracking-widest leading-none">
                                            {editingJob ? 'Update existing details' : 'Draft a new position'}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                    className="size-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200/50"
                                >
                                    <X className="size-4" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-6">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Job Identity</label>
                                        <div className="relative group/field">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within/field:text-gray-900 transition-colors" />
                                            <Input
                                                required
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Lead UI Engineer"
                                                className="w-full h-11 bg-gray-50 border border-gray-200/50 rounded-xl px-11 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-800 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Team Unit</label>
                                            <div className="relative group/field">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within/field:text-gray-900 transition-colors" />
                                                <Input
                                                    required
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g. Engineering"
                                                    className="w-full h-11 bg-gray-50 border border-gray-200/50 rounded-xl px-11 text-sm font-medium text-gray-900 focus:bg-white focus:border-emerald-800 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Availability</label>
                                            <div className="relative group/field">
                                                <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within/field:text-gray-900 transition-colors pointer-events-none" />
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="w-full h-11 bg-gray-50 border border-gray-200/50 rounded-xl pl-11 pr-10 text-sm font-bold text-gray-900 focus:bg-white focus:border-emerald-800 transition-all appearance-none outline-none cursor-pointer"
                                                >
                                                    <option value="Active">Operational (Live)</option>
                                                    <option value="Paused">Paused</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 rotate-90 pointer-events-none group-hover/field:text-gray-900 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Role Description</label>
                                        <div className="rich-text-editor border-none [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:bg-gray-50 [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-gray-200/50 [&_.ql-container]:border-gray-200/50 focus-within:[&_.ql-toolbar]:border-emerald-800 focus-within:[&_.ql-container]:border-emerald-800 transition-all">
                                            <ReactQuill
                                                theme="snow"
                                                value={formData.description}
                                                onChange={handleDescriptionChange}
                                                placeholder="Outline core responsibilities and tech stack requirements..."
                                                modules={{
                                                    toolbar: [
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                        ['link', 'clean']
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t border-gray-100 flex-shrink-0">
                                        {editingJob && (
                                            <Button variant="ghost"
                                                type="button"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this job opening?')) {
                                                        deleteMutation.mutate(editingJob._id);
                                                        setIsModalOpen(false);
                                                    }
                                                }}
                                                className="size-11 rounded-xl border border-gray-200/50 bg-white text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all flex items-center justify-center shadow-none"
                                            >
                                                <Trash2 className="size-5" />
                                            </Button>
                                        )}
                                        <Button variant="default"
                                            type="submit"
                                            disabled={addMutation.isPending || updateMutation.isPending}
                                            className="flex-1 h-11 bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-none flex items-center justify-center gap-2 border-none"
                                        >
                                            {addMutation.isPending || updateMutation.isPending ? (
                                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="size-4" />
                                                    <span>{editingJob ? 'Finalize Updates' : 'Publish Opening'}</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
