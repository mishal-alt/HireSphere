'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterviewerInterviews } from '@/hooks/useInterviews';
import { useRouter } from 'next/navigation';
import {
    Search,
    Calendar,
    Clock,
    User,
    ExternalLink,
    CalendarClock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Play,
    Filter,
    MoreVertical,
    CalendarDays,
    Video,
    History,
    ArrowUpRight
} from 'lucide-react';

export default function MyInterviewsPage() {
    const { user } = useAuthStore();
    const { data: interviews = [], isLoading } = useInterviewerInterviews();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

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

    if (isLoading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interview Sessions</h1>
                    <p className="text-sm font-medium text-slate-500">Track and manage your scheduled candidate assessments.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-medium text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                    />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 w-fit shadow-inner">
                {[
                    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
                    { id: 'completed', label: 'History', icon: History }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2.5 ${activeTab === tab.id 
                            ? 'bg-white text-slate-900 shadow-md border border-slate-100' 
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon className={`size-3.5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Interviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview: any, idx) => (
                            <motion.div
                                key={interview._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: idx * 0.03 }}
                                className="group bg-white border border-slate-200 rounded-[2rem] p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/40 transition-all relative overflow-hidden shadow-sm flex flex-col justify-between h-full"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="relative shrink-0 transition-transform group-hover:scale-105">
                                            <div className="size-20 rounded-2xl border border-slate-200 p-1 bg-white group-hover:border-primary transition-colors shadow-sm overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                                    className="w-full h-full object-cover rounded-xl bg-slate-50"
                                                    alt=""
                                                />
                                            </div>
                                            <div className={`absolute -bottom-2 -right-2 size-8 rounded-[10px] flex items-center justify-center border-4 border-white shadow-lg ${interview.status === 'Scheduled' ? 'bg-primary' : 'bg-emerald-500'
                                                }`}>
                                                {interview.status === 'Scheduled' ? (
                                                    <Video className="size-4 text-white" />
                                                ) : (
                                                    <CheckCircle2 className="size-4 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest shadow-inner">
                                                HS-{interview._id.slice(-6).toUpperCase()}
                                            </span>
                                            {interview.status === 'Scheduled' && (
                                                <div className="flex items-center gap-2 group-hover:scale-105 transition-transform cursor-pointer">
                                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(80,72,229,0.5)]"></div>
                                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Active Link</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 mb-8">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors truncate tracking-tight">{interview.candidateId?.name || 'Unknown Candidate'}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{interview.title || 'Technical Assessment'}</p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-4 py-3 border-y border-slate-50">
                                            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                                <Calendar className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">
                                                    {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Session Date</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 py-3">
                                            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-amber-500 transition-colors">
                                                <Clock className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 leading-none">
                                                    {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Scheduled Time</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex gap-4">
                                    <button
                                        onClick={() => router.push(`/interviewer/candidates/${interview.candidateId?._id}`)}
                                        className="flex-1 h-12 rounded-2xl border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2.5"
                                    >
                                        <User className="size-4" />
                                        Profile
                                    </button>
                                    {interview.status === 'Scheduled' && (
                                        <button className="flex-1 h-12 rounded-2xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-slate-950/10 group/btn">
                                            <Play className="size-4 fill-white group-hover:scale-110 transition-transform" />
                                            Join Session
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-40 text-center bg-white border border-slate-200 rounded-[3rem] shadow-sm border-dashed group">
                            <div className="size-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:scale-110 transition-transform">
                                <AlertCircle className="size-10" />
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No matching sessions</h3>
                            <p className="text-xs font-medium text-slate-400 mt-2">Adjust your search parameters or filter criteria.</p>
                            <button
                                className="mt-8 text-[11px] font-bold text-primary underline underline-offset-8 uppercase tracking-widest hover:text-primary/70 transition-colors"
                                onClick={() => { setSearchQuery(''); setActiveTab('upcoming'); }}
                            >
                                Reset Preferences
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
