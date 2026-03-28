'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useInterviewStore } from '@/store/useInterviewStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import Link from 'next/link';
import {
    Search,
    Bell,
    Clock,
    MessageSquare,
    LogOut,
    UserPlus,
    CalendarCheck,
    CalendarClock,
    CalendarX,
    BellOff,
    ChevronRight,
    SearchX,
    Info,
    Settings,
    Menu
} from 'lucide-react';

export default function InterviewerHeader() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { candidates, fetchCandidates } = useAdminCandidateStore();
    const { interviews, fetchInterviewerInterviews } = useInterviewStore();

    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const [showNotifications, setShowNotifications] = useState(false);

    const {
        notifications: realNotifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotificationStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'candidate_created': return UserPlus;
            case 'interview_created': return CalendarCheck;
            case 'interview_updated': return CalendarClock;
            case 'interview_cancelled': return CalendarX;
            case 'chat_message': return MessageSquare;
            default: return Bell;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'candidate_created': return 'text-sky-600 bg-sky-50 border-sky-100';
            case 'interview_created': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'interview_cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-400 bg-slate-50 border-slate-200';
        }
    };

    const formatTime = (dateString: string) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const mins = Math.floor(diffInSeconds / 60);
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

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

    useEffect(() => {
        fetchCandidates();
        fetchNotifications();
        if (user?._id) {
            fetchInterviewerInterviews(user._id);
        }
    }, [user, fetchCandidates, fetchInterviewerInterviews, fetchNotifications]);

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

    const profileImageUrl = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Interviewer'}`;

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 shadow-sm">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
                    <Menu className="size-5" />
                </button>

                {/* Global Search */}
                <div className="relative w-full hidden md:block" ref={searchRef}>
                    <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-all size-3.5 ${isSearchFocused ? 'text-slate-900' : 'text-slate-400'}`} />
                    <input
                        className={`w-full h-10 pl-10 pr-4 rounded-lg bg-slate-50 border transition-all text-sm outline-none ${isSearchFocused
                                ? 'bg-white border-slate-900 ring-4 ring-slate-900/5 text-slate-900 shadow-sm'
                                : 'border-slate-200 text-slate-700 placeholder:text-slate-400'
                            }`}
                        placeholder="Search for anything..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {isSearchFocused && searchQuery.trim() && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 4 }}
                                className="absolute top-12 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-60 ring-1 ring-slate-900/5"
                            >
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar text-left">
                                    {!hasResults ? (
                                        <div className="py-12 text-center text-slate-400">
                                            <SearchX className="size-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-xs font-semibold">No results found</p>
                                        </div>
                                    ) : (
                                        <div className="p-2 space-y-4">
                                            {searchResults.candidates.length > 0 && (
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-2">Candidates</h3>
                                                    <div className="space-y-0.5">
                                                        {searchResults.candidates.map(candidate => (
                                                            <button
                                                                key={candidate._id}
                                                                onClick={() => {
                                                                    router.push(`/interviewer/candidates/${candidate._id}`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-all text-left group"
                                                            >
                                                                <div className="size-8 rounded-md overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                                                    <img
                                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                                        className="size-full object-cover"
                                                                        alt={candidate.name}
                                                                    />
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold text-slate-900 truncate">{candidate.name}</p>
                                                                    <p className="text-[11px] font-medium text-slate-400 truncate">{candidate.email}</p>
                                                                </div>
                                                                <ChevronRight className="size-3 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`size-9 rounded-lg transition-all relative flex items-center justify-center border shadow-sm ${showNotifications
                                ? 'bg-slate-950 text-white border-slate-950'
                                : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                            }`}
                    >
                        <Bell className="size-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center bg-rose-500 text-[9px] font-bold text-white rounded-full ring-2 ring-white" >
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-xl overflow-hidden z-60 ring-1 ring-slate-900/5 text-left"
                            >
                                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <h3 className="text-slate-900 font-semibold text-sm tracking-tight">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
                                    {realNotifications.length === 0 ? (
                                        <div className="py-12 text-center text-slate-400">
                                            <BellOff className="size-10 mx-auto mb-3 opacity-20" />
                                            <p className="text-xs font-medium">All caught up!</p>
                                        </div>
                                    ) : (
                                        realNotifications.map((notif) => {
                                            const Icon = getIcon(notif.type);
                                            return (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200 shadow-sm ${getTypeColor(notif.type)}`}>
                                                            <Icon className="size-3.5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <h4 className={`text-xs truncate max-w-[140px] ${notif.isRead ? 'font-medium text-slate-400' : 'font-semibold text-slate-900'}`}>{notif.title}</h4>
                                                                <span className="text-[9px] text-slate-400 font-medium whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                                            </div>
                                                            <p className={`text-[11px] leading-relaxed line-clamp-2 ${notif.isRead ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <Link
                                    href="/interviewer/notifications"
                                    className="block w-full py-3 text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all text-center border-t border-slate-100"
                                    onClick={() => setShowNotifications(false)}
                                >
                                    View all activity
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* Profile Selector */}
                <div className="flex items-center gap-2.5 pl-1 group cursor-pointer relative">
                    <div className="relative">
                        <div className="size-8 rounded-lg overflow-hidden border border-slate-200 group-hover:border-slate-400 transition-all shadow-sm">
                            <img
                                alt="Profile"
                                className="size-full object-cover"
                                src={profileImageUrl}
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 size-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || 'User'}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Interviewer</p>
                    </div>

                    {/* Simple Dropdown Menu */}
                    <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 ring-1 ring-slate-950/5">
                            <Link
                                href="/interviewer/settings"
                                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                            >
                                <Settings className="size-3.5" />
                                Settings
                            </Link>
                            <div className="h-px bg-slate-100 my-1 mx-1.5" />
                            <button
                                onClick={logout}
                                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-50 transition-all"
                            >
                                <LogOut className="size-3.5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
