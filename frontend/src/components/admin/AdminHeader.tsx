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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
            case 'candidate_created': return 'text-gray-900 bg-gray-100 border-primary/20';
            case 'interview_created': return 'text-gray-900 bg-emerald-50 border-emerald-100';
            case 'interview_cancelled': return 'text-emerald-700 bg-emerald-50 border-gray-200/50';
            default: return 'text-gray-500 bg-gray-100/60 border-transparent';
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
        <header className="h-16 bg-white border-b border-gray-200/50 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 transition-colors duration-200">
            <div className="flex items-center gap-6 flex-1 max-w-2xl">
                <Button variant="ghost" className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors">
                    <Menu className="size-5" />
                </Button>

                {/* Global Search */}
                <div className="relative w-full hidden md:block" ref={searchRef}>
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors size-4 ${isSearchFocused ? 'text-gray-900' : 'text-gray-400'}`} />
                    <Input
                        className={`w-full h-9 pl-9 pr-3 rounded-md transition-colors text-sm outline-none border ${isSearchFocused ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-100/60 border-transparent text-gray-600 placeholder:text-gray-400 hover:bg-gray-100' }`}
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
                                className="absolute top-14 left-0 w-full bg-white border border-gray-200/50 rounded-xl overflow-hidden z-60"
                            >
                                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                                    {!hasResults ? (
                                        <div className="py-16 text-center bg-gray-50/30">
                                            <SearchX className="size-10 text-gray-500 mx-auto mb-4" />
                                            <p className="text-xs font-bold text-gray-500 tracking-wider">No results found</p>
                                        </div>
                                    ) : (
                                        <div className="p-4 space-y-6">
                                            {/* Candidates Section */}
                                            {searchResults.candidates.length > 0 && (
                                                <div>
                                                    <h3 className="text-sm font-bold text-gray-500 font-medium px-2 mb-3">Candidates</h3>
                                                    <div className="space-y-1">
                                                        {searchResults.candidates.map(candidate => (
                                                            <Button variant="ghost"
                                                                key={candidate._id}
                                                                onClick={() => {
                                                                    router.push(`/admin/candidates/${candidate._id}`);
                                                                    setIsSearchFocused(false);
                                                                    setSearchQuery('');
                                                                }}
                                                                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-primary-light transition-all text-left group"
                                                            >
                                                                <div className="size-9 rounded-lg overflow-hidden border border-gray-200/50 bg-gray-50 shrink-0">
                                                                    <img
                                                                        src={candidate.profileImage ? (candidate.profileImage.startsWith('http') ? candidate.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${candidate.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                                                        className="size-full object-cover"
                                                                        alt={candidate.name}
                                                                    />
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="text-[13px] font-bold text-gray-900 group-hover:text-gray-900 transition-colors truncate">{candidate.name}</p>
                                                                    <p className="text-sm font-medium text-gray-500 capitalize truncate">{candidate.status}</p>
                                                                </div>
                                                            </Button>
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

            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <Button variant="ghost"
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`size-9 rounded-md transition-colors relative flex items-center justify-center ${showNotifications ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900' }`}
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
                                className="absolute right-0 mt-4 w-[380px] bg-white border border-gray-200/50 rounded-xl overflow-hidden z-60"
                            >
                                <div className="p-5 border-b border-gray-200/50 flex items-center justify-between">
                                    <h3 className="text-gray-900 font-bold text-sm tracking-tight">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <Button variant="ghost" onClick={markAllAsRead} className="text-sm font-bold font-medium text-gray-900 hover:opacity-80 transition-opacity">
                                            Mark all read
                                        </Button>
                                    )}
                                </div>
                                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {realNotifications.length === 0 ? (
                                        <div className="py-16 text-center bg-gray-50/30">
                                            <BellOff className="size-10 text-gray-500 mx-auto mb-4" />
                                            <p className="text-sm font-bold text-gray-500 font-medium">Inbox Zero</p>
                                        </div>
                                    ) : (
                                        realNotifications.map((notif) => {
                                            const Icon = getIcon(notif.type);
                                            return (
                                                <div
                                                    key={notif._id}
                                                    onClick={() => markAsRead(notif._id)}
                                                    className={`p-4 border-b border-gray-200/50 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!notif.isRead ? 'bg-primary-light/30' : ''}`}
                                                >
                                                    <div className="flex gap-6">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 border border-gray-200/50 transition-transform group-hover:scale-105 ${getTypeColor(notif.type)}`}>
                                                            <Icon className="size-4 shrink-0" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-start mb-0.5">
                                                                <h4 className={`text-[13px] truncate pr-4 ${notif.isRead ? 'font-medium text-gray-500' : 'font-bold text-gray-900'}`}>{notif.title}</h4>
                                                                <span className="text-xs text-gray-500 font-bold font-medium whitespace-nowrap">{formatTime(notif.createdAt)}</span>
                                                            </div>
                                                            <p className={`text-sm leading-relaxed line-clamp-2 font-medium ${notif.isRead ? 'text-gray-500' : 'text-gray-500'}`}>{notif.message}</p>
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
                                    className="w-full py-4 text-sm font-bold text-gray-500 uppercase tracking-[0.2em] hover:text-gray-900 hover:bg-gray-50 transition-all text-center border-t border-gray-200/50"
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
                    <div className="size-8 rounded-md overflow-hidden bg-gray-100 transition-colors">
                        <img
                            alt="Profile"
                            className="size-full object-cover"
                            src={profileImageUrl}
                        />
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-sm font-medium text-gray-900 leading-none mb-0.5">{adminName}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

