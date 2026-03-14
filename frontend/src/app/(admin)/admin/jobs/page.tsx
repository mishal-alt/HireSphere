'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminJobStore } from '@/store/useAdminJobStore';

export default function JobsPage() {
    const { jobs, loading, fetchJobs, addJob, updateJob, deleteJob } = useAdminJobStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<any>(null);
    const [formData, setFormData] = useState({ title: '', department: '', description: '', status: 'Active' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        setSubmitting(true);
        
        let success;
        if (editingJob) {
            success = await updateJob(editingJob._id, formData);
        } else {
            success = await addJob(formData);
        }

        if (success) {
            setIsModalOpen(false);
            setFormData({ title: '', department: '', description: '', status: 'Active' });
            setEditingJob(null);
        }
        setSubmitting(false);
    };

    if (loading && jobs.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center">
                    HS
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Mission Board</h1>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mt-2">Managing {jobs.length} active job openings</p>
                </div>
                <button 
                    onClick={handleCreateClick}
                    className="h-11 px-8 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span> New Job
                </button>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job, i) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#080808] p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer group shadow-2xl relative"
                        >
                            <button 
                                onClick={(e) => handleEditClick(job, e)}
                                className="absolute top-6 right-6 size-8 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10"
                            >
                                <span className="material-symbols-outlined text-lg">settings</span>
                            </button>

                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{job.department}</span>
                            <h3 className="text-lg font-black text-white tracking-tight mt-2 mb-6 min-h-[48px] leading-tight group-hover:text-primary transition-colors italic">{job.title}</h3>

                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Hired</p>
                                    <p className="text-sm font-black text-white italic">0/1</p>
                                </div>
                                <div className={`px-3 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${
                                    job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    job.status === 'Paused' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                    {job.status}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-[#080808] rounded-2xl border border-white/5 shadow-2xl">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No jobs posted yet</p>
                    </div>
                )}
            </div>

            {/* Overall Status */}
            <div className="bg-[#080808] rounded-2xl border border-white/5 p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest italic">Hiring Progress</h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 bg-emerald-500 rounded-full" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">85% Positions Filled</span>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-primary"
                    />
                </div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-6 text-center italic">Your hiring is moving at a good pace</p>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                                            <span className="material-symbols-outlined">{editingJob ? 'edit_note' : 'add_circle'}</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white tracking-tight italic">
                                                {editingJob ? 'Update Job Scope' : 'Initialize Job Opening'}
                                            </h2>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">
                                                {editingJob ? 'Modify operational parameters' : 'Deploy recruitment protocol'}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-white/5 hover:text-white transition-all"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Job Designation</label>
                                        <input
                                            required
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Senior Software Architect"
                                            className="w-full h-14 bg-[#121212] border border-white/5 rounded-2xl px-6 text-sm font-black text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 italic"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Department</label>
                                            <input
                                                required
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Engineering"
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl px-4 text-xs font-black text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 italic"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl px-4 text-xs font-black text-white focus:border-primary/50 outline-none transition-all italic appearance-none cursor-pointer"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Paused">Paused</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Operational Scope</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Describe requirements..."
                                            className="w-full bg-[#121212] border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-white focus:border-primary/50 outline-none transition-all placeholder:text-slate-700 italic resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        {editingJob && (
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    if(confirm('Are you sure you want to delete this job?')) {
                                                        deleteJob(editingJob._id);
                                                        setIsModalOpen(false);
                                                    }
                                                }}
                                                className="h-14 px-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        )}
                                        <button 
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 h-14 bg-primary text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-lg">
                                                        {editingJob ? 'check_circle' : 'rocket_launch'}
                                                    </span>
                                                    {editingJob ? 'Save Sync' : 'Deploy Vacancy'}
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
        </div>
    );
}
