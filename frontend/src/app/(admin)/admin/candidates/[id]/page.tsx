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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


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
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full flex items-center justify-center text-gray-900 font-bold">
                    HS
                </div>
            </div>
        );
    }

    if (!selectedCandidate) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-500 font-bold font-medium text-xs">Candidate not found</p>
                <Button variant="ghost" 
                    onClick={() => router.back()}
                    className="px-6 h-10 bg-white border border-gray-200/50 rounded-xl text-sm font-bold font-medium text-gray-500 hover:bg-gray-50 transition-all"
                >
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10">
            {/* Header / Back */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50 pb-8">
                <div className="flex items-center gap-6">
                    <Button variant="ghost" 
                        onClick={() => router.back()}
                        className="size-12 rounded-xl bg-white border border-gray-200/50 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-primary transition-all group active:scale-95"
                    >
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" />
                    </Button>
                    <div className="space-y-1.5">
                        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Candidate Profile</h1>
                        <div className="flex items-center gap-2 text-sm uppercase font-bold tracking-[0.2em] text-gray-500">
                            <span className="px-2 py-0.5 bg-gray-100 rounded-md">ID: {selectedCandidate._id.substring(0, 12)}</span>
                            <span className="size-1 bg-gray-100 rounded-full" />
                            <span>Registered Applicant</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Star className="size-4" />
                        Shortlist
                    </Button>
                    {selectedCandidate.resumeUrl && (
                        <a 
                            href={selectedCandidate.resumeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="h-11 px-6 rounded-xl bg-primary border border-gray-200/50 text-gray-900 text-sm font-bold font-medium hover:bg-gray-50 transition-all flex items-center gap-2.5 shadow-none shadow-slate-950/20 active:scale-95"
                        >
                            <Download className="size-4" />
                            Resume.pdf
                        </a>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Panel: Profile Summary */}
                <div className="lg:col-span-4 space-y-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 text-center relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                            <User className="size-48 text-gray-900" />
                        </div>
                        
                        <div className="relative z-10 space-y-10">
                            <div className="size-32 rounded-2xl border-4 border-gray-200/50 p-1 bg-white shadow-none overflow-hidden mx-auto group-hover:border-primary transition-all">
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCandidate.name}`} 
                                    alt={selectedCandidate.name} 
                                    className="size-full rounded-xl object-cover bg-gray-50" 
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedCandidate.name}</h2>
                                <div className="flex items-center justify-center gap-2 text-sm uppercase font-bold tracking-[0.2em] text-gray-900">
                                    <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    Candidate Status: {selectedCandidate.status}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200/50">
                                <Button variant="default" className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <UserPlus className="size-4 group-hover/btn:scale-110 transition-transform" />
                                    Hire Candidate
                                </Button>
                                <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                    <MessageSquare className="size-4" />
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 space-y-10"
                    >
                        <div className="flex items-center gap-3 px-1">
                            <div className="size-1 bg-primary rounded-full" />
                            <h3 className="text-sm font-bold text-gray-500 font-medium">Contact Information</h3>
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
                        className="bg-white border border-gray-200/50 rounded-2xl p-6 h-full space-y-10"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-1 bg-primary rounded-full" />
                                <h3 className="text-sm font-bold text-gray-500 font-medium">Professional Dossier</h3>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="space-y-4">
                                <p className="text-sm font-bold text-gray-500 font-medium ml-1">Professional Summary</p>
                                <div className="p-6 bg-gray-50 border border-gray-200/50 rounded-xl">
                                    <p className="text-gray-500 leading-relaxed text-sm font-medium">
                                        This candidate has applied through HireSphere and is currently in the <span className="text-gray-900 font-bold">{selectedCandidate.status}</span> stage. 
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

                            <div className="pt-10 border-t border-gray-200/50">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm font-bold text-gray-500 font-medium ml-1">Technical Competencies</p>
                                    <span className="text-sm font-bold text-gray-900 font-medium px-3 py-1 bg-gray-100 rounded-full">6 Verified Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {['React.js', 'TypeScript', 'Node.js', 'MongoDB', 'Next.js', 'TailwindCSS'].map(skill => (
                                        <span 
                                            key={skill} 
                                            className="px-5 h-10 flex items-center bg-white border border-gray-200/50 rounded-xl text-sm font-bold text-gray-500 hover:border-primary hover:text-gray-900 transition-all cursor-default group"
                                        >
                                            <div className="size-1.5 bg-gray-100 rounded-full mr-3 group-hover:bg-primary transition-colors" />
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
            <div className="size-12 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all">
                <Icon className="size-5" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-bold text-gray-500 font-medium leading-none mb-1.5">{label}</p>
                <p className="text-sm font-bold text-gray-900 tracking-tight truncate leading-none">{value}</p>
            </div>
        </div>
    );
}

function DetailCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
    return (
        <div className="p-6 bg-gray-50 border border-gray-200/50 rounded-2xl flex items-center gap-5 hover:bg-gray-50 hover:bg-white transition-all group">
            <div className="size-12 rounded-xl bg-white border border-gray-200/50 flex items-center justify-center text-gray-500 group-hover:text-gray-900 transition-all">
                <Icon className="size-5" />
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 font-medium leading-none mb-2">{label}</p>
                <p className="text-sm font-bold text-gray-900 leading-none">{value}</p>
            </div>
        </div>
    );
}
