'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { useAdminInterviewStore } from '@/store/useAdminInterviewStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminHeader() {
    const { user } = useAuthStore();
    const { candidates, fetchCandidates } = useAdminCandidateStore();
    const { interviewers, fetchInterviewers } = useAdminInterviewerStore();
    const { interviews, fetchInterviews } = useAdminInterviewStore();
    const router = useRouter();

    const adminName = user?.name || 'Admin';
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Initial data fetch for search
    useEffect(() => {
        fetchCandidates();
        fetchInterviewers();
        fetchInterviews();
    }, []);

    // Global Search Logic
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return { candidates: [], interviewers: [], interviews: [] };
        const query = searchQuery.toLowerCase();

        return {
            candidates: candidates.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query)
            ).slice(0, 4),
            interviewers: interviewers.filter(i =>
                i.name.toLowerCase().includes(query) ||
                i.email.toLowerCase().includes(query)
            ).slice(0, 4),
            interviews: interviews.filter(inv =>
                inv.candidateId?.name.toLowerCase().includes(query) ||
                inv.interviewerId?.name.toLowerCase().includes(query)
            ).slice(0, 4)
        };
    }, [searchQuery, candidates, interviewers, interviews]);

    const hasResults = searchResults.candidates.length > 0 || searchResults.interviewers.length > 0 || searchResults.interviews.length > 0;

    const notifications = [
        {
            id: 1,
            title: 'New Candidate',
            message: 'John Doe has applied for the Senior Developer position.',
            time: '2m ago',
            type: 'primary',
            icon: 'person_add'
        },
        {
            id: 2,
            title: 'Interview Scheduled',
            message: 'Technical interview with Sarah Smith is tomorrow.',
            time: '1h ago',
            type: 'accent',
            icon: 'calendar_month'
        },
        {
            id: 3,
            title: 'New Feedback',
            message: 'Mark Thompson left feedback for Alex Johnson.',
            time: '3h ago',
            type: 'white',
            icon: 'rate_review'
        }
    ];

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-20 bg-[#080808] border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-40 relative">
            <div className="flex items-center gap-6 flex-1">
                <button className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5 transition-colors">
                    <span className="material-symbols-outlined">menu</span>
                </button>

                {/* Search */}
                <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
                    <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-primary' : 'text-slate-500'} text-lg`}>search</span>
                    <input
                        className="w-full h-11 pl-12 pr-4 rounded-lg bg-[#121212] border border-white/5 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 focus:bg-white/[0.02] outline-none transition-all"
                        placeholder="Search candidates, interviewers..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchQuery.trim() && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                className="absolute top-14 left-0 w-full bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl"
                            >
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar p-2">
                                    {!hasResults ? (
                                        <div className="py-10 text-center">
                                            <span className="material-symbols-outlined text-slate-700 text-3xl mb-2">search_off</span>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No results found</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 p-2">
                                            {/* Candidates Section */}
                                            {searchResults.candidates.length > 0 && (
                                                <div>
                                                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-2 flex items-center justify-between">
                                                        Candidates
                                                        <span className="text-primary/50 italic">{searchResults.candidates.length} result{searchResults.candidates.length > 1 ? 's' : ''}</span>
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {searchResults.candidates.map(candidate => (
                                                            <button
                                                                key={candidate._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/candidates/${candidate._id}`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                                                            >
                                                                <div className="size-8 rounded-lg overflow-hidden border border-white/10 bg-[#121212] shrink-0">
                                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} alt={candidate.name} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{candidate.name}</p>
                                                                    <p className="text-[9px] text-slate-500 font-bold uppercase truncate">{candidate.status}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Interviewers Section */}
                                            {searchResults.interviewers.length > 0 && (
                                                <div>
                                                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-2 flex items-center justify-between">
                                                        Interviewers
                                                        <span className="text-primary/50 italic">{searchResults.interviewers.length} result{searchResults.interviewers.length > 1 ? 's' : ''}</span>
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {searchResults.interviewers.map(interviewer => (
                                                            <button
                                                                key={interviewer._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/interviewers`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                                                            >
                                                                <div className="size-8 rounded-lg overflow-hidden border border-white/10 bg-[#121212] shrink-0">
                                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interviewer.name}`} alt={interviewer.name} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{interviewer.name}</p>
                                                                    <p className="text-[9px] text-slate-500 font-bold uppercase truncate">{interviewer.department || 'GENERAL'}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Interviews Section */}
                                            {searchResults.interviews.length > 0 && (
                                                <div>
                                                    <h3 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-2 flex items-center justify-between">
                                                        Interviews
                                                        <span className="text-primary/50 italic">{searchResults.interviews.length} result{searchResults.interviews.length > 1 ? 's' : ''}</span>
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {searchResults.interviews.map(inv => (
                                                            <button
                                                                key={inv._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/interviews`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left group"
                                                            >
                                                                <div className="size-8 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20 text-primary shrink-0">
                                                                    <span className="material-symbols-outlined text-sm">schedule</span>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-xs font-bold text-white group-hover:text-primary transition-colors truncate">{inv.candidateId?.name} Interview</p>
                                                                    <p className="text-[9px] text-slate-500 font-bold uppercase truncate">with {inv.interviewerId?.name} • {new Date(inv.scheduledAt).toLocaleDateString()}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest italic">Search all data</span>
                                    <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] text-slate-500 font-bold">ESC</kbd>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-lg transition-all relative ${showNotifications
                                ? 'bg-primary/20 text-primary'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full"></span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute right-0 mt-4 w-[380px] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 backdrop-blur-xl"
                            >
                                <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-white font-bold tracking-tight text-sm">Notifications</h3>
                                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase italic">3 New</span>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="p-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                                        >
                                            <div className="flex gap-4">
                                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-white/5 ${notif.type === 'primary' ? 'bg-primary/10 text-primary' :
                                                        notif.type === 'accent' ? 'bg-accent/10 text-accent' :
                                                            'bg-white/5 text-white'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-xl">{notif.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">{notif.title}</h4>
                                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{notif.time}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{notif.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        router.push('/admin/notifications');
                                    }}
                                    className="w-full py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all text-center"
                                >
                                    View All
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-[1px] bg-white/5 mx-2"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white tracking-tight">{adminName}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">Admin</p>
                    </div>
                    <div className="size-10 rounded-lg overflow-hidden border border-white/10 bg-[#121212]">
                        <img
                            alt="Profile"
                            className="size-full object-cover"
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
