'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    Download, 
    Calendar, 
    Briefcase, 
    GraduationCap, 
    MessageSquare, 
    UserPlus,
    User,
    ChevronRight,
    Star,
    Clock
} from 'lucide-react';

export default function CandidateProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedCandidate, loading, fetchCandidateById } = useAdminCandidateStore();

    useEffect(() => {
        if (id) {
            fetchCandidateById(id as string);
        }
    }, [id, fetchCandidateById]);

    if (loading && !selectedCandidate) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full flex items-center justify-center text-primary font-bold">
                    HS
                </div>
            </div>
        );
    }

    if (!selectedCandidate) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Candidate not found</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 h-10 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => router.back()}
                        className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm group active:scale-95"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    </button>
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Profile</h1>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
                            <span className="px-2 py-0.5 bg-slate-100 rounded-md">ID: {selectedCandidate._id.substring(0, 12)}</span>
                            <span className="size-1 bg-slate-300 rounded-full" />
                            <span>Registered Applicant</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="h-11 px-6 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all flex items-center gap-2.5 shadow-sm active:scale-95">
                        <Star className="size-4" />
                        Shortlist
                    </button>
                    {selectedCandidate.resumeUrl && (
                        <a 
                            href={selectedCandidate.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-11 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2.5 shadow-xl shadow-slate-950/20 active:scale-95"
                        >
                            <Download className="size-4" />
                            Resume.pdf
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Profile Summary */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 text-center shadow-sm relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <User className="size-48 text-slate-900" />
                        </div>
                        
                        <div className="relative z-10 space-y-8">
                            <div className="size-32 rounded-[2.5rem] border-4 border-slate-50 p-1 bg-white shadow-xl overflow-hidden mx-auto group-hover:border-primary transition-all">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} 
                                    alt={selectedCandidate.name} 
                                    className="size-full rounded-2xl object-cover bg-slate-50" 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedCandidate.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] text-primary">
                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    Candidate Status: {selectedCandidate.status}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-50">
                                <button className="h-12 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-950/20 active:scale-95 group/btn">
                                    <UserPlus className="size-4 group-hover/btn:scale-110 transition-transform" />
                                    Hire Candidate
                                </button>
                                <button className="h-12 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95">
                                    <MessageSquare className="size-4" />
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-8"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="size-1 bg-primary rounded-full" />
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <ContactItem icon={Mail} label="Email Address" value={selectedCandidate.email} />
                            <ContactItem icon={Phone} label="Phone Number" value={selectedCandidate.phone || 'Not provided'} />
                            <ContactItem icon={MapPin} label="Office Location" value="Remote / International" />
                        </div>
                    </motion.div>
                </div>

                {/* Right Panel: Experience & Skills */}
                <div className="lg:col-span-8 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm h-full space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-1 bg-primary rounded-full" />
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Professional Dossier</h3>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Professional Summary</p>
                                <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                        This candidate has applied through HireSphere and is currently in the <span className="text-primary font-bold">{selectedCandidate.status}</span> stage. 
                                        The profile details and resume indicate strong potential for the role. Further evaluations and 
                                        interviews will be scheduled to determine the ultimate fit for the company's culture and technical requirements.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailCard 
                                    label="Applied Date" 
                                    value={new Date(selectedCandidate.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                                    icon={Calendar} 
                                />
                                <DetailCard label="Experience Level" value={selectedCandidate.experience || 'Not specified'} icon={Briefcase} />
                                <DetailCard label="Academic Background" value={selectedCandidate.education || 'Not specified'} icon={GraduationCap} />
                                <DetailCard 
                                    label="Interview Progress" 
                                    value={selectedCandidate.status === 'Scheduled' ? '1 Session Active' : 'Waiting for Schedule'} 
                                    icon={Clock} 
                                />
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Technical Competencies</p>
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-full">6 Verified Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Next.js', 'TailwindCSS'].map(skill => (
                                        <span 
                                            key={skill} 
                                            className="px-5 h-10 flex items-center bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 hover:border-primary hover:text-primary transition-all cursor-default shadow-sm group"
                                        >
                                            <div className="size-1.5 bg-slate-200 rounded-full mr-3 group-hover:bg-primary transition-colors" />
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-center gap-5 group transition-transform hover:translate-x-1">
            <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-slate-900 tracking-tight truncate leading-none">{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center gap-5 hover:border-primary/30 hover:bg-white transition-all group shadow-sm">
            <div className="size-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all shadow-sm">
                <Icon className="size-5" />
            </div>
            <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</p>
                <p className="text-sm font-bold text-slate-900 leading-none">{value}</p>
            </div>
        </div>
    );
}
