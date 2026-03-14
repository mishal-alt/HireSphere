'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '@/store/useAdminStore';

export default function DashboardPage() {
    const { stats, recentInterviews, loading, fetchDashboardData } = useAdminStore();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (loading && !stats.totalCandidates) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center">
                    HS
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Main Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard icon="groups" label="New Candidates" value={stats?.totalCandidates?.toString() || "0"} trend="+0%" trendUp={true} idx={0} />
                <StatCard icon="calendar_today" label="Interviews Today" value={stats?.interviewsToday?.toString() || "0"} trend="+0%" trendUp={true} idx={1} />
                <StatCard icon="handshake" label="Total Team" value={stats?.totalInterviewers?.toString() || "0"} trend="+0%" trendUp={true} idx={2} />
                <StatCard icon="work" label="Active Jobs" value={stats?.totalJobs?.toString() || "0"} trend="+0%" trendUp={true} idx={3} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Recent Candidates Table */}
                <div className="xl:col-span-8 bg-[#080808] rounded-2xl border border-white/5 flex flex-col shadow-2xl overflow-visible">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">List of candidates being interviewed</p>
                        </div>
                        <button className="h-10 px-6 rounded-lg bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">View All</button>
                    </div>
                    <div className="">
                        <table className="w-full text-left">
                            <thead className="text-[9px] uppercase text-slate-500 font-bold tracking-[0.2em] border-b border-white/5">
                                <tr>
                                    <th className="py-4 pl-8">Name</th>
                                    <th className="py-4">Status</th>
                                    <th className="py-4">Scheduled</th>
                                    <th className="py-4 text-right pr-8">Options</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentInterviews.length > 0 ? (
                                    recentInterviews.map((interview: any) => (
                                        <InterviewRow
                                            key={interview._id}
                                            id={interview._id}
                                            candidateId={interview.candidateId?._id}
                                            name={interview.candidateId?.name || "Unknown"}
                                            time={new Date(interview.scheduledAt).toLocaleString()}
                                            status={interview.status}
                                            statusColor={interview.status === 'Scheduled' ? 'text-accent bg-accent/10' : interview.status === 'Cancelled' ? 'text-red-500 bg-red-500/10' : 'text-primary bg-primary/10'}
                                            img={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No recent interviews</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Progress Circle (Real data mocked for now based on actual stats) */}
                <div className="xl:col-span-4 bg-[#080808] rounded-2xl border border-white/5 p-8 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-baseline mb-10">
                        <h2 className="text-sm font-bold text-white tracking-widest uppercase">Hiring Progress</h2>
                        <span className="text-xs text-primary font-bold tracking-widest">+4.2%</span>
                    </div>

                    <div className="relative size-48 mx-auto mb-10">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                            <circle className="stroke-white/5" cx="18" cy="18" fill="none" r="16" strokeWidth="2.5"></circle>
                            <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="2.5"></circle>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">75%</span>
                            <span className="text-[8px] uppercase text-slate-500 font-black tracking-widest mt-1">Average</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <ProgressItem label="First Interview" value="84%" />
                        <ProgressItem label="Technical Round" value="42%" />
                        <ProgressItem label="Final Round" value="12%" />
                    </div>
                </div>
            </div>

            {/* Bottom Area */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Candidate Scores */}
                <div className="bg-[#080808] rounded-2xl border border-white/5 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Candidate Scores</h2>
                        <span className="material-symbols-outlined text-slate-500 text-sm">info</span>
                    </div>
                    <div className="space-y-6">
                        <ScoreBar label="High Score" count="142" percent="65%" color="bg-primary" />
                        <ScoreBar label="Average Score" count="456" percent="40%" color="bg-accent" />
                        <ScoreBar label="Low Score" count="892" percent="85%" color="bg-white/10" />
                    </div>
                </div>

                {/* Activity Graph */}
                <div className="bg-[#080808] rounded-2xl border border-white/5 p-8 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Activity Chart</h2>
                            <p className="text-[10px] text-accent font-bold mt-1">Increasing activity</p>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[140px] relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 200">
                            <path d="M0,160 Q40,120 80,140 T160,60 T240,90 T320,40 T400,70" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round"></path>
                            {[0, 80, 160, 240, 320, 400].map((x, i) => (
                                <circle key={i} cx={x} cy={160 - (i % 2 === 0 ? 20 * i : 10 * i)} r="3" fill="#030303" stroke="#8B5CF6" strokeWidth="1.5"></circle>
                            ))}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, trendUp, idx }: { icon: string; label: string; value: string; trend: string; trendUp: boolean; idx: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value.replace(/[^0-9]/g, '')) || 0;
        if (start === end) {
            setCount(end);
            return;
        }

        let totalDuration = 1000;
        let incrementTime = (totalDuration / end) > 10 ? (totalDuration / end) : 10;

        let timer = setInterval(() => {
            start += Math.ceil(end / 100);
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, incrementTime);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#080808] p-8 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-8xl">{icon}</span>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-white/5 shadow-inner">
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className="material-symbols-outlined text-[10px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
                        {trend}
                    </div>
                </div>
                <h3 className="text-4xl font-bold text-white tracking-tighter mb-1 shadow-sm">
                    {value.includes('%') ? `${count}%` : count}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</p>
            </div>
        </motion.div>
    );
}

function InterviewRow({ id, candidateId, name, time, status, statusColor, img, initials }: any) {
    const [showMenu, setShowMenu] = useState(false);
    const [showReschedule, setShowReschedule] = useState(false);
    const [newDate, setNewDate] = useState('');
    const router = useRouter();
    const { cancelInterview, rescheduleInterview } = useAdminStore();

    const handleCancel = async () => {
        if (window.confirm(`Are you sure you want to cancel the interview for ${name}?`)) {
            try {
                await cancelInterview(id);
                setShowMenu(false);
            } catch (error) {
                alert("Failed to cancel interview");
            }
        }
    };

    const handleReschedule = async () => {
        if (!newDate) return alert("Please select a new date and time");
        try {
            await rescheduleInterview(id, newDate);
            setShowReschedule(false);
            setShowMenu(false);
        } catch (error) {
            alert("Failed to reschedule interview");
        }
    };

    return (
        <tr className="hover:bg-white/[0.02] transition-colors group">
            <td className="py-4 pl-8">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg overflow-hidden border border-white/10">
                        {img ? (
                            <img src={img} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#121212] flex items-center justify-center text-[10px] font-bold text-primary">{initials}</div>
                        )}
                    </div>
                    <span className="font-bold text-white text-sm tracking-tight">{name}</span>
                </div>
            </td>
            <td className="py-4">
                <span className={`inline-flex px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${statusColor}`}>
                    {status}
                </span>
            </td>
            <td className="py-4 text-xs text-slate-300 font-medium">{time}</td>
            <td className="py-4 text-right pr-8 relative">
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="material-symbols-outlined text-slate-500 hover:text-white text-lg transition-colors cursor-pointer select-none"
                >
                    more_vert
                </button>

                <AnimatePresence>
                    {showMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowMenu(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10, x: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10, x: 20 }}
                                className="absolute right-0 top-12 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 py-1 overflow-hidden pointer-events-auto"
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
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-left"
                                >
                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                    View Profile
                                </button>
                                <button 
                                    onClick={() => {
                                        setShowReschedule(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-left"
                                >
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    Reschedule
                                </button>
                                <div className="h-[1px] bg-white/5 my-1" />
                                <button 
                                    onClick={handleCancel}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest text-left"
                                >
                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                    Cancel
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Reschedule Modal */}
                <AnimatePresence>
                    {showReschedule && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowReschedule(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-md bg-[#080808] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                    <span className="material-symbols-outlined text-8xl">calendar_month</span>
                                </div>

                                <div className="relative z-10">
                                    <h2 className="text-xl font-bold text-white tracking-tight mb-2">Reschedule Interview</h2>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-8">Select a new date and time for {name}</p>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">New Date & Time</label>
                                            <input 
                                                type="datetime-local" 
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl px-4 text-white text-sm focus:border-primary/50 outline-none transition-all color-scheme-dark"
                                            />
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                onClick={() => setShowReschedule(false)}
                                                className="flex-1 h-11 rounded-xl border border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:bg-white/5 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={handleReschedule}
                                                className="flex-1 h-11 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </td>
        </tr>
    );
}

function ProgressItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">{label}</span>
            <span className="text-sm font-bold text-white">{value}</span>
        </div>
    );
}

function ScoreBar({ label, count, percent, color }: { label: string; count: string; percent: string; color: string }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">{label}</span>
                <span className="text-xs font-bold text-white">{count}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: percent }} transition={{ duration: 1 }} className={`${color} h-full rounded-full`}></motion.div>
            </div>
        </div>
    );
}
