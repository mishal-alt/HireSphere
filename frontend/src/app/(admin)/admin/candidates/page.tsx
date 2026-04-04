'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidates } from '@/hooks/useCandidates';
import { useRouter } from 'next/navigation';
import AddCandidateModal from '@/components/admin/AddCandidateModal';
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Phone,
    Mail,
    Briefcase,
    FileText,
    BarChart3,
    ChevronDown,
    CheckCircle2,
    XCircle,
    Clock,
    Activity,
    ChevronLeft,
    ChevronRight,
    SearchX,
    UserCircle,
    BadgeCheck,
    CalendarCheck as CalendarIcon,
    MoreVertical,
    MapPin,
    UserPlus,
    ExternalLink,
    Shield,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function CandidatesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { data: candidates = [], isLoading } = useCandidates({
        status: filterStatus,
        search: debouncedSearch
    });

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Click Outside to Close Filter
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const statusOptions = ['All', 'New', 'Shortlisted', 'Scheduled', 'Interviewed', 'Hired', 'Rejected'];

    if (isLoading && candidates.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-10">
                <div className="space-y-1.5">
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Candidate Records</h1>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-gray-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                        Synchronized talent database with {candidates.length} active entries.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <Button variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 rounded-xl bg-emerald-800 text-white text-sm font-bold font-medium hover:opacity-90 transition-all shadow-none active:scale-95 flex items-center gap-3"
                    >
                        <UserPlus className="size-4" />
                        Add New Candidate
                    </Button>
                </div>
            </div>

            {/* Sub-Header / Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-5 rounded-2xl border border-gray-200/50 relative z-30">
                <div className="flex-1 relative group w-full lg:w-auto">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none group-focus-within:translate-x-0.5 transition-transform">
                        <Search className="text-slate-400 size-4 group-focus-within:text-emerald-700 transition-colors" />
                    </div>
                    <Input
                        className="w-full h-11 bg-slate-50 border border-slate-200/60 rounded-xl pl-11 pr-12 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:bg-white focus-visible:border-emerald-500/50 transition-all shadow-sm"
                        placeholder="Search for candidates by name, identity or role..."
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-bold text-slate-400 transition-opacity group-focus-within:opacity-0">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </div>
                </div>

                <div className="flex items-center gap-6 shrink-0" ref={filterRef}>
                    <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
                        {statusOptions.slice(0, 4).map((status) => (
                            <Button variant="ghost"
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setShowFilters(false);
                                }}
                                className={`h-9 px-5 rounded-lg text-xs font-bold font-medium transition-all ${filterStatus === status ? 'bg-white text-gray-900 border border-gray-200/50' : 'text-gray-500 hover:text-gray-500' }`}
                            >
                                {status}
                            </Button>
                        ))}
                        <div className="relative ml-1">
                            <Button variant="ghost"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-9 px-4 rounded-lg border transition-all flex items-center gap-2 ${showFilters || !['All', 'New', 'Shortlisted', 'Scheduled', 'Interviewed'].includes(filterStatus) ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white border-gray-200/50 text-gray-500 hover:border-emerald-800 hover:text-gray-900' }`}
                            >
                                <Filter className="size-3" />
                                <ChevronDown className={`size-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </Button>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-3 w-56 bg-white border border-gray-200/50 rounded-xl overflow-hidden z-[100] p-2 ring-8 ring-slate-950/5"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {statusOptions.map((status) => (
                                                <Button variant="ghost"
                                                    key={status}
                                                    onClick={() => {
                                                        setFilterStatus(status);
                                                        setShowFilters(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold font-medium transition-all flex items-center justify-between ${filterStatus === status ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50' }`}
                                                >
                                                    {status}
                                                    {filterStatus === status && <CheckCircle2 className="size-3.5" />}
                                                </Button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {candidates.length > 0 ? (
                    candidates.map((candidate: any, idx: number) => (
                        <motion.div
                            key={candidate._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border border-gray-200/50 rounded-2xl p-5 flex flex-col gap-5 hover:border-emerald-200/50 hover:shadow-soft transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-start gap-5 relative z-10 flex-1 min-w-0">
                                <div className="shrink-0 relative">
                                    <div className="size-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 transition-all group-hover:scale-105">
                                        <img 
                                            src={candidate.profileImage ? (candidate.profileImage.startsWith('http') ? candidate.profileImage : `http://localhost:5000${candidate.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} 
                                            alt={candidate.name} 
                                            className="size-full object-cover" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 min-w-0 flex-1 pt-0.5">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-slate-900 tracking-tight truncate group-hover:text-emerald-700 transition-colors">{candidate.name}</h3>
                                            {!candidate.isHired && <BadgeCheck className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {candidate.jobId && (
                                                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 capitalize tracking-tight">
                                                    <Briefcase className="size-3 text-slate-400" />
                                                    {candidate.jobId.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 flex items-center gap-2 truncate font-medium">
                                        <Mail className="size-3.5" />
                                        {candidate.email}
                                    </p>
                                    
                                    {/* Skills / Match Accuracy */}
                                    <div className="pt-2 flex items-center justify-between gap-4 max-w-[220px]">
                                        <div className="flex-1 space-y-1.5">
                                            <div className="flex justify-between items-center px-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Match Accuracy</span>
                                                <span className={`text-[11px] font-extrabold ${(candidate.atsScore || 0) >= 70 ? 'text-emerald-600' : (candidate.atsScore || 0) >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>{candidate.atsScore || 0}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/20">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${candidate.atsScore || 0}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                    className={`h-full rounded-full ${(candidate.atsScore || 0) >= 70 ? 'bg-emerald-500' : (candidate.atsScore || 0) >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-6 shrink-0">
                                    <StatusBadge status={candidate.status || 'New'} score={candidate.atsScore} />
                                    <Button variant="ghost" 
                                        onClick={() => router.push(`/admin/candidates/${candidate._id}`)}
                                        className="size-10 rounded-md bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors group/btn"
                                    >
                                        <ArrowUpRight className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-transparent border-t border-gray-200/50 relative group overflow-hidden">
                        <div className="size-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-8 text-gray-400 transition-transform group-hover:scale-105">
                            <Users className="size-8" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Database Exhausted</h3>
                        <p className="text-sm text-gray-500 mt-2">No candidates matching current parameters</p>
                        <Button variant="ghost" 
                            onClick={() => {setSearchTerm(''); setFilterStatus('All')}}
                            className="mt-8 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                        >
                            Reset System Filters
                        </Button>
                    </div>
                )}
            </div>

            {/* Performance Footer */}
            <div className="bg-white border border-gray-200/50 rounded-xl p-6  relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="size-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-700">
                                <Shield className="size-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Enterprise Infrastructure</h3>
                                <p className="text-sm text-gray-500">Recruitment cycle monitoring active</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-white border border-gray-200/50">
                        <div className="text-center space-y-1">
                            <p className="text-2xl font-semibold text-gray-900 leading-none">A+</p>
                            <p className="text-xs text-gray-500 font-medium">Integrity Index</p>
                        </div>
                        <div className="w-[1px] h-10 bg-gray-200" />
                        <div className="text-center space-y-1">
                            <p className="text-2xl font-semibold text-gray-900 leading-none">88%</p>
                            <p className="text-xs text-gray-500 font-medium">Conversion</p>
                        </div>
                    </div>
                </div>
            </div>

            <AddCandidateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}

import { StatusBadge } from '@/components/ui/status-badge';
