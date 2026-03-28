import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Interface matching the backend response
export interface DashboardData {
    stats: {
        totalCandidates: number;
        interviewsToday: number;
        totalInterviewers: number;
        totalJobs: number;
        conductedInterviews: number;
    };
    recentInterviews: Array<{
        _id: string;
        candidateId: {
            _id: string;
            name: string;
        };
        status: string;
        scheduledAt: string;
    }>;
}

export const useDashboardData = () => {
    return useQuery<DashboardData>({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const response = await api.get('/dashboard/stats');
            return response.data;
        },
    });
};

export const useCancelInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.put(`/interviews/${id}`, { status: 'Cancelled' });
            return response.data;
        },
        onSuccess: () => {
            // Refetch dashboard data after a successful cancellation
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

export const useRescheduleInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, newDate }: { id: string; newDate: string }) => {
            const response = await api.put(`/interviews/${id}`, { scheduledAt: newDate });
            return response.data;
        },
        onSuccess: () => {
            // Refetch dashboard data after a successful reschedule
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};
