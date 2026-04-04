"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    CheckCircle2, 
    ArrowLeft, 
    Star, 
    Send, 
    Award,
    Target,
    Zap,
    MessageSquare,
    Save
} from 'lucide-react';
import { useInterview, useSubmitEvaluation } from '@/hooks/useInterviews';
import { toast } from 'react-hot-toast';

function EvaluationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    const { data: interview, isLoading, isError } = useInterview(id || '');
    const submitEvaluation = useSubmitEvaluation();

    const [ratings, setRatings] = useState({
        technical: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0
    });
    const [comments, setComments] = useState('');

    // Pre-fill comments from interview notes
    useEffect(() => {
        if (interview?.notes) {
            setComments(interview.notes);
        }
    }, [interview]);

    const handleRating = (key: string, value: number) => {
        setRatings(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!id) return;

        // Check if all ratings are provided
        if (Object.values(ratings).some(v => v === 0)) {
            toast.error("Please provide all ratings before submitting.");
            return;
        }

        try {
            await submitEvaluation.mutateAsync({ id, ratings, comments });
            router.push('/interviewer/interviews');
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin size-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
    );

    if (isError || !interview) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <p className="text-gray-500 font-medium tracking-tight mb-4">Interview session not found.</p>
            <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="mr-2 size-4" /> Go Back
            </Button>
        </div>
    );

    const metrics = [
        { key: 'technical', label: 'Technical Proficiency', icon: Zap },
        { key: 'communication', label: 'Communication Skills', icon: MessageSquare },
        { key: 'problemSolving', label: 'Problem Solving', icon: Target },
        { key: 'culturalFit', label: 'Cultural Alignment', icon: Award }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-4xl mx-auto">
                <Button 
                    onClick={() => router.back()} 
                    variant="ghost" 
                    className="mb-8 font-bold text-xs uppercase tracking-widest text-emerald-900/60 hover:text-emerald-900 gap-2"
                >
                    <ArrowLeft className="size-4" /> 
                    Return to Sessions
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Summary */}
                    <div className="space-y-6">
                        <Card className="rounded-[2.5rem] border-none shadow-premium overflow-hidden bg-white">
                            <div className="h-24 bg-emerald-900 p-6 flex items-end">
                                <Badge className="bg-emerald-400 text-emerald-900 border-none font-bold text-[10px] uppercase tracking-widest">PRO-SESSION</Badge>
                            </div>
                            <CardContent className="p-8 -mt-12 text-center">
                                <div className="size-24 rounded-[2rem] bg-white p-1 border border-gray-100 shadow-xl mx-auto mb-6">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${interview.candidateId?.name}`} 
                                        className="w-full h-full object-cover rounded-[1.8rem]" 
                                        alt="" 
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">{interview.candidateId?.name}</h2>
                                <p className="text-xs font-medium text-gray-400 mt-2 mb-6">{interview.candidateId?.email}</p>
                                
                                <div className="space-y-3 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                        <span>Candidate ID</span>
                                        <span className="text-gray-900">HS-{interview._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2">
                                        <span>Interview Date</span>
                                        <span className="text-gray-900">{new Date(interview.scheduledAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100">
                           <div className="flex items-center gap-3 mb-3">
                               <CheckCircle2 className="size-4 text-emerald-600" />
                               <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Recruiter Note</span>
                           </div>
                           <p className="text-xs leading-relaxed text-emerald-700 font-medium">
                               Double check the technical core ratings. These metrics will affect the final rank calculation.
                           </p>
                        </div>
                    </div>

                    {/* Right: Evaluation Form */}
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                <span>Assessment Scores</span>
                                <div className="h-px flex-1 bg-emerald-100/50" />
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {metrics.map((m) => (
                                    <div key={m.key} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3 text-emerald-900">
                                                <m.icon className="size-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">{m.label}</span>
                                            </div>
                                            <span className="text-lg font-black text-emerald-900">{ratings[m.key as keyof typeof ratings]}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleRating(m.key, star)}
                                                    className={`size-10 rounded-xl transition-all flex items-center justify-center ${ratings[m.key as keyof typeof ratings] >= star ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}
                                                >
                                                    <Star className={`size-4 ${ratings[m.key as keyof typeof ratings] >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-[0.2em] flex items-center gap-4 flex-1">
                                    <span>Detailed Observations</span>
                                    <div className="h-px flex-1 bg-emerald-100/50" />
                                </h2>
                                <Badge variant="outline" className="ml-4 border-emerald-100 text-emerald-600 uppercase tracking-widest font-bold text-[9px]">
                                    AUTO-PULLED FROM ROOM
                                </Badge>
                            </div>
                            <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <Textarea 
                                    value={comments}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                                    placeholder="Provide detailed feedback on candidate performance..."
                                    className="min-h-[250px] border-none focus-visible:ring-0 rounded-[2rem] p-6 text-sm font-medium leading-relaxed resize-none"
                                />
                                <div className="p-4 bg-gray-50 rounded-b-[2rem] flex justify-end gap-2">
                                   <Button 
                                    onClick={handleSubmit}
                                    disabled={submitEvaluation.isPending || Object.values(ratings).some(v => v === 0)}
                                    className="bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl px-10 h-14 font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                                   >
                                       {submitEvaluation.isPending ? 'STASHING...' : (
                                           <>
                                                Finalize Assessment
                                                <Send className="size-4" />
                                           </>
                                       )}
                                   </Button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function EvaluationPage() {
    return (
        <Suspense fallback={<div>Loading Page...</div>}>
            <EvaluationContent />
        </Suspense>
    );
}
