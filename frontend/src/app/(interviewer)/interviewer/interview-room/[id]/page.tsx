'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Video, 
    VideoOff, 
    Mic, 
    MicOff, 
    MonitorUp, 
    PhoneOff, 
    FileText, 
    User, 
    Calendar,
    ChevronLeft,
    Save,
    LayoutPanelLeft,
    Clock,
    AlertCircle,
    CircleCheck,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInterview, useStartInterview, useSaveInterviewNotes } from '@/hooks/useInterviews';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'react-hot-toast';

export default function InterviewRoomPage() {
    const { id } = useParams() as { id: string };
    const { user } = useAuthStore();
    const router = useRouter();
    const { data: interview, isLoading, isError } = useInterview(id);
    const startInterview = useStartInterview();
    const saveNotes = useSaveInterviewNotes();

    const [activeTab, setActiveTab] = useState('notes');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOngoing, setIsOngoing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // 📹 WEBRTC ENGINE
    const { 
        localStream, 
        remoteStream, 
        isMuted, 
        isCamOff, 
        isScreenSharing,
        connectionStatus, 
        toggleMute, 
        toggleCamera,
        toggleScreenShare
    } = useWebRTC(id, user?._id || '');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Attach streams to video elements
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Sync initial notes from DB
    useEffect(() => {
        if (interview?.notes) {
            setNotes(interview.notes);
        }
        if (interview?.status === 'Ongoing') {
            setIsOngoing(true);
        }
    }, [interview]);

    // Handle Fullscreen Exit (via ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        const element = document.getElementById('video-container');
        if (!document.fullscreenElement) {
            element?.requestFullscreen().catch(err => {
                toast.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Auto-save logic (Debounced)
    useEffect(() => {
        if (!interview) return;
        
        const delayDebounceFn = setTimeout(() => {
            if (notes !== (interview.notes || '')) {
                handleSaveNotes();
            }
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [notes, interview]);

    const handleSaveNotes = async () => {
        setIsSaving(true);
        try {
            await saveNotes.mutateAsync({ id, notes });
        } catch (error) {
            console.error("Save notes error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStartInterview = async () => {
        try {
            await startInterview.mutateAsync(id);
            setIsOngoing(true);
            toast.success("Interview session started!");
        } catch (error) {
            toast.error("Failed to start session.");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <LogoLoader size="large" />
            </div>
        );
    }

    if (isError || !interview) {
        return (
            <div className="h-screen flex items-center justify-center bg-white p-8">
                <Card className="max-w-md w-full p-8 text-center border-dashed">
                    <AlertCircle className="size-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900">Room Not Found</h2>
                    <p className="text-sm text-gray-500 mt-2">The interview session you're looking for doesn't exist or has been moved.</p>
                    <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">
            {/* Left Column: Video & Media Controls */}
            <div className="flex-1 flex flex-col p-6 space-y-6">
                {/* Video Container (Phase 16 Implementation) */}
                <div id="video-container" className="relative flex-1 bg-gray-950 rounded-3xl overflow-hidden shadow-2xl group border-4 border-white ring-1 ring-gray-200">
                    {!isOngoing ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/40 backdrop-blur-md z-30">
                            <div className="size-24 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-2xl border border-white/20 overflow-hidden">
                                <img src="/favicon.png" className="size-full object-cover" />
                            </div>
                            <h3 className="text-white font-semibold text-xl tracking-tight">Ready to begin?</h3>
                            <p className="text-gray-400 text-sm mt-2 mb-8">Candidate is in the waiting room.</p>
                            <Button 
                                onClick={handleStartInterview}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-2xl text-md font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl"
                            >
                                Start Interview
                            </Button>
                        </div>
                    ) : null}

                    {/* MAIN HERO VIDEO (Candidate) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                        {remoteStream ? (
                            <video 
                                ref={remoteVideoRef}
                                autoPlay 
                                playsInline 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="size-20 rounded-full border-4 border-white/5 border-t-white animate-spin mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Establishing Secure Link...</p>
                                <p className="text-[9px] font-medium text-emerald-500 uppercase tracking-widest">{connectionStatus}</p>
                            </div>
                        )}
                        
                        {/* 💎 BRAND WATERMARK */}
                        <div className="absolute bottom-8 left-8 flex items-center gap-2 opacity-30 select-none pointer-events-none group-hover:opacity-60 transition-opacity duration-700">
                             <div className="size-6 bg-white rounded-md flex items-center justify-center p-0.5 overflow-hidden">
                                <img src="/favicon.png" className="size-full object-cover grayscale" />
                             </div>
                             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic">HireSphere</span>
                        </div>
                    </div>

                    {/* PIP VIDEO (Self-View - Interviewer) */}
                    <motion.div 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        className="absolute bottom-8 right-8 size-56 bg-gray-900 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-40 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                    >
                        <video 
                            ref={localVideoRef}
                            autoPlay 
                            muted // Always mute self locally
                            playsInline 
                            className={`w-full h-full object-cover ${isCamOff ? 'hidden' : ''}`}
                        />
                        {isCamOff && (
                            <div className="size-full flex flex-col items-center justify-center gap-3 bg-gray-800">
                                <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <VideoOff className="size-8 text-white/20" />
                                </div>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Camera Off</span>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur rounded-full border border-white/10">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-white uppercase tracking-widest">Self View</span>
                        </div>
                    </motion.div>
                    
                    {/* Floating Overlay for Candidate Info */}
                    <div className="absolute top-8 left-8 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pr-6 rounded-2xl border border-white/10 shadow-lg">
                        <div className="size-12 rounded-xl overflow-hidden border border-white/10 p-0.5">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`} alt="" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{interview.candidateId?.name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div className="size-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] text-white/60 font-medium">Session Optimized</span>
                            </div>
                        </div>
                    </div>

                    {/* MODERN FLOATING CONTROL BAR (Premium) */}
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-5 z-50 bg-black/40 backdrop-blur-3xl border border-white/20 p-5 px-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                         <Button 
                            onClick={toggleMute}
                            className={`size-14 rounded-2xl transition-all flex items-center justify-center border-2 ${isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/20'} shadow-none`}
                            title={isMuted ? "Unmute Mic" : "Mute Mic"}
                        >
                            {isMuted ? <MicOff className="size-6" /> : <Mic className="size-6" />}
                        </Button>

                        <Button 
                            onClick={toggleCamera}
                            className={`size-14 rounded-2xl transition-all flex items-center justify-center border-2 ${isCamOff ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/20'} shadow-none`}
                            title={isCamOff ? "Turn Camera On" : "Turn Camera Off"}
                        >
                            {isCamOff ? <VideoOff className="size-6" /> : <Video className="size-6" />}
                        </Button>

                        <Button 
                            onClick={toggleScreenShare}
                            className={`size-14 rounded-2xl transition-all flex items-center justify-center border-2 ${isScreenSharing ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 text-white hover:bg-white/20'} shadow-none`}
                            title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
                        >
                            <MonitorUp className={`size-6 ${isScreenSharing ? 'animate-pulse' : ''}`} />
                        </Button>

                        <div className="h-10 w-px bg-white/10 mx-2" />

                        <Button 
                            onClick={toggleFullscreen}
                            className={`size-14 rounded-2xl bg-white/5 border-2 border-white/10 text-white hover:bg-white/20 transition-all shadow-none`}
                            title="Toggle Fullscreen"
                        >
                            <LayoutPanelLeft className="size-6" />
                        </Button>

                        <Button 
                            className="h-14 px-8 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-widest text-[10px] transition-all shadow-xl active:scale-95 flex items-center gap-3"
                            onClick={() => router.push('/interviewer/interviews')}
                        >
                            <PhoneOff className="size-4" />
                            Leave
                        </Button>
                    </motion.div>
                </div>

                {/* Bottom Stats / Metadata */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Scheduled Time', value: new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), icon: Clock },
                        { label: 'Candidate Email', value: interview.candidateId?.email, icon: User },
                        { label: 'Session Type', value: interview.title || 'Technical', icon: FileText },
                        { label: 'Network status', value: connectionStatus, icon: CircleCheck, color: connectionStatus === 'Connected' ? 'text-emerald-500' : 'text-amber-500' }
                    ].map((item, i) => (
                        <Card key={i} className="p-4 bg-white border-none shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-gray-900 shrink-0">
                                <item.icon className={`size-5 ${item.color || ''}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                                <p className="text-xs font-semibold text-gray-900 truncate">{item.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right Column: Activity Hub (Tabs) */}
            <div className="w-[450px] bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                <Tabs defaultValue="notes" className="flex-1 flex flex-col pt-4">
                    <div className="px-6 pb-4 border-b border-gray-50">
                        <TabsList className="grid grid-cols-3 bg-gray-100 rounded-xl h-12 p-1 gap-1">
                            <TabsTrigger value="notes" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <Save className="size-3.5" />
                                Notes
                            </TabsTrigger>
                            <TabsTrigger value="resume" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <FileText className="size-3.5" />
                                Resume
                            </TabsTrigger>
                            <TabsTrigger value="details" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                <LayoutPanelLeft className="size-3.5" />
                                Info
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <TabsContent value="notes" className="h-full m-0 p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Interviewer Notepad</h3>
                                <div className="flex items-center gap-2">
                                     <span className={`text-[9px] font-bold uppercase tracking-widest ${isSaving ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {isSaving ? 'Syncing...' : 'Changes Saved'}
                                    </span>
                                    {isSaving ? (
                                        <div className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    ) : (
                                        <div className="size-1.5 rounded-full bg-emerald-500" />
                                    )}
                                </div>
                            </div>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Type your observations here... (Auto-saving enabled)"
                                className="flex-1 w-full bg-gray-50/50 rounded-2xl p-6 text-sm text-gray-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none font-medium leading-relaxed"
                            />
                             <div className="p-4 bg-gray-50 rounded-b-[2rem] flex justify-end gap-2">
                                <Button 
                                    className="bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl px-10 h-14 font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 group/finalize"
                                    onClick={() => router.push(`/interviewer/evaluation?id=${id}`)}
                                >
                                    Finalize Assessment
                                    <ExternalLink className="size-4 group-hover/finalize:translate-x-1 transition-transform" />
                                </Button>
                             </div>
                        </TabsContent>

                        <TabsContent value="resume" className="h-full m-0 bg-gray-100 relative group">
                             {interview.candidateId?.resumeUrl ? (
                                <>
                                    <iframe 
                                        src={interview.candidateId.resumeUrl.startsWith('http') 
                                            ? interview.candidateId.resumeUrl 
                                            : `${process.env.NEXT_PUBLIC_API_URL}${interview.candidateId.resumeUrl}#toolbar=0`
                                        } 
                                        className="w-full h-full border-none"
                                    />
                                    {/* Quick Link Overlay */}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="bg-white/90 backdrop-blur shadow-lg border-gray-200 text-[10px] font-bold uppercase tracking-widest gap-2 h-9 rounded-xl"
                                            onClick={() => window.open(interview.candidateId?.resumeUrl, '_blank')}
                                        >
                                            <ExternalLink className="size-3.5" />
                                            View Full
                                        </Button>
                                    </div>
                                </>
                             ) : (
                                 <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                                     <div className="size-20 rounded-3xl bg-white flex items-center justify-center mb-6 shadow-sm">
                                        <AlertCircle className="size-8 text-gray-300" />
                                     </div>
                                     <p className="text-sm font-semibold text-gray-900">No Resume Attached</p>
                                     <p className="text-xs text-gray-500 mt-2">This candidate hasn't uploaded a resume document yet.</p>
                                 </div>
                             )}
                        </TabsContent>

                        <TabsContent value="details" className="h-full m-0 p-8 overflow-y-auto space-y-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="size-24 rounded-3xl p-1 bg-white border-2 border-gray-100 shadow-sm mb-4">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`} className="rounded-2xl" alt="" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{interview.candidateId?.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Application ID: {interview._id.slice(-8).toUpperCase()}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-4">Key Qualifications</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(interview.candidateId?.matchedSkills && interview.candidateId.matchedSkills.length > 0) ? (
                                            interview.candidateId.matchedSkills.map(skill => (
                                                <Badge key={skill} variant="outline" className="bg-white border-gray-100 text-gray-600 text-[9px] font-medium px-3 py-1 uppercase">{skill}</Badge>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">No skills analyzed yet.</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                     <div className="space-y-2">
                                         <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Experience Summary</h4>
                                         <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                             <div className="size-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                                                 <Clock className="size-4 text-emerald-500" />
                                             </div>
                                             <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                                 {interview.candidateId?.experience || "No experience summary provided."}
                                             </p>
                                         </div>
                                     </div>

                                     <div className="space-y-2">
                                         <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Education Background</h4>
                                         <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                             <div className="size-10 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                                                 <User className="size-4 text-emerald-500" />
                                             </div>
                                             <p className="text-xs text-gray-700 leading-relaxed font-medium">
                                                 {interview.candidateId?.education || "No education history provided."}
                                             </p>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
