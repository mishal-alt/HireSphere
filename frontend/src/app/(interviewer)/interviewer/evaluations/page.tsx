'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { 
    ClipboardList, 
    Clock, 
    CheckCircle2, 
    FileText, 
    User, 
    ArrowUpRight,
    AlertCircle,
    Inbox,
    Filter
} from 'lucide-react';

interface Candidate {
    _id: string;
    name: string;
    email: string;
    role?: string;
}

interface Interview {
    _id: string;
    candidateId: Candidate;
    status: string;
    scheduledAt: string;
}

export default function EvaluationsPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews/interviewer/my-interviews');
                setInterviews(response.data);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const filteredEvaluations = interviews.filter((i) => {
        if (activeTab === 'pending') return i.status === 'Scheduled' || i.status === 'Ongoing';
        if (activeTab === 'completed') return i.status === 'Completed' || i.status === 'Evaluated';
        return false;
    });

    const pendingCount = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Ongoing').length;

    if (loading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-slate-900 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Performance Evaluations</h1>
                    <p className="text-sm font-medium text-slate-500">Document and submit assessment reports for interviewed candidates.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-3">
                        <ClipboardList className="size-4 text-slate-400" />
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Awaiting Review</p>
                            <p className="text-sm font-bold text-slate-900 mt-1">{pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-8 border-b border-slate-100 relative">
                {[
                    { id: 'pending', label: 'Pending Assessment', count: pendingCount, icon: Clock },
                    { id: 'completed', label: 'Archived Reports', count: null, icon: CheckCircle2 }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 px-1 text-xs font-bold uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                            activeTab === tab.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <tab.icon className="size-3.5" />
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`ml-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest ${
                                activeTab === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="nav-underline" 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full shadow-sm" 
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Evaluations Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Session Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence mode="popLayout">
                                {filteredEvaluations.length > 0 ? (
                                    filteredEvaluations.map((row, idx) => (
                                        <motion.tr 
                                            key={row._id} 
                                            layout
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-9 rounded-lg border border-slate-200 bg-white flex items-center justify-center shadow-sm group-hover:border-slate-900 transition-all">
                                                        <User className="size-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-slate-950 truncate transition-colors">{row.candidateId?.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{row.candidateId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md">
                                                    {row.candidateId?.role || 'Developer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-slate-900 italic">
                                                        {new Date(row.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Verified Session</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <StatusBadge status={row.status} />
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {row.status === 'Completed' || row.status === 'Evaluated' ? (
                                                    <button className="h-9 px-4 rounded-lg border border-slate-200 bg-white text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-900 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2 ml-auto">
                                                        <FileText className="size-3" />
                                                        View Report
                                                    </button>
                                                ) : (
                                                    <button className="h-9 px-4 rounded-lg bg-slate-950 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-slate-950/10 flex items-center justify-center gap-2 ml-auto">
                                                        Evaluate Profile
                                                        <ArrowUpRight className="size-3.5" />
                                                    </button>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-24 text-center">
                                            <div className="bg-slate-50 size-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Inbox className="size-8 text-slate-200" />
                                            </div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic opacity-50">Empty Evaluation Hub</p>
                                            <button 
                                                onClick={() => setActiveTab(activeTab === 'pending' ? 'completed' : 'pending')}
                                                className="mt-4 text-[10px] font-bold text-slate-900 underline uppercase tracking-widest"
                                            >
                                                {activeTab === 'pending' ? 'Check Archives' : 'Back to Active'}
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Performance Hub Online</span>
                    <span className="flex items-center gap-2">
                        Reporting {filteredEvaluations.length} records
                    </span>
                </div>
            </div>

            {/* Hint Card */}
            {filteredEvaluations.length === 0 && activeTab === 'pending' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 rounded-xl border border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center text-center space-y-6"
                >
                    <div className="size-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-900/20">
                        <CheckCircle2 className="size-8" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Everything Reviewed</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose font-medium">
                            All scheduled interviews have been completely processed.
                            No pending assessments are registered on the central terminal.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/5',
        Evaluated: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm shadow-emerald-500/5',
        Ongoing: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-500/5',
        Scheduled: 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm shadow-sky-500/5',
        Pending: 'bg-slate-50 text-slate-500 border-slate-200 shadow-sm shadow-slate-500/5'
    };

    return (
        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border leading-none ${styles[status] || styles.Pending}`}>
            {status || 'Pending'}
        </span>
    );
}
