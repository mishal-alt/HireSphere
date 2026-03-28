'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { useAdminInterviewStore } from '@/store/useAdminInterviewStore';
import { useNotificationStore, Notification } from '@/store/useNotificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    Bell,
    Menu,
    X,
    UserPlus,
    Calendar,
    Clock,
    MessageSquare,
    User,
    CheckCircle2,
    ChevronRight,
    SearchX,
    BellOff,
    MoreHorizontal
} from 'lucide-react';

export default function AdminHeader() {
    const { user } = useAuthStore();
    const { candidates, fetchCandidates } = useAdminCandidateStore();
    const { interviewers, fetchInterviewers } = useAdminInterviewerStore();
    const { interviews, fetchInterviews } = useAdminInterviewStore();
    const router = useRouter();

    const adminName = user?.name || 'Admin';
    const profileImageUrl = user?.profileImage
        ? (user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`)
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName}`;

    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const notificationRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const {
        notifications: realNotifications,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    } = useNotificationStore();

    useEffect(() => {
        fetchCandidates();
        fetchInterviewers();
        fetchInterviews();
        fetchNotifications();
    }, []);

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

    const getIcon = (type: string) => {
        switch (type) {
            case 'candidate_created': return UserPlus;
            case 'interview_created': return Calendar;
            case 'interview_updated': return Clock;
            case 'interview_cancelled': return BellOff;
            case 'chat_message': return MessageSquare;
            default: return Bell;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'candidate_created': return 'text-primary bg-primary/10 border-primary/20';
            case 'interview_created': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'interview_cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-400 bg-slate-50 border-slate-100';
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

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 lg:px-12 shrink-0 z-50 sticky top-0 transition-all">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <button className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                    <Menu className="size-5" />
                </button>

                {/* Global Search */}
                <div className="relative w-full hidden md:block" ref={searchRef}>
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all size-4 ${isSearchFocused ? 'text-primary scale-110' : 'text-slate-400'}`} />
                    <input
                        className={`w-full h-11 pl-12 pr-4 rounded-xl transition-all text-xs font-semibold outline-none border ${isSearchFocused
                            ? 'bg-white border-primary shadow-sm text-slate-900 px-5'
                            : 'bg-slate-50 border-slate-100 text-slate-600 placeholder:text-slate-400 hover:bg-slate-100/50'
                            }`}
                        placeholder="Search workspace..."
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
                                className="absolute top-14 left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-premium overflow-hidden z-60"
                            >
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {!hasResults ? (
                                        <div className="py-16 text-center bg-slate-50/30">
                                            <SearchX className="size-10 text-slate-200 mx-auto mb-4" />
                                            <p className="text-xs font-bold text-slate-400 tracking-wider">No results found</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-6">
                                            {/* Candidates Section */}
                                            {searchResults.candidates.length > 0 && (
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">Candidates</h3>
                                                    <div className="space-y-1">
                                                        {searchResults.candidates.map(candidate => (
                                                            <button
                                                                key={candidate._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/candidates/${candidate._id}`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary-light transition-all text-left group"
                                                            >
                                                                <div className="size-9 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                                                                    <img
                                                                        src={candidate.profileImage ? (candidate.profileImage.startsWith('http') ? candidate.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${candidate.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                                        className="size-full object-cover"
                                                                        alt={candidate.name}
                                                                    />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[13px] font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{candidate.name}</p>
                                                                    <p className="text-[11px] font-medium text-slate-400 capitalize truncate">{candidate.status}</p>
                                                                </div>
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

            <div className="flex items-center gap-5">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`size-10 rounded-xl transition-all relative flex items-center justify-center border ${showNotifications
                            ? 'bg-primary-light text-primary border-primary-light'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700 border-slate-100'
                            }`}
                    >
                        <Bell className="size-4.5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-[380px] bg-white border border-slate-200 shadow-premium rounded-2xl overflow-hidden z-60"
                            >
                                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-slate-900 font-bold text-sm tracking-tight">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button onClick={markAllAsRead} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity">
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {realNotifications.length === 0 ? (
                                        <div className="py-16 text-center bg-slate-50/30">
                                            <BellOff className="size-10 text-slate-100 mx-auto mb-4" />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inbox Zero</p>
                                        </div>
                                    ) : (
                                        realNotifications.map((notif) => {
                                            const Icon = getIcon(notif.type);
                                            return (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-primary-light/30' : ''}`}
                                                >
                                                    <div className="flex gap-4">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 transition-transform group-hover:scale-105 ${getTypeColor(notif.type)}`}>
                                                            <Icon className="size-4 shrink-0" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <h4 className={`text-[13px] truncate pr-4 ${notif.isRead ? 'font-medium text-slate-500' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                                                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                                            </div>
                                                            <p className={`text-[11px] leading-relaxed line-clamp-2 font-medium ${notif.isRead ? 'text-slate-400' : 'text-slate-500'}`}>{notif.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        router.push('/admin/notifications');
                                    }}
                                    className="w-full py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] hover:text-primary hover:bg-slate-50 transition-all text-center border-t border-slate-100"
                                >
                                    View all activity
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-4 w-[1px] bg-slate-200"></div>

                {/* Profile Selector */}
                <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => router.push('/admin/settings')}>
                    <div className="size-9 rounded-lg overflow-hidden border-2 border-slate-100 transition-all shadow-sm group-hover:border-primary">
                        <img
                            alt="Profile"
                            className="size-full object-cover"
                            src={profileImageUrl}
                        />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-1">{adminName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

