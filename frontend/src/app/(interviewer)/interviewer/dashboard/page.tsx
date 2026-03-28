'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterviewerInterviews, useInterviewerStats } from '@/hooks/useInterviews';
import {
    Calendar,
    CheckCircle2,
    Briefcase,
    Star,
    ChevronRight,
    Search,
    Clock,
    MoreHorizontal,
    TrendingUp,
    Inbox,
    ExternalLink,
    Activity,
    Users,
    ArrowUpRight,
    Shield
} from 'lucide-react';

export default function InterviewerDashboard() {
    const { user } = useAuthStore();
    const { data: interviews = [], isLoading } = useInterviewerInterviews();
    const { data: qStats } = useInterviewerStats();
    const router = useRouter();

    const handleNavigate = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        router.push(`/interviewer/candidates/${id}`);
    };

    const stats = [
        { label: 'Upcoming', value: qStats?.upcoming || 0, icon: Calendar, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
        { label: 'Completed', value: qStats?.completed || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'My Rating', value: qStats?.avgScore?.toFixed(1) || '0.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Hello, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-sm font-medium text-slate-500">Your recruitment overview and upcoming interview sessions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2 rounded-full bg-slate-900 text-white flex items-center gap-2.5 shadow-xl shadow-slate-950/10 transition-transform hover:scale-[1.02]">
                        <Activity className="size-3.5 animate-pulse text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard Live</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
                            <stat.icon className="size-16" />
                        </div>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-sm`}>
                                <stat.icon className="size-6" />
                            </div>
                        </div>
                        <h3 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                <Calendar className="size-4" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upcoming Schedule</h2>
                        </div>
                        <Link href="/interviewer/interviews" className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest flex items-center gap-2 transition-colors group">
                            Full Calendar <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Position</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Schedule</th>
                                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <AnimatePresence mode="popLayout">
                                        {interviews.length > 0 ? (
                                            interviews.slice(0, 5).map((interview: any) => (
                                                <motion.tr
                                                    key={interview._id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                                                    onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                                >
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <img
                                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                                                    className="size-12 rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform group-hover:scale-105"
                                                                    alt=""
                                                                />
                                                                <div className="absolute -bottom-1 -right-1 size-3 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-bold text-slate-900 group-hover:text-primary truncate transition-colors font-display">{interview.candidateId?.name || 'Unknown'}</p>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate mt-1">{interview.candidateId?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
                                                            {interview.title || 'Developer'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">
                                                                {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest">
                                                                {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <button
                                                            onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                                            className="h-9 px-5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold text-slate-600 uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                                                        >
                                                            Review
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-20 text-center">
                                                    <div className="size-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
                                                        <Inbox className="size-8" />
                                                    </div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No scheduled interviews</p>
                                                    <p className="text-xs font-medium text-slate-300 mt-2">Your interview pipeline is clear.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Efficiency Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-10 group">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="size-4 text-primary" />
                                Efficiency Metrics
                            </h2>
                            <MoreHorizontal className="size-5 text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
                        </div>

                        <div className="space-y-10">
                            <div className="flex gap-6 items-center bg-slate-50 p-6 rounded-3xl border border-slate-100 group-hover:border-primary/20 transition-all">
                                <div className="relative size-20">
                                    <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle className="text-slate-200" cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <motion.circle
                                            initial={{ strokeDasharray: '0 100' }}
                                            animate={{ strokeDasharray: '85 100' }}
                                            transition={{ duration: 1.5 }}
                                            className="text-primary"
                                            cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-bold text-slate-900 tracking-tight">85%</span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workplace Index</p>
                                    <p className="text-sm font-bold text-slate-900 mt-1 uppercase tracking-tight truncate">Peak Potential</p>
                                </div>
                            </div>

                            <div className="space-y-6 pt-2">
                                <ActivityItem label="Verification Rating" count="24" percent="80%" />
                                <ActivityItem label="Feedback Sentiment" count="18" percent="65%" />
                                <ActivityItem label="Acceptance Ratio" count="06" percent="30%" />
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-[2.5rem] bg-slate-900 group relative overflow-hidden cursor-pointer shadow-2xl shadow-slate-950/20"
                        onClick={() => router.push('/interviewer/candidates')}
                    >
                        <div className="relative z-10 space-y-6">
                            <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-xl">
                                <Users className="size-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-tight leading-tight">Candidate Profiles</h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                    Review and manage your <span className="text-white font-bold">assigned candidates</span> and evaluation history.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-widest group-hover:gap-5 transition-all">
                                Access Directory <ChevronRight className="size-4" />
                            </div>
                        </div>
                        <Activity className="absolute -right-8 -bottom-8 text-white/[0.03] size-48 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ label, count, percent }: { label: string; count: string; percent: string }) {
    return (
        <div className="space-y-3 group/item">
            <div className="flex justify-between items-end px-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/item:text-primary transition-colors">{label}</span>
                <span className="text-sm font-bold text-slate-900">{count}</span>
            </div>
            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: percent }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-slate-900 rounded-full"
                />
            </div>
        </div>
    );
}
