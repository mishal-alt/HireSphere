'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useInterviewStore } from '@/store/useInterviewStore';

export default function InterviewerHeader() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { candidates, fetchCandidates } = useAdminCandidateStore();
    const { interviews, fetchInterviewerInterviews } = useInterviewStore();

    useEffect(() => {
        fetchCandidates();
        if (user?._id) {
            fetchInterviewerInterviews(user._id);
        }
    }, [user, fetchCandidates, fetchInterviewerInterviews]);

    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return { candidates: [], interviews: [] };
        
        const query = searchQuery.toLowerCase();
        
        const matchedCandidates = candidates
            .filter(c => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query))
            .slice(0, 3);
            
        const matchedInterviews = interviews
            .filter(i => (i.candidateId?.name || '').toLowerCase().includes(query))
            .slice(0, 3);
            
        return { candidates: matchedCandidates, interviews: matchedInterviews };
    }, [searchQuery, candidates, interviews]);

    const hasResults = searchResults.candidates.length > 0 || searchResults.interviews.length > 0;

    return (
        <header className="h-24 px-10 border-b border-white/5 flex items-center justify-between bg-[#030303]/80 backdrop-blur-md sticky top-0 z-40">
            {/* Search Protocol */}
            <div className="relative w-full max-w-xl group">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors text-xl">search</span>
                <input 
                    type="text" 
                    placeholder="Search candidate or interview..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold text-white italic focus:border-primary/50 focus:bg-white/[0.08] outline-none transition-all"
                />

                {/* Search Results Dropdown */}
                <AnimatePresence>
                    {isSearchFocused && searchQuery.trim() && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[-1]"
                                onClick={() => setIsSearchFocused(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-4 bg-[#080808] border border-white/10 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
                            >
                                {hasResults ? (
                                    <div className="p-4 space-y-6">
                                        {/* Candidates Category */}
                                        {searchResults.candidates.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Candidates</p>
                                                <div className="space-y-1">
                                                    {searchResults.candidates.map((candidate) => (
                                                        <button 
                                                            key={candidate._id}
                                                            onClick={() => {
                                                                router.push(`/interviewer/candidates/${candidate._id}`);
                                                                setIsSearchFocused(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="w-full p-4 rounded-xl hover:bg-white/5 flex items-center gap-4 group/item transition-all"
                                                        >
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} className="size-10 rounded-lg border border-white/10" alt="" />
                                                            <div className="text-left flex-1">
                                                                <p className="text-xs font-black text-white uppercase italic group-hover/item:text-primary transition-colors">{candidate.name}</p>
                                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{candidate.email}</p>
                                                            </div>
                                                            <span className="material-symbols-outlined text-slate-700 group-hover/item:text-white transition-colors">arrow_forward</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Interviews Category */}
                                        {searchResults.interviews.length > 0 && (
                                            <div className="space-y-3">
                                                <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Your Interviews</p>
                                                <div className="space-y-1">
                                                    {searchResults.interviews.map((interview) => (
                                                        <button 
                                                            key={interview._id}
                                                            onClick={() => {
                                                                router.push('/interviewer/interviews');
                                                                setIsSearchFocused(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="w-full p-4 rounded-xl hover:bg-white/5 flex items-center gap-4 group/item transition-all"
                                                        >
                                                            <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                                                <span className="material-symbols-outlined text-sm">schedule</span>
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <p className="text-xs font-black text-white uppercase italic group-hover/item:text-primary transition-colors">Interview with {interview.candidateId?.name}</p>
                                                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <span className="material-symbols-outlined text-slate-700 group-hover/item:text-white transition-colors">arrow_forward</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-10 text-center">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No results found</p>
                                    </div>
                                )}
                                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                                    <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest italic">Global Search Active</p>
                                    <span className="text-[8px] text-slate-800">ESC to close</span>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Profile Terminal */}
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <p className="text-[11px] font-black text-white uppercase italic tracking-tighter leading-none">{user?.name}</p>
                    <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-1.5 leading-none">Interviewer Role</p>
                </div>
                <div className="relative group">
                    <div className="size-12 rounded-2xl border-2 border-primary/20 p-1 group-hover:border-primary transition-all cursor-pointer">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
                            className="w-full h-full rounded-xl bg-[#121212]" 
                            alt="avatar" 
                        />
                    </div>
                    {/* Simple Logout Dropdown */}
                    <div className="absolute top-full right-0 mt-3 w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <button 
                            onClick={logout}
                            className="w-full p-4 bg-[#080808] border border-white/10 rounded-2xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-between"
                        >
                            Log Out
                            <span className="material-symbols-outlined text-sm">logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
