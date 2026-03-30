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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
        <div className="space-y-12 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Scheduling Calendar</h1>
                    <p className="text-sm font-medium text-gray-500">Plan and coordinate your upcoming assessment sessions.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-none">
                    <Button variant="ghost"
                        onClick={() => setView('monthly')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'monthly' ? 'bg-emerald-800 text-white shadow-none' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <CalendarDays className="size-3" />
                        Monthly
                    </Button>
                    <Button variant="ghost"
                        onClick={() => setView('weekly')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-medium uppercase tracking-widest transition-all flex items-center gap-2 ${view === 'weekly' ? 'bg-emerald-800 text-white shadow-none' : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <LayoutGrid className="size-3" />
                        Weekly
                    </Button>
                </div>
            </div>

            {/* Main Calendar Content */}
            <div className="flex flex-col xl:flex-row gap-6">
                {/* Calendar Grid */}
                <div className="flex-1 overflow-hidden">
                    <div className="bg-white rounded-xl shadow-none flex flex-col h-[850px] overflow-hidden">
                        {/* Grid Header */}
                        <div className="p-6 border-b border-gray-200/50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-6">
                                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{monthName} {currentYear}</h3>
                                <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    Today
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar bg-white">
                            {/* Days Tags */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-3 text-center border-b border-r border-gray-100 bg-gray-50 text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none flex items-center justify-center h-10">
                                    {day}
                                </div>
                            ))}

                            {/* Empty cells for start of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[140px] p-4 border-b border-r border-slate-50 bg-transparent"></div>
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
                                    <div key={dayNum} className={`min-h-[140px] p-4 border-b border-r border-slate-50 transition-all relative group hover:bg-gray-50/30 overflow-hidden`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`size-7 flex items-center justify-center rounded-lg text-xs font-medium ${dayNum === now.getDate() ? 'bg-emerald-800 text-white' : 'text-gray-900'}`}>
                                                {dayNum}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1 pb-1">
                                            {dayInterviews.map((row, idx) => (
                                                <motion.div
                                                    key={row._id}
                                                    initial={{ opacity: 0, y: 3 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`text-[9px] p-2 rounded-lg font-medium uppercase tracking-widest truncate cursor-pointer transition-all border shadow-none ${row.status === 'Ongoing'
                                                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                            : 'bg-white border-gray-200/50 text-gray-600 hover:border-slate-900'
                                                        }`}
                                                    title={`${row.candidateId?.name} - ${new Date(row.scheduledAt).toLocaleTimeString()}`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock className={`size-2.5 ${row.status === 'Ongoing' ? 'text-gray-900' : 'text-gray-400'}`} />
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
                    <div className="bg-transparent py-8 shadow-none space-y-12">
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-gray-900 uppercase tracking-widest">Schedule Analytics</h3>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-relaxed">Intelligence Overview</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-6 p-4 rounded-xl bg-gray-50 border border-gray-100 group hover:bg-white hover:border-slate-900 hover:shadow-none transition-all">
                                <div className="size-10 rounded-lg bg-white text-gray-900 flex items-center justify-center border border-gray-100 shadow-none group-hover:scale-105 transition-transform">
                                    <CalendarCheck className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-gray-900 leading-none">{interviews.length}</p>
                                    <p className="text-[9px] text-gray-500 font-medium uppercase tracking-widest mt-1.5 leading-none">Registered Assessments</p>
                                </div>
                            </div>

                            <div className="p-6 rounded-xl bg-emerald-800 text-white relative overflow-hidden group shadow-none shadow-slate-950/20">
                                <div className="relative z-10 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="size-3 text-gray-900" />
                                        <p className="text-[10px] font-medium text-white uppercase tracking-widest leading-none">Weekly Projection</p>
                                    </div>
                                    <p className="text-[11px] font-medium leading-relaxed text-slate-200">
                                        You have <span className="text-white font-medium">{interviews.filter(i => new Date(i.scheduledAt) > new Date()).length}</span> upcoming sessions this queue cycle. Prepare documentation early.
                                    </p>
                                    <Button variant="ghost" className="w-full h-10 bg-white text-gray-900 rounded-lg text-[10px] font-medium uppercase tracking-widest hover:bg-slate-200 transition-all shadow-none">
                                        View Prep Guide
                                    </Button>
                                </div>
                                <RefreshCw className="absolute -right-4 -bottom-4 text-gray-900/[0.03] size-24 rotate-12 group-hover:rotate-0 transition-all duration-1000" />
                            </div>

                            <div className="p-6 border border-dashed border-gray-200/50 rounded-xl text-center space-y-3 group hover:bg-gray-50 transition-all">
                                <div className="size-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-slate-200 mx-auto transition-colors group-hover:text-gray-900 group-hover:border-slate-300">
                                    <RefreshCw className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-medium text-gray-900 uppercase tracking-widest leading-none">Cloud Synchronized</p>
                                    <p className="text-[8px] text-gray-500 font-medium uppercase tracking-widest leading-none">Last verified: 1m ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
