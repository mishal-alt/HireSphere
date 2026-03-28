import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

export interface Interview {
    _id: string;
    candidateId: {
        _id: string;
        name: string;
        email: string;
    };
    interviewerId?: {
        _id: string;
        name: string;
    };
    scheduledAt: string;
    status: string;
    meetLink?: string;
    title?: string;
}

export interface InterviewStats {
    totalAssigned: number;
    upcoming: number;
    completed: number;
    avgScore: number;
}

// Admin Hooks
export const useInterviews = () => {
    return useQuery<Interview[]>({
        queryKey: ['interviews'],
        queryFn: async () => {
            const response = await api.get('/interviews');
            return response.data;
        },
    });
};

export const useCreateInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/interviews', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Interview scheduled successfully');
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
        },
    });
};

export const useUpdateInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(`/interviews/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Interview updated successfully');
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update interview');
        },
    });
};

export const useDeleteInterview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/interviews/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Interview cancelled successfully');
            queryClient.invalidateQueries({ queryKey: ['interviews'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to cancel interview');
        },
    });
};

// Interviewer Hooks
export const useInterviewerInterviews = () => {
    return useQuery<Interview[]>({
        queryKey: ['interviews', 'interviewer', 'my'],
        queryFn: async () => {
            const response = await api.get('/interviews/interviewer/my-interviews');
            return response.data;
        },
    });
};

export const useInterviewerStats = () => {
    return useQuery<InterviewStats>({
        queryKey: ['interviews', 'interviewer', 'stats'],
        queryFn: async () => {
            const response = await api.get('/interviews/interviewer/stats');
            return response.data;
        },
    });
};
