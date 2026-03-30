'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import {
    Bell,
    BellOff,
    UserPlus,
    CalendarCheck,
    Clock,
    XCircle,
    MessageSquare,
    CheckCheck,
    AlertCircle,
    Info,
    Inbox,
    Shield,
    CheckCircle2,
    Calendar,
    Settings,
    ShieldCheck,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function NotificationsPage() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'candidate_created': return UserPlus;
            case 'interview_created': return CalendarCheck;
            case 'interview_updated': return Clock;
            case 'interview_cancelled': return XCircle;
            case 'chat_message': return MessageSquare;
            default: return Info;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'candidate_created': return 'bg-gray-50 text-gray-900 border-gray-200/40 shadow-blue-500/5';
            case 'interview_created': return 'bg-emerald-50 text-emerald-700 border border-emerald-200/40 border-emerald-100 shadow-emerald-500/5';
            case 'interview_cancelled': return 'bg-emerald-50 text-emerald-700 border-gray-200/50 shadow-gray-500/5';
            case 'interview_updated': return 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-500/5';
            default: return 'bg-gray-50 text-gray-500 border-gray-200/50 shadow-slate-500/5';
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const past = new Date(dateString);
        const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="space-y-10 pb-10 max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">System Notifications</h1>
                    <p className="text-sm font-medium text-gray-500">Review and manage your recent administrative updates and activities.</p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="default"
                        onClick={markAllAsRead}
                        className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCheck className="size-4 group-hover:scale-110 transition-transform" />
                        Mark All Read ({unreadCount})
                    </Button>
                )}
            </div>

            {/* Notifications Feed */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.length > 0 ? (
                        notifications.map((notif, idx) => {
                            const Icon = getIcon(notif.type);
                            return (
                                <motion.div
                                    key={notif._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: idx * 0.02 }}
                                    onClick={() => markAsRead(notif._id)}
                                    className={`group relative bg-white border rounded-2xl p-6 flex items-start gap-6 transition-all cursor-pointer hover:bg-gray-50 hover:shadow-none hover:shadow-slate-200/40 ${!notif.isRead ? 'border-primary bg-primary/[0.01]' : 'border-gray-200/50' }`}
                                >
                                    <div className={`size-16 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all group-hover:rotate-6 group-hover:scale-110 ${getTypeColor(notif.type)}`}>
                                        <Icon className="size-7" />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <h3 className={`font-bold text-lg tracking-tight transition-colors ${!notif.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.isRead && (
                                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(80,72,229,0.5)]"></div>
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-500 font-medium shrink-0 italic">
                                                {formatRelativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed max-w-2xl ${!notif.isRead ? 'text-gray-500' : 'text-gray-500'}`}>
                                            {notif.message}
                                        </p>
                                    </div>

                                    {!notif.isRead && (
                                        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-primary rounded-r-full transition-all group-hover:w-2"></div>
                                    )}

                                    <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <ArrowUpRight className="size-5 text-gray-900" />
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center bg-white border border-gray-200/50 border-dashed rounded-[3rem] text-center space-y-6 group">
                            <div className="size-24 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-200/50 group-hover:scale-110 transition-transform">
                                <Inbox className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-gray-900 font-medium">Inbox Zero</h3>
                                <p className="text-gray-500 font-bold font-medium text-sm">No new system updates at this time.</p>
                            </div>
                            <Button variant="ghost" className="h-10 px-6 rounded-xl border border-gray-200/50 text-sm font-bold font-medium text-gray-500 hover:border-primary hover:text-gray-900 transition-all">
                                Refresh Feed
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* System Status */}
            <div className="p-6 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm font-bold text-gray-500 font-medium rounded-2xl border border-gray-200/50 shadow-inner">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="size-3" />
                        System Online
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 group cursor-pointer hover:text-gray-900 transition-colors">
                        <ShieldCheck className="size-4" />
                        Encrypted Data
                    </div>
                    <div className="flex items-center gap-2.5 group cursor-pointer hover:text-gray-900 transition-colors">
                        <Settings className="size-4" />
                        Preferences
                    </div>
                </div>
            </div>
        </div>
    );
}
