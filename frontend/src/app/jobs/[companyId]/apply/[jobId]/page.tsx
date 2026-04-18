'use client';

import React, { useEffect, useState, use } from 'react';
import api, { getFileUrl } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { 
    ArrowLeft, 
    Briefcase, 
    Calendar, 
    Clock, 
    FileText, 
    CircleCheck, 
    ChevronRight,
    UploadCloud,
    User,
    Mail,
    Phone,
    Check,
    Ban,
    GraduationCap,
    History
} from 'lucide-react';

interface Job {
    _id: string;
    title: string;
    department: string;
    description: string;
    companyId: {
        _id: string;
        name: string;
        logoUrl?: string;
    };
}

export default function JobApplyPage({ params }: { params: Promise<{ companyId: string, jobId: string }> }) {
    const p = use(params);
    const companyId = p.companyId?.trim();
    const jobId = p.jobId?.trim();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        experience: '',
        education: '',
    });
    const [resume, setResume] = useState<File | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/public/job/${jobId}`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                toast.error('Could not load job details.');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [jobId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume) {
            toast.error('Please upload your resume.');
            return;
        }

        setSubmitting(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('experience', formData.experience);
        data.append('education', formData.education);
        data.append('companyId', companyId);
        data.append('jobId', jobId);
        data.append('resume', resume);

        try {
            await api.post('/public/apply', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSubmitted(true);
            toast.success('Application submitted successfully!');
        } catch (error: any) {
            console.error('Submission error:', error);
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="size-10 border-2 border-slate-200 border-t-primary rounded-full" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-6 font-heading font-bold">
                <Ban className="size-12 text-slate-300" />
                <h2 className="text-2xl text-slate-900">Position has been archived</h2>
                <Link href={`/jobs/${companyId}`} className="text-primary hover:underline text-sm font-bold uppercase tracking-widest">Back to Careers</Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FFFFFF] text-slate-900 min-h-screen font-body selection:bg-primary/20 overflow-x-hidden pt-20 pb-40">
            <header className="fixed top-0 left-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-50 px-8 flex items-center justify-between">
                <Link href={`/jobs/${companyId}`} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold group">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-widest">Job List</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="size-9 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {job.companyId.logoUrl ? (
                            <img src={getFileUrl(job.companyId.logoUrl)} className="size-full object-contain" alt={job.companyId.name} />
                        ) : (
                            <Briefcase className="size-4 text-slate-300" />
                        )}
                    </div>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{job.companyId.name}</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-8 relative z-10 pt-8">
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div 
                            key="form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
                        >
                            {/* Left: Job Details */}
                            <div className="lg:col-span-7 space-y-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                                        <span className="size-1 bg-emerald-500 rounded-full animate-pulse" />
                                        Actively Recruiting
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-heading font-black leading-tight text-slate-900 tracking-tight">
                                        {job.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-8 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                <Briefcase className="size-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Department</span>
                                                <span className="text-xs font-bold text-slate-700">{job.department}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                                <Clock className="size-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Work Type</span>
                                                <span className="text-xs font-bold text-slate-700">Full Time</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-slate max-w-none bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-[0.2em] mb-8">Role Description</h3>
                                    <div 
                                        className="text-slate-600 leading-relaxed font-medium text-sm antialiased rich-text-content"
                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                    />
                                </div>
                            </div>

                            {/* Right: Application Form */}
                            <div className="lg:col-span-5 sticky top-32">
                                <form 
                                    onSubmit={handleSubmit}
                                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] space-y-8"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-heading font-black text-slate-900 tracking-tight">Quick Application</h3>
                                        <p className="text-xs text-slate-400 font-medium">Takes less than 2 minutes to apply.</p>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="Marcus Miller"
                                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    required
                                                    type="email" 
                                                    placeholder="marcus@example.com"
                                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone (Optional)</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    type="tel" 
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Experience (Years)</label>
                                            <div className="relative group">
                                                <History className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="e.g. 5+ Years"
                                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Highest Education</label>
                                            <div className="relative group">
                                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                                                <input 
                                                    required
                                                    type="text" 
                                                    placeholder="e.g. B.Tech Computer Science"
                                                    className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-200"
                                                    value={formData.education}
                                                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                                                />
                                            </div>
                                        </div>

                                        {/* Resume Upload */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Resume / CV (PDF)</label>
                                            <div className="relative group/upload h-32">
                                                <input 
                                                    id="resume"
                                                    type="file" 
                                                    accept=".pdf"
                                                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`h-full border border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${resume ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 group-hover/upload:border-primary group-hover/upload:bg-primary/[0.01]'}`}>
                                                    {resume ? (
                                                        <CircleCheck className="size-6 text-emerald-500" />
                                                    ) : (
                                                        <UploadCloud className="size-6 text-slate-300 group-hover/upload:text-primary transition-colors" />
                                                    )}
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-slate-700 tracking-tight">
                                                            {resume ? resume.name : 'Upload your professional CV'}
                                                        </p>
                                                        <p className="text-[8px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                                                            {resume ? `${(resume.size / 1024 / 1024).toFixed(2)} MB` : 'PDF only, max 5MB'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full h-14 bg-slate-900 text-white text-[10px] uppercase font-black tracking-[0.3em] rounded-xl shadow-none hover:bg-primary hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group/btn"
                                    >
                                        {submitting ? 'Processing...' : 'Submit Application'}
                                        {!submitting && <ChevronRight className="size-3 transition-transform group-hover/btn:translate-x-1" />}
                                    </button>

                                    <p className="text-[9px] text-center font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                        Securely protected by standard <br /> Privacy Policy.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl mx-auto py-16 text-center space-y-10"
                        >
                            <div className="size-24 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto shadow-[0_32px_64px_-12px_rgba(16,185,129,0.3)]">
                                <Check className="size-10 stroke-[3px]" />
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-4xl font-heading font-black text-slate-900 tracking-tight">You're all set!</h1>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto antialiased">
                                    Thanks for applying, **{formData.name.split(' ')[0]}**. We've received your profile and our team will get back to you soon.
                                </p>
                            </div>
                            <div className="pt-8">
                                <Link 
                                    href={`/jobs/${companyId}`}
                                    className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-[0.2em] h-14 px-10 rounded-xl hover:bg-black transition-all"
                                >
                                    Browse more roles <ChevronRight className="size-3" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer className="py-20 border-t border-slate-100 text-center">
                <div className="max-w-4xl mx-auto">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">
                        &copy; {new Date().getFullYear()} {job.companyId.name} &bull; All Rights Reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}
