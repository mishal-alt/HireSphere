'use client';

import React, { useState } from 'react';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Loader2, 
    DollarSign, 
    Calendar, 
    FileText, 
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';
import { useGenerateOffer } from '@/hooks/useCandidates';
import { toast } from 'react-hot-toast';

interface GenerateOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidateId: string;
    candidateName: string;
}

export default function GenerateOfferModal({ 
    isOpen, 
    onClose, 
    candidateId, 
    candidateName 
}: GenerateOfferModalProps) {
    const [salary, setSalary] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const generateOfferMutation = useGenerateOffer();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!salary || !joiningDate) {
            toast.error('Please provide both salary and joining date.');
            return;
        }

        try {
            await generateOfferMutation.mutateAsync({
                id: candidateId,
                salary: Number(salary),
                joiningDate
            });
            toast.success('Offer Letter Generated Successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to generate offer letter.');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none bg-white rounded-[2rem] shadow-2xl">
                <div className="bg-emerald-800 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <ShieldCheck className="size-32" />
                    </div>
                    <DialogHeader className="relative z-10">
                        <DialogTitle className="text-2xl font-bold tracking-tight mb-2">Generate Offer Letter</DialogTitle>
                        <DialogDescription className="text-emerald-100/80 font-medium">
                            Drafting professional employment documentation for <span className="text-white font-bold">{candidateName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Salary Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Proposed Annual Salary ($)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <DollarSign className="size-5" />
                                </div>
                                <Input 
                                    type="number" 
                                    placeholder="e.g. 120000"
                                    value={salary}
                                    onChange={(e) => setSalary(e.target.value)}
                                    className="pl-12 h-14 bg-gray-50 border-gray-100 rounded-2xl font-bold focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                                />
                            </div>
                        </div>

                        {/* Date Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Target Start Date</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                                    <Calendar className="size-5" />
                                </div>
                                <Input 
                                    type="date" 
                                    value={joiningDate}
                                    onChange={(e) => setJoiningDate(e.target.value)}
                                    className="pl-12 h-14 bg-gray-50 border-gray-100 rounded-2xl font-bold focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                        <div className="size-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                            <FileText className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-blue-900">Next Step: Digital Signature</p>
                            <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                                Generating this offer will trigger a signature request. The candidate will receive a branded email to review and sign.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={onClose}
                            className="flex-1 h-14 rounded-2xl text-gray-500 border border-transparent hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={generateOfferMutation.isPending}
                            className="flex-[2] h-14 rounded-2xl bg-emerald-800 text-white font-bold text-base hover:bg-emerald-900 shadow-xl shadow-emerald-900/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {generateOfferMutation.isPending ? (
                                <><Loader2 className="mr-2 size-5 animate-spin" /> Finalizing...</>
                            ) : (
                                <><CheckCircle2 className="mr-2 size-5" /> Confirm & Send Offer</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
