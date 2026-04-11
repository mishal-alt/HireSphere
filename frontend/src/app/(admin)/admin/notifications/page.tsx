'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '@/store/useNotificationStore';
import { 
    Bell, 
    BellSlash, 
    UserPlus, 
    Calendar, 
    Clock, 
    ChatCircleDots,
    CheckCircle,
    Info,
    Trash2,
    CirclesThreePlus
} from '@phosphor-icons/react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
    const { 
        notifications, 
        fetchNotifications, 
        markAsRead, 
        markAllAsRead, 
        clearAll,
        isLoading 
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'candidate_created': return <UserPlus className="size-6 text-blue-500" />;
            case 'interview_created': return <Calendar className="size-6 text-emerald-500" />;
            case 'interview_updated': return <Clock className="size-6 text-amber-500" />;
            case 'interview_cancelled': return <BellSlash className="size-6 text-rose-500" />;
            case 'chat_message': return <ChatCircleDots className="size-6 text-purple-500" />;
            default: return <Bell className="size-6 text-gray-500" />;
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

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        Notifications
                        <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold border-emerald-100">
                            {notifications.filter(n => !n.isRead).length} NEW
                        </Badge>
                    </h1>
                    <p className="text-sm font-medium text-gray-500">
                        Stay updated with real-time activities across your workspace.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        onClick={markAllAsRead}
                        className="text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 h-9 rounded-xl transition-all"
                    >
                        Mark all read
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={clearAll}
                        className="text-xs font-bold text-gray-500 hover:text-rose-600 hover:bg-rose-50 px-4 h-9 rounded-xl transition-all"
                    >
                        Clear all
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border-2 border-dashed border-gray-100 rounded-3xl py-24 flex flex-col items-center justify-center text-center space-y-4"
                        >
                            <div className="size-20 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-gray-100 text-gray-400">
                                <BellSlash className="size-10" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Inbox Zero</h3>
                                <p className="text-sm font-medium text-gray-500 italic">No new activities to show right now.</p>
                            </div>
                        </motion.div>
                    ) : (
                        notifications.map((notif, index) => (
                            <motion.div
                                key={notif._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => !notif.isRead && markAsRead(notif._id)}
                                className={`group p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden bg-white shadow-sm hover:shadow-md ${!notif.isRead ? 'border-emerald-100 shadow-emerald-800/5' : 'border-gray-100'}`}
                            >
                                <div className="flex gap-6 relative z-10">
                                    <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1.5 pt-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className={`text-base tracking-tight ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-500'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                {formatTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-gray-600 font-medium' : 'text-gray-400 font-normal'}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="size-2 rounded-full bg-emerald-600 mt-2 shrink-0 animate-pulse" />
                                    )}
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/0 via-emerald-50/30 to-emerald-50/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
