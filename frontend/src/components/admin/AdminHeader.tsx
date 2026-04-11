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
    MagnifyingGlass,
    Bell,
    List,
    X,
    UserPlus,
    Calendar,
    Clock,
    ChatCircleDots,
    User,
    CheckCircle,
    CaretRight,
    BellSlash,
    DotsThree
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function AdminHeader() {
    const { user, company } = useAuthStore();
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
            case 'interview_cancelled': return BellSlash;
            case 'chat_message': return ChatCircleDots;
            default: return Bell;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'candidate_created': return 'text-foreground bg-muted border-primary/20';
            case 'interview_created': return 'text-foreground bg-emerald-50 border-emerald-100';
            case 'interview_cancelled': return 'text-emerald-700 bg-emerald-50 border-border';
            default: return 'text-muted-foreground bg-muted/60 border-transparent';
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
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 transition-colors duration-200">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <Button variant="ghost" className="lg:hidden p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                    <List className="size-5" />
                </Button>

                {/* Global Search */}
                <div className="relative w-full hidden md:block" ref={searchRef}>
                    <MagnifyingGlass className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors size-4 ${isSearchFocused ? 'text-foreground' : 'text-gray-400'}`} />
                    <Input
                        className={`w-full h-9 pl-9 pr-3 rounded-md transition-colors text-sm outline-none border ${isSearchFocused ? 'bg-card border-gray-300 text-foreground' : 'bg-muted/60 border-transparent text-gray-600 placeholder:text-gray-400 hover:bg-muted' }`}
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
                                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-gray-200/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-[1000] backdrop-blur-xl"
                            >
                                <div className="max-h-[520px] overflow-y-auto custom-scrollbar p-3 space-y-4">
                                    {!hasResults ? (
                                        <div className="py-16 text-center animate-in fade-in zoom-in duration-300">
                                            <div className="size-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                                                <MagnifyingGlass className="size-8 text-gray-300" />
                                            </div>
                                            <p className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">No matches found</p>
                                            <p className="text-xs text-gray-400 font-medium mt-2 px-10">Try searching for a name, email, or session ID instead.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Candidates Section */}
                                            {searchResults.candidates.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between px-3 mb-1">
                                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Candidates</h3>
                                                        <span className="text-[10px] font-bold text-emerald-800">{searchResults.candidates.length} FOUND</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {searchResults.candidates.map(candidate => (
                                                            <button
                                                                key={candidate._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/candidates/${candidate._id}`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group text-left border border-transparent hover:border-gray-200/50"
                                                            >
                                                                <div className="flex items-center gap-4 min-w-0">
                                                                    <div className="size-10 rounded-lg overflow-hidden border border-gray-200/50 bg-gray-50 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                                                        <img
                                                                            src={candidate.profileImage ? (candidate.profileImage.startsWith('http') ? candidate.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${candidate.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                                            className="size-full object-cover"
                                                                            alt={candidate.name}
                                                                        />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{candidate.name}</p>
                                                                        <p className="text-xs text-gray-400 font-medium truncate italic lowercase">{candidate.email}</p>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider py-0 px-2 rounded-full border-gray-100 text-gray-400 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-emerald-800 transition-all">
                                                                    {candidate.status}
                                                                </Badge>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Interviewers Section */}
                                            {searchResults.interviewers.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between px-3 mb-1 pt-2 border-t border-gray-50">
                                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Interviewers</h3>
                                                        <span className="text-[10px] font-bold text-emerald-800">{searchResults.interviewers.length} FOUND</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {searchResults.interviewers.map(member => (
                                                            <button
                                                                key={member._id}
                                                                onClick={() => {
                                                                    router.push('/admin/interviewers');
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all group text-left border border-transparent hover:border-gray-200/50"
                                                            >
                                                                <div className="size-10 rounded-lg overflow-hidden border border-gray-200/50 bg-gray-50 shrink-0 shadow-sm">
                                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} className="size-full object-cover" alt={member.name} />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{member.name}</p>
                                                                    <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-widest mt-0.5">Management Panel</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Sessions Section */}
                                            {searchResults.interviews.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between px-3 mb-1 pt-2 border-t border-gray-50">
                                                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sessions</h3>
                                                        <span className="text-[10px] font-bold text-emerald-800">{searchResults.interviews.length} ACTIVE</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-1">
                                                        {searchResults.interviews.map(inv => (
                                                            <button
                                                                key={inv._id}
                                                                onClick={() => {
                                                                    router.push('/admin/interviews');
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-all group text-left border border-transparent hover:border-gray-200/50"
                                                            >
                                                                <div className="flex items-center gap-4 min-w-0">
                                                                    <div className="size-10 rounded-lg bg-emerald-800 flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover:rotate-12">
                                                                        <Calendar className="size-5 text-emerald-400" />
                                                                    </div>
                                                                    <div className="min-w-0">
                                                                        <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{inv.candidateId?.name} Interview</p>
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">w/ {inv.interviewerId?.name}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-[10px] font-bold text-gray-900 leading-none mb-1 uppercase italic underline decoration-emerald-800/10 decoration-2 underline-offset-2">Scheduled</p>
                                                                    <p className="text-[9px] text-gray-400 font-bold">{new Date(inv.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-gray-200 shadow-sm">
                                            <span className="text-[8px] font-bold text-gray-400">ESC</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Close Command</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[9px] font-bold text-emerald-800 uppercase tracking-widest hover:translate-x-1 transition-transform cursor-pointer" onClick={() => setSearchQuery('')}>
                                        Clear History <X className="size-3" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Plan Badge */}
                <Link href="/admin/pricing" className="hidden sm:block">
                    <Badge variant="outline" className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full border-gray-200 text-gray-600 bg-gray-50 hover:bg-muted transition-colors cursor-pointer`}>
                        {company?.subscriptionPlan || 'Free'} Plan
                    </Badge>
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <Button variant="ghost"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`size-9 rounded-md transition-colors relative flex items-center justify-center ${showNotifications ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground' }`}
                    >
                        <Bell className="size-4.5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-600 rounded-full" />
                        )}
                    </Button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute right-0 mt-4 w-[380px] bg-white border border-gray-200/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden z-60"
                            >
                                <div className="p-5 border-b border-border flex items-center justify-between">
                                    <h3 className="text-foreground font-bold text-sm tracking-tight">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <Button variant="ghost" onClick={markAllAsRead} className="text-sm font-bold font-medium text-foreground hover:opacity-80 transition-opacity">
                                            Mark all read
                                        </Button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {realNotifications.length === 0 ? (
                                        <div className="py-20 text-center bg-white">
                                            <BellSlash className="size-10 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-sm font-bold text-muted-foreground font-medium">Inbox Zero</p>
                                        </div>
                                    ) : (
                                        realNotifications.map((notif) => {
                                            const Icon = getIcon(notif.type);
                                            return (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-4 border-b border-border hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-primary-light/30' : ''}`}
                                                >
                                                    <div className="flex gap-6">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-border transition-transform group-hover:scale-105 ${getTypeColor(notif.type)}`}>
                                                            <Icon className="size-4 shrink-0" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <h4 className={`text-[13px] truncate pr-4 ${notif.isRead ? 'font-medium text-muted-foreground' : 'font-bold text-foreground'}`}>{notif.title}</h4>
                                                                <span className="text-xs text-muted-foreground font-bold font-medium whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                                            </div>
                                                            <p className={`text-sm leading-relaxed line-clamp-2 font-medium ${notif.isRead ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{notif.message}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                <Button variant="ghost"
                                    onClick={() => {
                                        setShowNotifications(false);
                                        router.push('/admin/notifications');
                                    }}
                                    className="w-full py-4 text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground hover:bg-gray-50 transition-all text-center border-t border-border"
                                >
                                    View all activity
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="h-4 w-[1px] bg-gray-200"></div>

                {/* Profile Selector */}
                <div className="flex items-center gap-3 pl-1 group cursor-pointer" onClick={() => router.push('/admin/settings')}>
                    <div className="size-8 rounded-md overflow-hidden bg-muted transition-colors">
                        <img
                            alt="Profile"
                            className="size-full object-cover"
                            src={profileImageUrl}
                        />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-foreground leading-none mb-0.5">{adminName}</p>
                        <p className="text-xs text-muted-foreground">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

