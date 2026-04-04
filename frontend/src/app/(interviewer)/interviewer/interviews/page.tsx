'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useInterviewerInterviews } from '@/hooks/useInterviews';
import { useRouter } from 'next/navigation';
import {
    Search,
    Calendar,
    Clock,
    User,
    ExternalLink,
    CalendarClock,
    CircleCheck,
    AlertCircle,
    ChevronRight,
    Play,
    Filter,
    MoreVertical,
    CalendarDays,
    Video,
    History,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function MyInterviewsPage() {
    const { user } = useAuthStore();
    const { data: interviews = [], isLoading } = useInterviewerInterviews();
    const [activeTab, setActiveTab] = useState('upcoming');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const filteredInterviews = useMemo(() => {
        return interviews.filter(interview => {
            const matchesTab = activeTab === 'upcoming'
                ? interview.status === 'Scheduled'
                : interview.status === 'Completed';

            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                (interview.candidateId?.name || '').toLowerCase().includes(searchLower) ||
                (interview.candidateId?.email || '').toLowerCase().includes(searchLower) ||
                (interview.title || '').toLowerCase().includes(searchLower);

            return matchesTab && matchesSearch;
        });
    }, [interviews, activeTab, searchQuery]);

    if (isLoading && interviews.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Interview Sessions</h1>
                    <p className="text-sm font-medium text-gray-500">Track and manage your scheduled candidate assessments.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white rounded-xl pl-11 pr-4 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400 shadow-none"
                    />
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 flex items-center gap-2 border-b border-gray-200/50 w-full mb-6 pb-2">
                {[
                    { id: 'upcoming', label: 'Upcoming', icon: CalendarDays },
                    { id: 'completed', label: 'History', icon: History }
                ].map((tab) => (
                    <Button variant="ghost"
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-10 px-6 text-[10px] font-medium uppercase tracking-widest transition-all relative flex items-center gap-2.5 ${activeTab === tab.id 
                            ? 'text-gray-900 border-b-2 border-primary rounded-none shadow-none' 
                            : 'text-gray-500 hover:text-gray-900 rounded-none'
                            }`}
                    >
                        <tab.icon className={`size-3.5 ${activeTab === tab.id ? 'text-gray-900' : ''}`} />
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Interviews List */}
            <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredInterviews.length > 0 ? (
                        filteredInterviews.map((interview: any, idx) => (
                            <motion.div
                                key={interview._id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ delay: idx * 0.03 }}
                                className="group bg-white border border-gray-100 p-4 rounded-2xl hover:bg-gray-50 hover:border-emerald-100 transition-all flex items-center gap-6 shadow-sm hover:shadow-md h-24"
                            >
                                {/* Left: Avatar */}
                                <div className="relative shrink-0">
                                    <div className="size-16 rounded-xl p-0.5 bg-gray-50 border border-gray-100 group-hover:border-emerald-200 transition-colors overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`}
                                            className="w-full h-full object-cover rounded-lg"
                                            alt=""
                                        />
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 size-5 rounded-md flex items-center justify-center border-2 border-white ${interview.status === 'Scheduled' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                        {interview.status === 'Scheduled' ? (
                                            <Video className="size-2.5 text-white" />
                                        ) : (
                                            <CircleCheck className="size-2.5 text-white" />
                                        )}
                                    </div>
                                </div>

                                {/* Middle: Info */}
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-base font-bold text-gray-900 truncate tracking-tight">{interview.candidateId?.name || 'Unknown Candidate'}</h3>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                                            <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">{interview.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-medium text-gray-400 flex items-center gap-4">
                                        <span className="flex items-center gap-1.5"><Calendar className="size-3" /> {new Date(interview.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="size-3" /> {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="text-gray-300">|</span>
                                        <span className="font-bold tracking-widest uppercase">HS-{interview._id.slice(-6).toUpperCase()}</span>
                                    </p>
                                </div>

                                {/* Right: Actions */}
                                <div className="flex items-center gap-3 shrink-0 pr-2">
                                    <Button 
                                        variant="ghost"
                                        onClick={() => router.push(`/interviewer/candidates/${interview.candidateId?._id}`)}
                                        className="h-10 px-4 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2 hover:text-gray-900 border border-transparent"
                                    >
                                        <User className="size-4" />
                                        Profile
                                    </Button>
                                    {interview.status === 'Scheduled' && (
                                        <Button 
                                            variant="default" 
                                            onClick={() => router.push(`/interviewer/interview-room/${interview._id}`)}
                                            className="bg-emerald-900 text-white h-12 px-6 rounded-2xl text-[10px] uppercase font-bold tracking-[0.1em] hover:bg-emerald-950 transition-all flex items-center gap-3 shadow-lg shadow-emerald-900/10 active:scale-95"
                                        >
                                            Join Session
                                            <ChevronRight className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center rounded-2xl border-dashed group">
                            <div className="size-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:scale-110 transition-transform">
                                <AlertCircle className="size-10" />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest">No matching sessions</h3>
                            <p className="text-xs font-medium text-gray-400 mt-2">Adjust your search parameters or filter criteria.</p>
                            <Button variant="ghost"
                                className="mt-8 text-[11px] font-medium text-gray-900 underline underline-offset-8 uppercase tracking-widest hover:text-gray-900/70 transition-colors"
                                onClick={() => { setSearchQuery(''); setActiveTab('upcoming'); }}
                            >
                                Reset Preferences
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
