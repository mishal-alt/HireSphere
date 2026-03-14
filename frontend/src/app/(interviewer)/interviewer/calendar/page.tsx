'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';

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

    return (
        <div className="space-y-10 pb-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Calendar_</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
                        View and manage your scheduled interviews.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-[#080808] border border-white/5 rounded-2xl p-1.5 shadow-2xl">
                        <button 
                            onClick={() => setView('monthly')}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'monthly' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 hover:text-white'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Calendar Content */}
            <div className="flex flex-col xl:flex-row gap-8">
                {/* Calendar Grid */}
                <div className="flex-1 overflow-hidden">
                    <div className="bg-[#080808] rounded-3xl border border-white/5 shadow-2xl flex flex-col h-[700px]">
                        {/* Grid Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">{monthName} {currentYear}_</h3>
                                <button className="text-[9px] font-black text-primary px-4 py-1.5 bg-primary/10 rounded-full uppercase tracking-widest border border-primary/20">Today</button>
                            </div>
                        </div>

                        {/* Calendar Body */}
                        <div className="flex-1 grid grid-cols-7 overflow-y-auto custom-scrollbar">
                            {/* Days Tags */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-4 text-center border-b border-r border-white/5 bg-white/[0.01] text-[9px] font-black text-slate-600 uppercase tracking-widest">{day}</div>
                            ))}

                            {/* Empty cells for start of month */}
                            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[120px] p-4 border-b border-r border-white/5 opacity-10"></div>
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
                                    <div key={dayNum} className={`min-h-[120px] p-4 border-b border-r border-white/5 transition-all text-sm font-black italic relative group hover:bg-white/[0.01]`}>
                                        <span className={`size-7 flex items-center justify-center rounded-xl text-[10px] ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30 not-italic' : 'text-slate-500'}`}>
                                            {dayNum}
                                        </span>

                                        <div className="mt-4 space-y-1">
                                            {dayInterviews.map((row, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={`text-[7px] p-1.5 rounded-lg font-black uppercase tracking-widest truncate cursor-pointer transition-all ${
                                                        row.status === 'Ongoing' 
                                                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' 
                                                        : 'bg-primary/20 border border-primary/30 text-primary'
                                                    }`}
                                                    title={`${row.candidateId?.name} - ${new Date(row.scheduledAt).toLocaleTimeString()}`}
                                                >
                                                    {new Date(row.scheduledAt).getHours()}:{new Date(row.scheduledAt).getMinutes().toString().padStart(2, '0')} - {row.candidateId?.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="w-full xl:w-80 space-y-8">
                    {/* Insights */}
                    <div className="bg-[#080808] rounded-3xl border border-white/5 p-8 shadow-2xl">
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 italic">Summary_</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{interviews.length} Scheduled</p>
                                    <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">Total interviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
