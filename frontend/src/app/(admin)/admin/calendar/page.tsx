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
        <div className="flex flex-col xl:flex-row h-full gap-8 pb-10">
            {/* Main Stage */}
            <div className="flex-1 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interview Calendar</h1>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <CalendarIcon className="size-4 text-primary" />
                            {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center p-1.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-inner">
                        {[
                            { id: 'month', label: 'Month', icon: CalendarDays },
                            { id: 'week', label: 'Week', icon: CalendarRange }
                        ].map((v) => (
                            <button
                                key={v.id}
                                onClick={() => setView(v.id as 'month' | 'week')}
                                className={`h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${view === v.id ? 'bg-white text-slate-900 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'}`}
                            >
                                <v.icon className={`size-3.5 ${view === v.id ? 'text-primary' : ''}`} />
                                {v.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Plane */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px] relative group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <CalendarIcon className="size-64 text-slate-900" />
                    </div>

                    {view === 'month' ? (
                        <div className="flex-1 flex flex-col relative z-10">
                            {/* Days Grid */}
                            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                    <div key={d} className="py-4 text-center border-r border-slate-50 last:border-0">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{d}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex-1 grid grid-cols-7">
                                {monthDays.map((d, i) => {
                                    const dayEvents = getEventsForDay(d.fullDate);
                                    return (
                                        <div key={i} className={`border-r border-b border-slate-50 last:border-r-0 relative p-6 transition-all hover:bg-slate-50/30 ${d.isToday ? 'bg-primary/5' : ''} ${!d.isCurrentMonth ? 'opacity-20' : ''}`}>
                                            <span className={`text-2xl font-bold tracking-tighter ${d.isToday ? 'text-primary' : 'text-slate-300'}`}>{d.date}</span>
                                            <div className="mt-4 space-y-2">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event._id}
                                                        onClick={() => router.push('/admin/interviews')}
                                                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[8px] font-bold text-slate-600 truncate cursor-pointer hover:border-primary hover:text-primary transition-all uppercase tracking-widest shadow-sm flex items-center gap-1.5"
                                                    >
                                                        <div className="size-1 rounded-full bg-primary" />
                                                        {new Date(event.scheduledAt).getHours()}:00 • {event.candidateId?.name.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-[8px] font-bold text-primary uppercase tracking-widest ml-1 pl-1 border-l-2 border-primary/20">+{dayEvents.length - 2} more sessions</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden relative z-10">
                            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
                                {weekDays.map((d, i) => (
                                    <div key={i} className={`py-8 text-center border-r border-slate-50 last:border-0 ${d.isToday ? 'bg-primary/5' : ''}`}>
                                        <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{d.day}</span>
                                        <span className={`text-5xl font-bold tracking-tighter ${d.isToday ? 'text-slate-900 underline decoration-primary decoration-4 underline-offset-8' : 'text-slate-300'}`}>{d.date}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 relative overflow-y-auto bg-slate-50/10 custom-scrollbar">
                                <div className="grid grid-cols-7 h-[1040px] relative">
                                    {Array.from({ length: 13 }).map((_, i) => (
                                        <div key={i} className="absolute w-full border-t border-slate-100" style={{ top: `${i * 80}px` }}>
                                            <span className="absolute -top-3 left-4 text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">{8 + i}:00</span>
                                        </div>
                                    ))}

                                    {weekDays.map((d, i) => (
                                        <div key={i} className={`border-r border-slate-50 last:border-0 relative h-full ${d.isToday ? 'bg-primary/[0.01]' : ''}`}>
                                            {getEventsForDay(d.fullDate).map((event) => (
                                                <motion.div
                                                    key={event._id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    onClick={() => router.push('/admin/interviews')}
                                                    className="absolute inset-x-3 p-4 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 group cursor-pointer transition-all hover:scale-[1.02] hover:border-primary active:scale-[0.98] overflow-hidden"
                                                    style={{ top: `${calculateTop(event.scheduledAt)}px`, height: '70px' }}
                                                >
                                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                                    <div className="flex flex-col justify-between h-full pl-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[9px] font-bold text-primary uppercase tracking-widest leading-none">
                                                                {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
                                                        </div>
                                                        <div className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-tight mt-1">{event.candidateId?.name}</div>
                                                        <div className="text-[8px] font-bold text-slate-400 truncate uppercase mt-1 italic pl-3 relative">
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-slate-200" />
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
            <aside className="w-full xl:w-[400px] space-y-8 xl:h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar shrink-0">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Activity className="size-32 text-slate-900" />
                    </div>

                    <div className="flex items-center justify-between mb-10 relative z-10 transition-transform group-hover:translate-x-1">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Today's Schedule</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 italic">Real-time session status</p>
                        </div>
                        <span className="px-4 py-1.5 bg-slate-900 text-white text-[9px] font-bold uppercase tracking-[0.2em] rounded-full shadow-xl shadow-slate-950/10">
                            {todaysInterviews.length} SESSIONS
                        </span>
                    </div>

                    <div className="space-y-10 relative z-10">
                        {todaysInterviews.length > 0 ? todaysInterviews.map((event) => (
                            <div key={event._id} className="group/item cursor-pointer">
                                <div className="flex items-start gap-5">
                                    <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:border-primary transition-all shadow-sm">
                                        <Clock className="size-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover/item:text-primary transition-colors">
                                            {event.candidateId?.name}
                                        </h4>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="size-1.5 rounded-full bg-slate-200" />
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                Interviewer: {event.interviewerId?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-6 mt-4">
                                            <div className="flex items-center gap-2 text-[9px] text-slate-900 font-bold uppercase tracking-widest transition-transform group-hover/item:translate-x-1">
                                                <Clock className="size-3.5 text-primary" />
                                                {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.meetLink && (
                                                <a href={event.meetLink} target="_blank" className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest hover:text-primary transition-all group/link">
                                                    <Video className="size-3.5 group-hover/link:animate-pulse" />
                                                    Join Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[2rem] group-hover:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-slate-200 text-5xl mb-6">event_busy</span>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">No sessions today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Interviewer Hub */}
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <Users className="size-32 text-slate-900" />
                    </div>
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 italic">Interviewer Directory</h3>
                    <div className="space-y-6 relative z-10">
                        {interviewers.slice(0, 5).map((member) => (
                            <div key={member._id} className="flex items-center justify-between group/row">
                                <div className="flex items-center gap-4">
                                    <div className="size-11 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group-hover/row:border-primary group-hover/row:scale-105 transition-all shadow-sm">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} className="size-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tight group-hover/row:text-primary transition-colors">{member.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Management</p>
                                    </div>
                                </div>
                                <div className={`size-2.5 rounded-full ${member.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-slate-200'} transition-all`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Card */}
                <div className="p-10 rounded-[2.5rem] bg-slate-900 border border-slate-950 relative overflow-hidden group cursor-pointer shadow-2xl shadow-slate-950/20 active:scale-[0.98] transition-transform" onClick={() => router.push('/admin/interviews')}>
                    <div className="relative z-10 space-y-6">
                        <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl">
                            <ArrowUpRight className="size-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white tracking-tight leading-tight uppercase">Full Session Logs</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                Access the complete history and management portal for all <span className="text-white font-bold">interview sessions</span> across the platform.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-5 transition-all">
                            Manage All <ChevronRight className="size-4" />
                        </div>
                    </div>
                    <CalendarIcon className="absolute -right-8 -bottom-8 text-white/[0.03] size-48 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
                </div>
            </aside>
        </div>
    );
}
