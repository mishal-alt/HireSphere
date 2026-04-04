'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import {
    User,
    Lock,
    Bell,
    Calendar,
    Camera,
    Mail,
    Building2,
    Globe,
    Link as LinkIcon,
    Plus,
    X,
    Save,
    RotateCcw,
    ShieldCheck,
    Smartphone,
    UserCircle,
    Shield,
    CircleCheck,
    LogOut,
    Eye,
    Settings,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateProfile, uploadProfileImage, changePassword, logout } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: 'Engineering',
        notificationPreferences: {
            interviewAssigned: true,
            recruiterMessage: true,
            candidateSubmission: true,
            meetingReminders: true
        }
    });
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isChangingPass, setIsChangingPass] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || 'Engineering',
                notificationPreferences: user.notificationPreferences || {
                    interviewAssigned: true,
                    recruiterMessage: true,
                    candidateSubmission: true,
                    meetingReminders: true
                }
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (key: string) => {
        setFormData(prev => ({
            ...prev,
            notificationPreferences: {
                ...prev.notificationPreferences,
                [key]: !prev.notificationPreferences[key as keyof typeof prev.notificationPreferences]
            }
        }));
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
                email: formData.email,
                notificationPreferences: formData.notificationPreferences
            });
            toast.success('Account settings updated');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to update settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || 'Engineering',
                notificationPreferences: user.notificationPreferences || {
                    interviewAssigned: true,
                    recruiterMessage: true,
                    candidateSubmission: true,
                    meetingReminders: true
                }
            });
            toast('Changes reverted', { icon: '🔄' });
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

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'availability', label: 'Availability', icon: Calendar }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-gray-200/50 pb-8">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-sm font-medium text-gray-500">Manage your profile details and platform preferences.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 bg-gray-50 p-1.5 rounded-2xl /60 w-fit shadow-inner">
                {tabs.map((tab) => (
                    <Button variant="ghost"
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`h-10 px-6 rounded-xl text-[10px] font-medium uppercase tracking-widest transition-all relative flex items-center gap-2.5 ${activeTab === tab.id 
                            ? 'bg-white text-gray-900 shadow-none border border-gray-100' 
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <tab.icon className={`size-3.5 ${activeTab === tab.id ? 'text-gray-900' : ''}`} />
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Settings Sections */}
            <div className="bg-white rounded-2xl p-6 shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    <Settings className="size-48 text-gray-900" />
                </div>
                <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12 relative z-10"
                        >
                            {/* Profile Photo */}
                            <div className="flex flex-col md:flex-row md:items-center gap-6 py-8 border-b border-slate-50">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
                                    <p className="text-xs text-gray-500 font-medium">This photo will be visible to candidates and other team members.</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="relative group/avatar">
                                        <div className="size-24 rounded-2xl border-4 border-slate-50 p-1 bg-white shadow-none overflow-hidden group-hover/avatar:border-primary transition-all">
                                            {isUploading ? (
                                                <div className="size-full rounded-2xl flex items-center justify-center bg-gray-50">
                                                    <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={user?.profileImage ? (user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`) : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || 'User'}`}
                                                    className="size-full rounded-2xl object-cover bg-gray-50"
                                                    alt="Avatar"
                                                />
                                            )}
                                        </div>
                                        <Input
                                            type="file"
                                            ref={fileInputRef}
                                            className="w-full h-10 bg-gray-100/80 border-none rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                        <Button variant="ghost"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-1 -right-1 size-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center border-4 border-white shadow-none hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
                                        >
                                            <Camera className="size-4" />
                                        </Button>
                                    </div>
                                    <div className="space-y-3">
                                        <Button variant="ghost"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploading}
                                            className="h-10 px-6 rounded-xl bg-white text-[10px] font-medium text-gray-600 uppercase tracking-widest hover:border-primary hover:text-gray-900 transition-all disabled:opacity-50 shadow-none"
                                        >
                                            {isUploading ? 'Uploading...' : 'Change Photo'}
                                        </Button>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest pl-1">PNG, JPG or SVG • Max 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="flex flex-col md:flex-row gap-6 py-8 border-b border-slate-50">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Personal Data</h3>
                                    <p className="text-xs text-gray-500 font-medium">Your primary contact and organizational information.</p>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-all" />
                                                <Input
                                                    name="name"
                                                    placeholder="Enter your name"
                                                    className="w-full h-12 bg-gray-100/80 border-none rounded-lg !pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Department</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                                                <Input
                                                    className="w-full h-12 bg-gray-100/80 border-none rounded-lg !pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                                    value={formData.department}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-all" />
                                            <Input
                                                name="email"
                                                placeholder="work@example.com"
                                                className="w-full h-12 bg-gray-100/80 border-none rounded-lg !pl-12 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:bg-gray-100 transition-colors"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Timezone</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-all" />
                                            <select className="w-full h-12 bg-gray-50 rounded-xl pl-12 pr-4 text-sm font-medium text-gray-900 transition-all focus:border-primary focus:bg-white outline-none appearance-none cursor-pointer">
                                                <option>Greenwich Mean Time (GMT +00:00)</option>
                                                <option>Eastern Standard Time (GMT -5:00)</option>
                                                <option>Indian Standard Time (GMT +5:30)</option>
                                                <option>Pacific Standard Time (GMT -8:00)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Calendar Connections */}
                            <div className="flex flex-col md:flex-row gap-6 py-8">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Connections</h3>
                                    <p className="text-xs text-gray-500 font-medium">Link your account with external calendar services.</p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="p-5 rounded-2xl bg-gray-50 flex items-center justify-between group hover:bg-white hover:border-primary hover:shadow-none hover:shadow-primary/5 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="size-12 rounded-xl bg-white flex items-center justify-center p-2.5 shadow-none group-hover:border-primary transition-colors">
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" className="size-full" alt="G" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">Google Calendar</p>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="size-2 rounded-full bg-gray-400 animate-pulse"></div>
                                                    <p className="text-[9px] text-gray-900 font-medium uppercase tracking-widest">Active & Connected</p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="text-[10px] font-medium text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors mr-2">Disconnect</Button>
                                    </div>
                                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                        <Plus className="size-4 text-gray-400 group-hover:text-gray-900 transition-colors" />
                                        <span className="text-[10px] font-medium text-gray-400 group-hover:text-gray-900 uppercase tracking-widest transition-colors">Link Other Calendars</span>
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12 relative z-10"
                        >
                            {/* Password Change */}
                            <div className="flex flex-col md:flex-row gap-6 py-8 border-b border-slate-50">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Security Credentials</h3>
                                    <p className="text-xs text-gray-500 font-medium">Update your password to ensure your account remains secure.</p>
                                </div>
                                <div className="flex-1 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 group-focus-within:text-gray-900 transition-all" />
                                            <Input
                                                type="password"
                                                value={passwords.current}
                                                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                className="w-full h-12 bg-gray-50 rounded-xl pl-12 pr-4 text-sm font-medium text-gray-900 transition-all focus:border-primary focus:bg-white outline-none"
                                                placeholder="••••••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                            <Input
                                                type="password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm font-medium text-gray-900 transition-all focus:border-primary focus:bg-white outline-none"
                                                placeholder="New password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <Input
                                                type="password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm font-medium text-gray-900 transition-all focus:border-primary focus:bg-white outline-none"
                                                placeholder="Confirm password"
                                            />
                                        </div>
                                    </div>
                                    <Button variant="default" 
                                        onClick={handlePasswordUpdate}
                                        disabled={isChangingPass}
                                        className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isChangingPass ? 'Updating...' : 'Update Credential'}
                                    </Button>
                                </div>
                            </div>

                            {/* MFA Control */}
                            <div className="flex flex-col md:flex-row gap-6 py-8">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Advanced Security</h3>
                                    <p className="text-xs text-gray-500 font-medium">Enable additional verification layers for your account.</p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="p-6 rounded-2xl bg-gray-50 flex items-center justify-between group hover:bg-white hover:border-primary hover:shadow-none hover:shadow-primary/5 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className="size-12 rounded-xl bg-white flex items-center justify-center text-gray-400 shadow-none group-hover:border-primary group-hover:text-gray-900 transition-all">
                                                <Smartphone className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">Two-Factor Authentication</p>
                                                <p className="text-[10px] text-gray-500 font-medium mt-1">Protect your account with mobile verification.</p>
                                            </div>
                                        </div>
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3">
                                        <ShieldCheck className="size-4 text-gray-900" />
                                        <p className="text-[10px] font-medium text-gray-900 uppercase tracking-widest">Verification status: Secured</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'notifications' && (
                        <motion.div
                            key="notifications"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12 relative z-10"
                        >
                            <div className="flex flex-col md:flex-row gap-6 py-8">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Event Stream</h3>
                                    <p className="text-xs text-gray-500 font-medium">Choose which activities you want to be notified about.</p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {[
                                        { title: 'New Interview Assigned', key: 'interviewAssigned', desc: 'Get notified as soon as an admin assigns a candidate to you.', icon: Calendar },
                                        { title: 'Message from Recruiter', key: 'recruiterMessage', desc: 'Receive alerts for internal team messages and updates.', icon: Mail },
                                        { title: 'Candidate Submission', key: 'candidateSubmission', desc: 'Alert when a candidate completes their required pre-assessment.', icon: UserCircle },
                                        { title: 'Meeting Reminders', key: 'meetingReminders', desc: 'Remind me 15 minutes before an interview starts.', icon: Bell }
                                    ].map((item, i) => (
                                        <label key={i} className="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-primary/30 hover:bg-gray-50 transition-all cursor-pointer group">
                                            <div className="flex items-center gap-6">
                                                <div className="size-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
                                                    <item.icon className="size-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-900 uppercase tracking-widest">{item.title}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={formData.notificationPreferences[item.key as keyof typeof formData.notificationPreferences]}
                                                    onChange={() => handleToggle(item.key)}
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'availability' && (
                        <motion.div
                            key="availability"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="space-y-12 relative z-10"
                        >
                            <div className="flex flex-col md:flex-row gap-6 py-8">
                                <div className="space-y-1.5 max-w-[200px]">
                                    <h3 className="text-sm font-medium text-gray-900">Working Period</h3>
                                    <p className="text-xs text-gray-500 font-medium">Define your standard availability for automated scheduling.</p>
                                </div>
                                <div className="flex-1 space-y-12">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Standard Start</label>
                                            <select className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm font-medium text-gray-900 outline-none">
                                                <option>09:00 AM</option>
                                                <option>10:00 AM</option>
                                                <option>11:00 AM</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Standard End</label>
                                            <select className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm font-medium text-gray-900 outline-none">
                                                <option>05:00 PM</option>
                                                <option>06:00 PM</option>
                                                <option>07:00 PM</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-medium text-gray-400 uppercase tracking-widest ml-1">Available Workdays</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                                <Button variant="default" key={day} className={`h-11 px-5 rounded-xl text-[11px] font-medium uppercase tracking-widest transition-all border ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day) ? 'bg-emerald-800 text-white border-primary shadow-none shadow-primary/20' : 'bg-white text-gray-400 border-gray-200/50 hover:border-slate-400'}`}>
                                                    {day}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Controls */}
                <div className="flex items-center justify-between pt-10 border-t border-gray-100 bg-white/50 relative z-10">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest italic flex items-center gap-2.5">
                        <CircleCheck className="size-4 text-gray-900" />
                        Settings are saved automatically
                    </p>
                    <div className="flex gap-6">
                        <Button variant="outline"
                            onClick={handleCancel}
                            className="bg-white hover:bg-gray-50 border border-gray-200/50 text-gray-700 shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="size-4" />
                            Discard
                        </Button>
                        <Button variant="default"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-emerald-800 text-white shadow-none h-10 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <div className="size-4 border border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save className="size-4 group-hover/save:scale-110 transition-transform" />
                            )}
                            {isSaving ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-white shadow-none flex items-start gap-6 hover:border-primary/50 transition-all group cursor-pointer active:scale-[0.98]">
                    <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all shadow-none group-hover:rotate-6">
                        <Smartphone className="size-6" />
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-900 uppercase tracking-widest">Two-Factor Auth</h4>
                        <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Add an extra layer of security to your account with 2FA.</p>
                        <div className="flex items-center gap-2 text-[9px] font-medium text-gray-900 uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-all">
                            Configure <ArrowUpRight className="size-3" />
                        </div>
                    </div>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-none flex items-start gap-6 hover:border-primary/50 transition-all group cursor-pointer active:scale-[0.98]">
                    <div className="size-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-emerald-800 group-hover:text-white group-hover:border-primary transition-all shadow-none group-hover:-rotate-6">
                        <Eye className="size-6" />
                    </div>
                    <div>
                        <h4 className="text-xs font-medium text-gray-900 uppercase tracking-widest">Privacy Controls</h4>
                        <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Manage who can see your profile and interview availability.</p>
                        <div className="flex items-center gap-2 text-[9px] font-medium text-gray-900 uppercase tracking-widest mt-3 opacity-0 group-hover:opacity-100 transition-all">
                            Manage <ArrowUpRight className="size-3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
