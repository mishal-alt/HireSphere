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
            case 'candidate_created': return 'bg-blue-50 text-blue-600 border-blue-100 shadow-blue-500/5';
            case 'interview_created': return 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-500/5';
            case 'interview_cancelled': return 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-500/5';
            case 'interview_updated': return 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-500/5';
            default: return 'bg-slate-50 text-slate-400 border-slate-200 shadow-slate-500/5';
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Notifications</h1>
                    <p className="text-sm font-medium text-slate-500">Review and manage your recent administrative updates and activities.</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="h-12 px-8 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20 active:scale-95 flex items-center gap-3 group"
                    >
                        <CheckCheck className="size-4 group-hover:scale-110 transition-transform" />
                        Mark All Read ({unreadCount})
                    </button>
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
                                    className={`group relative bg-white border rounded-[2rem] p-8 flex items-start gap-8 transition-all cursor-pointer shadow-sm hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/40 ${!notif.isRead ? 'border-primary shadow-primary/5 bg-primary/[0.01]' : 'border-slate-200'
                                        }`}
                                >
                                    <div className={`size-16 rounded-[1.25rem] flex items-center justify-center shrink-0 border transition-all group-hover:rotate-6 group-hover:scale-110 shadow-sm ${getTypeColor(notif.type)}`}>
                                        <Icon className="size-7" />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <h3 className={`font-bold text-lg tracking-tight transition-colors ${!notif.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                                                    {notif.title}
                                                </h3>
                                                {!notif.isRead && (
                                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(80,72,229,0.5)]"></div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0 italic">
                                                {formatRelativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm font-medium leading-relaxed max-w-2xl ${!notif.isRead ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {notif.message}
                                        </p>
                                    </div>

                                    {!notif.isRead && (
                                        <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-primary rounded-r-full shadow-sm shadow-primary/20 transition-all group-hover:w-2"></div>
                                    )}

                                    <div className="absolute right-8 bottom-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                        <ArrowUpRight className="size-5 text-primary" />
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-[3rem] text-center space-y-6 group">
                            <div className="size-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                <Inbox className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Inbox Zero</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No new system updates at this time.</p>
                            </div>
                            <button className="h-10 px-6 rounded-xl border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-primary hover:text-primary transition-all">
                                Refresh Feed
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* System Status */}
            <div className="p-8 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest rounded-[2rem] border border-slate-100 shadow-inner">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="size-3" />
                        System Online
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5 group cursor-pointer hover:text-slate-900 transition-colors">
                        <ShieldCheck className="size-4" />
                        Encrypted Data
                    </div>
                    <div className="flex items-center gap-2.5 group cursor-pointer hover:text-slate-900 transition-colors">
                        <Settings className="size-4" />
                        Preferences
                    </div>
                </div>
            </div>
        </div>
    );
}
