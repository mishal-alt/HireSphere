'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    User,
    CalendarDays,
    CalendarCheck,
    RefreshCw,
    TrendingUp,
    LayoutGrid
} from 'lucide-react';

interface Candidate {
    _id: string;
    name: string;
    email: string;
    role?: string;
}

interface Interview {
    _id: string;
    candidateId: Candidate;
    status: string;
    scheduledAt: string;
}

export default function CalendarPage() {
    const [view, setView] = useState('monthly');
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews/interviewer/my-interviews');
                setInterviews(response.data);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    // Get days in current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthName = now.toLocaleString('default', { month: 'long' });

    if (loading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-slate-900 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Scheduling Calendar</h1>
                    <p className="text-sm font-medium text-slate-500">Plan and coordinate your upcoming assessment sessions.</p>
                </div>

                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                    <button
                        onClick={() => setView('monthly')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'monthly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <CalendarDays className="size-3" />
                        Monthly
                    </button>
                    <button
                        onClick={() => setView('weekly')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'weekly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <LayoutGrid className="size-3" />
                        Weekly
                    </button>
                </div>
            </div>

            {/* Main Calendar Content */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Calendar Grid */}
                <div className="flex-1 overflow-hidden">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[850px] overflow-hidden">
                        {/* Grid Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-6">
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{monthName} {currentYear}</h3>
                                <button className="text-[10px] font-bold text-slate-900 px-4 py-1.5 bg-slate-50 rounded-lg uppercase tracking-widest border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">
                                    Today
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="size-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all bg-white shadow-sm">
                                    <ChevronLeft className="size-4" />
                                </button>
                                <button className="size-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all bg-white shadow-sm">
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar bg-white">
                            {/* Days Tags */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center border-b border-r border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none flex items-center justify-center h-10">
                                    {day}
                                </div>
                            ))}

                            {/* Empty cells for start of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[140px] p-4 border-b border-r border-slate-50 bg-slate-50/10"></div>
                            ))}

                            {/* Actual days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const dayNum = i + 1;
                                const isToday = dayNum === now.getDate();

                                // Find interviews for this day
                                const dayInterviews = interviews.filter((interview) => {
                                    const d = new Date(interview.scheduledAt);
                                    return d.getDate() === dayNum && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                                });

                                return (
                                    <div key={dayNum} className={`min-h-[140px] p-4 border-b border-r border-slate-50 transition-all relative group hover:bg-slate-50/30 overflow-hidden`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`size-7 flex items-center justify-center rounded-lg text-xs font-bold leading-none ${isToday ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 group-hover:text-slate-900'
                                                }`}>
                                                {dayNum}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1 pb-1">
                                            {dayInterviews.map((row, idx) => (
                                                <motion.div
                                                    key={row._id}
                                                    initial={{ opacity: 0, y: 3 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`text-[9px] p-2 rounded-lg font-bold uppercase tracking-widest truncate cursor-pointer transition-all border shadow-sm ${row.status === 'Ongoing'
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-900'
                                                        }`}
                                                    title={`${row.candidateId?.name} - ${new Date(row.scheduledAt).toLocaleTimeString()}`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className={`size-2.5 ${row.status === 'Ongoing' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                        <span className="truncate">{row.candidateId?.name}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full xl:w-80 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-8">
                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Schedule Analytics</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Intelligence Overview</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-slate-900 hover:shadow-md transition-all">
                                <div className="size-10 rounded-lg bg-white text-slate-900 flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                                    <CalendarCheck className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-slate-900 leading-none">{interviews.length}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 leading-none">Registered Assessments</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-slate-950 text-white relative overflow-hidden group shadow-xl shadow-slate-950/20">
                                <div className="relative z-10 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="size-3 text-emerald-400" />
                                        <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Weekly Projection</p>
                                    </div>
                                    <p className="text-[11px] font-medium leading-relaxed text-slate-300">
                                        You have <span className="text-white font-bold">{interviews.filter(i => new Date(i.scheduledAt) > new Date()).length}</span> upcoming sessions this queue cycle. Prepare documentation early.
                                    </p>
                                    <button className="w-full h-10 bg-white text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm">
                                        View Prep Guide
                                    </button>
                                </div>
                                <RefreshCw className="absolute -right-4 -bottom-4 text-white/[0.03] size-24 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                            </div>

                            <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center space-y-3 group hover:bg-slate-50 transition-all">
                                <div className="size-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 mx-auto transition-colors group-hover:text-slate-900 group-hover:border-slate-300">
                                    <RefreshCw className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold text-slate-900 uppercase tracking-widest leading-none">Cloud Synchronized</p>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-none">Last verified: 1m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
