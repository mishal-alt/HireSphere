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

const ReactQuill = dynamic(() => import('react-quill-new'), { 
    ssr: false,
    loading: () => <div className="h-40 w-full animate-pulse bg-slate-100 rounded-xl" />
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
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Openings</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary/40"></span>
                        Manage and track all current {jobs.length} recruitment opportunities.
                    </p>
                </div>
                <button
                    onClick={handleCreateClick}
                    className="h-11 px-6 rounded-lg bg-primary text-white text-sm font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="size-4" />
                    Create Job Opening
                </button>
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
                            className="bg-white p-6 rounded-2xl border border-slate-200 group relative shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-default flex flex-col"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <Briefcase className="size-6" />
                                </div>
                                <button
                                    onClick={(e) => handleEditClick(job, e)}
                                    className="size-8 rounded-lg bg-white border border-slate-200 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 shadow-sm"
                                >
                                    <Edit2 className="size-3.5" />
                                </button>
                            </div>

                            <div className="space-y-2 flex-1">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block leading-none">{job.department}</span>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight line-clamp-2">{job.title}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed h-8">
                                    {(job.description || "").replace(/<[^>]*>/g, '') || "No description provided."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-50 pt-5 mt-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Applications</p>
                                    <p className="text-xs font-bold text-slate-900 leading-none">0 Received</p>
                                </div>
                                <div className={`px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider shadow-sm ${
                                    job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    job.status === 'Paused' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    {job.status === 'Active' ? 'Live' : job.status === 'Paused' ? 'Paused' : 'Closed'}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
                        <div className="size-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-200 shadow-sm">
                            <Briefcase className="size-8" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">No Job Openings</h3>
                        <p className="text-xs font-medium text-slate-400 mt-1">Start by creating your first job posting.</p>
                    </div>
                )}
            </div>

            {/* Overall Status bar */}
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-white">
                    <Activity className="size-24" />
                </div>
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recruitment Metrics</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Platform Performance Hub</p>
                    </div>
                    <div className="flex items-center gap-2.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
                        <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Optimal Velocity</span>
                    </div>
                </div>

                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner p-[1px]">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-primary rounded-full shadow-lg"
                    />
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
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
                            className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl p-8"
                        >
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                        {editingJob ? <Layers className="size-5" /> : <Plus className="size-6" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                                            {editingJob ? 'Edit Job Opening' : 'New Job Opening'}
                                        </h2>
                                        <p className="text-xs font-medium text-slate-500 mt-1">
                                            {editingJob ? 'Update existing position details.' : 'Create a new recruitment opportunity.'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 ml-1">Job Title</label>
                                    <div className="relative group/field">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors size-4 group-focus-within/field:text-primary" />
                                        <input
                                            required
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-semibold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1">Department</label>
                                        <div className="relative group/field">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors size-4 group-focus-within/field:text-primary" />
                                            <input
                                                required
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Engineering"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-semibold text-slate-900 focus:border-primary focus:bg-white transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1">Status</label>
                                        <div className="relative group/field">
                                            <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors size-4 group-focus-within/field:text-primary pointer-events-none" />
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white transition-all appearance-none outline-none cursor-pointer"
                                            >
                                                <option value="Active">Operational (Live)</option>
                                                <option value="Paused">Paused</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 rotate-90 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-900 ml-1">Job Description</label>
                                    <div className="rich-text-editor [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:rounded-b-xl [&_.ql-container]:bg-slate-50/50 [&_.ql-toolbar]:bg-slate-100/50 [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-slate-200 focus-within:[&_.ql-toolbar]:border-primary focus-within:[&_.ql-container]:border-primary transition-all">
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.description}
                                            onChange={handleDescriptionChange}
                                            placeholder="Outline duties, requirements and qualifications..."
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

                                <div className="flex gap-4 pt-4">
                                    {editingJob && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this job opening? This action cannot be undone.')) {
                                                    deleteMutation.mutate(editingJob._id);
                                                    setIsModalOpen(false);
                                                }
                                            }}
                                            className="size-12 rounded-xl border border-red-100 bg-white text-red-500 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center shadow-sm"
                                        >
                                            <Trash2 className="size-5" />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={addMutation.isPending || updateMutation.isPending}
                                        className="flex-1 h-12 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {addMutation.isPending || updateMutation.isPending ? (
                                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Save className="size-4" />
                                                <span>{editingJob ? 'Update Opening' : 'Publish Opening'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
