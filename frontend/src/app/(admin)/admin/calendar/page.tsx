'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminInterviewStore } from '@/store/useAdminInterviewStore';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { useRouter } from 'next/navigation';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    Video,
    MoreHorizontal,
    Activity,
    CheckCircle2,
    CalendarDays,
    CalendarRange,
    Users,
    ArrowUpRight,
    Search,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function CalendarPage() {
    const { interviews, loading, fetchInterviews } = useAdminInterviewStore();
    const { interviewers, fetchInterviewers } = useAdminInterviewerStore();
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());

    const [view, setView] = useState<'month' | 'week'>('month');

    useEffect(() => {
        fetchInterviews();
        fetchInterviewers();

        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, [fetchInterviews, fetchInterviewers]);

    const monthDays = useMemo(() => {
        const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const gridStart = new Date(start.setDate(diff));

        return Array.from({ length: 35 }, (_, i) => {
            const d = new Date(gridStart);
            d.setDate(gridStart.getDate() + i);
            return {
                fullDate: d,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.getDate().toString(),
                isToday: d.toDateString() === new Date().toDateString(),
                isCurrentMonth: d.getMonth() === currentTime.getMonth()
            };
        });
    }, [currentTime]);

    const weekDays = useMemo(() => {
        const start = new Date(currentTime);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(start.setDate(diff));

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            return {
                fullDate: d,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                date: d.getDate().toString(),
                isToday: d.toDateString() === new Date().toDateString()
            };
        });
    }, [currentTime]);

    const getEventsForDay = (date: Date) => {
        return interviews.filter(interview => {
            const interviewDate = new Date(interview.scheduledAt);
            return interviewDate.toDateString() === date.toDateString();
        });
    };

    const calculateTop = (scheduledAt: string) => {
        const date = new Date(scheduledAt);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const top = (hours - 8) * 80 + (minutes / 60) * 80;
        return Math.max(0, top);
    };

    const todaysInterviews = useMemo(() => {
        return interviews.filter(inv => new Date(inv.scheduledAt).toDateString() === currentTime.toDateString())
            .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    }, [interviews, currentTime]);

    if (loading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row h-full gap-6 pb-10">
            {/* Main Stage */}
            <div className="flex-1 space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                    <div className="space-y-1.5">
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Interview Calendar</h1>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-900" />
                            {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center p-1.5 rounded-xl bg-gray-50 border border-gray-200/50 shadow-inner">
                        {[
                            { id: 'month', label: 'Month', icon: CalendarDays },
                            { id: 'week', label: 'Week', icon: CalendarRange }
                        ].map((v) => (
                            <Button variant="ghost"
                                key={v.id}
                                onClick={() => setView(v.id as 'month' | 'week')}
                                className={`h-10 px-6 rounded-xl text-sm font-bold font-medium transition-all flex items-center gap-2 ${view === v.id ? 'bg-white text-gray-900 border border-gray-200/50' : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}`}
                            >
                                <v.icon className={`size-3.5 ${view === v.id ? 'text-gray-900' : ''}`} />
                                {v.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Calendar Plane */}
                <div className="flex flex-col h-[750px] relative group border-t border-gray-200/50 mt-4 pt-4">
                    {view === 'month' ? (
                        <div className="flex-1 flex flex-col relative z-10">
                            {/* Days Grid */}
                            <div className="grid grid-cols-7 border-b border-gray-200/50 bg-gray-50">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                    <div key={d} className="py-4 text-center border-r border-gray-200/50 last:border-0">
                                        <span className="text-sm font-bold font-medium text-gray-500">{d}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-1 grid grid-cols-7">
                                {monthDays.map((d, i) => {
                                    const dayEvents = getEventsForDay(d.fullDate);
                                    return (
                                        <div key={i} className={`border-r border-b border-gray-200/50 last:border-r-0 relative p-6 transition-all hover:bg-gray-50/30 ${d.isToday ? 'bg-gray-100' : ''} ${!d.isCurrentMonth ? 'opacity-20' : ''}`}>
                                            <span className={`text-2xl font-bold tracking-tighter ${d.isToday ? 'text-gray-900' : 'text-gray-500'}`}>{d.date}</span>
                                            <div className="mt-4 space-y-2">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event._id}
                                                        onClick={() => router.push('/admin/interviews')}
                                                        className="px-3 py-1.5 rounded-xl bg-white border border-gray-200/50 text-[8px] font-bold text-gray-500 truncate cursor-pointer hover:border-primary hover:text-gray-900 transition-all font-medium flex items-center gap-1.5"
                                                    >
                                                        <div className="size-1 rounded-full bg-primary" />
                                                        {new Date(event.scheduledAt).getHours()}:00 • {event.candidateId?.name.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-[8px] font-bold text-gray-900 font-medium ml-1 pl-1 border-l-2 border-primary/20">+{dayEvents.length - 2} more sessions</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                            <div className="grid grid-cols-7 border-b border-gray-200/50 bg-gray-50">
                                {weekDays.map((d, i) => (
                                    <div key={i} className={`py-8 text-center border-r border-gray-200/50 last:border-0 ${d.isToday ? 'bg-gray-100' : ''}`}>
                                        <span className="block text-sm font-bold font-medium text-gray-500 mb-2">{d.day}</span>
                                        <span className={`text-5xl font-bold tracking-tighter ${d.isToday ? 'text-gray-900 underline decoration-primary decoration-4 underline-offset-8' : 'text-gray-500'}`}>{d.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 relative overflow-y-auto bg-gray-50/10 custom-scrollbar">
                                <div className="grid grid-cols-7 h-[1040px] relative">
                                    {Array.from({ length: 13 }).map((_, i) => (
                                        <div key={i} className="absolute w-full border-t border-gray-200/50" style={{ top: `${i * 80}px` }}>
                                            <span className="absolute -top-3 left-4 text-xs font-bold text-gray-500 font-medium italic">{8 + i}:00</span>
                                        </div>
                                    ))}

                                    {weekDays.map((d, i) => (
                                        <div key={i} className={`border-r border-gray-200/50 last:border-0 relative h-full ${d.isToday ? 'bg-primary/[0.01]' : ''}`}>
                                            {getEventsForDay(d.fullDate).map((event) => (
                                                <motion.div
                                                    key={event._id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    onClick={() => router.push('/admin/interviews')}
                                                    className="absolute inset-x-3 p-4 rounded-xl border border-gray-200/50 bg-white shadow-none shadow-slate-200/40 group cursor-pointer transition-all hover:scale-[1.02] hover:border-primary active:scale-[0.98] overflow-hidden"
                                                    style={{ top: `${calculateTop(event.scheduledAt)}px`, height: '70px' }}
                                                >
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                                    <div className="flex flex-col justify-between h-full pl-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-gray-900 font-medium leading-none">
                                                                {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <div className="size-2 rounded-full bg-gray-400 animate-pulse" />
                                                        </div>
                                                        <div className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight mt-1">{event.candidateId?.name}</div>
                                                        <div className="text-[8px] font-bold text-gray-500 truncate uppercase mt-1 italic pl-3 relative">
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-gray-100" />
                                                            w/ {event.interviewerId?.name}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Aside Activity */}
            <aside className="w-full xl:w-[400px] space-y-10 xl:h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar shrink-0">
                <div className="flex flex-col pt-4 group">

                    <div className="flex items-center justify-between mb-10 relative z-10 transition-transform group-hover:translate-x-1">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Today's Schedule</h3>
                            <p className="text-xs font-bold text-gray-500 font-medium mt-1.5 italic">Real-time session status</p>
                        </div>
                        <span className="px-4 py-1.5 bg-primary border border-gray-200/50 text-gray-900 text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-none shadow-slate-950/10">
                            {todaysInterviews.length} SESSIONS
                        </span>
                    </div>

                    <div className="space-y-10 relative z-10">
                        {todaysInterviews.length > 0 ? todaysInterviews.map((event) => (
                            <div key={event._id} className="group/item cursor-pointer">
                                <div className="flex items-start gap-5">
                                    <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover/item:bg-primary group-hover/item:text-gray-900 group-hover/item:border-primary transition-all">
                                        <Clock className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight group-hover/item:text-gray-900 transition-colors">
                                            {event.candidateId?.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-1.5 rounded-full bg-gray-100" />
                                            <p className="text-xs text-gray-500 font-bold font-medium">
                                                Interviewer: {event.interviewerId?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6 mt-4">
                                            <div className="flex items-center gap-2 text-xs text-gray-900 font-bold font-medium transition-transform group-hover/item:translate-x-1">
                                                <Clock className="size-3.5 text-gray-900" />
                                                {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.meetLink && (
                                                <a href={event.meetLink} target="_blank" className="flex items-center gap-2 text-xs text-gray-500 font-bold font-medium hover:text-gray-900 transition-all group/link">
                                                    <Video className="size-3.5 group-hover/link:animate-pulse" />
                                                    Join Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-24 text-center border-2 border-dashed border-gray-200/50 rounded-2xl group-hover:bg-gray-50 transition-colors">
                                <span className="material-symbols-outlined text-gray-500 text-5xl mb-6">event_busy</span>
                                <p className="text-sm font-bold text-gray-500 font-medium italic">No sessions today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interviewer Hub */}
                <div className="flex flex-col pt-4 border-t border-gray-200/50 group">
                    <h3 className="text-sm font-semibold text-gray-900 mb-6">Interviewer Directory</h3>
                    <div className="space-y-6 relative z-10">
                        {interviewers.slice(0, 5).map((member) => (
                            <div key={member._id} className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-6">
                                    <div className="size-11 rounded-xl overflow-hidden border border-gray-200/50 bg-gray-50 group-hover/row:border-primary group-hover/row:scale-105 transition-all">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="size-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight group-hover/row:text-gray-900 transition-colors">{member.name}</p>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Management</p>
                                    </div>
                                </div>
                                <div className={`size-2.5 rounded-full ${member.isActive ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-gray-100'} transition-all`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Card */}
                <div className="p-6 rounded-2xl bg-gray-900 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => router.push('/admin/interviews')}>
                    <div className="relative z-10 space-y-4">
                        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-900">
                            <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-gray-900 tracking-tight leading-tight">Full Session Logs</h3>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                Access the complete history and management portal for all <span className="text-gray-900 font-semibold">interview sessions</span> across the platform.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:gap-6 transition-all">
                            Manage All <ChevronRight className="size-4" />
                        </div>
                    </div>
                    <CalendarIcon className="absolute -right-8 -bottom-8 text-gray-900/[0.03] size-48 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
                </div>
            </aside>
        </div>
    );
}
