'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useRouter } from 'next/navigation';

export default function MyInterviewsPage() {
    const { user } = useAuthStore();
    const { interviews, fetchInterviewerInterviews, loading } = useInterviewStore();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (user?._id) {
            fetchInterviewerInterviews(user._id);
        }
    }, [user, fetchInterviewerInterviews]);

    const filteredInterviews = useMemo(() => {
        return interviews.filter(interview => {
            const matchesTab = activeTab === 'upcoming' 
                ? interview.status === 'Scheduled' 
                : interview.status === 'Completed';
            
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = 
                (interview.candidateId?.name || '').toLowerCase().includes(searchLower) ||
                (interview.candidateId?.email || '').toLowerCase().includes(searchLower) ||
                (interview.title || '').toLowerCase().includes(searchLower);

            return matchesTab && matchesSearch;
        });
    }, [interviews, activeTab, searchQuery]);

    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-3">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">My Interviews</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Manage your scheduled and past interviews.</p>
                </div>
                
                {/* Search Bar */}
                <div className="relative w-full md:w-96 group">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                    <input 
                        type="text" 
                        placeholder="Search interviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 bg-[#080808] border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold text-white italic focus:border-primary/50 outline-none transition-all shadow-2xl"
                    />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-10 border-b border-white/5">
                {[
                    { id: 'upcoming', label: 'Upcoming' },
                    { id: 'completed', label: 'Completed' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                            activeTab === tab.id ? 'text-primary' : 'text-slate-600 hover:text-white'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                        )}
                    </button>
                ))}
            </div>

            {/* Interviews List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview: any, idx) => (
                            <motion.div
                                key={interview._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 hover:border-primary/20 transition-all shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                                    <span className="material-symbols-outlined text-8xl">event_available</span>
                                </div>

                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-8">
                                    <div className="relative shrink-0">
                                        <img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                            className="size-20 rounded-[2rem] border-2 border-primary/20 p-1 group-hover:border-primary transition-all"
                                            alt=""
                                        />
                                        <div className={`absolute -bottom-1 -right-1 size-6 rounded-lg flex items-center justify-center border-4 border-[#080808] text-[10px] ${
                                            interview.status === 'Scheduled' ? 'bg-primary text-white' : 'bg-emerald-500 text-white'
                                        }`}>
                                            <span className="material-symbols-outlined text-xs">
                                                {interview.status === 'Scheduled' ? 'schedule' : 'check'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{interview.candidateId?.name || 'Unknown Candidate'}</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{interview.title || 'Developer Role'}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                                    {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
                                                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                                    {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                onClick={() => router.push(`/interviewer/candidates/${interview.candidateId?._id}`)}
                                                className="flex-1 h-11 rounded-xl border border-white/5 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
                                            >
                                                View Profile
                                            </button>
                                            {interview.status === 'Scheduled' && (
                                                <button className="flex-1 h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                                    Start Interview
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-[#080808] border border-dashed border-white/5 rounded-[3rem]">
                            <span className="material-symbols-outlined text-4xl text-slate-700 mb-4 block">event_busy</span>
                            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.4em]">No interviews found</h3>
                            <button className="mt-6 text-[10px] font-black text-primary uppercase tracking-widest hover:underline" onClick={() => setSearchQuery('')}>Clear search</button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
