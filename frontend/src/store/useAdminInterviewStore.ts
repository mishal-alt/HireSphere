import { create } from 'zustand';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

interface Interview {
    _id: string;
    candidateId: any;
    interviewerId: any;
    scheduledAt: string;
    status: string;
    meetLink: string;
}

interface AdminInterviewState {
    interviews: Interview[];
    loading: boolean;
    fetchInterviews: () => Promise<void>;
    createInterview: (data: any) => Promise<boolean>;
    updateInterview: (id: string, data: any) => Promise<boolean>;
    deleteInterview: (id: string) => Promise<boolean>;
}

export const useAdminInterviewStore = create<AdminInterviewState>((set, get) => ({
    interviews: [],
    loading: false,

    fetchInterviews: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/interviews');
            set({ interviews: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching interviews:", error);
            set({ loading: false });
        }
    },

    createInterview: async (formData) => {
        try {
            await api.post('/interviews', formData);
            toast.success('Interview scheduled successfully');
            await get().fetchInterviews();
            return true;
        } catch (error: any) {
            console.error("Error creating interview:", error);
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
            return false;
        }
    },

    updateInterview: async (id, data) => {
        try {
            await api.put(`/interviews/${id}`, data);
            toast.success('Interview updated successfully');
            await get().fetchInterviews();
            return true;
        } catch (error: any) {
            console.error("Error updating interview:", error);
            toast.error(error.response?.data?.message || 'Failed to update interview');
            return false;
        }
    },

    deleteInterview: async (id) => {
        try {
            await api.delete(`/interviews/${id}`);
            toast.success('Interview cancelled successfully');
            await get().fetchInterviews();
            return true;
        } catch (error: any) {
            console.error("Error deleting interview:", error);
            toast.error(error.response?.data?.message || 'Failed to cancel interview');
            return false;
        }
    }
}));
