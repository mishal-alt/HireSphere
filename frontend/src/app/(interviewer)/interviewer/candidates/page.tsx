'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';

export default function CandidatesPage() {
    const { candidates, fetchCandidates, loading } = useAdminCandidateStore();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const filteredCandidates = useMemo(() => {
        const searchLower = searchQuery.toLowerCase();
        return candidates.filter(candidate => 
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower)
        );
    }, [candidates, searchQuery]);

    const handleViewProfile = (id: string) => {
        router.push(`/interviewer/candidates/${id}`);
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Candidates</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Browse and review all candidate profiles.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96 group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                    <input 
                        type="text" 
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 bg-[#080808] border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold text-white italic focus:border-primary/50 outline-none transition-all shadow-2xl"
                    />
                </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-[#080808] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Candidate Name</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Contact</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        <AnimatePresence mode="popLayout">
                            {filteredCandidates.length > 0 ? (
                                filteredCandidates.map((candidate, idx) => (
                                    <motion.tr
                                        key={candidate._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        onClick={() => handleViewProfile(candidate._id)}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                    className="size-11 rounded-xl border border-white/10"
                                                    alt=""
                                                />
                                                <span className="text-sm font-black text-white uppercase italic">{candidate.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                candidate.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                candidate.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                candidate.status === 'Shortlisted' ? 'bg-primary/10 text-primary border-primary/20' :
                                                'bg-white/5 text-slate-400 border-white/5'
                                            }`}>
                                                {candidate.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold text-slate-500 italic">{candidate.email}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewProfile(candidate._id);
                                                }}
                                                className="h-10 px-6 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest group-hover:bg-primary group-hover:border-primary transition-all active:scale-95"
                                            >
                                                View Profile
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-32 text-center">
                                        <div className="space-y-4">
                                            <span className="material-symbols-outlined text-4xl text-slate-700">group_off</span>
                                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No candidates found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
