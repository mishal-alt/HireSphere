import { create } from 'zustand';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

interface Job {
    _id: string;
    title: string;
    department: string;
    description: string;
    status: 'Active' | 'Paused' | 'Closed';
    createdAt: string;
}

interface AdminJobState {
    jobs: Job[];
    loading: boolean;
    fetchJobs: () => Promise<void>;
    addJob: (data: any) => Promise<boolean>;
    updateJob: (id: string, data: any) => Promise<boolean>;
    deleteJob: (id: string) => Promise<boolean>;
}

export const useAdminJobStore = create<AdminJobState>((set, get) => ({
    jobs: [],
    loading: false,

    fetchJobs: async () => {
        const { jobs } = get();
        // Only show loading spinner if we have no data at all
        if (jobs.length === 0) set({ loading: true });

        try {
            const response = await api.get('/jobs');
            set({ jobs: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching jobs:", error);
            set({ loading: false });
        }
    },

    addJob: async (formData) => {
        try {
            await api.post('/jobs', formData);
            toast.success('Job opening published successfully');
            await get().fetchJobs(); // Refresh list
            return true;
        } catch (error: any) {
            console.error("Error adding job:", error);
            toast.error(error.response?.data?.message || 'Failed to publish job opening');
            return false;
        }
    },

    updateJob: async (id, data) => {
        try {
            await api.put(`/jobs/${id}`, data);
            toast.success('Job updated successfully');
            await get().fetchJobs();
            return true;
        } catch (error: any) {
            console.error("Error updating job:", error);
            toast.error(error.response?.data?.message || 'Failed to update job');
            return false;
        }
    },

    deleteJob: async (id) => {
        try {
            await api.delete(`/jobs/${id}`);
            toast.success('Job deleted successfully');
            await get().fetchJobs();
            return true;
        } catch (error: any) {
            console.error("Error deleting job:", error);
            toast.error(error.response?.data?.message || 'Failed to delete job');
            return false;
        }
    }
}));
