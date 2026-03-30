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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
        { label: 'Upcoming', value: qStats?.upcoming || 0, icon: Calendar, color: 'text-gray-900', bg: 'bg-gray-100', border: 'border-primary/10' },
        { label: 'Completed', value: qStats?.completed || 0, icon: CheckCircle2, color: 'text-gray-900', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-gray-900', bg: 'bg-gray-50', border: 'border-gray-200/40' },
        { label: 'My Rating', value: qStats?.avgScore?.toFixed(1) || '0.0', icon: Star, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    ];

    return (
        <div className="space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Hello, {user?.name?.split(' ')[0]}
                    </h1>
                    <p className="text-sm font-medium text-gray-500">Your recruitment overview and upcoming interview sessions.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-5 py-2 rounded-full bg-emerald-800 text-white flex items-center gap-2.5 shadow-none transition-transform hover:scale-[1.02]">
                        <Activity className="size-3.5 animate-pulse text-gray-900" />
                        <span className="text-[10px] font-medium uppercase tracking-widest">Dashboard Live</span>
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
                        className="bg-white border border-gray-200/50 rounded-xl p-6  group relative items-center flex flex-col items-start gap-6 hover:bg-gray-100 transition-colors"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-500">
                            <stat.icon className="size-16" />
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border ${stat.border} group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all duration-300 shadow-none`}>
                                <stat.icon className="size-6" />
                            </div>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">{stat.value}</h3>
                        <p className="text-xs text-gray-500 font-medium leading-none">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-gray-900 flex items-center justify-center text-gray-900 shadow-none">
                                <Calendar className="size-4" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Upcoming Schedule</h2>
                        </div>
                        <Link href="/interviewer/interviews" className="text-[10px] font-medium text-gray-400 hover:text-gray-900 uppercase tracking-widest flex items-center gap-2 transition-colors group">
                            Full Calendar <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex flex-col pt-4 overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table >
                                <TableHeader className="border-b border-gray-200/50">
                                    <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                        <TableHead className="px-8 py-5 text-xs text-gray-500 font-medium">Candidate</TableHead>
                                        <TableHead className="px-8 py-5 text-xs text-gray-500 font-medium">Position</TableHead>
                                        <TableHead className="px-8 py-5 text-xs text-gray-500 font-medium text-center">Schedule</TableHead>
                                        <TableHead className="px-8 py-5 text-xs text-gray-500 font-medium text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-200/60">
                                    <AnimatePresence mode="popLayout">
                                        {interviews.length > 0 ? (
                                            interviews.slice(0, 5).map((interview: any) => (
                                                <motion.tr
                                                    key={interview._id}
                                                    layout
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-gray-50 transition-all cursor-pointer"
                                                    onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                                >
                                                    <TableCell className="px-8 py-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="relative">
                                                                <img
                                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                                                    className="size-12 rounded-2xl bg-white shadow-none transition-transform group-hover:scale-105"
                                                                    alt=""
                                                                />
                                                                <div className="absolute -bottom-1 -right-1 size-3 bg-emerald-500 border border-white rounded-full shadow-none"></div>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-900 truncate transition-colors font-display">{interview.candidateId?.name || 'Unknown'}</p>
                                                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest truncate mt-1">{interview.candidateId?.email}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6">
                                                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest px-3 py-1.5 bg-gray-50 rounded-lg shadow-none">
                                                            {interview.title || 'Developer'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-[11px] font-medium text-gray-900 uppercase tracking-tight">
                                                                {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-[9px] font-medium text-gray-400 uppercase mt-1 tracking-widest">
                                                                {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-8 py-6 text-right">
                                                        <Button
                                                            onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                                            className="h-9 px-5 rounded-xl bg-emerald-800 text-[10px] font-medium text-white uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-none border-none"
                                                        >
                                                            Review
                                                        </Button>
                                                    </TableCell>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                                <TableCell colSpan={4} className="px-8 py-20 text-center">
                                                    <div className="size-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-2 text-slate-200 shadow-none">
                                                        <Inbox className="size-8" />
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-medium">No scheduled interviews</p>
                                                    <p className="text-xs font-medium text-slate-300 mt-2">Your interview pipeline is clear.</p>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Efficiency Sidebar */}
                <div className="lg:col-span-4 space-y-12">
                    <div className="bg-white border border-gray-200/50 rounded-xl p-6  flex flex-col relative overflow-hidden group space-y-12">
                        <div className="flex justify-between items-center">
                            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="size-4 text-gray-900" />
                                Efficiency Metrics
                            </h2>
                            <MoreHorizontal className="size-5 text-slate-300 hover:text-gray-900 cursor-pointer transition-colors" />
                        </div>

                        <div className="space-y-12">
                            <div className="flex gap-6 items-center bg-gray-50 p-6 rounded-3xl border border-gray-100 group-hover:border-primary/20 transition-all">
                                <div className="relative size-20">
                                    <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                        <circle className="text-slate-200" cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <motion.circle
                                            initial={{ strokeDasharray: '0 100' }}
                                            animate={{ strokeDasharray: '85 100' }}
                                            transition={{ duration: 1.5 }}
                                            className="text-gray-900"
                                            cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-semibold text-gray-900 tracking-tight">85%</span>
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 font-medium">Workplace Index</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1 uppercase tracking-tight truncate">Peak Potential</p>
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
                        className="p-6 rounded-2xl bg-gray-900 group relative overflow-hidden cursor-pointer"
                        onClick={() => router.push('/interviewer/candidates')}
                    >
                        <div className="relative z-10 space-y-6">
                            <div className="size-14 rounded-2xl bg-gray-100 border border-white/10 flex items-center justify-center text-gray-900 shadow-none">
                                <Users className="size-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900 tracking-tight leading-tight">Candidate Profiles</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    Review and manage your <span className="text-gray-900 font-medium">assigned candidates</span> and evaluation history.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-medium text-gray-900 uppercase tracking-widest group-hover:gap-5 transition-all">
                                Access Directory <ChevronRight className="size-4" />
                            </div>
                        </div>
                        <Activity className="absolute -right-8 -bottom-8 text-gray-900/[0.03] size-48 rotate-12 group-hover:rotate-0 transition-transform duration-1000 pointer-events-none" />
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
                <span className="text-xs text-gray-500 font-medium group-hover/item:text-gray-900 transition-colors">{label}</span>
                <span className="text-sm font-medium text-gray-900">{count}</span>
            </div>
            <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: percent }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gray-900 rounded-full"
                />
            </div>
        </div>
    );
}
