import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

// Interface matching the backend response
export interface DashboardData {
    stats: {
        totalCandidates: number;
        candidateTrend: string;
        interviewsToday: number;
        interviewTrend: string;
        totalInterviewers: number;
        totalJobs: number;
        conductedInterviews: number;
        totalInterviews: number;
        successRate: string;
        expansionRate: string;
    };
    recentInterviews: Array<{
        _id: string;
        candidateId: {
            _id: string;
            name: string;
            profileImage?: string;
        };
        status: string;
        scheduledAt: string;
    }>;
    talentDistribution: Array<{
        label: string;
        count: number;
        percent: string;
    }>;
    growthTrend: number[];
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
