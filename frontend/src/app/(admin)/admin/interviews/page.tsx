'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import api from '@/services/api';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { useAdminInterviewStore } from '@/store/useAdminInterviewStore';
import { toast } from 'react-hot-toast';

function InterviewActions({ interview, onEdit }: { interview: any; onEdit: (interview: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { deleteInterview } = useAdminInterviewStore();

    const handleCancel = async () => {
        if (window.confirm(`Are you sure you want to cancel the interview for ${interview.candidateId?.name}?`)) {
            await deleteInterview(interview._id);
        }
    };

    return (
        <div className="relative flex justify-end">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="material-symbols-outlined text-slate-500 hover:text-white text-lg transition-colors"
            >
                more_vert
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-8 w-40 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-20 py-1 overflow-hidden pointer-events-auto"
                        >
                            <button 
                                onClick={() => {
                                    onEdit(interview);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-left"
                            >
                                <span className="material-symbols-outlined text-sm">schedule</span>
                                Reschedule
                            </button>
                            <div className="h-[1px] bg-white/5 my-1" />
                            <button 
                                onClick={() => {
                                    handleCancel();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest text-left"
                            >
                                <span className="material-symbols-outlined text-sm">cancel</span>
                                Cancel
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function InterviewsPage() {
    const { interviews, loading, fetchInterviews, createInterview, updateInterview } = useAdminInterviewStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        candidateId: '',
        interviewerId: '',
        scheduledAt: '',
    });

    const candidates = useAdminCandidateStore(state => state.candidates);
    const fetchCandidates = useAdminCandidateStore(state => state.fetchCandidates);
    const interviewers = useAdminInterviewerStore(state => state.interviewers);
    const fetchInterviewers = useAdminInterviewerStore(state => state.fetchInterviewers);

    useEffect(() => {
        fetchInterviews();
        fetchCandidates();
        fetchInterviewers();
    }, []);

    const handleEdit = (interview: any) => {
        setSelectedInterview(interview);
        setFormData({
            candidateId: interview.candidateId?._id || '',
            interviewerId: interview.interviewerId?._id || '',
            scheduledAt: new Date(interview.scheduledAt).toISOString().slice(0, 16),
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.candidateId || !formData.interviewerId || !formData.scheduledAt) {
            toast.error("Please fill all fields");
            return;
        }

        setSubmitting(true);
        let success = false;

        if (isEditing && selectedInterview) {
            success = await updateInterview(selectedInterview._id, formData);
        } else {
            success = await createInterview(formData);
        }

        if (success) {
            setIsModalOpen(false);
            setFormData({ candidateId: '', interviewerId: '', scheduledAt: '' });
            setIsEditing(false);
            setSelectedInterview(null);
        }
        setSubmitting(false);
    };

    if (loading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Interviews</h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-2">You have {interviews.length} interviews in your system</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/admin/calendar">
                        <button className="h-11 px-6 rounded-lg border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2 shadow-xl">
                            <span className="material-symbols-outlined text-lg">calendar_month</span> Open Calendar
                        </button>
                    </Link>
                    <button 
                        onClick={() => {
                            setIsEditing(false);
                            setSelectedInterview(null);
                            setFormData({ candidateId: '', interviewerId: '', scheduledAt: '' });
                            setIsModalOpen(true);
                        }}
                        className="h-11 px-8 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        New Interview
                    </button>
                </div>
            </div>

            {/* List and Tabs */}
            <div className="bg-[#080808] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-1">
                        <button className="h-9 px-5 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white text-black">All</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[9px] uppercase text-slate-500 font-bold tracking-widest border-b border-white/5">
                            <tr>
                                <th className="py-4 pl-8">Candidate</th>
                                <th className="py-4">Interviewer</th>
                                <th className="py-4">Scheduled At</th>
                                <th className="py-4">Status</th>
                                <th className="py-4">Meeting Room</th>
                                <th className="py-4 text-right pr-8">Manage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {interviews.length > 0 ? (
                                interviews.map((interview, idx) => (
                                    <motion.tr
                                        key={interview._id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="py-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-lg bg-[#121212] border border-white/5 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name || 'User'}`} alt="avatar" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-sm text-white tracking-tight">{interview.candidateId?.name || "Unknown"}</p>
                                                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{interview.candidateId?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="size-7 rounded-lg overflow-hidden border border-white/10 bg-[#121212]">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.interviewerId?.name}`} alt="Interviewer" />
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 capitalize">{interview.interviewerId?.name || "Unassigned"}</span>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-bold text-white">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                                                <p className="text-[9px] text-slate-500 font-bold">{new Date(interview.scheduledAt).toLocaleTimeString()}</p>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <StatusBadge status={interview.status} type={interview.status === 'Scheduled' ? 'warning' : 'success'} />
                                        </td>
                                        <td className="py-5">
                                            {interview.meetLink && (
                                                <a
                                                    href={interview.meetLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-widest hover:underline"
                                                >
                                                    <span className="material-symbols-outlined text-sm">video_chat</span> Join Room
                                                </a>
                                            )}
                                        </td>
                                        <td className="py-5 text-right pr-8">
                                            <InterviewActions interview={interview} onEdit={handleEdit} />
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No scheduled interviews</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-4 bg-[#050505] flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Showing {interviews.length} interviews</span>
                    <div className="flex gap-2">
                        <button className="h-8 px-4 rounded border border-white/5 text-[9px] font-bold text-slate-500 hover:text-white">Previous</button>
                        <button className="h-8 px-4 rounded bg-white text-black text-[9px] font-bold">Next</button>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Stats Chart */}
                <div className="lg:col-span-8 bg-[#080808] rounded-2xl border border-white/5 p-8">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-10">Weekly Interview Schedule</h3>
                    <div className="h-48 flex items-end justify-between gap-4">
                        {[
                            { day: 'Mon', val: 30 },
                            { day: 'Tue', val: 80 },
                            { day: 'Wed', val: 60 },
                            { day: 'Thu', val: 100 },
                            { day: 'Fri', val: 45 }
                        ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-3">
                                <div className="w-full h-full flex items-end bg-white/[0.02] rounded-lg relative overflow-hidden">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${d.val}%` }}
                                        className={`w-full ${d.val === 100 ? 'bg-primary' : 'bg-primary/20'} transition-all`}
                                    />
                                </div>
                                <span className="text-[9px] font-bold uppercase text-slate-600 tracking-widest">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interviewer Status */}
                <div className="lg:col-span-4 bg-[#080808] rounded-2xl border border-white/5 p-8">
                    <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-8">Interviewer Status</h3>
                    <div className="space-y-6">
                        {interviewers.slice(0, 4).map((interviewer, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-lg overflow-hidden border border-white/10 bg-[#121212]">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interviewer.name}`} alt={interviewer.name} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-white tracking-tight">{interviewer.name}</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`size-1 rounded-full ${interviewer.isActive ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{interviewer.isActive ? 'Available' : 'Busy'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="material-symbols-outlined text-slate-500 hover:text-white text-lg">calendar_today</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0"
                    />
                    <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-bold text-white tracking-tight">{isEditing ? 'Reschedule Interview' : 'Schedule New Interview'}</h2>
                                <p className="text-[9px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-1">{isEditing ? 'Modify existing protocol' : 'Connect candidate with an interviewer'}</p>
                                {(candidates.length === 0 || interviewers.length === 0) && (
                                    <p className="mt-2 text-[8px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded">
                                        Warning: You need at least one candidate and one interviewer in the system.
                                    </p>
                                )}
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-bold tracking-widest text-slate-500 ml-1">Select Candidate</label>
                                <select 
                                    required
                                    value={formData.candidateId}
                                    onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                                    className="w-full h-12 bg-[#121212] border border-white/5 rounded-lg px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                                >
                                    <option value="">Choose a candidate...</option>
                                    {candidates.length === 0 ? (
                                        <option disabled>No candidates found. Please add them in the Candidates page.</option>
                                    ) : (
                                        candidates.map(candidate => (
                                            <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-bold tracking-widest text-slate-500 ml-1">Select Interviewer</label>
                                <select 
                                    required
                                    value={formData.interviewerId}
                                    onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                                    className="w-full h-12 bg-[#121212] border border-white/5 rounded-lg px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                                >
                                    <option value="">Choose an interviewer...</option>
                                    {interviewers.length === 0 ? (
                                        <option disabled>No interviewers found. Please add them in the Interviewers page.</option>
                                    ) : (
                                        interviewers.map(interviewer => (
                                            <option key={interviewer._id} value={interviewer._id}>{interviewer.name} - {interviewer.department || 'General'}</option>
                                        ))
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-bold tracking-widest text-slate-500 ml-1">Schedule Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    required
                                    value={formData.scheduledAt}
                                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                    className="w-full h-12 bg-[#121212] border border-white/5 rounded-lg px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-all [color-scheme:dark]"
                                />
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-12 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        isEditing ? 'Update Schedule' : 'Schedule Interview'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
    const styles: Record<string, string> = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        primary: 'bg-primary/10 text-primary border-primary/20',
        danger: 'bg-red-500/10 text-red-500 border-red-500/20',
        neutral: 'bg-white/5 text-slate-400 border-white/10'
    };

    return (
        <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest border ${styles[type] || styles.neutral}`}>
            {status}
        </span>
    );
}
