'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDashboardData, useCancelInterview, useRescheduleInterview } from '@/hooks/useDashboard';
import Portal from '@/components/Portal';
import {
    Users,
    Calendar,
    Briefcase,
    Handshake,
    TrendingUp,
    TrendingDown,
    MoreHorizontal,
    Eye,
    Clock,
    X,
    Check,
    ChevronRight,
    SearchX,
    Inbox,
    BarChart3,
    Shield,
    CalendarDays,
    Activity,
    Users2,
    ArrowUpRight
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, trend, trendUp, idx }: { icon: any; label: string; value: string; trend: string; trendUp: boolean; idx: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        if (start === end) {
            setCount(end);
            return;
        }
        let totalDuration = 1000;
        let timer = setInterval(() => {
            start += Math.ceil(end / 20);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 transition-all group relative shadow-sm hover:border-primary/50 hover:shadow-premium"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="size-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <Icon className="size-5" />
                </div>
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {trend}
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {value.includes('%') ? `${count}%` : count.toLocaleString()}
                </h3>
            </div>
        </motion.div>
    );
}

function InterviewRow({ id, candidateId, name, time, status, statusColor, img }: any) {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [showReschedule, setShowReschedule] = useState(false);
    const [newDate, setNewDate] = useState('');
    const router = useRouter();
    const toggleMenu = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX - 160
            });
        }
        setShowMenu(!showMenu);
    };

    const cancelMutation = useCancelInterview();
    const rescheduleMutation = useRescheduleInterview();

    const handleCancel = async () => {
        if (window.confirm(`Are you sure you want to cancel the interview for ${name}?`)) {
            try {
                await cancelMutation.mutateAsync(id);
                setShowMenu(false);
            } catch (error) {}
        }
    };

    const handleReschedule = async () => {
        if (!newDate) return;
        try {
            await rescheduleMutation.mutateAsync({ id, newDate });
            setShowReschedule(false);
            setShowMenu(false);
        } catch (error) {}
    };

    return (
        <tr className="hover:bg-slate-50 transition-all group">
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg overflow-hidden border border-slate-100 bg-white shadow-sm transition-transform group-hover:scale-105">
                        <img src={img} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-slate-900 block leading-tight">{name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {id?.slice(-6).toUpperCase()}</span>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5 text-center">
                <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-bold tracking-tight border ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="px-8 py-5">
                <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-900">{time.split(',')[0]}</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">{time.split(',')[1]}</span>
                </div>
            </td>
            <td className="px-8 py-5 text-right pr-8 relative">
                <button
                    ref={buttonRef}
                    onClick={toggleMenu}
                    className="size-9 rounded-lg border border-slate-200 hover:border-primary/30 bg-white text-slate-400 hover:text-primary transition-all flex items-center justify-center shadow-sm ml-auto"
                >
                    <MoreHorizontal className="size-4" />
                </button>

                <AnimatePresence>
                    {showMenu && (
                        <Portal>
                            <div className="fixed inset-0 z-[110]" onClick={() => setShowMenu(false)} />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: -5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                                style={{ 
                                    position: 'fixed',
                                    top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
                                    left: buttonRef.current ? buttonRef.current.getBoundingClientRect().right - 192 : 0,
                                }}
                                className="w-48 bg-white border border-slate-200 rounded-xl shadow-premium z-[120] py-1.5 overflow-hidden"
                            >
                                <button
                                    onClick={() => {
                                        if (candidateId) {
                                            router.push(`/admin/candidates/${candidateId}`);
                                        } else {
                                            router.push('/admin/candidates');
                                        }
                                        setShowMenu(false);
                                    }}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left"
                                >
                                    <Eye className="size-4" />
                                    Review Profile
                                </button>
                                <button
                                    onClick={() => {
                                        setShowReschedule(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left"
                                >
                                    <Calendar className="size-4" />
                                    Reschedule
                                </button>
                                <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                                <button
                                    onClick={handleCancel}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all text-left"
                                >
                                    <X className="size-4" />
                                    Cancel Session
                                </button>
                            </motion.div>
                        </Portal>
                    )}
                </AnimatePresence>

                <Portal>
                    <AnimatePresence>
                        {showReschedule && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/10 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="relative w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-premium"
                                >
                                    <div className="flex flex-col items-center text-center mb-8">
                                        <div className="size-16 bg-slate-50 rounded-2xl flex items-center justify-center text-primary mb-6 border border-slate-200 shadow-sm">
                                            <CalendarDays className="size-8" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Modify Schedule</h2>
                                        <p className="text-xs font-semibold text-slate-500 mt-2 px-6 uppercase tracking-wider">Select new interview timeline</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <input
                                                type="datetime-local"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 text-sm font-semibold focus:border-primary focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => setShowReschedule(false)}
                                                className="flex-1 h-12 rounded-xl text-xs font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                            >
                                                Discard
                                            </button>
                                            <button
                                                onClick={handleReschedule}
                                                className="flex-1 h-12 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                Update Time
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </Portal>
            </td>
        </tr>
    );
}

function ProgressItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0 px-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className="text-xs font-bold text-white tracking-tight">{value}</span>
        </div>
    );
}

function ScoreBar({ label, count, percent, color }: { label: string; count: string; percent: string; color: string }) {
    return (
        <div className="space-y-3 group/bar">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/bar:text-slate-900 transition-colors">{label}</span>
                <span className="text-xs font-black text-slate-900">{count}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: percent }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={`${color} h-full rounded-full transition-all`}
                />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { data, isLoading } = useDashboardData();
    const router = useRouter();
    const stats = data?.stats;
    const recentInterviews = data?.recentInterviews || [];

    if (isLoading && !stats) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
                    <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-2 uppercase tracking-widest">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        Last updated: Just now
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push('/admin/jobs')}
                        className="h-10 px-5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2 shadow-sm"
                    >
                        <Briefcase className="size-4" />
                        Manage Jobs
                    </button>
                    <button 
                        onClick={() => router.push('/admin/candidates')}
                        className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <Users2 className="size-4" />
                        Talent Pool
                    </button>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Pipeline" value={stats?.totalCandidates?.toString() || "0"} trend="+12.5%" trendUp={true} idx={0} />
                <StatCard icon={CalendarDays} label="Active Rounds" value={stats?.interviewsToday?.toString() || "0"} trend="+3" trendUp={true} idx={1} />
                <StatCard icon={Handshake} label="Panel Members" value={stats?.totalInterviewers?.toString() || "0"} trend="+2" trendUp={true} idx={2} />
                <StatCard icon={Briefcase} label="Job Openings" value={stats?.totalJobs?.toString() || "0"} trend="Active" trendUp={true} idx={3} />
            </div>

            {/* Content Mid Section */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                <div className="xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/10">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Rounds</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Latest candidate sessions</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/interviews')}
                            className="h-9 px-4 rounded-lg bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all border border-slate-200 shadow-sm flex items-center gap-2"
                        >
                            History <ChevronRight className="size-3" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Participant</th>
                                    <th className="px-8 py-4 text-center">Status</th>
                                    <th className="px-8 py-4">Phase</th>
                                    <th className="px-8 py-4 text-right pr-8">Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentInterviews.length > 0 ? (
                                    recentInterviews.map((interview: any) => (
                                        <InterviewRow
                                            key={interview._id}
                                            id={interview._id}
                                            candidateId={interview.candidateId?._id}
                                            name={interview.candidateId?.name || "Unknown"}
                                            time={new Date(interview.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            status={interview.status}
                                            statusColor={interview.status === 'Scheduled' ? 'text-primary bg-primary-light border-primary/10' : interview.status === 'Cancelled' ? 'text-rose-600 bg-rose-50 border-rose-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}
                                            img={interview.candidateId?.profileImage ? (interview.candidateId.profileImage.startsWith('http') ? interview.candidateId.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${interview.candidateId.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <Inbox className="size-12 text-slate-100 mb-4" />
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No activity log</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 rounded-2xl p-8 flex flex-col shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.05] text-white">
                            <Activity className="size-32" />
                        </div>
                        <div className="flex justify-between items-start mb-10 relative z-10">
                            <div>
                                <h2 className="text-xs font-bold text-white uppercase tracking-widest">Global Success Rate</h2>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Platform Metrics</p>
                            </div>
                            <ArrowUpRight className="size-5 text-emerald-400" />
                        </div>

                        <div className="relative size-36 mx-auto mb-10 flex items-center justify-center">
                            <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="4"></circle>
                                <motion.circle
                                    initial={{ strokeDasharray: '0, 100' }}
                                    whileInView={{ strokeDasharray: '75, 100' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="stroke-primary"
                                    cx="18" cy="18" fill="none" r="16" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="4"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white leading-none">75%</span>
                                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mt-2">Conversion</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-800 relative z-10">
                            <ProgressItem label="Funnel Velocity" value="84%" />
                            <ProgressItem label="Offer Acceptance" value="92%" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                                <Shield className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Security Core</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Monitoring active</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Health</span>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></div>
                                    <span className="text-[11px] font-bold text-slate-800 uppercase">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Talent Distribution</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Department analytics</p>
                        </div>
                        <Activity className="size-5 text-slate-200 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="space-y-8">
                        <ScoreBar label="Engineering" count="456" percent="65%" color="bg-primary" />
                        <ScoreBar label="Product Design" count="142" percent="40%" color="bg-slate-800" />
                        <ScoreBar label="Sales Ops" count="289" percent="85%" color="bg-slate-300" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden flex flex-col group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Growth Trend</h2>
                            <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                                <ArrowUpRight className="size-3" />
                                +14% Expansion
                            </p>
                        </div>
                        <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            Last Quarter
                        </div>
                    </div>
                    <div className="flex-1 min-h-[160px] relative z-10">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,160 Q40,120 80,140 T160,60 T240,90 T320,40 T400,70 V200 H0 Z" fill="url(#chartGradient)"></path>
                            <motion.path
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M0,160 Q40,120 80,140 T160,60 T240,90 T320,40 T400,70"
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
