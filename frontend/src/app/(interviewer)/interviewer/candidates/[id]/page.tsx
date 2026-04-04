'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCandidate } from '@/hooks/useCandidates';
import { 
    ArrowLeft, 
    Mail, 
    Phone, 
    MapPin, 
    FileText, 
    ExternalLink, 
    Calendar, 
    Briefcase, 
    GraduationCap, 
    Layers, 
    MessageSquare,
    CircleCheck,
    Clock,
    UserCheck,
    Contact,
    Shield
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function InterviewerCandidateProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: selectedCandidate, isLoading } = useCandidate(id as string);

    if (isLoading && !selectedCandidate) {
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-emerald-800 border-t-transparent rounded-full" />
            </div>
    }

    if (!selectedCandidate) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="bg-gray-50 size-20 rounded-full flex items-center justify-center border border-gray-100 mb-4 shadow-none">
                    <UserCheck className="size-10 text-slate-200" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">Entity Not Located</h3>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Candidate profile missing from terminal</p>
                </div>
                <Button variant="ghost"
                    onClick={() => router.back()}
                    className="px-8 h-11 bg-emerald-800 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2"
                >
                    <ArrowLeft className="size-3.5" />
                    Return to Directory
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 max-w-6xl mx-auto">
            {/* Header / Back */}
            <div className="flex items-center justify-between border-b border-gray-200/50 pb-8">
                <div className="flex items-center gap-6">
                    <Button variant="ghost"
                        onClick={() => router.back()}
                        className="size-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 border border-transparent transition-all bg-white shadow-sm"
                    >
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Personnel Dossier</h1>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                            <Shield className="size-3 text-emerald-800" />
                            UID: {selectedCandidate._id.slice(-12)} • Verified Secure
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <MessageSquare className="size-3.5" />
                        Initiate Comms
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - Profile Card & Contact */}
                <div className="lg:col-span-4 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-transparent border-b border-gray-200/50 py-6 shadow-none relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-24 bg-gray-50 border-b border-gray-200/50"></div>

                        <div className="relative z-10 text-center">
                            <div className="size-28 rounded-xl overflow-hidden border-4 border-white mx-auto mb-6 shadow-none bg-white group hover:scale-[1.02] transition-transform shadow-slate-200">
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`}
                                    alt={selectedCandidate.name}
                                    className="size-full object-cover bg-gray-50"
                                />
                            </div>

                            <h2 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">{selectedCandidate.name}</h2>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-4 italic">Qualified Applicant</p>
                            
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 text-[10px] font-medium uppercase tracking-widest text-gray-600 shadow-none leading-none">
                                <div className={`size-1.5 rounded-full ${selectedCandidate.status === 'Hired' ? 'bg-emerald-500' : 'bg-sky-500'} animate-pulse`}></div>
                                {selectedCandidate.status || 'Under Review'}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-transparent border-b border-gray-200/50 py-6 shadow-none space-y-12"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2 leading-none">
                                <Contact className="size-3 text-gray-400" />
                                Secure Connectivity
                            </h3>
                        </div>
                        <div className="space-y-6 pt-2">
                            <ContactItem icon={Mail} label="Transmission Node" value={selectedCandidate.email} />
                            <ContactItem icon={Phone} label="Direct Frequency" value={selectedCandidate.phone || '000-000-0000'} />
                            <ContactItem icon={MapPin} label="Geographic Hub" value="Global / Hybrid" />
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Resume / Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-transparent border-b border-gray-200/50 py-6 shadow-none space-y-12"
                    >
                        <div className="flex items-center justify-between pb-6 border-b border-gray-200/50">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-800 p-2 rounded-lg text-white shadow-sm">
                                    <Layers className="size-4 text-emerald-400" />
                                </div>
                                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.2em] leading-none">Professional Summary</h2>
                            </div>
                            
                            {selectedCandidate.resumeUrl && (
                                <a
                                    href={selectedCandidate.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-10 px-4 flex items-center gap-3 bg-white text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                                >
                                    <FileText className="size-3.5" />
                                    Access Resume
                                    <ExternalLink className="size-3 text-emerald-400" />
                                </a>
                            )}
                        </div>

                        <div className="space-y-12">
                            <div className="p-6 bg-gray-50 border border-gray-100 rounded-xl relative group overflow-hidden">
                                <div className="absolute -right-2 -bottom-2 text-slate-200/20 group-hover:scale-110 transition-transform duration-700">
                                    <MessageSquare className="size-24" />
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 italic leading-none">Preliminary Overview:</p>
                                <p className="text-gray-600 leading-relaxed text-sm font-medium relative z-10 selection:bg-emerald-100 selection:text-emerald-900">
                                    Candidate profile is currently indexed and active within the central recruitment hub. 
                                    Performance analytics suggest high technical compatibility for the target position. 
                                    Current status is registered as <span className="text-emerald-800 font-bold underline decoration-emerald-100">{selectedCandidate.status}</span>.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailCard 
                                    label="Registered On" 
                                    value={new Date(selectedCandidate.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} 
                                    icon={Calendar} 
                                />
                                <DetailCard label="Industry Exp" value={selectedCandidate.experience || 'Not Verified'} icon={Briefcase} />
                                <DetailCard label="Specialization" value={selectedCandidate.education || 'Generalist'} icon={GraduationCap} />
                                <DetailCard label="Pipeline State" value={selectedCandidate.status || 'Evaluation'} icon={UserCheck} />
                            </div>

                            <div className="pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-6 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                    <Shield className="size-3" />
                                    Competency Cluster
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['React.js', 'Node.js', 'TypeScript', 'DevOps', 'UI Architecture', 'Security Protocol'].map(skill => (
                                        <span key={skill} className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase tracking-widest shadow-sm hover:border-emerald-800 hover:text-emerald-800 transition-all cursor-default">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Info */}
                    <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2 italic">
                            <Clock className="size-3" />
                            File synchronized with cloud hub
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-900">
                            <CircleCheck className="size-3" />
                            Data Validated
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="flex items-start gap-6 group">
            <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 shadow-sm group-hover:bg-emerald-800 group-hover:text-white transition-all">
                <Icon className="size-4.5 group-hover:text-emerald-400" />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1 leading-none">{label}</p>
                <p className="text-sm font-medium text-gray-900 tracking-tight italic truncate">{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="p-5 bg-white rounded-xl flex items-center gap-6 hover:border-emerald-800 hover:shadow-md transition-all group border border-transparent shadow-sm">
            <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-800 group-hover:text-white transition-all shadow-sm">
                <Icon className="size-5 group-hover:text-emerald-400" />
            </div>
            <div>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
                <p className="text-xs font-bold text-gray-900 uppercase italic leading-none">{value}</p>
            </div>
        </div>
    );
}
