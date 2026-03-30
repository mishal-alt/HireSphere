'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import { 
    ClipboardList, 
    Clock, 
    CheckCircle2, 
    FileText, 
    User, 
    ArrowUpRight,
    AlertCircle,
    Inbox,
    Filter
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

export default function EvaluationsPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const response = await api.get('/interviews/interviewer/my-interviews');
                setInterviews(response.data);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    const filteredEvaluations = interviews.filter((i) => {
        if (activeTab === 'pending') return i.status === 'Scheduled' || i.status === 'Ongoing';
        if (activeTab === 'completed') return i.status === 'Completed' || i.status === 'Evaluated';
        return false;
    });

    const pendingCount = interviews.filter((i) => i.status === 'Scheduled' || i.status === 'Ongoing').length;

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
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Performance Evaluations</h1>
                    <p className="text-sm font-medium text-gray-500">Document and submit assessment reports for interviewed candidates.</p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="bg-gray-50 border-none px-4 py-2.5 rounded-lg flex items-center gap-3">
                        <ClipboardList className="size-4 text-gray-400" />
                        <div>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none">Awaiting Review</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{pendingCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-6 border-b border-gray-200/50 relative">
                {[
                    { id: 'pending', label: 'Pending Assessment', count: pendingCount, icon: Clock },
                    { id: 'completed', label: 'Archived Reports', count: null, icon: CheckCircle2 }
                ].map((tab) => (
                    <Button variant="ghost"
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`pb-4 px-1 text-xs font-medium uppercase tracking-widest transition-all relative flex items-center gap-2 ${
                            activeTab === tab.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <tab.icon className="size-3.5" />
                        {tab.label}
                        {tab.count !== null && (
                            <span className={`ml-1.5 px-2 py-0.5 rounded-md text-[9px] font-medium tracking-widest ${
                                activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-gray-500'
                            }`}>
                                {tab.count}
                            </span>
                        )}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="nav-underline" 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full shadow-none" 
                            />
                        )}
                    </Button>
                ))}
            </div>

            {/* Evaluations Table */}
            <div className="bg-white rounded-xl overflow-hidden shadow-none">
                <div className="overflow-x-auto">
                    <Table >
                        <TableHeader className="bg-gray-50 border-b border-gray-200/50">
                            <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                <TableHead className="px-6 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Candidate</TableHead>
                                <TableHead className="px-6 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Position</TableHead>
                                <TableHead className="px-6 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Session Date</TableHead>
                                <TableHead className="px-6 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="px-6 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200/60">
                            <AnimatePresence mode="popLayout">
                                {filteredEvaluations.length > 0 ? (
                                    filteredEvaluations.map((row, idx) => (
                                        <motion.tr 
                                            key={row._id} 
                                            layout
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: idx * 0.02 }}
                                            className="group hover:bg-gray-50 transition-all cursor-pointer"
                                        >
                                            <TableCell className="px-6 py-5">
                                                <div className="flex items-center gap-6">
                                                    <div className="size-9 rounded-lg bg-white flex items-center justify-center shadow-none group-hover:border-slate-900 transition-all">
                                                        <User className="size-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 group-hover:text-slate-950 truncate transition-colors">{row.candidateId?.name}</p>
                                                        <p className="text-[10px] font-medium text-gray-400 truncate mt-0.5">{row.candidateId?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md">
                                                    {row.candidateId?.role || 'Developer'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-medium text-gray-900 italic">
                                                        {new Date(row.scheduledAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Verified Session</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-center">
                                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-100 font-medium px-2.5 py-0.5 rounded-full uppercase tracking-widest text-[10px]">{row.status}</Badge>
                                            </TableCell>
                                            <TableCell className="px-6 py-5 text-right">
                                                {row.status === 'Completed' || row.status === 'Evaluated' ? (
                                                    <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                        <FileText className="size-3" />
                                                        View Report
                                                    </Button>
                                                ) : (
                                                    <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                        Evaluate Profile
                                                        <ArrowUpRight className="size-3.5" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                        <TableCell colSpan={5} className="px-6 py-24 text-center">
                                            <div className="bg-gray-50 size-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                <Inbox className="size-8 text-slate-200" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest italic opacity-50">Empty Evaluation Hub</p>
                                            <Button variant="ghost" 
                                                onClick={() => setActiveTab(activeTab === 'pending' ? 'completed' : 'pending')}
                                                className="mt-4 text-[10px] font-medium text-gray-900 underline uppercase tracking-widest"
                                            >
                                                {activeTab === 'pending' ? 'Check Archives' : 'Back to Active'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </AnimatePresence>
                        </TableBody>
                    </Table>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                    <span>Performance Hub Online</span>
                    <span className="flex items-center gap-2">
                        Reporting {filteredEvaluations.length} records
                    </span>
                </div>
            </div>

            {/* Hint Card */}
            {filteredEvaluations.length === 0 && activeTab === 'pending' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl border border-dashed border-gray-200/50 bg-white/50 flex flex-col items-center justify-center text-center space-y-6"
                >
                    <div className="size-16 rounded-full bg-gray-900 flex items-center justify-center text-gray-900 shadow-none shadow-slate-900/20">
                        <CheckCircle2 className="size-8" />
                    </div>
                    <div className="max-w-md space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-tight">Everything Reviewed</h3>
                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest leading-loose font-medium">
                            All scheduled interviews have been completely processed.
                            No pending assessments are registered on the central terminal.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none shadow-emerald-500/5',
        Evaluated: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none shadow-emerald-500/5',
        Ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-none shadow-emerald-500/5',
        Scheduled: 'bg-sky-50 text-sky-700 border-sky-200 shadow-none shadow-sky-500/5',
        Pending: 'bg-gray-50 text-gray-500 border-gray-200/50 shadow-none shadow-slate-500/5'
    };

    return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-100 font-medium px-2.5 py-0.5 rounded-full uppercase text-[10px]">
            {status || 'Pending'}
        </Badge>
    );
}
