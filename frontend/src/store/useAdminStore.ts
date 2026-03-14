import { create } from 'zustand';
import api from '@/services/api';

interface DashboardStats {
    totalCandidates: number;
    interviewsToday: number;
    totalInterviewers: number;
    totalJobs: number;
}

interface RecentInterview {
    _id: string;
    candidateId: {
        name: string;
    };
    status: string;
    scheduledAt: string;
}

interface AdminDashboardState {
    stats: DashboardStats;
    recentInterviews: RecentInterview[];
    loading: boolean;
    fetchDashboardData: () => Promise<void>;
    cancelInterview: (id: string) => Promise<void>;
    rescheduleInterview: (id: string, newDate: string) => Promise<void>;
}

export const useAdminStore = create<AdminDashboardState>((set, get) => ({
    stats: {
        totalCandidates: 0,
        interviewsToday: 0,
        totalInterviewers: 0,
        totalJobs: 0
    },
    recentInterviews: [],
    loading: false,

    fetchDashboardData: async () => {
        set((state) => {
            // Only show loading if we have initial/zero values
            if (state.stats.totalCandidates === 0 && state.recentInterviews.length === 0) {
                return { loading: true };
            }
            return {};
        });

        try {
            const response = await api.get('/dashboard/stats');
            set({ 
                stats: response.data.stats, 
                recentInterviews: response.data.recentInterviews,
                loading: false 
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            set({ loading: false });
        }
    },

    cancelInterview: async (id: string) => {
        try {
            await api.put(`/interviews/${id}`, { status: 'Cancelled' });
            // Refresh data after cancellation
            get().fetchDashboardData();
        } catch (error) {
            console.error("Error cancelling interview:", error);
            throw error;
        }
    },

    rescheduleInterview: async (id: string, newDate: string) => {
        try {
            await api.put(`/interviews/${id}`, { scheduledAt: newDate });
            // Refresh data after rescheduling
            get().fetchDashboardData();
        } catch (error) {
            console.error("Error rescheduling interview:", error);
            throw error;
        }
    }
}));
