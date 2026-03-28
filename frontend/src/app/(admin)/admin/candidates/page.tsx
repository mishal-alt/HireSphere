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

    const statusOptions = ['All', 'New', 'Scheduled', 'Interviewed', 'Hired', 'Rejected'];

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-10">
                <div className="space-y-1.5">
                    <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Candidate Records</h1>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-2.5">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                        Synchronized talent database with {candidates.length} active entries.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 flex items-center gap-3"
                    >
                        <UserPlus className="size-4" />
                        Add New Candidate
                    </button>
                </div>
            </div>

            {/* Sub-Header / Filters */}
            <div className="flex flex-col lg:flex-row items-center gap-6 bg-white p-5 rounded-[2rem] border border-slate-200/60 shadow-sm relative z-30">
                <div className="flex-1 relative group w-full lg:w-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-all" />
                    <input
                        className="w-full h-12 pl-12 pr-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-primary focus:bg-white focus:ring-8 focus:ring-primary/5 outline-none text-sm font-bold text-slate-900 placeholder:text-slate-400 transition-all shadow-inner"
                        placeholder="Search candidates by name, identity or role..."
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 shrink-0" ref={filterRef}>
                    <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/40">
                        {statusOptions.slice(0, 4).map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setShowFilters(false);
                                }}
                                className={`h-9 px-5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${filterStatus === status
                                    ? 'bg-white text-slate-900 shadow-sm border border-slate-100'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                        <div className="relative ml-1">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-9 px-4 rounded-lg border transition-all flex items-center gap-2 ${showFilters || !['All', 'New', 'Scheduled', 'Interviewed'].includes(filterStatus)
                                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                <Filter className="size-3" />
                                <ChevronDown className={`size-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-3 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[100] p-2 ring-8 ring-slate-950/5"
                                    >
                                        <div className="flex flex-col gap-1">
                                            {statusOptions.map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setFilterStatus(status);
                                                        setShowFilters(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-between ${filterStatus === status
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {status}
                                                    {filterStatus === status && <CheckCircle2 className="size-3.5" />}
                                                </button>
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
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {candidates.length > 0 ? (
                    candidates.map((candidate: any, idx: number) => (
                        <motion.div
                            key={candidate._id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col gap-8 hover:border-primary hover:shadow-2xl hover:shadow-primary/5 transition-all group shadow-sm relative overflow-hidden"
                        >
                            <div className="flex items-start gap-8 relative z-10 flex-1 min-w-0">
                                <div className="shrink-0 relative">
                                    <div className="size-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 bg-white shadow-xl p-1 transition-all group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/20">
                                        <img 
                                            src={candidate.profileImage ? (candidate.profileImage.startsWith('http') ? candidate.profileImage : `http://localhost:5000${candidate.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} 
                                            alt={candidate.name} 
                                            className="size-full object-cover rounded-[1.5rem]" 
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-lg text-primary scale-0 group-hover:scale-100 transition-transform duration-300">
                                            <BadgeCheck className="size-5" />
                                    </div>
                                </div>
                                <div className="space-y-4 min-w-0 flex-1 pt-2">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-bold text-slate-900 tracking-tight truncate group-hover:text-primary transition-colors">{candidate.name}</h3>
                                            {!candidate.isHired && <BadgeCheck className="size-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {candidate.jobId && (
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 italic">
                                                    <Briefcase className="size-3" />
                                                    {candidate.jobId.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 truncate tracking-wide">
                                        <Mail className="size-4 text-slate-300" />
                                        {candidate.email}
                                    </p>
                                    
                                    {/* Skills / Match Accuracy Mockup */}
                                    <div className="pt-2 flex items-center justify-between gap-6 max-w-[240px]">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">Match Accuracy</span>
                                                <span className="text-[10px] font-black text-slate-900">85%</span>
                                            </div>
                                            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: '85%' }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1.5, ease: "circOut" }}
                                                    className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-10 shrink-0">
                                    <StatusBadge status={candidate.status || 'New'} />
                                    <button 
                                        onClick={() => router.push(`/admin/candidates/${candidate._id}`)}
                                        className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 group/btn"
                                    >
                                        <ArrowUpRight className="size-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed relative group overflow-hidden">
                        <div className="size-24 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm transition-transform group-hover:scale-110">
                            <Users className="size-10" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Database Exhausted</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-3 opacity-60 italic">No candidates matching current parameters</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setFilterStatus('All')}}
                            className="mt-10 text-[10px] font-bold text-primary uppercase tracking-[0.3em] hover:opacity-70 transition-opacity"
                        >
                            Reset System Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Performance Footer */}
            <div className="bg-slate-950 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-12 opacity-5 text-white group-hover:scale-110 transition-transform duration-1000">
                    <Activity className="size-48" />
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-5">
                            <div className="size-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center text-primary shadow-2xl border border-white/10 group-hover:rotate-6 transition-transform">
                                <Shield className="size-7" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-white tracking-tight">Enterprise Infrastructure</h3>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none italic">Recruitment cycle monitoring active</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-10 p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-xl shadow-2xl">
                        <div className="text-center space-y-2">
                            <p className="text-3xl font-black text-white tracking-tight leading-none uppercase">A+</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic leading-none">Integrity Index</p>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10" />
                        <div className="text-center space-y-2">
                            <p className="text-3xl font-black text-white tracking-tight leading-none">88%</p>
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic leading-none">Conversion Vector</p>
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

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Hired': 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5',
        'Scheduled': 'text-primary bg-primary/5 border-primary/20 shadow-primary/5',
        'New': 'text-amber-500 bg-amber-500/5 border-amber-500/20 shadow-amber-500/5',
        'Rejected': 'text-rose-500 bg-rose-500/5 border-rose-500/20 shadow-rose-500/5',
        'Interviewed': 'text-slate-400 bg-slate-400/5 border-slate-400/10 shadow-slate-500/5'
    };

    const icons: Record<string, any> = {
        'Hired': CheckCircle2,
        'Scheduled': CalendarIcon,
        'New': Clock,
        'Rejected': XCircle,
        'Interviewed': Activity
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`px-5 py-2 rounded-xl border text-[9px] font-extrabold uppercase tracking-[0.2em] whitespace-nowrap shadow-sm flex items-center gap-2.5 transition-all ${styles[status] || 'text-slate-400 bg-white border-slate-200'}`}>
            <div className={`size-1.5 rounded-full ${styles[status]?.split(' ')[0].replace('text-', 'bg-')} animate-pulse`} />
            {status}
        </span>
    );
}
