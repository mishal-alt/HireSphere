'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useInterviewers, useAddInterviewer, useDeleteInterviewer } from '@/hooks/useInterviewers';
import Portal from '@/components/Portal';
import EditInterviewerModal from '@/components/admin/EditInterviewerModal';
import {
    Users,
    UserPlus,
    Search,
    MoreHorizontal,
    Eye,
    Edit2,
    Trash2,
    Star,
    TrendingUp,
    Shield,
    Mail,
    Briefcase,
    X,
    Lock,
    User,
    CheckCircle2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


function InterviewerActions({ interviewer, onEdit }: { interviewer: any; onEdit: (interviewer: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const deleteMutation = useDeleteInterviewer();

    const handleRemove = async () => {
        if (window.confirm(`Are you sure you want to remove ${interviewer.name}? This action cannot be undone.`)) {
            await deleteMutation.mutateAsync(interviewer._id);
        }
    };

    return (
        <div className="relative flex justify-end">
            <Button variant="ghost"
                onClick={() => setIsOpen(!isOpen)}
                className="size-10 rounded-xl border border-gray-200/50 bg-white hover:border-gray-200/50 text-gray-500 hover:text-gray-900 transition-all flex items-center justify-center"
            >
                <MoreHorizontal className="size-5" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-6 w-48 bg-white border border-gray-200/50 rounded-xl z-20 py-2 overflow-hidden ring-4 ring-slate-950/5"
                        >
                            <Button variant="ghost"
                                onClick={() => {
                                    router.push(`/admin/interviewers/${interviewer._id}`);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left font-medium"
                            >
                                <Eye className="size-4" />
                                View Profile
                            </Button>
                            <Button variant="ghost"
                                onClick={() => {
                                    onEdit(interviewer);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all text-left font-medium"
                            >
                                <Edit2 className="size-4" />
                                Edit Details
                            </Button>
                            <div className="h-[1px] bg-gray-100 my-1 mx-2" />
                            <Button variant="ghost"
                                onClick={() => {
                                    handleRemove();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all text-left font-medium"
                            >
                                <Trash2 className="size-4" />
                                Remove
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function InterviewersPage() {
    const { data: interviewers = [], isLoading } = useInterviewers();
    const addMutation = useAddInterviewer();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInterviewer, setEditingInterviewer] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMutation.mutateAsync(formData);
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', department: '' });
        } catch (error) {
            // Error is handled by the hook's toast
        }
    };

    const filteredInterviewers = interviewers.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (interviewer: any) => {
        setEditingInterviewer(interviewer);
        setIsEditModalOpen(true);
    };

    const avgTeamRating = interviewers.length > 0
        ? (interviewers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / interviewers.length).toFixed(1)
        : '0.0';

    if (isLoading && interviewers.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-gray-200/50 pb-8">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight text-gray-900">Interviewer Team</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-gray-100 animate-pulse"></span>
                        Manage and monitor recruitment team performance.
                    </p>
                </div>
                <Button variant="ghost"
                    onClick={() => setIsModalOpen(true)}
                    className="h-11 px-6 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                    <UserPlus className="size-5" />
                    <span>Add Interviewer</span>
                </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Total Personnel', val: interviewers.length.toString(), growth: '+5%', icon: Users, color: 'text-gray-900' },
                    { label: 'Average Rating', val: avgTeamRating, growth: '+0.2', icon: Star, color: 'text-gray-900' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border border-gray-200/50 rounded-xl p-6  group hover:bg-gray-100 transition-colors cursor-default flex items-center gap-6"
                    >
                        <div className="size-12 rounded-xl bg-white flex items-center justify-center text-gray-500 transition-all">
                            <stat.icon className="size-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 font-medium mb-1.5">{stat.label}</p>
                            <div className="flex items-center gap-6">
                                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{stat.val}</h3>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-gray-900 text-sm font-bold">
                                    <TrendingUp className="size-3" />
                                    {stat.growth}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List Area */}
            <div className="flex flex-col pt-4">
                <div className="pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200/50">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Team Directory</h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">Configure roles and monitor interviewer engagement.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4 group-focus-within:text-gray-900 transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-full md:w-80 rounded-xl border border-gray-200/50 bg-white pl-11 pr-4 text-sm font-medium text-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-gray-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table >
                        <TableHeader className="text-xs text-gray-500 font-medium border-b border-gray-200/50">
                            <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                <TableHead className="px-8 py-5">Personnel Card</TableHead>
                                <TableHead className="px-8 py-5">Role/Department</TableHead>
                                <TableHead className="px-8 py-5 text-center">Sessions</TableHead>
                                <TableHead className="px-8 py-5">Performance</TableHead>
                                <TableHead className="px-8 py-5">Status</TableHead>
                                <TableHead className="px-8 py-5 text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-200/60">
                            {filteredInterviewers.length > 0 ? (
                                filteredInterviewers.map((person: any, idx: number) => (
                                    <motion.tr
                                        key={person._id}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-gray-50 transition-all group"
                                    >
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="size-12 rounded-xl overflow-hidden border border-gray-200/50 bg-gray-50 p-1 transition-transform group-hover:scale-105">
                                                    <img
                                                        src={person.profileImage ? (person.profileImage.startsWith('http') ? person.profileImage : `http://localhost:5000${person.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                                                        className="size-full object-cover rounded-xl"
                                                        alt={person.name}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-900 leading-none truncate">{person.name}</p>
                                                    <p className="text-xs font-medium text-gray-500 mt-1.5 truncate">{person.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <span className="inline-flex rounded-lg bg-gray-50 px-3 py-1 text-sm font-bold text-gray-500 border border-gray-200/50 font-medium">
                                                {person.department || 'General'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-center text-sm font-bold text-gray-500">{person.interviewsCount || 0}</TableCell>
                                        <TableCell className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-20 rounded-full bg-gray-100 overflow-hidden shadow-inner p-[1px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${((person.rating || 0) / 5) * 100}%` }}
                                                        viewport={{ once: true }}
                                                        className="h-full rounded-full bg-primary"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-gray-900">{(person.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-8 py-6">
                                            <StatusBadge status={person.isActive ? "Online" : "Away"} type={person.isActive ? "success" : "neutral"} />
                                        </TableCell>
                                        <TableCell className="px-8 py-6 text-right pr-8">
                                            <InterviewerActions interviewer={person} onEdit={handleEdit} />
                                        </TableCell>
                                    </motion.tr>
                                ))
                            ) : (
                                <TableRow className="hover:bg-gray-50/50 transition-colors group/row">
                                    <TableCell colSpan={6} className="py-24 text-center">
                                        <div className="size-20 rounded-xl bg-gray-50 border border-gray-200/50 flex items-center justify-center mx-auto mb-6 text-gray-500">
                                            <Users className="size-10" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 font-medium">No matching personnel</h3>
                                        <p className="text-xs font-medium text-gray-500 mt-2">Check your distribution parameters.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200/50 pt-6 mt-4 bg-transparent">
                    <p className="text-sm font-bold text-gray-500 font-medium">Live synchronization: {filteredInterviewers.length} records active</p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditInterviewerModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingInterviewer(null);
                }}
                interviewer={editingInterviewer}
            />

            <Portal>
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-white border border-gray-200/50 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-md bg-white border border-gray-200/50 rounded-3xl p-6 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add Interviewer</h2>
                                        <p className="text-sm font-medium text-gray-500 mt-1.5">Register a new recruitment team member.</p>
                                    </div>
                                    <Button variant="ghost"
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200/50"
                                    >
                                        <X className="size-5" />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Full Identity</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4 group-focus-within:text-gray-900 transition-colors" />
                                            <Input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Candidate full name"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors pl-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4 group-focus-within:text-gray-900 transition-colors" />
                                            <Input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="work@example.com"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors pl-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Department</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4 group-focus-within:text-gray-900 transition-colors" />
                                            <Input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="Engineering, Design, etc."
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors pl-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-900 ml-1 font-medium">Access Key</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4 group-focus-within:text-gray-900 transition-colors" />
                                            <Input
                                                required
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Initialization password"
                                                className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors pl-11"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <Button variant="default"
                                            disabled={addMutation.isPending}
                                            type="submit"
                                            className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            {addMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="size-5 group-hover:scale-110 transition-transform" />
                                                    <span className="font-medium">Add Interviewer</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Portal>
        </div>
    );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
    const styles: Record<string, string> = {
        success: 'text-gray-900 bg-emerald-50 border-emerald-100 shadow-emerald-500/5',
        warning: 'text-emerald-700 bg-emerald-50 border-emerald-200 shadow-emerald-500/5',
        primary: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-500/5',
        danger: 'text-gray-700 bg-gray-100/60 border-transparent shadow-gray-500/5',
        neutral: 'text-gray-500 bg-gray-100/60 border-transparent shadow-slate-500/5'
    };

    return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-100 font-medium px-2.5 py-0.5 rounded-full uppercase text-[10px]">
            <span className={`h-1.5 w-1.5 rounded-full ${type === 'success' ? 'bg-emerald-500' : type === 'danger' ? 'bg-gray-500' : 'bg-gray-100'}`}></span>
            {status}
        </Badge>
    );
}
