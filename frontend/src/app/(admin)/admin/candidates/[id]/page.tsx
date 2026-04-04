'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAdminCandidateStore } from '@/store/useAdminCandidateStore';
import { useDeleteCandidate, useHireCandidate, useRejectCandidate, useSimulateSignature } from '@/hooks/useCandidates';
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
    Clock,
    Trash2,
    Loader2,
    ShieldCheck,
    CircleCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StatusBadge } from '@/components/ui/status-badge';
import MessageModal from '@/components/admin/MessageModal';
import GenerateOfferModal from '@/components/admin/GenerateOfferModal';
import { toast } from 'react-hot-toast';


export default function CandidateProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { selectedCandidate, loading, fetchCandidateById } = useAdminCandidateStore();
    const deleteMutation = useDeleteCandidate();
    const hireMutation = useHireCandidate();
    const rejectMutation = useRejectCandidate();
    const simulateSignatureMutation = useSimulateSignature();
    
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = React.useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = React.useState(false);

    const handleHireClick = () => {
        setIsOfferModalOpen(true);
    };

    const handleSimulateSignature = async () => {
        if (!selectedCandidate || !id) return;
        if (!confirm(`Simulate candidate signature for ${selectedCandidate.name}?`)) return;

        try {
            setIsProcessing(true);
            await simulateSignatureMutation.mutateAsync(id as string);
            toast.success('Offer Signed! Candidate is now Hired.');
            fetchCandidateById(id as string);
        } catch (error) {
            toast.error('Simulation failed.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedCandidate || !id) return;
        if (!confirm('Move this candidate to Rejected status?')) return;
        
        try {
            setIsProcessing(true);
            await rejectMutation.mutateAsync(id as string);
            toast.success('Candidate rejected.');
            fetchCandidateById(id as string); // Refresh data
        } catch (error) {
            toast.error('Failed to update status.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedCandidate || !id) return;
        if (!confirm('Are you sure you want to remove this candidate? This action cannot be undone.')) return;
        
        try {
            setIsDeleting(true);
            await deleteMutation.mutateAsync(id as string);
            router.push('/admin/candidates');
        } catch (error) {
            console.error('Failed to delete candidate:', error);
            toast.error('Failed to delete record.');
        } finally {
            setIsDeleting(false);
        }
    };

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
                            
                            <div className="flex flex-col items-center gap-2">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{selectedCandidate.name}</h2>
                                <StatusBadge status={selectedCandidate.status || 'New'} score={selectedCandidate.atsScore} />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200/50">
                                {selectedCandidate.status === 'Offered' ? (
                                    <Button 
                                        variant="default" 
                                        className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-50"
                                        onClick={handleSimulateSignature}
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                                        Simulate Final Signing
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="default" 
                                        className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-50"
                                        onClick={handleHireClick}
                                        disabled={isProcessing || selectedCandidate.status === 'Hired (Signed)'}
                                    >
                                        {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                                        {selectedCandidate.status === 'Hired (Signed)' ? 'Candidate Hired' : 'Hire Candidate'}
                                    </Button>
                                )}
                                <Button 
                                    variant="outline" 
                                    onClick={() => setIsMessageModalOpen(true)}
                                    className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageSquare className="size-4" />
                                    Send Message
                                </Button>
                                {selectedCandidate.status !== 'Rejected' && (
                                    <Button 
                                        variant="outline" 
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="bg-white hover:bg-red-50 border border-red-100 text-red-600 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        Reject Application
                                    </Button>
                                )}
                                <Button 
                                    variant="outline" 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-gray-50 hover:bg-red-50 border border-gray-100/50 hover:border-red-200 text-gray-400 hover:text-red-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                    Delete Record
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
                                    value={selectedCandidate.interviews?.length ? `${selectedCandidate.interviews.length} Sessions Conducted` : 'Waiting for Schedule'} 
                                    icon={Clock} 
                                />
                            </div>

                            {/* 🚀 NEW: Interview Evaluation Insights */}
                            {selectedCandidate.interviews && selectedCandidate.interviews.filter(i => i.status === 'Evaluated').length > 0 && (
                                <div className="pt-10 border-t border-gray-200/50">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="size-1.5 bg-primary rounded-full" />
                                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none">Interview Evaluation Insight</h3>
                                        </div>
                                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[9px] uppercase tracking-widest px-3">EVALUATED</Badge>
                                    </div>

                                    <div className="space-y-6">
                                        {selectedCandidate.interviews.filter(i => i.status === 'Evaluated').map((interview: any, idx: number) => (
                                            <div key={interview._id} className="bg-gray-50/50 border border-gray-100 rounded-[2rem] p-8 space-y-8">
                                                {/* Header & Ratings */}
                                                <div className="flex flex-col md:flex-row justify-between gap-8">
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Evaluator</p>
                                                        <h4 className="text-lg font-bold text-gray-900 tracking-tight">{interview.interviewerId?.name}</h4>
                                                        <p className="text-xs text-gray-500 font-medium">{new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                                        {[
                                                            { key: 'technical', label: 'Technical' },
                                                            { key: 'communication', label: 'Communication' },
                                                            { key: 'problemSolving', label: 'Problem Solving' },
                                                            { key: 'culturalFit', label: 'Cultural Fit' }
                                                        ].map((metric) => {
                                                            const val = interview.ratings?.[metric.key] || 0;
                                                            return (
                                                                <div key={metric.key} className="space-y-2">
                                                                    <div className="flex items-center justify-between gap-10">
                                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{metric.label}</span>
                                                                        <span className="text-sm font-black text-emerald-600">{val}/5</span>
                                                                    </div>
                                                                    <div className="h-1.5 w-32 bg-gray-200 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${(val/5)*100}%` }} />
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Comments */}
                                                <div className="pt-8 border-t border-gray-200/30">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <MessageSquare className="size-4 text-emerald-600" />
                                                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Interviewer Observations</span>
                                                    </div>
                                                    <div className="p-6 bg-white border border-gray-100 rounded-2xl">
                                                        <p className="text-sm font-medium text-gray-500 italic leading-relaxed whitespace-pre-wrap">
                                                            "{interview.evaluationComments || interview.notes || "No detailed observations were recorded for this session."}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-10 border-t border-gray-200/50">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-sm font-bold text-gray-500 font-medium ml-1">Matched Skills (ATS: {selectedCandidate.atsScore || 0}%)</p>
                                    <span className="text-sm font-bold text-gray-900 font-medium px-3 py-1 bg-gray-100 rounded-full">{(selectedCandidate.matchedSkills || []).length} Verified Skills</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCandidate.matchedSkills && selectedCandidate.matchedSkills.length > 0 ? (
                                        selectedCandidate.matchedSkills.map((skill: string) => (
                                            <span 
                                                key={skill} 
                                                className="px-5 h-10 flex items-center bg-emerald-50/50 border border-emerald-200/50 rounded-xl text-sm font-bold text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-default group"
                                            >
                                                <div className="size-1.5 bg-emerald-500 rounded-full mr-3 group-hover:scale-125 transition-transform" />
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 font-medium italic">No specific skills matched by ATS.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <MessageModal 
                isOpen={isMessageModalOpen}
                onClose={() => setIsMessageModalOpen(false)}
                candidateId={selectedCandidate._id}
                candidateName={selectedCandidate.name}
                candidateEmail={selectedCandidate.email}
            />

            <GenerateOfferModal 
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                candidateId={selectedCandidate._id}
                candidateName={selectedCandidate.name}
            />
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
