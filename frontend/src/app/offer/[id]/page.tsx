'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { 
    ShieldCheck, 
    CircleCheck, 
    FileText, 
    AlertCircle, 
    Loader2, 
    XCircle,
    UserCircle,
    Building2,
    Calendar,
    Stamp,
    MousePointer2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function CandidateSignaturePage() {
    const { id } = useParams();
    const router = useRouter();
    const [offer, setOffer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await api.get(`/public/offer/${id}`);
                setOffer(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Offer not found or expired.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffer();
    }, [id]);

    const handleSign = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signatureName) {
            toast.error('Please enter your legal name as a signature.');
            return;
        }

        try {
            setSigning(true);
            await api.post(`/public/offer/${id}/sign`, { signatureName });
            setIsSigned(true);
            toast.success('Offer successfully signed!');
        } catch (err) {
            toast.error('Failed to process signature.');
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 flex-col gap-4">
                <div className="animate-spin size-12 border-4 border-emerald-600 border-t-transparent rounded-full" />
                <p className="text-gray-500 font-bold tracking-widest text-xs uppercase animate-pulse">Initializing Secure Session</p>
            </div>
        );
    }

    if (error || !offer) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50 p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="size-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-500 border border-rose-100">
                        <XCircle className="size-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Session Restricted</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">{error || "This offer link is no longer active or private."}</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/')} className="h-12 px-8 rounded-xl">Return to Homepage</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Document View */}
            <div className="lg:w-7/12 h-[50vh] lg:h-screen bg-gray-200 border-r border-gray-200 p-4 lg:p-8 overflow-hidden">
                <div className="h-full w-full bg-white rounded-2xl shadow-inner border border-gray-300 overflow-hidden relative">
                    <iframe 
                        src={offer.offerLetterUrl} 
                        className="w-full h-full border-none"
                        title="Offer Document"
                    />
                    <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur rounded-full border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
                        <ShieldCheck className="size-4 text-emerald-600" />
                        Verify Mode: Active
                    </div>
                </div>
            </div>

            {/* Right: Signing Interface */}
            <div className="lg:w-5/12 h-screen flex flex-col p-6 lg:p-14 overflow-y-auto bg-white">
                <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center gap-14">
                    
                    <AnimatePresence mode="wait">
                        {!isSigned ? (
                            <motion.div 
                                key="sign-panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="space-y-14"
                            >
                                {/* Header */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Building2 className="size-6 text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">{offer.companyName}</span>
                                    </div>
                                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter leading-none">Employment Acceptance</h1>
                                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                                        Congratulations <span className="text-gray-900 font-bold">{offer.candidateName}</span>, your next professional milestone starts here. Review your offer and sign below.
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSign} className="space-y-10">
                                    <div className="space-y-5">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type your full legal name</label>
                                            <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-bold">DIGITAL-SIGNATURE</span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute top-1/2 -translate-y-1/2 left-5 text-gray-300">
                                                <MousePointer2 className="size-6" />
                                            </div>
                                            <Input 
                                                value={signatureName}
                                                onChange={(e) => setSignatureName(e.target.value)}
                                                placeholder="e.g. Michael Scott"
                                                className="h-20 bg-gray-50 border-gray-100 rounded-[1.5rem] pl-16 text-2xl font-bold font-serif focus:ring-emerald-500/10 focus:border-emerald-600 transition-all italic text-emerald-800"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 font-medium leading-relaxed px-1">
                                            By typing your name above, you acknowledge this as an electronic equivalent to your handwritten signature.
                                        </p>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        disabled={signing || !signatureName}
                                        className="w-full h-20 rounded-[1.5rem] bg-emerald-800 text-white text-xl font-bold hover:bg-emerald-900 shadow-2xl shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {signing ? (
                                            <Loader2 className="size-6 animate-spin" />
                                        ) : (
                                            <>Finalize & Accept Offer</>
                                        )}
                                    </Button>
                                </form>

                                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-5">
                                    <div className="size-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 shrink-0">
                                        <Stamp className="size-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-gray-900">Legally Binding Session</p>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                            Your session is being logged and protected by HireSphere Security Architecture to ensure professional documentation integrity.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="success-panel"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-10 py-20"
                            >
                                <div className="size-32 bg-emerald-50 text-emerald-600 rounded-[3rem] border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                                    <CircleCheck className="size-16" />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome Aboard!</h2>
                                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                                        Your signed offer has been transmitted to {offer.companyName}. You'll receive a final copy and your onboarding kit shortly via email.
                                    </p>
                                </div>
                                <div className="pt-8 grid grid-cols-2 gap-4">
                                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-sm font-bold text-emerald-600">Onboarding</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 border border-gray-100 rounded-3xl text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Signed Date</p>
                                        <p className="text-sm font-bold text-gray-900">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Brand */}
                    <div className="text-center pt-20">
                        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
                            Powered by <span className="text-emerald-500">HIRESPHERE</span> Logic
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
