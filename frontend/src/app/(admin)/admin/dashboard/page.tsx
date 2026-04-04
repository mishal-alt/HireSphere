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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
        >
            <Card className="bg-white border border-gray-200/50 rounded-xl shadow-none">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="size-8 flex items-center justify-center text-emerald-800 transition-colors">
                            <Icon className="size-5" />
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium tracking-tight ${trendUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' : 'bg-emerald-50 text-emerald-700'}`}>
                            {trendUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                            {trend}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500 font-medium">{label}</p>
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tight leading-none">
                            {value.includes('%') ? `${count}%` : count.toLocaleString()}
                        </h3>
                    </div>
                </CardContent>
            </Card>
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
            } catch (error) { }
        }
    };

    const handleReschedule = async () => {
        if (!newDate) return;
        try {
            await rescheduleMutation.mutateAsync({ id, newDate });
            setShowReschedule(false);
            setShowMenu(false);
        } catch (error) { }
    };

    return (
        <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
            <TableCell className="px-8 py-5">
                <div className="flex items-center gap-6">
                    <div className="size-10 rounded-lg overflow-hidden border border-gray-200/50 bg-white transition-transform group-hover:scale-105">
                        <img src={img} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <span className="text-sm font-bold text-gray-900 block leading-tight">{name}</span>
                        <span className="text-xs font-bold text-gray-500 font-medium">ID: {id?.slice(-6).toUpperCase()}</span>
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-8 py-5 text-center">
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-100 font-medium px-2.5 py-0.5 rounded-full uppercase text-[10px]">
                    {status}
                </Badge>
            </TableCell>
            <TableCell className="px-8 py-5">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{time.split(',')[0]}</span>
                    <span className="text-sm font-medium text-gray-500 mt-0.5 font-medium">{time.split(',')[1]}</span>
                </div>
            </TableCell>
            <TableCell className="px-8 py-5 text-right pr-8 relative">
                <Button variant="ghost"
                    ref={buttonRef}
                    onClick={toggleMenu}
                    className="size-9 rounded-md text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 transition-all flex items-center justify-center ml-auto"
                >
                    <MoreHorizontal className="size-4" />
                </Button>

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
                                className="w-48 bg-white border border-gray-200/50 rounded-xl z-[120] py-1.5 overflow-hidden"
                            >
                                <Button variant="ghost"
                                    onClick={() => {
                                        if (candidateId) {
                                            router.push(`/admin/candidates/${candidateId}`);
                                        } else {
                                            router.push('/admin/candidates');
                                        }
                                        setShowMenu(false);
                                    }}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left"
                                >
                                    <Eye className="size-4" />
                                    Review Profile
                                </Button>
                                <Button variant="ghost"
                                    onClick={() => {
                                        setShowReschedule(true);
                                        setShowMenu(false);
                                    }}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left"
                                >
                                    <Calendar className="size-4" />
                                    Reschedule
                                </Button>
                                <div className="h-[1px] bg-gray-100 my-1 mx-2" />
                                <Button variant="ghost"
                                    onClick={handleCancel}
                                    className="w-full h-10 flex items-center gap-3 px-4 text-xs font-semibold text-gray-900 hover:bg-emerald-50 transition-all text-left"
                                >
                                    <X className="size-4" />
                                    Cancel Session
                                </Button>
                            </motion.div>
                        </Portal>
                    )}
                </AnimatePresence>

                <Portal>
                    <AnimatePresence>
                        {showReschedule && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-white border border-gray-200/50 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    className="relative w-full max-w-sm bg-transparent border-b border-gray-200/50 py-8"
                                >
                                    <div className="flex flex-col items-center text-center mb-8">
                                        <div className="size-16 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-800 mb-6 border border-emerald-100">
                                            <CalendarDays className="size-8" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase italic">Modify Schedule</h2>
                                        <p className="text-sm text-gray-500 mt-2 px-6 font-medium">Select new interview timeline</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Input
                                                type="datetime-local"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="w-full h-12 bg-gray-50 border border-gray-200/50 rounded-xl px-4 text-gray-900 text-sm font-semibold focus:border-primary focus:bg-white outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <Button variant="ghost"
                                                onClick={() => setShowReschedule(false)}
                                                className="flex-1 h-12 rounded-xl text-xs font-bold text-gray-500 bg-white border border-gray-200/50 hover:bg-gray-50 hover:text-gray-900 transition-all"
                                            >
                                                Discard
                                            </Button>
                                            <Button variant="default"
                                                onClick={handleReschedule}
                                                className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                Update Time
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </Portal>
            </TableCell>
        </TableRow>
    );
}

function ProgressItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 px-1">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <span className="text-xs font-bold text-emerald-800">{value}</span>
        </div>
    );
}

function ScoreBar({ label, count, percent, color }: { label: string; count: string; percent: string; color: string }) {
    return (
        <div className="space-y-3 group/bar">
            <div className="flex justify-between items-end px-1">
                <span className="text-sm font-bold text-gray-500 font-medium group-hover/bar:text-gray-900 transition-colors">{label}</span>
                <span className="text-xs font-semibold text-gray-900">{count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
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
                <div className="animate-spin size-6 border-2 border-emerald-800 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-12">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2 font-medium">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Last updated: Just now
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost"
                        onClick={() => router.push('/admin/jobs')}
                        className="h-10 px-5 rounded-xl bg-white border border-gray-200/50 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <Briefcase className="size-4" />
                        Manage Jobs
                    </Button>
                    <Button variant="ghost"
                        onClick={() => router.push('/admin/candidates')}
                        className="h-10 px-6 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2"
                    >
                        <Users2 className="size-4" />
                        Talent Pool
                    </Button>
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
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8 flex flex-col pt-4">
                    <div className="pb-4 flex justify-between items-center border-b border-gray-200/50">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Recent Rounds</h2>
                            <p className="text-sm text-gray-500 mt-1">Latest candidate sessions</p>
                        </div>
                        <Button variant="ghost"
                            onClick={() => router.push('/admin/interviews')}
                            className="h-9 px-4 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 transition-all flex items-center gap-2"
                        >
                            History <ChevronRight className="size-3" />
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <Table >
                            <TableHeader>
                                <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                    <TableHead className="px-8 py-4">Participant</TableHead>
                                    <TableHead className="px-8 py-4 text-center">Status</TableHead>
                                    <TableHead className="px-8 py-4">Phase</TableHead>
                                    <TableHead className="px-8 py-4 text-right pr-8">Control</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-200/60">
                                {recentInterviews.length > 0 ? (
                                    recentInterviews.map((interview: any) => (
                                        <InterviewRow
                                            key={interview._id}
                                            id={interview._id}
                                            candidateId={interview.candidateId?._id}
                                            name={interview.candidateId?.name || "Unknown"}
                                            time={new Date(interview.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            status={interview.status}
                                            statusColor={interview.status === 'Scheduled' ? 'text-gray-900 bg-primary-light border-primary/10' : interview.status === 'Cancelled' ? 'text-emerald-700 bg-emerald-50 border-gray-200/50' : 'text-gray-900 bg-emerald-50 border-emerald-100'}
                                            img={interview.candidateId?.profileImage ? (interview.candidateId.profileImage.startsWith('http') ? interview.candidateId.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${interview.candidateId.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                        />
                                    ))
                                ) : (
                                    <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                        <TableCell colSpan={4} className="py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <Inbox className="size-12 text-gray-500 mb-4" />
                                                <p className="text-xs font-bold text-gray-500 font-medium">No activity log</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="xl:col-span-4 space-y-10 pl-4">
                    <div className="bg-white border border-gray-200/50 rounded-xl p-6  flex flex-col relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Global Success Rate</h2>
                                <p className="text-xs text-gray-500 mt-1">Platform Metrics</p>
                            </div>
                            <ArrowUpRight className="size-4 text-emerald-800" />
                        </div>

                        <div className="relative size-32 mx-auto mb-8 flex items-center justify-center">
                            <svg className="size-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle className="stroke-gray-200" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                                <motion.circle
                                    initial={{ strokeDasharray: '0, 100' }}
                                    whileInView={{ strokeDasharray: '75, 100' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="stroke-gray-900"
                                    cx="18" cy="18" fill="none" r="16" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-semibold text-gray-900 leading-none">75%</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-200/50 relative z-10">
                            <ProgressItem label="Funnel Velocity" value="84%" />
                            <ProgressItem label="Offer Acceptance" value="92%" />
                        </div>
                    </div>

                    <div className="bg-transparent flex flex-col p-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-10 flex items-center justify-center text-emerald-800">
                                <Shield className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">Security Core</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Monitoring active</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="py-2 flex items-center justify-between border-b border-gray-200/50">
                                <span className="text-sm text-gray-500 font-medium">System Health</span>
                                <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-emerald-800 uppercase">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-8">
                <div className="bg-transparent flex flex-col p-4 group transition-all">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-200/50 pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Talent Distribution</h2>
                            <p className="text-sm text-gray-500 font-medium mt-1">Department analytics</p>
                        </div>
                        <Activity className="size-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
                    </div>
                    <div className="space-y-6">
                        <ScoreBar label="Engineering" count="456" percent="65%" color="bg-emerald-800" />
                        <ScoreBar label="Product Design" count="142" percent="40%" color="bg-slate-400" />
                        <ScoreBar label="Sales Ops" count="289" percent="85%" color="bg-emerald-500" />
                    </div>
                </div>

                <div className="bg-transparent relative overflow-hidden flex flex-col group p-4">
                    <div className="flex justify-between items-end mb-8 relative z-10 border-b border-gray-200/50 pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">Growth Trend</h2>
                            <p className="text-xs font-medium text-gray-900 flex items-center gap-1.5 mt-1">
                                <ArrowUpRight className="size-3" />
                                +14% Expansion
                            </p>
                        </div>
                        <div className="text-xs text-gray-400">
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
