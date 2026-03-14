'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import AddCandidateModal from '@/components/admin/AddCandidateModal';

export default function CandidatesPage() {
    const { candidates, loading, fetchCandidates } = useAdminCandidateStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilters, setShowFilters] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    // Debounced Fetching
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCandidates({ status: filterStatus, search: searchTerm });
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, filterStatus, fetchCandidates]);

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

    if (loading && candidates.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center">
                    HS
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Candidates</h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-2">Managing {candidates.length} candidates in your list</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-[#080808] border border-white/5 px-6 py-3 rounded-xl text-center">
                        <p className="text-[8px] uppercase font-bold text-slate-500 mb-1">Total</p>
                        <p className="text-xl font-bold text-white">{candidates.length}</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="h-12 px-8 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                    >
                        Add Candidate
                    </button>
                </div>
            </div>

            <AddCandidateModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-[#080808] p-4 rounded-xl border border-white/5 shadow-2xl relative z-30">
                <div className="relative w-full lg:max-w-md">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                    <input
                        className="w-full h-11 pl-12 pr-4 rounded-lg bg-[#121212] border border-white/5 focus:border-primary/50 outline-none text-sm text-white placeholder:text-slate-600 transition-all"
                        placeholder="Search by name or email..."
                        type="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {loading && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                             <div className="size-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3 w-full lg:w-auto" ref={filterRef}>
                    <div className="flex items-center gap-1.5 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-hide">
                        {statusOptions.slice(0, 3).map((status) => (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilterStatus(status);
                                    setShowFilters(false);
                                }}
                                className={`h-9 px-5 rounded-lg border text-[9px] font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    filterStatus === status 
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                                    : 'border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    
                    <div className="h-6 w-[1px] bg-white/5 mx-1 hidden lg:block"></div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-9 px-4 rounded-lg border transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                                showFilters || !['All', 'New', 'Scheduled'].includes(filterStatus)
                                ? 'border-primary/50 text-white bg-primary/10 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]'
                                : 'border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                            }`}
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest">
                                {['All', 'New', 'Scheduled'].includes(filterStatus) ? 'More Filters' : filterStatus}
                            </span>
                            <span className={`material-symbols-outlined text-xs transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>expand_more</span>
                        </button>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.2, ease: "circOut" }}
                                    className="absolute right-0 mt-3 w-56 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden z-[100] p-1.5"
                                >
                                    <div className="grid grid-cols-1 gap-1">
                                        <p className="px-3 py-2 text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">Select Status</p>
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status);
                                                    setShowFilters(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${
                                                    filterStatus === status 
                                                    ? 'bg-primary/20 text-primary shadow-inner' 
                                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    {status}
                                                    {filterStatus === status && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div className="grid grid-cols-1 gap-4">
                {candidates.length > 0 ? (
                    candidates.map((candidate, idx) => (
                        <motion.div
                            key={candidate._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-[#080808] border border-white/5 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-primary/20 transition-all group shadow-xl"
                        >
                            <div className="flex items-center gap-6">
                                <div className="relative shrink-0">
                                    <div className="size-14 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-300">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`} alt={candidate.name} className="size-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary border-2 border-[#080808] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[10px] text-white font-bold">check</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{candidate.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{candidate.phone || "No Phone"}</p>
                                        <span className="size-1 rounded-full bg-white/10"></span>
                                        <p className="text-[10px] font-medium text-slate-500">{candidate.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-8">
                                <div className="space-y-2 w-32">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Match Score</span>
                                        <span className="text-xs font-bold text-primary">85%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `85%` }} />
                                    </div>
                                </div>

                                <StatusBadge status={candidate.status || 'New'} />

                                <div className="flex items-center gap-2">
                                    {candidate.resumeUrl && (
                                        <a
                                            href={candidate.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-10 px-6 rounded-lg bg-[#121212] border border-white/5 text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/20 transition-all flex items-center"
                                        >
                                            View Resume
                                        </a>
                                    )}
                                    <button className="h-10 w-10 rounded-lg bg-[#121212] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                        <span className="material-symbols-outlined text-lg">mail</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-[#080808] rounded-2xl border border-white/5 shadow-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No candidates found matching your criteria</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Showing {candidates.length} candidates</p>
                <div className="flex gap-2">
                    <button className="h-10 px-5 rounded-lg border border-white/5 text-[9px] font-bold uppercase text-slate-500 hover:text-white transition-all">Previous</button>
                    <button className="h-10 px-5 rounded-lg bg-white text-black text-[9px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">Next</button>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        'Hired': 'text-primary bg-primary/10 border-primary/20',
        'Scheduled': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'New': 'text-accent bg-accent/10 border-accent/20',
        'Rejected': 'text-red-500 bg-red-500/10 border-red-500/20',
        'Interviewed': 'text-white bg-white/5 border-white/10'
    };

    return (
        <span className={`px-3 py-1.5 rounded-md border text-[8px] font-bold uppercase tracking-widest whitespace-nowrap shadow-sm ${styles[status] || 'text-slate-400 bg-white/5 border-white/10'}`}>
            {status}
        </span>
    );
}
