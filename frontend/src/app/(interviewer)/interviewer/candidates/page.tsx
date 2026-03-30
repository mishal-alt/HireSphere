'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { 
    Search, 
    User, 
    Mail, 
    ChevronRight, 
    Filter, 
    Users, 
    ArrowUpRight,
    SearchX,
    BadgeCheck,
    MoreHorizontal,
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    ShieldCheck,
    ArrowRight,
    History,
    Activity,
    CheckCircle2,
    XCircle,
    Clock,
    Target
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function CandidatesPage() {
    const { candidates, fetchCandidates, loading } = useAdminCandidateStore();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const filteredCandidates = useMemo(() => {
        const searchLower = searchQuery.toLowerCase();
        return candidates.filter(candidate =>
            candidate.name.toLowerCase().includes(searchLower) ||
            candidate.email.toLowerCase().includes(searchLower)
        );
    }, [candidates, searchQuery]);

    const handleViewProfile = (id: string) => {
        router.push(`/interviewer/candidates/${id}`);
    };

    if (loading && candidates.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-10 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-10">
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tightest">Talent Directory</h1>
                    <p className="text-sm text-gray-500 flex items-center gap-3">
                        <span className="size-2 rounded-full bg-gray-100 animate-pulse shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"></span>
                        Reviewing {candidates.length} potential hires in the specialized pool.
                    </p>
                </div>

                <div className="flex items-center gap-6 bg-white px-8 py-4 rounded-[1.5rem] shadow-none group">
                    <div className="size-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner group-hover:bg-emerald-800 group-hover:text-white transition-all">
                        <Users className="size-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none italic">Database Size</p>
                        <p className="text-2xl font-semibold text-gray-900 leading-none mt-2">{candidates.length}</p>
                    </div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-5 rounded-2xl shadow-none shadow-slate-200/20 relative z-30">
                <div className="relative flex-1 max-w-xl group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-all scale-110" />
                    <Input
                        type="text"
                        placeholder="Search by candidate identity or expertise..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 text-sm font-medium text-gray-900 focus:border-primary focus:bg-white focus:ring-8 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-400 shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Filter className="size-4" />
                        Refine Search
                    </Button>
                    <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        Export Set
                    </Button>
                </div>
            </div>

            {/* Candidates Card List (Compact List Layout) */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredCandidates.length > 0 ? (
                        filteredCandidates.map((candidate: any, idx: number) => (
                            <motion.div
                                key={candidate._id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.03, duration: 0.3 }}
                                className="group bg-transparent border-b border-gray-200/50 py-6 hover:border-primary hover:shadow-none transition-all relative overflow-hidden shadow-none cursor-pointer flex items-center gap-6"
                                onClick={() => handleViewProfile(candidate._id)}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    <div className="size-16 rounded-xl border border-gray-100 p-0.5 bg-gray-50 group-hover:border-primary transition-all shadow-none overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
                                            className="w-full h-full rounded-lg object-cover bg-gray-50"
                                            alt={candidate.name}
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 size-5 rounded-md bg-white border border-gray-100 flex items-center justify-center shadow-none text-gray-900">
                                        <ShieldCheck className="size-3" />
                                    </div>
                                </div>

                                {/* Identity */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-900 transition-colors truncate tracking-tight">{candidate.name}</h3>
                                        <BadgeCheck className="size-4 text-gray-900 shrink-0" />
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] font-medium text-gray-400">
                                        <span className="flex items-center gap-1.5"><Mail className="size-3 text-slate-300" /> {candidate.email}</span>
                                        <span className="text-slate-200">|</span>
                                        <span className="flex items-center gap-1.5 uppercase tracking-wider">HS-{candidate._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>

                                {/* Status & Metadata */}
                                <div className="hidden sm:flex flex-col items-end gap-2 px-4 border-l border-gray-100">
                                    <StatusBadge status={candidate.status || 'Pending'} />
                                    <div className="text-[9px] font-medium text-slate-300 uppercase tracking-[0.2em]">Updated Today</div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                    <Button variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewProfile(candidate._id);
                                        }}
                                        className="size-10 rounded-xl bg-emerald-800 text-white hover:bg-slate-800 transition-all shadow-none flex items-center justify-center group/btn active:scale-95"
                                    >
                                        <ChevronRight className="size-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (

                        <div className="col-span-full py-48 text-center bg-white rounded-2xl shadow-none border-dashed group">
                            <div className="bg-gray-50 size-28 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-none transition-transform group-hover:scale-110">
                                <SearchX className="size-12 text-slate-200" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-[0.3em]">Directory Exhausted</h3>
                            <p className="text-xs font-medium text-gray-400 mt-4 uppercase tracking-[0.2em] opacity-60">No matching candidate signatures found</p>
                            <Button variant="ghost" 
                                onClick={() => setSearchQuery('')}
                                className="mt-12 text-[10px] font-semibold text-gray-900 border-b-2 border-primary/20 pb-2 hover:border-primary uppercase tracking-[0.2em] transition-all"
                            >
                                Reset Directory Index
                            </Button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Stats Footer */}
            <div className="bg-gray-900 rounded-2xl p-6 shadow-none relative overflow-hidden group">
                <div className="absolute left-0 bottom-0 p-6 opacity-5 text-gray-900 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <Activity className="size-48" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-xl font-semibold text-gray-900 tracking-tightest">Assessment Status</h3>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest italic">Global candidate synchronization active</p>
                    </div>
                    <div className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/5 shadow-none">
                        <div className="text-center space-y-3">
                            <p className="text-xl font-semibold text-gray-900 tracking-tight">24</p>
                            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-[0.3em] leading-none">Active Reviews</p>
                        </div>
                        <div className="w-[1px] h-14 bg-white/10" />
                        <div className="text-center space-y-3">
                            <p className="text-xl font-semibold text-gray-900 tracking-tight">08</p>
                            <p className="text-[9px] font-medium text-gray-600 uppercase tracking-[0.3em] leading-none">Due Sessions</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        Hired: 'bg-emerald-500/10 text-gray-900 border-emerald-500/20 shadow-emerald-500/5',
        Rejected: 'bg-transparent text-gray-600 border-gray-200/50 shadow-gray-500/5',
        Shortlisted: 'bg-gray-100 text-gray-900 border-primary/20 shadow-primary/10',
        Pending: 'bg-gray-500/5 text-gray-400 border-slate-500/10 shadow-slate-100/5'
    };

    return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-100 font-medium px-2.5 py-0.5 rounded-full uppercase text-[10px]">
            <div className={`size-1.5 rounded-full animate-pulse ${status === 'Hired' ? 'bg-emerald-500' : status === 'Rejected' ? 'bg-gray-50' : status === 'Shortlisted' ? 'bg-primary' : 'bg-slate-400'}`} />
            {status || 'Pending'}
        </Badge>
    );
}
