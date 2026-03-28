'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidates } from '@/hooks/useCandidates';
import { useInterviewers } from '@/hooks/useInterviewers';
import { useInterviews, useCreateInterview, useUpdateInterview, useDeleteInterview } from '@/hooks/useInterviews';
import { useDashboardData } from '@/hooks/useDashboard';
import Portal from '@/components/Portal';
import { toast } from 'react-hot-toast';
import {
    Calendar,
    Clock,
    MoreHorizontal,
    Edit2,
    Trash2,
    Plus,
    X,
    User,
    Search,
    CheckCircle2,
    AlertCircle,
    History,
    Save,
    CalendarCheck,
    Video,
    MapPin,
    AlertTriangle,
    ChevronDown
} from 'lucide-react';

function InterviewActions({ interview, onEdit, onToggle }: { interview: any; onEdit: (interview: any) => void; onToggle?: (isOpen: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const deleteMutation = useDeleteInterview();

    const handleToggle = () => {
        const next = !isOpen;
        setIsOpen(next);
        onToggle?.(next);
    };

    const handleCancel = async () => {
        if (window.confirm(`Are you sure you want to cancel the interview for ${interview.candidateId?.name}?`)) {
            await deleteMutation.mutateAsync(interview._id);
        }
    };

    return (
        <div className="relative flex justify-end">
            <button
                ref={buttonRef}
                onClick={handleToggle}
                className="size-10 rounded-xl border border-slate-200 bg-white hover:border-slate-900 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm"
            >
                <MoreHorizontal className="size-5" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <Portal>
                        <div className="fixed inset-0 z-[110]" onClick={() => { setIsOpen(false); onToggle?.(false); }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            style={{
                                position: 'fixed',
                                top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
                                left: buttonRef.current ? buttonRef.current.getBoundingClientRect().right - 192 : 0,
                            }}
                            className="w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[120] py-2 overflow-hidden ring-4 ring-slate-950/5"
                        >
                            <button
                                onClick={() => {
                                    onEdit(interview);
                                    setIsOpen(false);
                                    onToggle?.(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left uppercase tracking-wider"
                            >
                                <CalendarCheck className="size-4" />
                                Reschedule
                            </button>
                            <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                            <button
                                onClick={() => {
                                    handleCancel();
                                    setIsOpen(false);
                                    onToggle?.(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all text-left uppercase tracking-wider"
                            >
                                <Trash2 className="size-4" />
                                Cancel
                            </button>
                        </motion.div>
                    </Portal>
                )}
            </AnimatePresence>
        </div>
    );
}

function InterviewListItem({ interview, idx, onEdit }: { interview: any; idx: number; onEdit: (interview: any) => void }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group relative ${isMenuOpen ? 'z-50 ring-2 ring-primary/20 shadow-xl' : 'z-10'}`}
        >
            <div className="flex items-center gap-6 relative z-10 flex-1 min-w-0">
                <div className="size-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm p-1 transition-transform group-hover:scale-105">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                        alt=""
                        className="size-full object-cover rounded-xl"
                    />
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors truncate">
                        {interview.candidateId?.name || 'Unknown Candidate'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <User className="size-3.5 text-primary" />
                        <p className="text-xs font-semibold text-slate-500">
                            Interviewer: <span className="text-slate-900 font-bold">{interview.interviewerId?.name || 'Unassigned'}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-8 lg:gap-14 relative z-10">
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl">
                    <Calendar className="size-5 text-primary" />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900">
                            {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                            {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>

                <StatusBadge status={interview.status} />

                <InterviewActions interview={interview} onEdit={onEdit} onToggle={setIsMenuOpen} />
            </div>
        </motion.div>
    );
}

export default function InterviewsPage() {
    const { data: interviews = [], isLoading } = useInterviews();
    const createMutation = useCreateInterview();
    const updateMutation = useUpdateInterview();
    const { data: dashboardData } = useDashboardData();
    const { data: candidates = [] } = useCandidates();
    const { data: interviewers = [] } = useInterviewers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<any>(null);

    const [formData, setFormData] = useState({
        candidateId: '',
        interviewerId: '',
        scheduledAt: '',
    });

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

        try {
            if (isEditing && selectedInterview) {
                await updateMutation.mutateAsync({ id: selectedInterview._id, data: formData });
            } else {
                await createMutation.mutateAsync(formData);
            }

            setIsModalOpen(false);
            setFormData({ candidateId: '', interviewerId: '', scheduledAt: '' });
            setIsEditing(false);
            setSelectedInterview(null);
        } catch (error) {
            // Handled by hook
        }
    };

    if (isLoading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interviews</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary/40 animate-pulse"></span>
                        Schedule and manage all recruitment sessions.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white border border-slate-200 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                            <History className="size-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Completed</p>
                            <p className="text-xl font-bold text-slate-900 leading-none mt-1.5">{dashboardData?.stats?.conductedInterviews || 0}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setFormData({ candidateId: '', interviewerId: '', scheduledAt: '' });
                            setIsEditing(false);
                            setIsModalOpen(true);
                        }}
                        className="h-11 px-6 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="size-5" />
                        New Interview
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {interviews.length > 0 ? (
                    interviews.map((interview: any, idx: number) => (
                        <InterviewListItem 
                            key={interview._id} 
                            interview={interview} 
                            idx={idx} 
                            onEdit={handleEdit} 
                        />
                    ))
                ) : (
                    <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-sm border-dashed flex flex-col items-center justify-center space-y-6">
                        <div className="size-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 shadow-sm">
                            <Calendar className="size-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No interviews scheduled</h3>
                            <p className="text-xs text-slate-400 font-medium">Your upcoming interview timeline is currently empty.</p>
                        </div>
                    </div>
                )}
            </div>

            <Portal>
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white border border-slate-200 shadow-2xl rounded-3xl p-10 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{isEditing ? 'Edit Interview' : 'Schedule Interview'}</h2>
                                        <p className="text-sm font-medium text-slate-500 mt-1.5">{isEditing ? 'Modify the details of this interview session.' : 'Set up a new recruitment session.'}</p>
                                        
                                        {(candidates.length === 0 || interviewers.length === 0) && (
                                            <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-100 px-4 py-2.5 rounded-xl shadow-sm">
                                                <AlertTriangle className="size-4 text-red-500" />
                                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                                                    Required records missing in system.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-8 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Candidate</label>
                                        <div className="relative group">
                                            <select
                                                required
                                                value={formData.candidateId}
                                                onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                            >
                                                <option value="">Select candidate...</option>
                                                {candidates.map((candidate: any) => (
                                                    <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4 group-focus-within:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Interviewer</label>
                                        <div className="relative group">
                                            <select
                                                required
                                                value={formData.interviewerId}
                                                onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                            >
                                                <option value="">Select interviewer...</option>
                                                {interviewers.map((interviewer: any) => (
                                                    <option key={interviewer._id} value={interviewer._id}>{interviewer.name} - {interviewer.department || 'General'}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none size-4 group-focus-within:text-primary transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Date and Time</label>
                                        <div className="relative">
                                            <input
                                                type="datetime-local"
                                                required
                                                value={formData.scheduledAt}
                                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="w-full h-14 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
                                        >
                                            {createMutation.isPending || updateMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="size-5 group-hover:scale-110 transition-transform" />
                                                    <span className="uppercase tracking-widest">Schedule Interview</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Portal>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Scheduled': 'bg-primary/5 text-primary border-primary/20 shadow-primary/5',
        'Ongoing': 'bg-amber-50 text-amber-600 border-amber-200 shadow-amber-500/5',
        'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-500/5',
        'Cancelled': 'bg-red-50 text-red-600 border-red-200 shadow-red-500/5',
    };

    const icons: Record<string, any> = {
        'Scheduled': Calendar,
        'Ongoing': Video,
        'Completed': CheckCircle2,
        'Cancelled': X,
    };

    const StatusIcon = icons[status] || Clock;

    return (
        <span className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-2.5 shadow-sm transition-all ${styles[status] || 'bg-slate-50 text-slate-400 border-slate-200'}`}>
            <StatusIcon className="size-3.5" />
            {status}
        </span>
    );
}
