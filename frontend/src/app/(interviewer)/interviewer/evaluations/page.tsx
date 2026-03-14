'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';

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

    return (
        <div className="space-y-10 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Evaluations_</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                        Submit and review performance assessment reports.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/5">
                <div className="flex gap-10">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                            activeTab === 'pending' ? 'text-primary' : 'text-slate-600 hover:text-slate-400'
                        }`}
                    >
                        Pending Actions
                        <span className="ml-3 bg-primary/10 px-2 py-0.5 rounded-lg text-primary text-[8px]">{pendingCount}</span>
                        {activeTab === 'pending' && <motion.div layoutId="tab-eval" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('completed')}
                        className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                            activeTab === 'completed' ? 'text-primary' : 'text-slate-600 hover:text-slate-400'
                        }`}
                    >
                        Completed Assessments
                        {activeTab === 'completed' && <motion.div layoutId="tab-eval" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                </div>
            </div>

            {/* Evaluations Table */}
            <div className="rounded-3xl border border-white/5 bg-[#080808] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/[0.01]">
                            <tr>
                                <th className="px-8 py-5">Candidate</th>
                                <th className="px-8 py-5">Position</th>
                                <th className="px-8 py-5">Event Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm uppercase font-black italic">
                            {filteredEvaluations.length > 0 ? (
                                filteredEvaluations.map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-8 rounded-xl overflow-hidden border border-white/10 bg-[#121212] flex items-center justify-center">
                                                    <span className="text-[8px] text-primary uppercase font-black">{row.candidateId?.name?.[0]}</span>
                                                </div>
                                                <p className="text-white tracking-tight">{row.candidateId?.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 font-bold not-italic font-mono text-[11px]">{row.candidateId?.role || 'Engineer'}</td>
                                        <td className="px-8 py-6 text-slate-500 font-bold not-italic text-[11px]">{new Date(row.scheduledAt).toLocaleDateString()}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-2.5 py-1 rounded-lg text-[8px] tracking-[0.2em] font-black not-italic border ${
                                                row.status === 'Completed' || row.status === 'Evaluated' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                row.status === 'Ongoing' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-white/5 text-slate-500 border-white/5'
                                            }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {row.status === 'Completed' || row.status === 'Evaluated' ? (
                                                <button className="text-[9px] text-slate-500 hover:text-white tracking-widest uppercase transition-colors">View Report</button>
                                            ) : (
                                                <button className="text-[9px] text-primary hover:underline tracking-widest uppercase font-black">
                                                    Start Protocol
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-slate-600 font-bold uppercase tracking-widest text-[10px]">
                                        No evaluation protocols pending in the matrix.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hint Card */}
            {filteredEvaluations.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-16 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center space-y-4"
                >
                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
                        <span className="material-symbols-outlined text-4xl">rate_review</span>
                    </div>
                    <div className="max-w-xs space-y-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Protocol Clear_</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose">
                            All scheduled interviews have active or completed evaluation reports assigned.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
