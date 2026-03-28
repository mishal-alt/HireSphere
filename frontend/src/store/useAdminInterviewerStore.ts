import { create } from 'zustand';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

export interface Interviewer {

    _id: string;
    name: string;
    email: string;
    department?: string;
    isActive: boolean;
    interviewsCount?: number;
    rating?: number;
    profileImage?: string;
}


interface AdminInterviewerState {
    interviewers: Interviewer[];
    selectedInterviewer: Interviewer | null;
    loading: boolean;
    fetchInterviewers: () => Promise<void>;
    fetchInterviewerById: (id: string) => Promise<void>;
    addInterviewer: (data: any) => Promise<boolean>;
    updateInterviewer: (id: string, data: any) => Promise<boolean>;
    deleteInterviewer: (id: string) => Promise<boolean>;
}

export const useAdminInterviewerStore = create<AdminInterviewerState>((set, get) => ({
    interviewers: [],
    selectedInterviewer: null,
    loading: false,

    fetchInterviewers: async () => {
        const { interviewers } = get();
        // Only show loading if we have no data
        if (interviewers.length === 0) set({ loading: true });

        try {
            const response = await api.get('/users');
            set({ interviewers: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching interviewers:", error);
            set({ loading: false });
        }
    },

    fetchInterviewerById: async (id: string) => {
        set({ loading: true });
        try {
            const response = await api.get(`/users/${id}`);
            set({ selectedInterviewer: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching interviewer:", error);
            set({ loading: false });
        }
    },

    addInterviewer: async (formData) => {
        try {
            await api.post('/users', formData);
            toast.success('Interviewer created successfully');
            await get().fetchInterviewers(); // Refresh list
            return true;
        } catch (error: any) {
            console.error("Error adding interviewer:", error);
            toast.error(error.response?.data?.message || 'Failed to create interviewer');
            return false;
        }
    },

    updateInterviewer: async (id, data) => {
        try {
            await api.put(`/users/${id}`, data);
            toast.success('Interviewer updated successfully');
            await get().fetchInterviewers(); // Refresh list
            return true;
        } catch (error: any) {
            console.error("Error updating interviewer:", error);
            toast.error(error.response?.data?.message || 'Failed to update interviewer');
            return false;
        }
    },

    deleteInterviewer: async (id) => {
        try {
            await api.delete(`/users/${id}`);
            toast.success('Interviewer terminated successfully');
            await get().fetchInterviewers(); // Refresh list
            return true;
        } catch (error: any) {
            console.error("Error deleting interviewer:", error);
            toast.error(error.response?.data?.message || 'Failed to terminate interviewer');
            return false;
        }
    }
}));
