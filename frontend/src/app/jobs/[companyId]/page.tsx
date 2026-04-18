'use client';

import React, { useEffect, useState, use } from 'react';
import api, { getFileUrl } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
    Search, 
    Briefcase, 
    MapPin, 
    Clock, 
    ArrowUpRight, 
    Ban,
    Globe,
    ExternalLink
} from 'lucide-react';

interface Job {
    _id: string;
    title: string;
    department: string;
    location?: string;
    description: string;
    createdAt: string;
}

export default function PublicJobsPage({ params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = use(params);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [companyName, setCompanyName] = useState<string>('');
    const [companyLogo, setCompanyLogo] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get(`/public/jobs/${companyId}`);
                setJobs(response.data.jobs);
                setCompanyName(response.data.companyName);
                setCompanyLogo(response.data.companyLogo);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [companyId]);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="size-10 border-2 border-slate-200 border-t-primary rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] text-slate-900 min-h-screen font-body selection:bg-primary/20 overflow-x-hidden pt-20">
            {/* Header / Brand Bar */}
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-50 px-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden shadow-none">
                        {companyLogo ? (
                            <img src={getFileUrl(companyLogo)} className="size-full object-contain" alt={companyName} />
                        ) : (
                            <Briefcase className="size-5 text-slate-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 tracking-tight">{companyName}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider uppercase">Careers Portal</span>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div className="h-8 w-px bg-slate-100"></div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Available Roles: {jobs.length}</span>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-8 py-10">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto space-y-10 mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em]"
                    >
                        <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                        We're currently hiring
                    </motion.div>
                    
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl md:text-[5.5rem] font-heading font-black leading-[0.9] tracking-tight text-slate-900"
                        >
                            Build the future <br />
                            with <span className="text-primary italic font-serif font-light">{companyName}</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium"
                        >
                            Explore our open positions and find a role where you can grow, innovate, and make a real impact on our global mission.
                        </motion.p>
                    </div>
                </div>

                {/* Filter & Search */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 py-8 sticky top-20 bg-white/80 backdrop-blur-md z-40 border-b border-slate-50">
                    <div className="relative group w-full md:w-[450px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Find your next role..."
                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-semibold focus:ring-2 focus:ring-primary/10 focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg">
                            <Briefcase className="size-3.5 text-slate-400" />
                            <span className="text-xs font-bold text-slate-600 tracking-tight">{filteredJobs.length} Results</span>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredJobs.map((job, index) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex flex-col p-8 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] transition-all duration-500"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex flex-col gap-3">
                                            <div className="inline-flex px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/10">
                                                {job.department}
                                            </div>
                                            <h3 className="text-xl font-heading font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight">
                                                {job.title}
                                            </h3>
                                        </div>
                                        <div className="size-10 rounded-full border border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-slate-50 transition-all duration-300">
                                            <ArrowUpRight className="size-4 text-slate-400" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-4 mt-auto pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Globe className="size-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Remote / Hybrid</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Clock className="size-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Full Time</span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/jobs/${companyId}/apply/${job._id}`}
                                        className="mt-6 w-full h-12 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 hover:bg-primary transition-all active:scale-[0.98] shadow-none shadow-black/10"
                                    >
                                        Apply for role
                                        <ExternalLink className="size-3" />
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="py-32 text-center space-y-6 bg-slate-50/50 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center">
                        <div className="size-20 rounded-2xl bg-white shadow-none border border-slate-100 flex items-center justify-center text-slate-200">
                            <Search className="size-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-heading font-black text-slate-900">No roles match your search</h3>
                            <p className="text-sm text-slate-400 max-w-sm mx-auto font-medium italic">"Try searching for departments like Engineering, Sales, or Design"</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Simple Footer */}
            <footer className="py-20 border-t border-slate-100 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">
                        &copy; {new Date().getFullYear()} {companyName} &bull; All Rights Reserved
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Powered by</span>
                        <div className="px-2 py-1 rounded bg-slate-900 text-white text-[8px] font-black tracking-widest uppercase">Hiresphere</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
