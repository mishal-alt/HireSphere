'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterviewStore } from '@/store/useInterviewStore';

export default function InterviewerDashboard() {
    const { user } = useAuthStore();
    const { interviews, fetchInterviewerInterviews, loading } = useInterviewStore();
    const router = useRouter();

    useEffect(() => {
        if (user?._id) {
            fetchInterviewerInterviews(user._id);
        }
    }, [user, fetchInterviewerInterviews]);

    const handleNavigate = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        router.push(`/interviewer/candidates/${id}`);
    };

    const stats = [
        { label: 'Upcoming', value: interviews.filter(i => i.status === 'Scheduled').length, icon: 'calendar_today', color: 'text-primary' },
        { label: 'Completed', value: interviews.filter(i => i.status === 'Completed').length, icon: 'check_circle', color: 'text-emerald-500' },
        { label: 'Active Jobs', value: '12', icon: 'work', color: 'text-accent' },
        { label: 'Rating', value: '4.8', icon: 'star', color: 'text-amber-500' },
    ];

    return (
        <div className="space-y-10 pb-20">
            {/* Header section with Welcome text */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">
                        Hello, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">
                        Here is an overview of your interviews and candidates.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">System Active</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-[#080808] border border-white/5 shadow-2xl group hover:border-primary/20 transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} border border-white/5`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Actual</span>
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{stat.value}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Recent Candidates list */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.4em] italic">Your Interviews_</h2>
                        <Link href="/interviewer/interviews" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                            View All Interviews
                        </Link>
                    </div>

                    <div className="bg-[#080808] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Role</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Schedule</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {interviews.length > 0 ? (
                                        interviews.slice(0, 5).map((interview: any) => (
                                            <motion.tr
                                                key={interview._id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                                                onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                                            className="size-10 rounded-xl border border-white/10"
                                                            alt=""
                                                        />
                                                        <div>
                                                            <p className="text-sm font-black text-white uppercase italic">{interview.candidateId?.name || 'Unknown'}</p>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{interview.candidateId?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{interview.title || 'Developer'}</span>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                                        {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={(e) => handleNavigate(e, interview.candidateId?._id)}
                                                        className="h-10 px-6 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white uppercase tracking-widest group-hover:bg-primary group-hover:border-primary transition-all"
                                                    >
                                                        View Profile
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No interviews found</p>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance sidebar section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="p-8 rounded-[2.5rem] bg-[#080808] border border-white/5 shadow-2xl space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Daily Progress_</h2>
                            <span className="material-symbols-outlined text-slate-600">more_horiz</span>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-6 items-center">
                                <div className="size-20 rounded-full border-4 border-primary border-t-transparent animate-spin-slow flex items-center justify-center">
                                    <span className="text-xl font-black text-white">85%</span>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Hiring Progress</p>
                                    <p className="text-xs font-bold text-white mt-1">Excellent Performance</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <ActivityItem label="Assignments Checked" count="24" percent="80%" />
                                <ActivityItem label="Feedback Sent" count="18" percent="65%" />
                                <ActivityItem label="Final Reviews" count="06" percent="30%" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-primary group relative overflow-hidden cursor-pointer shadow-2xl">
                        <div className="relative z-10 space-y-4">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">New Candidate Trace_</h3>
                            <p className="text-[9px] text-white/70 font-bold uppercase tracking-widest leading-relaxed">
                                You have 4 new student applications pending initial review.
                            </p>
                            <button className="h-10 px-6 rounded-xl bg-white text-primary text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                Review Now
                            </button>
                        </div>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/10 text-9xl rotate-12 group-hover:rotate-0 transition-transform duration-500">person_search</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActivityItem({ label, count, percent }: { label: string; count: string; percent: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-black text-white">{count}</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: percent }}
                    className="h-full bg-slate-400"
                />
            </div>
        </div>
    );
}
