'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useNotificationStore } from '@/store/useNotificationStore';
import toast from 'react-hot-toast';
import Link from 'next/link';

import { useCompany, useUpdateCompany } from '@/hooks/useCompany';
import {
    User,
    Building2,
    Shield,
    CreditCard,
    Bell,
    Camera,
    Trash2,
    Save,
    Copy,
    ExternalLink,
    Link as LinkIcon,
    LogIn,
    Edit,
    Smartphone,
    CheckCircle2,
    Mail,
    ChevronRight,
    SearchX,
    Info,
    RefreshCcw,
    Moon,
    Activity,
    Lock,
    Globe,
    Check,
    Cpu,
    ArrowRight,
    BadgeCheck,
    Briefcase,
    ShieldCheck,
    Settings,
    ArrowUpRight,
    History,
    Zap,
    Inbox
} from 'lucide-react';

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateProfile, uploadProfileImage, changePassword, logout } = useAuthStore();
    const { data: company } = useCompany();
    const { notifications } = useNotificationStore();
    const updateCompanyMutation = useUpdateCompany();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const companyLogoRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        role: ''
    });

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const [isChangingPass, setIsChangingPass] = useState(false);

    const [orgData, setOrgData] = useState({
        name: '',
        email: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isOrgUploading, setIsOrgUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                company: (user as any).companyName || company?.name || 'HireSphere Entity',
                role: (user as any).role || 'Administrator'
            });
        }
        if (company) {
            setOrgData({
                name: company.name || '',
                email: company.email || '',
            });
        }
    }, [user, company]);

    const handleOrgLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsOrgUploading(true);
        try {
            const data = new FormData();
            data.append('logo', file);
            await updateCompanyMutation.mutateAsync(data);
            toast.success('Company logo updated');
        } catch (error) {
            toast.error('Failed to update logo');
        } finally {
            setIsOrgUploading(false);
        }
    };

    const handleOrgSave = async () => {
        setIsSaving(true);
        try {
            const data = new FormData();
            data.append('name', orgData.name);
            data.append('email', orgData.email);
            await updateCompanyMutation.mutateAsync(data);
            toast.success('Organization settings updated');
        } catch (error) {
            toast.error('Failed to update organization');
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadProfileImage(file);
            toast.success('Profile photo updated');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to update photo');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                name: formData.name,
                email: formData.email
            });
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Operation failed');
        } finally {
            setIsSaving(false);
        }
    };
    const handlePasswordUpdate = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error('Please fill all password fields');
            return;
        }

        if (passwords.new !== passwords.confirm) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwords.new.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsChangingPass(true);
        try {
            await changePassword({
                currentPassword: passwords.current.trim(),
                newPassword: passwords.new.trim()
            });
            toast.success('Password updated. Please login with your new credentials.');
            setPasswords({ current: '', new: '', confirm: '' });
            setTimeout(() => logout(), 2000);
        } catch (error: any) {
            console.error('Password update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setIsChangingPass(false);
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const now = new Date();
        const past = new Date(dateString);
        const diff = Math.floor((now.getTime() - past.getTime()) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    const tabs = [
        { id: 'profile', label: 'My Account', icon: User },
        { id: 'organization', label: 'Organization', icon: Building2 },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Subscription', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-10">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-200 pb-8">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
                    <p className="text-sm font-medium text-slate-500">
                        Manage your administrative profile and organization preferences.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 w-fit shadow-inner">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center gap-2.5 ${activeTab === tab.id 
                            ? 'bg-white text-slate-900 shadow-md border border-slate-100' 
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon className={`size-3.5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Panel: Settings Content */}
                <div className="lg:col-span-8 space-y-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-10"
                            >
                                {/* Admin Profile */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Configuration</h3>
                                    </div>

                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                            <User className="size-48 text-slate-900" />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                                            <div className="relative group/avatar">
                                                <div className="size-32 rounded-[2.5rem] border-4 border-slate-50 p-1 bg-white shadow-xl overflow-hidden group-hover/avatar:border-primary transition-all">
                                                    {isUploading ? (
                                                        <div className="size-full rounded-2xl flex items-center justify-center bg-slate-50">
                                                            <RefreshCcw className="size-6 text-primary animate-spin" />
                                                        </div>
                                                    ) : (
                                                        <img
                                                            src={user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `${process.env.NEXT_PUBLIC_API_URL}${user.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'Admin'}`}
                                                            className="size-full rounded-2xl object-cover bg-slate-50"
                                                            alt="Identity"
                                                        />
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                />
                                                <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute -bottom-2 -right-2 size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center border-4 border-white shadow-xl hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
                                                >
                                                    <Camera className="size-4" />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-6 text-center md:text-left">
                                                <div className="space-y-1.5">
                                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{formData.name || 'Account Owner'}</h4>
                                                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                                                        <ShieldCheck className="size-3.5" />
                                                        {formData.role}
                                                    </div>
                                                </div>
                                                <div className="flex justify-center md:justify-start gap-4">
                                                    <button
                                                        onClick={() => fileInputRef.current?.click()}
                                                        disabled={isUploading}
                                                        className="h-10 px-6 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 shadow-sm"
                                                    >
                                                        Update Photo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50 relative z-10">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                <div className="relative group/input">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                    <input
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                        placeholder="Administrative name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                                <div className="relative group/input">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                    <input
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                        placeholder="Primary email"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Interface Options */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interface Preferences</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-6 shadow-sm">
                                        <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-4 px-6 py-4 rounded-2xl transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                                    <Moon className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">Dark Mode</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch to a dark interface theme</p>
                                                </div>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-slate-100 border border-slate-200 p-1 relative shadow-inner">
                                                <div className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-slate-900 shadow-sm transition-all group-hover:scale-90"></div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-50"></div>

                                        <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-4 px-6 py-4 rounded-2xl transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                                    <RefreshCcw className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">Real-time Updates</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sync dashboard data automatically</p>
                                                </div>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-slate-900 border border-slate-900 p-1 relative shadow-inner">
                                                <div className="absolute left-1 top-1 bottom-1 aspect-square rounded-full bg-white shadow-sm transition-all group-hover:scale-90"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'organization' && (
                            <motion.div
                                key="organization"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-10"
                            >
                                <section className="space-y-6">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Profile</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                            <Building2 className="size-48 text-slate-900" />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                                            <div className="relative group/logo">
                                                <div className="size-32 rounded-[2.5rem] border-4 border-slate-50 p-6 bg-white shadow-xl overflow-hidden flex items-center justify-center group-hover/logo:border-primary transition-all">
                                                    {isOrgUploading ? (
                                                        <RefreshCcw className="size-6 text-primary animate-spin" />
                                                    ) : company?.logoUrl ? (
                                                        <img src={company.logoUrl} className="size-full rounded-2xl object-contain transition-transform group-hover/logo:scale-105" alt="Brand Logo" />
                                                    ) : (
                                                        <Building2 className="size-12 text-slate-100" />
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={companyLogoRef}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleOrgLogoChange}
                                                />
                                                <button
                                                    onClick={() => companyLogoRef.current?.click()}
                                                    className="absolute -bottom-2 -right-2 size-10 rounded-xl bg-slate-900 text-white flex items-center justify-center border-4 border-white shadow-xl hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
                                                >
                                                    <Camera className="size-4" />
                                                </button>
                                            </div>
                                            <div className="flex-1 space-y-6 text-center md:text-left">
                                                <div className="space-y-1.5">
                                                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{company?.name || 'Company Name'}</h4>
                                                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] font-bold text-sky-500 uppercase tracking-[0.2em]">
                                                        <BadgeCheck className="size-3.5" />
                                                        Verified Business Account
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => companyLogoRef.current?.click()}
                                                    disabled={isOrgUploading}
                                                    className="h-10 px-6 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50 shadow-sm"
                                                >
                                                    {isOrgUploading ? 'Updating...' : 'Change Logo'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-50 relative z-10">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                                                <div className="relative group/input">
                                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                    <input
                                                        value={orgData.name}
                                                        onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                                                <div className="relative group/input">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                    <input
                                                        value={orgData.email}
                                                        onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Public Link */}
                                        <div className="pt-10 border-t border-slate-50 space-y-6 relative z-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest leading-none">Career Portal URL</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Public page for external applicants</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/jobs/${company?._id}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast.success('URL copied to clipboard');
                                                        }}
                                                        className="h-9 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm active:scale-95"
                                                    >
                                                        <Copy className="size-3.5" />
                                                        Copy URL
                                                    </button>
                                                    <Link
                                                        href={`/jobs/${company?._id}`}
                                                        target="_blank"
                                                        className="h-9 px-5 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-950/20 active:scale-95"
                                                    >
                                                        <ExternalLink className="size-3.5" />
                                                        View Portal
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center gap-5 group/box shadow-inner overflow-hidden">
                                                <div className="size-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 shadow-sm group-hover/box:border-primary group-hover/box:text-primary transition-all">
                                                    <Globe className="size-5" />
                                                </div>
                                                <code className="text-[11px] font-mono font-bold text-slate-500 truncate select-all group-hover/box:text-slate-900 transition-colors">
                                                    {typeof window !== 'undefined' ? `${window.location.origin}/jobs/${company?._id}` : `.../jobs/${company?._id}`}
                                                </code>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-10"
                            >
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authentication Security</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                            <Shield className="size-48 text-slate-900" />
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                                    <div className="relative group/input">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                        <input
                                                            type="password"
                                                            value={passwords.current}
                                                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                            placeholder="••••••••••••"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                                    <div className="relative group/input">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                        <input
                                                            type="password"
                                                            value={passwords.new}
                                                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                            placeholder="New credential"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                                    <div className="relative group/input">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary transition-all size-4" />
                                                        <input
                                                            type="password"
                                                            value={passwords.confirm}
                                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                            className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-bold text-slate-900 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                            placeholder="Repeat new password"
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={handlePasswordUpdate}
                                                    disabled={isChangingPass}
                                                    className="h-11 px-8 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-950/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {isChangingPass ? 'Updating...' : 'Update Credential'}
                                                </button>
                                            </div>

                                            <div className="space-y-6 border-l border-slate-50 pl-10 hidden md:block">
                                                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col gap-4 group/box hover:bg-white hover:border-primary transition-all shadow-sm">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-11 rounded-[1.25rem] bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/box:text-primary transition-all shadow-sm">
                                                            <Smartphone className="size-5" />
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest leading-none">Two-Factor Auth</h4>
                                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest italic">Highly Recommended</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-widest">Add an extra layer of security to your account with 2FA verification.</p>
                                                    <button className="w-full h-10 rounded-xl border border-slate-200 bg-white text-[9px] font-bold text-slate-500 uppercase tracking-widest hover:text-primary hover:border-primary transition-all group-hover/box:shadow-md active:scale-95">
                                                        Enable Layer
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'billing' && (
                            <motion.div
                                key="billing"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-10"
                            >
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan & Entitlements</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                            <CreditCard className="size-48 text-slate-900" />
                                        </div>
                                        
                                        <div className="size-32 rounded-[2.5rem] bg-slate-900 flex flex-col items-center justify-center text-white shrink-0 shadow-2xl relative z-10 group-hover:scale-105 transition-transform">
                                            <Zap className="size-8 text-amber-400 mb-2 fill-amber-400" />
                                            <p className="text-[9px] font-bold uppercase tracking-widest">Pro Tier</p>
                                        </div>

                                        <div className="flex-1 space-y-4 relative z-10">
                                            <div className="space-y-1.5">
                                                <h4 className="text-2xl font-bold text-slate-900 tracking-tight">Enterprise Infrastructure</h4>
                                                <p className="text-sm text-slate-500 font-medium italic">Your subscription is managed via corporate billing.</p>
                                            </div>
                                            <div className="flex items-center gap-8 py-4 border-y border-slate-50">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Invoice</p>
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight leading-none italic">April 26, 2026</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                        <p className="text-sm font-bold text-emerald-600 tracking-tight leading-none italic">Active</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button className="h-10 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                                                    Upgrade Plan
                                                </button>
                                                <button className="h-10 px-6 rounded-xl border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all active:scale-95">
                                                    Manage Billings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                key="notifications"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-10"
                            >
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notification Preferences</h3>
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 space-y-6 shadow-sm">
                                        <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-4 px-6 py-4 rounded-2xl transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                                                    <Bell className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">Browser Notifications</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enable real-time desktop alerts</p>
                                                </div>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-primary border border-primary p-1 relative shadow-inner">
                                                <div className="absolute right-1 top-1 bottom-1 aspect-square rounded-full bg-white shadow-sm transition-all group-hover:scale-90"></div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-50"></div>

                                        <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 -mx-4 px-6 py-4 rounded-2xl transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                                                    <Mail className="size-5" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-slate-900 tracking-tight uppercase">Email Digests</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receive daily activity summaries via email</p>
                                                </div>
                                            </div>
                                            <div className="w-12 h-6 rounded-full bg-slate-100 border border-slate-200 p-1 relative shadow-inner">
                                                <div className="absolute left-1 top-1 bottom-1 aspect-square rounded-full bg-slate-900 shadow-sm transition-all group-hover:scale-90"></div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 px-1">
                                        <div className="size-1 bg-primary rounded-full" />
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recent Activity Feed</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {notifications.slice(0, 5).map((notif) => (
                                            <div 
                                                key={notif._id}
                                                className="bg-white border border-slate-200 rounded-3xl p-6 flex items-start gap-6 hover:border-primary/50 transition-all group/item shadow-sm"
                                            >
                                                <div className="size-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-sm">
                                                    <Bell className="size-5" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{formatRelativeTime(notif.createdAt)}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{notif.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {notifications.length > 5 && (
                                            <Link 
                                                href="/admin/notifications"
                                                className="flex items-center justify-center w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-primary hover:bg-white hover:border-primary/30 transition-all group"
                                            >
                                                View all activity
                                                <ChevronRight className="size-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                        {notifications.length === 0 && (
                                            <div className="py-20 bg-white border border-slate-200 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
                                                <div className="size-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-200 shadow-sm">
                                                    <Inbox className="size-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-slate-900 tracking-tight uppercase">Your feed is empty</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">We'll alert you here for system updates</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-10 border-t border-slate-100 relative z-10 px-4">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest italic leading-none">
                            <ShieldCheck className="size-4 text-emerald-500" />
                            Security settings validated
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={activeTab === 'organization' ? handleOrgSave : handleSave}
                                disabled={isSaving}
                                className="h-12 px-10 rounded-xl bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-950/20 group"
                            >
                                {isSaving ? (
                                    <RefreshCcw className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4 group-hover:scale-110 transition-transform" />
                                )}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Side Stats */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Activity Log */}
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-8 space-y-8 shadow-sm group">
                        <div className="flex items-center gap-4 transition-transform group-hover:translate-x-1">
                            <div className="size-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm">
                                <History className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest leading-none">Security Logs</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Last 24 hours</p>
                            </div>
                        </div>
                        <div className="space-y-6 relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100" />
                            {[
                                { event: 'Login Verified', time: '5m ago', loc: 'California, US', icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                { event: 'Profile Updated', time: '2h ago', loc: 'Management Suite', icon: Edit, color: 'text-sky-500', bg: 'bg-sky-50' },
                                { event: 'Image Changed', time: 'Yesterday', loc: 'iOS Device', icon: User, color: 'text-slate-400', bg: 'bg-slate-50' }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-6 group/item relative z-10 pl-1.5">
                                    <div className={`size-5 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white ${log.bg} ${log.color}`}>
                                        <log.icon className="size-2.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 tracking-tight leading-none mb-1.5">{log.event}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{log.time} • {log.loc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-all border-t border-slate-50 flex items-center justify-center gap-2 group/btn">
                            Detailed Logs
                            <ArrowRight className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* System Status */}
                    <div className="p-10 rounded-[2.5rem] bg-slate-900 space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                            <Settings className="size-48 text-white rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3 transition-transform group-hover:translate-x-1">
                                <div className="size-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,1)]"></div>
                                <span className="text-sm font-bold text-white uppercase tracking-widest">Core Status</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                Our platform systems are functioning normally. All job feeds are synchronized and performing at 100% capacity.
                            </p>
                            <div className="flex items-center gap-10 pt-4">
                                <div className="space-y-2">
                                    <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest block leading-none underline decoration-emerald-500 decoration-2 underline-offset-4">Load Balance</span>
                                    <span className="text-lg font-bold text-white leading-none">0.8%</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest block leading-none">Uptime</span>
                                    <span className="text-lg font-bold text-white leading-none">99%</span>
                                </div>
                            </div>
                            <button className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:bg-white transition-all hover:text-slate-950 flex items-center justify-center gap-2 group/status active:scale-95">
                                Infrastructure Hub
                                <ArrowUpRight className="size-4 transition-transform group-hover/status:translate-x-0.5 group-hover/status:-translate-y-0.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
