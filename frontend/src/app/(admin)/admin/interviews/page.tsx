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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
            <Button variant="outline"
                ref={buttonRef}
                onClick={handleToggle}
                className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
                <MoreHorizontal className="size-5" />
            </Button>
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
                            className="w-48 bg-white border border-gray-200/50 rounded-xl z-[120] py-2 overflow-hidden ring-4 ring-slate-950/5"
                        >
                            <Button variant="ghost"
                                onClick={() => {
                                    onEdit(interview);
                                    setIsOpen(false);
                                    onToggle?.(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left font-medium"
                            >
                                <CalendarCheck className="size-4" />
                                Reschedule
                            </Button>
                            <div className="h-[1px] bg-gray-100 my-1 mx-2" />
                            <Button variant="ghost"
                                onClick={() => {
                                    handleCancel();
                                    setIsOpen(false);
                                    onToggle?.(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all text-left font-medium"
                            >
                                <Trash2 className="size-4" />
                                Cancel
                            </Button>
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
            className={`bg-transparent border-b border-gray-200/50 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all group relative ${isMenuOpen ? 'z-50 ring-2 ring-primary/20 shadow-none' : 'z-10'}`}
        >
            <div className="flex items-center gap-6 relative z-10 flex-1 min-w-0">
                <div className="size-16 rounded-xl overflow-hidden border border-gray-200/50 bg-gray-50 p-1 transition-transform group-hover:scale-105">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                        alt=""
                        className="size-full object-cover rounded-xl"
                    />
                </div>
                <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 transition-colors truncate">
                        {interview.candidateId?.name || 'Unknown Candidate'}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                        <User className="size-3.5 text-gray-900" />
                        <p className="text-sm text-gray-500">
                            Interviewer: <span className="text-gray-900 font-bold">{interview.interviewerId?.name || 'Unassigned'}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:gap-14 relative z-10">
                <div className="flex items-center gap-6 bg-gray-50 border border-gray-200/50 px-6 py-3 rounded-xl">
                    <Calendar className="size-5 text-gray-900" />
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-gray-900">
                            {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm font-bold text-gray-500 font-medium mt-0.5">
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
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight text-gray-900">Interviews</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-gray-100 animate-pulse"></span>
                        Schedule and manage all recruitment sessions.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="bg-white border border-gray-200/50 px-6 py-3 rounded-xl flex items-center gap-6">
                        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200/50 shadow-inner">
                            <History className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 font-medium leading-none">Completed</p>
                            <p className="text-xl font-semibold text-gray-900 leading-none mt-1.5">{dashboardData?.stats?.conductedInterviews || 0}</p>
                        </div>
                    </div>
                    <Button variant="ghost"
                        onClick={() => {
                            setFormData({ candidateId: '', interviewerId: '', scheduledAt: '' });
                            setIsEditing(false);
                            setIsModalOpen(true);
                        }}
                        className="h-11 px-6 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="size-5" />
                        New Interview
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                    <div className="py-24 text-center bg-transparent border-t border-gray-200/50 flex flex-col items-center justify-center space-y-6">
                        <div className="size-20 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                            <Calendar className="size-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900">No interviews scheduled</h3>
                            <p className="text-xs text-gray-500">Your upcoming interview timeline is currently empty.</p>
                        </div>
                    </div>
                )}
            </div>

            <Portal>
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-white border border-gray-200/50 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-white border border-gray-200/50 rounded-3xl p-6 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10 relative z-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{isEditing ? 'Edit Interview' : 'Schedule Interview'}</h2>
                                        <p className="text-sm font-medium text-gray-500 mt-1.5">{isEditing ? 'Modify the details of this interview session.' : 'Set up a new recruitment session.'}</p>
                                        
                                        {(candidates.length === 0 || interviewers.length === 0) && (
                                            <div className="mt-6 flex items-center gap-3 bg-gray-50 border border-gray-200/50 px-4 py-2.5 rounded-xl">
                                                <AlertTriangle className="size-4 text-gray-600" />
                                                <p className="text-sm font-bold text-gray-700 font-medium">
                                                    Required records missing in system.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost"
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200/50"
                                    >
                                        <X className="size-5" />
                                    </Button>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-10 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Candidate</label>
                                        <div className="relative group">
                                            <select
                                                required
                                                value={formData.candidateId}
                                                onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                                                className="w-full h-12 bg-gray-50 border border-gray-200/50 rounded-xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                            >
                                                <option value="">Select candidate...</option>
                                                {candidates.map((candidate: any) => (
                                                    <option key={candidate._id} value={candidate._id}>{candidate.name} ({candidate.email})</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none size-4 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Interviewer</label>
                                        <div className="relative group">
                                            <select
                                                required
                                                value={formData.interviewerId}
                                                onChange={(e) => setFormData({ ...formData, interviewerId: e.target.value })}
                                                className="w-full h-12 bg-gray-50 border border-gray-200/50 rounded-xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all appearance-none"
                                            >
                                                <option value="">Select interviewer...</option>
                                                {interviewers.map((interviewer: any) => (
                                                    <option key={interviewer._id} value={interviewer._id}>{interviewer.name} - {interviewer.department || 'General'}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none size-4 group-focus-within:text-gray-900 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Date and Time</label>
                                        <div className="relative">
                                            <Input
                                                type="datetime-local"
                                                required
                                                value={formData.scheduledAt}
                                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                                className="w-full h-12 bg-gray-50 border border-gray-200/50 rounded-xl px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button variant="default"
                                            type="submit"
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                            className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            {createMutation.isPending || updateMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="size-5 group-hover:scale-110 transition-transform" />
                                                    <span className="font-medium">Schedule Interview</span>
                                                </>
                                            )}
                                        </Button>
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
        'Scheduled': 'bg-gray-100 text-gray-900 border-primary/20 ',
        'Ongoing': 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-500/5',
        'Completed': 'bg-emerald-50 text-emerald-700 border border-emerald-200/40 border-emerald-200 shadow-emerald-500/5',
        'Cancelled': 'bg-gray-50 text-gray-700 border-gray-200/50 shadow-gray-500/5',
    };

    const icons: Record<string, any> = {
        'Scheduled': Calendar,
        'Ongoing': Video,
        'Completed': CheckCircle2,
        'Cancelled': X,
    };

    const StatusIcon = icons[status] || Clock;

    return (
        <span className={`px-5 py-2 rounded-full text-sm font-bold font-medium border flex items-center gap-2.5 transition-all ${styles[status] || 'bg-gray-50 text-gray-500 border-gray-200/50'}`}>
            <StatusIcon className="size-3.5" />
            {status}
        </span>
    );
}
