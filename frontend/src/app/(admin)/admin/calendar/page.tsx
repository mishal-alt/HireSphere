'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminInterviewStore } from '@/store/useAdminInterviewStore';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
    const { interviews, loading, fetchInterviews } = useAdminInterviewStore();
    const { interviewers, fetchInterviewers } = useAdminInterviewerStore();
    const router = useRouter();
    const [currentTime, setCurrentTime] = useState(new Date());

    const [view, setView] = useState<'month' | 'week'>('month');

    useEffect(() => {
        fetchInterviews();
        fetchInterviewers();

        // Update current time every minute to keep "isToday" and "Pulse" fresh
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Calculate Month Days (5 weeks grid)
    const monthDays = useMemo(() => {
        const start = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday start
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

    // Calculate Week Days
    const weekDays = useMemo(() => {
        const start = new Date(currentTime);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday start
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

    // Format events for the calendar view
    const getEventsForDay = (date: Date) => {
        return interviews.filter(interview => {
            const interviewDate = new Date(interview.scheduledAt);
            return interviewDate.toDateString() === date.toDateString();
        });
    };

    // Calculate top position for week view based on time (start at 8:00 AM)
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
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="flex h-full gap-8 pb-10">
            {/* Main Calendar Stage */}
            <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-4xl font-display font-black text-white italic tracking-tight uppercase">
                            {view} <span className="text-primary italic">Orchestra.</span>
                        </h1>
                        <p className="text-[10px] text-slate-500 font-display font-black uppercase tracking-[0.3em] mt-2">
                            {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })} Protocol
                        </p>
                    </div>
                    <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/5">
                        {['month', 'week'].map((v) => (
                            <button 
                                key={v} 
                                onClick={() => setView(v as 'month' | 'week')}
                                className={`px-6 py-2 rounded-xl text-[10px] font-display font-black uppercase tracking-widest transition-all ${view === v ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Calendar Plane */}
                <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden bg-[#030303] flex flex-col h-[750px]">
                    {view === 'month' ? (
                        <div className="flex-1 flex flex-col">
                            {/* Month Header Days */}
                            <div className="grid grid-cols-7 border-b border-white/5">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                    <div key={d} className="p-4 text-center border-r border-white/5 last:border-0">
                                        <span className="text-[10px] font-display font-black uppercase tracking-widest text-slate-600">{d}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Month Grid */}
                            <div className="flex-1 grid grid-cols-7">
                                {monthDays.map((d, i) => {
                                    const dayEvents = getEventsForDay(d.fullDate);
                                    return (
                                        <div key={i} className={`border-r border-b border-white/5 last:border-r-0 relative p-3 transition-colors ${d.isToday ? 'bg-primary/[0.03]' : ''} ${!d.isCurrentMonth ? 'opacity-20' : ''}`}>
                                            <span className={`text-xl font-display font-black ${d.isToday ? 'text-primary' : 'text-slate-700'}`}>{d.date}</span>
                                            <div className="mt-2 space-y-1">
                                                {dayEvents.slice(0, 3).map(event => (
                                                    <div 
                                                        key={event._id}
                                                        onClick={() => router.push('/admin/interviews')}
                                                        className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[7px] font-bold text-slate-400 truncate cursor-pointer hover:bg-primary/20 hover:text-white transition-all uppercase tracking-tighter"
                                                    >
                                                        {new Date(event.scheduledAt).getHours()}:00 • {event.candidateId?.name.split(' ')[0]}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 3 && (
                                                    <div className="text-[6px] font-black text-primary uppercase ml-1">+{dayEvents.length - 3} More</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            <div className="grid grid-cols-7 border-b border-white/5">
                                {weekDays.map((d, i) => (
                                    <div key={i} className={`p-8 text-center border-r border-white/5 last:border-0 ${d.isToday ? 'bg-primary/5' : ''}`}>
                                        <span className="block text-[10px] font-display font-black uppercase tracking-[0.3em] text-slate-500 mb-2">{d.day}</span>
                                        <span className={`text-4xl font-display font-black ${d.isToday ? 'text-primary' : 'text-slate-700'}`}>{d.date}</span>
                                        {d.isToday && <div className="h-1 w-8 bg-primary mx-auto mt-2 rounded-full" />}
                                    </div>
                                ))}
                            </div>

                            <div className="flex-1 relative overflow-y-auto bg-white/[0.01] custom-scrollbar">
                                <div className="grid grid-cols-7 h-[960px] relative">
                                    {Array.from({ length: 13 }).map((_, i) => (
                                        <div key={i} className="absolute w-full border-t border-white/[0.02]" style={{ top: `${i * 80}px` }}>
                                            <span className="absolute -top-3 left-2 text-[8px] font-bold text-slate-700 uppercase">{8 + i}:00</span>
                                        </div>
                                    ))}

                                    {weekDays.map((d, i) => (
                                        <div key={i} className={`border-r border-white/5 last:border-0 relative h-full ${d.isToday ? 'bg-primary/[0.02]' : ''}`}>
                                            {getEventsForDay(d.fullDate).map((event) => (
                                                <motion.div
                                                    key={event._id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    onClick={() => router.push('/admin/interviews')}
                                                    className={`absolute inset-x-2 p-3 rounded-2xl border-l-4 shadow-2xl group cursor-pointer transition-all hover:scale-[1.02] active:scale-95 bg-primary/10 border-primary/50 overflow-hidden`}
                                                    style={{ top: `${calculateTop(event.scheduledAt)}px`, height: '70px' }}
                                                >
                                                    <div className="text-[8px] font-display font-black text-white/40 uppercase tracking-widest">
                                                        {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] font-display font-black text-white truncate mt-1 leading-tight">{event.candidateId?.name}</div>
                                                    <div className="text-[8px] font-bold text-slate-500 truncate uppercase mt-0.5 tracking-tighter">w/ {event.interviewerId?.name}</div>

                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="material-symbols-outlined text-[10px] text-white">more_horiz</span>
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

            {/* Sidebar Observer */}
            <aside className="w-96 space-y-8 h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-[#050505] shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-lg font-display font-black text-white italic uppercase tracking-tight">Today's Pulse</h3>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[8px] font-display font-black uppercase tracking-widest rounded-full border border-primary/20">
                            {todaysInterviews.length} EVENTS
                        </span>
                    </div>

                    <div className="space-y-10">
                        {todaysInterviews.length > 0 ? todaysInterviews.map((event) => (
                            <div key={event._id} className="group cursor-pointer">
                                <div className="flex items-start gap-5">
                                    <div className={`size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform`}>
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-display font-black text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                                            {event.candidateId?.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-display font-black uppercase tracking-widest mt-1">
                                            Interviewer: {event.interviewerId?.name}
                                        </p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex items-center gap-1.5 text-[8px] text-slate-600 font-display font-black uppercase">
                                                <span className="material-symbols-outlined text-[14px]">history</span>
                                                {new Date(event.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            {event.meetLink && (
                                                <a href={event.meetLink} target="_blank" className="flex items-center gap-1.5 text-[8px] text-primary font-display font-black uppercase hover:underline">
                                                    <span className="material-symbols-outlined text-[14px]">videocam</span>
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl">
                                <span className="material-symbols-outlined text-slate-700 text-4xl mb-4">event_busy</span>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No signals detected today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Team Status HUD */}
                <div className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-[#050505]">
                    <h3 className="text-[10px] font-display font-black text-slate-600 uppercase tracking-[0.3em] mb-8">Node Availability</h3>
                    <div className="space-y-6">
                        {interviewers.slice(0, 5).map((member) => (
                            <div key={member._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-xl overflow-hidden border border-white/5 bg-[#121212]">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-display font-black text-white uppercase tracking-tight italic opacity-80">{member.name}</span>
                                        <span className="text-[7px] text-slate-600 font-bold uppercase">{member.department || 'GENERAL'}</span>
                                    </div>
                                </div>
                                <div className={`size-1.5 rounded-full ${member.isActive ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-white/5 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/admin/interviews')}>
                    <div className="relative z-10 leading-tight">
                        <p className="text-xs font-display font-black text-white uppercase tracking-widest">Global Protocol</p>
                        <p className="text-[8px] text-slate-500 font-display font-black uppercase tracking-widest mt-2 max-w-[150px]">Manage all session records and active pipelines</p>
                        <button className="h-12 w-full mt-6 bg-white text-black text-[9px] font-display font-black uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all">Manage Interviews</button>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform text-white">
                        <span className="material-symbols-outlined text-8xl">clinical_notes</span>
                    </div>
                </div>
            </aside>
        </div>
    );
}
