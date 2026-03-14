'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdminInterviewerStore } from '@/store/useAdminInterviewerStore';
import EditInterviewerModal from '@/components/admin/EditInterviewerModal';

function InterviewerActions({ interviewer, onEdit }: { interviewer: any; onEdit: (interviewer: any) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { deleteInterviewer } = useAdminInterviewerStore();

    const handleTerminate = async () => {
        if (window.confirm(`Are you sure you want to terminate ${interviewer.name}? This action cannot be undone.`)) {
            await deleteInterviewer(interviewer._id);
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-500 hover:text-white transition-colors"
            >
                <span className="material-symbols-outlined text-lg">more_vert</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 top-10 w-48 bg-[#121212] border border-white/10 rounded-xl shadow-2xl z-20 py-1 overflow-hidden pointer-events-auto"
                        >
                            <button 
                                onClick={() => {
                                    router.push(`/admin/interviewers/${interviewer._id}`);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-left"
                            >
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                View Profile
                            </button>
                            <button 
                                onClick={() => {
                                    onEdit(interviewer);
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest text-left"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit Logic
                            </button>
                            <div className="h-[1px] bg-white/5 my-1" />
                            <button 
                                onClick={() => {
                                    handleTerminate();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold text-red-500 hover:bg-red-500/10 transition-all uppercase tracking-widest text-left"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Terminate
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default function InterviewersPage() {
    const { interviewers, loading, fetchInterviewers, addInterviewer } = useAdminInterviewerStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingInterviewer, setEditingInterviewer] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', department: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchInterviewers();
    }, [fetchInterviewers]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const success = await addInterviewer(formData);
        if (success) {
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', department: '' });
        }
        setSubmitting(false);
    };

    const filteredInterviewers = interviewers.filter(person =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (interviewer: any) => {
        setEditingInterviewer(interviewer);
        setIsEditModalOpen(true);
    };

    const totalInterviews = interviewers.reduce((acc, curr) => acc + (curr.interviewsCount || 0), 0);
    const avgTeamRating = interviewers.length > 0 
        ? (interviewers.reduce((acc, curr) => acc + (curr.rating || 0), 0) / interviewers.length).toFixed(1)
        : '0.0';

    if (loading && interviewers.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center">
                <div className="animate-spin size-8 border-2 border-primary border-t-transparent rounded-full font-display font-black text-xs uppercase tracking-widest italic flex items-center justify-center">
                    HS
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header Actions */}
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-2 text-white">Interviewers</h1>
                    <p className="text-slate-500 max-w-xl text-sm font-medium">
                        Manage and monitor your company's interviewing team performance and availability.
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 text-sm uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    <span>Add Interviewer</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                {[
                    { label: 'Total Interviewers', val: interviewers.length.toString(), change: '+5%', icon: 'groups', color: 'bg-blue-500/10 text-blue-500' },
                    { label: 'Interviews Conducted', val: totalInterviews.toString(), change: '+12%', icon: 'history_edu', color: 'bg-primary/10 text-primary' },
                    { label: 'Avg. Team Rating', val: avgTeamRating, change: '+0.2', icon: 'star_rate', color: 'bg-amber-500/10 text-amber-500' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-white/5 bg-[#080808] p-6 shadow-sm group hover:border-white/10 transition-all"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}>
                                <span className="material-symbols-outlined text-lg">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                            <p className="text-3xl font-black text-white italic">{stat.val}</p>
                            <span className="mb-1 flex items-center text-[10px] font-black uppercase text-emerald-500 tracking-widest">
                                <span className="material-symbols-outlined text-[10px]">arrow_upward</span>{stat.change}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area with Search and Table */}
            <div className="rounded-2xl border border-white/5 bg-[#080808] shadow-sm overflow-hidden">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-500">filter_list</span>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Team Logic Matrix</h3>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Initialize search protocol..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-64 rounded-xl border-white/5 bg-[#121212] pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-slate-600 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 bg-white/[0.01]">
                            <tr className="border-b border-white/5">
                                <th className="px-6 py-4">Interviewer</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4 text-center">Interviews</th>
                                <th className="px-6 py-4">Avg. Rating</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredInterviewers.length > 0 ? (
                                filteredInterviewers.map((person, idx) => (
                                    <motion.tr
                                        key={person._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 bg-[#121212]">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm text-white uppercase italic tracking-tight">{person.name}</p>
                                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{person.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="inline-flex rounded-lg bg-white/5 border border-white/5 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                                {person.department || 'Engineering'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center text-sm font-black text-white italic">{person.interviewsCount || 0}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1 w-24 rounded-full bg-white/5 overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-primary transition-all duration-1000" 
                                                        style={{ width: `${((person.rating || 0) / 5) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-black text-white">{(person.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={person.isActive ? "Active" : "Inactive"} type={person.isActive ? "success" : "danger"} />
                                        </td>
                                        <td className="px-6 py-5 text-right pr-6 relative">
                                            <InterviewerActions interviewer={person} onEdit={handleEdit} />
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">No matching operators found in system</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 bg-white/[0.01]">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Showing {filteredInterviewers.length} of {interviewers.length} records retrieved</p>
                    <div className="flex gap-2">
                        <button className="rounded-lg border border-white/5 bg-white/5 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all shadow-sm">Previous</button>
                        <button className="rounded-lg border border-white/5 bg-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-black hover:bg-slate-100 transition-all shadow-xl">Next</button>
                    </div>
                </div>
            </div>

            {/* Edit Interviewer Modal */}
            <EditInterviewerModal 
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingInterviewer(null);
                }}
                interviewer={editingInterviewer}
            />

            {/* Add Interviewer Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl"
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                            <span className="material-symbols-outlined">person_add</span>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black text-white italic">Initialize Agent</h2>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Crete new interviewer protocol</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="size-8 rounded-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">badge</span>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter full name"
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="name@company.com"
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">category</span>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Engineering, HR"
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol (Password)</label>
                                        <div className="relative group">
                                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors text-lg">lock</span>
                                            <input
                                                required
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="••••••••"
                                                className="w-full h-12 bg-[#121212] border border-white/5 rounded-xl pl-12 pr-4 text-xs font-bold text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            disabled={submitting}
                                            type="submit"
                                            className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                        >
                                            {submitting ? (
                                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-lg">save</span>
                                                    <span>Authorize Agent</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
    const styles: Record<string, string> = {
        success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        primary: 'text-primary bg-primary/10 border-primary/20',
        danger: 'text-red-500 bg-red-500/10 border-red-500/20',
        neutral: 'text-slate-400 bg-white/10 border-white/10'
    };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest border ${styles[type] || styles.neutral}`}>
            <span className={`h-1 w-1 rounded-full ${type === 'success' ? 'bg-emerald-500' : type === 'danger' ? 'bg-red-500' : 'bg-slate-400'}`}></span>
            {status}
        </span>
    );
}
