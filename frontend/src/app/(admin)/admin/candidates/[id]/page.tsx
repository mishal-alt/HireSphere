'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';

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
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center text-primary">
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
                    className="px-6 h-10 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="size-10 rounded-xl bg-[#080808] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all group"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Candidate Profile</h1>
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">ID: {selectedCandidate._id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent"></div>
                        
                        <div className="relative z-10">
                            <div className="size-24 rounded-2xl overflow-hidden border-2 border-white/10 mx-auto mb-6 shadow-2xl shadow-primary/20">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} 
                                    alt={selectedCandidate.name} 
                                    className="size-full object-cover" 
                                />
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCandidate.name}</h2>
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-primary mt-2">Candidate Status: {selectedCandidate.status}</p>
                            
                            <div className="grid grid-cols-2 gap-3 mt-8">
                                <button className="h-11 rounded-xl bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    Message
                                </button>
                                <button className="h-11 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                                    Hire Now
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl"
                    >
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <ContactItem icon="mail" label="Email Address" value={selectedCandidate.email} />
                            <ContactItem icon="call" label="Phone Number" value={selectedCandidate.phone || 'Not provided'} />
                            <ContactItem icon="location_on" label="Location" value="Remote / International" />
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Resume / Details */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl h-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">About Candidate</h3>
                            {selectedCandidate.resumeUrl && (
                                <a 
                                    href={selectedCandidate.resumeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all hover:bg-white/10"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Resume.pdf
                                </a>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Professional Summary</p>
                                <p className="text-slate-400 leading-relaxed text-sm">
                                    This candidate has applied through HireSphere and is currently in the {selectedCandidate.status} stage. 
                                    The profile details and resume indicate strong potential for the role. Further evaluations and 
                                    interviews will be scheduled to determine the ultimate fit for the company's culture and technical requirements.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailCard label="Applied Date" value="March 12, 2026" icon="event" />
                                <DetailCard label="Experience" value="5+ Years" icon="work_history" />
                                <DetailCard label="Education" value="B.Tech Computer Science" icon="school" />
                                <DetailCard label="Interview Rounds" value="3 Scheduled" icon="conversion_path" />
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-5">Technical Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Next.js', 'TailwindCSS'].map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-[10px] font-bold text-primary">
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

function ContactItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="size-10 rounded-xl bg-[#121212] flex items-center justify-center text-primary shrink-0 border border-white/5 shadow-inner">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-transparent">{label}</p>
                <p className="text-[11px] font-bold text-white tracking-tight truncate mt-0.5">{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="p-4 bg-[#121212] border border-white/5 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all group">
            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-bold text-white mt-0.5">{value}</p>
            </div>
        </div>
    );
}
