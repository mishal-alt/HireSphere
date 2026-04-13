'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { animate, stagger } from 'animejs';
import { 
    Video, 
    VideoOff, 
    Mic, 
    MicOff, 
    MonitorUp, 
    PhoneOff, 
    User, 
    Clock,
    AlertCircle,
    CircleCheck,
    ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWebRTC } from '@/hooks/useWebRTC';
import { toast } from 'react-hot-toast';

export default function CandidateInterviewRoom() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const [interviewData, setInterviewData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOngoing, setIsOngoing] = useState(false);

    // 📹 WEBRTC ENGINE (Using 'candidate' as ID for public guest)
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
    } = useWebRTC(id, 'candidate');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // 🚀 ANIME.JS SONAR INITIALIZATION
    useEffect(() => {
        const animation = animate('.sonar-ring', {
            scale: [1, 4],
            opacity: [0.6, 0],
            duration: 2000,
            delay: stagger(1000),
            loop: true,
            easing: 'easeOutExpo'
        });
        return () => { animation.pause(); };
    }, []);

    // Fetch Public Interview Details
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const res = await fetch(`${apiBaseUrl}/public/interview/${id}`);
                const data = await res.json();
                if (res.ok) {
                    setInterviewData(data);
                } else {
                    toast.error("Session link invalid or expired.");
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    // Attach streams
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

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 rounded-full border-4 border-gray-100 border-t-emerald-600 animate-spin" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verifying Invitation...</p>
                </div>
            </div>
        );
    }

    if (!interviewData) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50 p-8">
                <Card className="max-w-md w-full p-10 text-center border-none shadow-2xl rounded-[2.5rem]">
                    <div className="size-20 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="size-10 text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Access Denied</h2>
                    <p className="text-gray-500 mt-3 text-sm leading-relaxed">This invitation link has expired or is no longer valid. Please contact your recruitment manager for a new link.</p>
                    <Button onClick={() => window.close()} className="mt-8 w-full bg-gray-900 py-6 rounded-2xl">Return to Portal</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
            {/* Header / Branding */}
            <header className="h-20 px-10 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="size-10 bg-white/10 rounded-xl flex items-center justify-center">
                        {interviewData.companyLogo ? (
                            <img src={interviewData.companyLogo} className="size-8 object-contain" alt="" />
                        ) : (
                            <ShieldCheck className="size-6 text-emerald-400" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-sm tracking-tight">{interviewData.interviewTitle}</h1>
                        <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-widest">{interviewData.companyName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 relative overflow-hidden group">
                        <div id="sonar-container" className="absolute inset-0 flex items-center justify-start pl-4 pointer-events-none">
                            <div className="sonar-ring size-2 rounded-full bg-emerald-500/20 absolute" />
                            <div className="sonar-ring size-2 rounded-full bg-emerald-500/10 absolute" />
                        </div>
                        <div 
                            id="connection-dot"
                            className={`size-2 rounded-full relative z-10 ${connectionStatus === 'Connected' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-500'}`} 
                        />
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest relative z-10">{connectionStatus}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative p-8">
                {/* HERO VIDEO (Interviewer) */}
                <div className="relative w-full h-full bg-gray-900 rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                    {remoteStream ? (
                        <video 
                            ref={remoteVideoRef}
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <div className="size-32 rounded-full bg-white/5 flex items-center justify-center mb-8 animate-pulse">
                                <User className="size-12 text-white/10" />
                            </div>
                            <h3 className="text-white text-xl font-bold tracking-tight">The Interviewer is not here yet</h3>
                            <p className="text-gray-500 text-sm mt-3">Please stay on this page. The session will begin automatically.</p>
                        </div>
                    )}

                    {/* PIP (Candidate Self View) */}
                    <motion.div 
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                        className="absolute bottom-10 right-10 size-64 bg-black rounded-[2.5rem] overflow-hidden border-2 border-white/20 shadow-2xl z-20 cursor-grab active:cursor-grabbing group hover:scale-105 transition-transform"
                    >
                        <video 
                            ref={localVideoRef}
                            autoPlay 
                            muted 
                            playsInline 
                            className={`w-full h-full object-cover ${isCamOff ? 'hidden' : ''}`}
                        />
                        {isCamOff && (
                            <div className="size-full flex flex-col items-center justify-center gap-4 bg-gray-900">
                                <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center">
                                    <VideoOff className="size-8 text-white/20" />
                                </div>
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Your Camera is Off</span>
                            </div>
                        )}
                        <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur rounded-full border border-white/10">
                            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-bold text-white uppercase tracking-widest">Live Preview</span>
                        </div>
                    </motion.div>

                    {/* INTERACTIVE CONTROL BAR */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-white/10 backdrop-blur-2xl border border-white/10 p-5 px-8 rounded-full shadow-2xl">
                         <Button 
                            onClick={toggleMute}
                            className={`size-16 rounded-full transition-all flex items-center justify-center border-2 ${isMuted ? 'bg-rose-500 border-rose-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'} shadow-none`}
                        >
                            {isMuted ? <MicOff className="size-7" /> : <Mic className="size-7" />}
                        </Button>

                        <Button 
                            onClick={toggleCamera}
                            className={`size-16 rounded-full transition-all flex items-center justify-center border-2 ${isCamOff ? 'bg-rose-500 border-rose-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'} shadow-none`}
                        >
                            {isCamOff ? <VideoOff className="size-7" /> : <Video className="size-7" />}
                        </Button>

                        <Button 
                            onClick={toggleScreenShare}
                            className={`size-16 rounded-full transition-all flex items-center justify-center border-2 ${isScreenSharing ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'} shadow-none`}
                        >
                            <MonitorUp className={`size-7 ${isScreenSharing ? 'animate-pulse' : ''}`} />
                        </Button>

                        <div className="h-10 w-px bg-white/10 mx-4" />

                        <Button 
                            className={`h-16 px-10 rounded-full bg-rose-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-rose-700 transition-all shadow-xl active:scale-95`}
                            onClick={() => window.close()}
                        >
                            <PhoneOff className="size-5 mr-4" />
                            End Interview
                        </Button>
                    </div>
                </div>
            </main>
            
            <footer className="h-14 px-10 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <span className="flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    Secure P2P Encrypted Session
                </span>
                <span>Session ID: HS-EXT-{id.slice(-6).toUpperCase()}</span>
            </footer>
        </div>
    );
}
