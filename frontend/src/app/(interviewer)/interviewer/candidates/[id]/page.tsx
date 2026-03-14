'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';

export default function InterviewerCandidateProfilePage() {
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
            <div className="h-96 flex flex-col items-center justify-center space-y-4 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Candidate profile trace unavailable</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 h-10 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                >
                    Back to Matrix
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
                    className="size-10 rounded-xl bg-[#080808] border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all group shadow-xl"
                >
                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tighter italic uppercase">Candidate Profile Trace_</h1>
                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 italic">ID_SYSTEM_EXTRACT: {selectedCandidate._id}</p>
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
                            <div className="size-24 rounded-2xl overflow-hidden border-2 border-white/10 mx-auto mb-6 shadow-2xl shadow-primary/20 bg-[#121212] flex items-center justify-center">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} 
                                    alt={selectedCandidate.name} 
                                    className="size-full object-cover" 
                                />
                            </div>
                            
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{selectedCandidate.name}</h2>
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-primary mt-2">Pipeline Status: {selectedCandidate.status}</p>
                            
                            <button className="w-full h-11 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all mt-8">
                                Initiate Message Protocol
                            </button>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl space-y-6"
                    >
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Communication Channels_</h3>
                        <div className="space-y-6">
                            <ContactItem icon="mail" label="Digital Address" value={selectedCandidate.email} />
                            <ContactItem icon="call" label="Audio Line" value={selectedCandidate.phone || 'Trace Unavailable'} />
                            <ContactItem icon="location_on" label="Origin Node" value="Remote Terminal" />
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
                        className="bg-[#080808] border border-white/5 rounded-3xl p-8 shadow-2xl h-full space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Bio-Data Extract_</h3>
                            {selectedCandidate.resumeUrl && (
                                <a 
                                    href={selectedCandidate.resumeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/20 transition-all shadow-lg shadow-primary/10"
                                >
                                    <span className="material-symbols-outlined text-sm">description</span>
                                    Resume_Trace.pdf
                                </a>
                            )}
                        </div>

                        <div className="space-y-8">
                            <div className="p-6 bg-[#121212] border border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Professional Profile Summary_</p>
                                <p className="text-slate-400 leading-relaxed text-sm font-medium">
                                    This talent trace has been synchronized with the HireSphere network. Currently at the {selectedCandidate.status} stage, 
                                    preliminary data points suggest significant alignment with designated protocols. Bio-data highlights 
                                    expertise that requires further validation during evaluation cycles.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailCard label="Indexed Date" value="March 12, 2026" icon="event" />
                                <DetailCard label="Experience Cycle" value="5+ Years" icon="work_history" />
                                <DetailCard label="Academic Node" value="CS Discipline" icon="school" />
                                <DetailCard label="Evaluation Phases" value="Multi-Round Pipeline" icon="conversion_path" />
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-5 italic">Technical Skill matrix_</p>
                                <div className="flex flex-wrap gap-2">
                                    {['React.js', 'TypeScript', 'Node.js', 'System Arch', 'Modern UI', 'Data Flow'].map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">
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
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{label}</p>
                <p className="text-[11px] font-black text-white tracking-tight truncate mt-0.5 italic">{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon }: { label: string; value: string; icon: string }) {
    return (
        <div className="p-5 bg-[#121212] border border-white/5 rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-all group">
            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary transition-all">
                <span className="material-symbols-outlined text-lg">{icon}</span>
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                <p className="text-xs font-black text-white mt-0.5 uppercase italic">{value}</p>
            </div>
        </div>
    );
}
