"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { animate, stagger } from 'animejs';
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
    CircleCheck, 
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
    const mode = searchParams.get('mode'); // 'view' or null/edit
    const isViewMode = mode === 'view';

    const { data: interview, isLoading, isError } = useInterview(id || '');
    const submitEvaluation = useSubmitEvaluation();

    const [ratings, setRatings] = useState({
        technical: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0
    });
    const [comments, setComments] = useState('');

    // Pre-fill ratings and comments from interview
    useEffect(() => {
        if (interview) {
            if (interview.ratings) {
                setRatings({
                    technical: interview.ratings.technical || 0,
                    communication: interview.ratings.communication || 0,
                    problemSolving: interview.ratings.problemSolving || 0,
                    culturalFit: interview.ratings.culturalFit || 0
                });
            }
            if (isViewMode && interview.evaluationComments) {
                setComments(interview.evaluationComments);
            } else if (interview.notes) {
                setComments(interview.notes);
            }
        }
    }, [interview, isViewMode]);

    const handleRating = (key: string, value: number, event: React.MouseEvent) => {
        if (isViewMode) return; // Prevent rating in view mode
        setRatings(prev => ({ ...prev, [key]: value }));
        
        // 🌟 Star Burst 2.0 (Particle System)

        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create 8 sparks
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('div');
            spark.className = 'fixed size-1 bg-emerald-500 rounded-full pointer-events-none z-[100]';
            spark.style.left = `${centerX}px`;
            spark.style.top = `${centerY}px`;
            document.body.appendChild(spark);

            const angle = (i / 8) * Math.PI * 2;
            const distance = 40 + Math.random() * 40;

            animate(spark, {
                translateX: Math.cos(angle) * distance,
                translateY: Math.sin(angle) * distance,
                scale: [1, 0],
                opacity: [1, 0],
                duration: 800 + Math.random() * 400,
                easing: 'easeOutQuart',
                complete: () => spark.remove()
            });
        }

        animate(`.star-icon-${key}-${value}`, {
            scale: [1, 1.8, 1],
            rotate: [0, 25, -25, 0],
            duration: 800,
            easing: 'easeOutElastic(1, .5)'
        });
    };

    const isFormValid = !Object.values(ratings).some(v => v === 0);

    useEffect(() => {
        // 🚀 Sequential Section Reveal
        animate('.evaluation-animate-in', {
            translateY: [20, 0],
            opacity: [0, 1],
            delay: stagger(150),
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }, [isLoading]);

    useEffect(() => {
        if (isFormValid) {
            animate('.finalize-btn', {
                boxShadow: [
                    '0 0 0px rgba(6, 78, 59, 0)',
                    '0 0 20px rgba(6, 78, 59, 0.4)',
                    '0 0 0px rgba(6, 78, 59, 0)'
                ],
                duration: 2000,
                loop: true,
                easing: 'easeInOutSine'
            });
        }
    }, [isFormValid]);

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
                               <CircleCheck className="size-4 text-emerald-600" />
                               <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Recruiter Note</span>
                           </div>
                           <p className="text-xs leading-relaxed text-emerald-700 font-medium">
                               Double check the technical core ratings. These metrics will affect the final rank calculation.
                           </p>
                        </div>
                    </div>

                    {/* Right: Evaluation Form */}
                    <div className="md:col-span-2 space-y-8">
                        <section className="evaluation-animate-in opacity-0">
                            <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                <span>{isViewMode ? 'Assessment Report' : 'Assessment Scores'}</span>
                                <div className="h-px flex-1 bg-emerald-100/50" />
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {metrics.map((m) => (
                                    <div key={m.key} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
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
                                                    disabled={isViewMode}
                                                    onClick={(e) => handleRating(m.key, star, e)}
                                                    className={`size-10 rounded-xl transition-all flex items-center justify-center ${ratings[m.key as keyof typeof ratings] >= star ? 'bg-emerald-600 text-white' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'} ${isViewMode ? 'cursor-default' : ''}`}
                                                >
                                                    <Star className={`size-4 star-icon-${m.key}-${star} ${ratings[m.key as keyof typeof ratings] >= star ? 'fill-current' : ''}`} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="evaluation-animate-in opacity-0">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-[0.2em] flex items-center gap-4 flex-1">
                                    <span>{isViewMode ? 'Final Observations' : 'Detailed Observations'}</span>
                                    <div className="h-px flex-1 bg-emerald-100/50" />
                                </h2>
                                <Badge variant="outline" className="ml-4 border-emerald-100 text-emerald-600 uppercase tracking-widest font-bold text-[9px]">
                                    {isViewMode ? 'PERMANENT RECORD' : 'AUTO-PULLED FROM ROOM'}
                                </Badge>
                            </div>
                            <div className="bg-white p-2 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <Textarea 
                                    value={comments}
                                    readOnly={isViewMode}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                                    placeholder={isViewMode ? "No detailed feedback provided." : "Provide detailed feedback on candidate performance..."}
                                    className="min-h-[250px] border-none focus-visible:ring-0 rounded-[2rem] p-6 text-sm font-medium leading-relaxed resize-none"
                                />
                                <div className="p-4 bg-gray-50 rounded-b-[2rem] flex justify-end gap-2">
                                   {!isViewMode ? (
                                       <Button 
                                        onClick={handleSubmit}
                                        disabled={submitEvaluation.isPending || !isFormValid}
                                        className="finalize-btn bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl px-10 h-14 font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl active:scale-95 disabled:opacity-50"
                                       >
                                           {submitEvaluation.isPending ? 'STASHING...' : (
                                                <>
                                                    Finalize Assessment
                                                    <Send className="size-4" />
                                                </>
                                           )}
                                        </Button>
                                   ) : (
                                       <Button 
                                        onClick={() => router.back()}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl px-10 h-14 font-bold uppercase tracking-widest flex items-center gap-3 active:scale-95"
                                       >
                                           Close Report
                                        </Button>
                                   )}
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
