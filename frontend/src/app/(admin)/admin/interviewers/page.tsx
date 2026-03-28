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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="size-10 rounded-xl border border-slate-200 bg-white hover:border-slate-900 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center shadow-sm"
            >
                <MoreHorizontal className="size-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden ring-4 ring-slate-950/5"
                        >
                            <button
                                onClick={() => {
                                    router.push(`/admin/interviewers/${interviewer._id}`);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left uppercase tracking-widest"
                            >
                                <Eye className="size-4" />
                                View Profile
                            </button>
                            <button
                                onClick={() => {
                                    onEdit(interviewer);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all text-left uppercase tracking-widest"
                            >
                                <Edit2 className="size-4" />
                                Edit Details
                            </button>
                            <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                            <button
                                onClick={() => {
                                    handleRemove();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-all text-left uppercase tracking-widest"
                            >
                                <Trash2 className="size-4" />
                                Remove
                            </button>
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
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Interviewer Team</h1>
                    <p className="text-slate-500 text-sm font-medium mt-1 flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary/40 animate-pulse"></span>
                        Manage and monitor recruitment team performance.
                    </p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-11 px-6 rounded-lg bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all shadow-sm flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                    <UserPlus className="size-5" />
                    <span>Add Interviewer</span>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { label: 'Total Personnel', val: interviewers.length.toString(), growth: '+5%', icon: Users, color: 'text-primary' },
                    { label: 'Average Rating', val: avgTeamRating, growth: '+0.2', icon: Star, color: 'text-amber-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200 group hover:border-primary/50 transition-all shadow-sm flex items-center gap-8"
                    >
                        <div className="size-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                            <stat.icon className="size-7" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
                            <div className="flex items-center gap-4">
                                <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stat.val}</h3>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold">
                                    <TrendingUp className="size-3" />
                                    {stat.growth}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* List Area */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Team Directory</h3>
                        <p className="text-xs font-medium text-slate-500 mt-1">Configure roles and monitor interviewer engagement.</p>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search team members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 w-full md:w-80 rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-900 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5">Personnel Card</th>
                                <th className="px-8 py-5">Role/Department</th>
                                <th className="px-8 py-5 text-center">Sessions</th>
                                <th className="px-8 py-5">Performance</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50/50">
                            {filteredInterviewers.length > 0 ? (
                                filteredInterviewers.map((person: any, idx: number) => (
                                    <motion.tr
                                        key={person._id}
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 transition-all group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm p-1 transition-transform group-hover:scale-105">
                                                    <img
                                                        src={person.profileImage ? (person.profileImage.startsWith('http') ? person.profileImage : `http://localhost:5000${person.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`}
                                                        className="size-full object-cover rounded-xl"
                                                        alt={person.name}
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-none truncate">{person.name}</p>
                                                    <p className="text-xs font-medium text-slate-400 mt-1.5 truncate">{person.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex rounded-lg bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 uppercase tracking-widest">
                                                {person.department || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center text-sm font-bold text-slate-600">{person.interviewsCount || 0}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-20 rounded-full bg-slate-100 overflow-hidden shadow-inner p-[1px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${((person.rating || 0) / 5) * 100}%` }}
                                                        viewport={{ once: true }}
                                                        className="h-full rounded-full bg-primary shadow-sm"
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-slate-900">{(person.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <StatusBadge status={person.isActive ? "Online" : "Away"} type={person.isActive ? "success" : "neutral"} />
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <InterviewerActions interviewer={person} onEdit={handleEdit} />
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <div className="size-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <Users className="size-10" />
                                        </div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No matching personnel</h3>
                                        <p className="text-xs font-medium text-slate-400 mt-2">Check your distribution parameters.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-8 py-6 bg-white">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live synchronization: {filteredInterviewers.length} records active</p>
                    <div className="flex gap-2">
                        <button className="size-10 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center shadow-sm">
                            <ChevronLeft className="size-4" />
                        </button>
                        <button className="size-10 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all flex items-center justify-center shadow-sm">
                            <ChevronRight className="size-4" />
                        </button>
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
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl p-10 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add Interviewer</h2>
                                        <p className="text-sm font-medium text-slate-500 mt-1.5">Register a new recruitment team member.</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Full Identity</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Candidate full name"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="work@example.com"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Department</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="Engineering, Design, etc."
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-900 ml-1 uppercase tracking-widest">Access Key</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-primary transition-colors" />
                                            <input
                                                required
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Initialization password"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button
                                            disabled={addMutation.isPending}
                                            type="submit"
                                            className="w-full h-14 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 disabled:opacity-50 group"
                                        >
                                            {addMutation.isPending ? (
                                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <UserPlus className="size-5 group-hover:scale-110 transition-transform" />
                                                    <span className="uppercase tracking-widest">Add Interviewer</span>
                                                </>
                                            )}
                                        </button>
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
        success: 'text-emerald-600 bg-emerald-50 border-emerald-100 shadow-emerald-500/5',
        warning: 'text-amber-600 bg-amber-50 border-amber-100 shadow-amber-500/5',
        primary: 'text-indigo-600 bg-indigo-50 border-indigo-100 shadow-indigo-500/5',
        danger: 'text-red-600 bg-red-50 border-red-100 shadow-red-500/5',
        neutral: 'text-slate-500 bg-slate-50 border-slate-200 shadow-slate-500/5'
    };

    return (
        <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${styles[type] || styles.neutral}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${type === 'success' ? 'bg-emerald-500' : type === 'danger' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
            {status}
        </span>
    );
}
