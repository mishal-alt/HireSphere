import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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


export const useInterviewers = () => {
    return useQuery<Interviewer[]>({
        queryKey: ['interviewers'],
        queryFn: async () => {
            const response = await api.get('/users');
            return response.data;
        },
    });
};

export const useInterviewer = (id: string) => {
    return useQuery<Interviewer>({
        queryKey: ['interviewers', id],
        queryFn: async () => {
            const response = await api.get(`/users/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useAddInterviewer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/users', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Interviewer created successfully');
            queryClient.invalidateQueries({ queryKey: ['interviewers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create interviewer');
        },
    });
};

export const useUpdateInterviewer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: (_, variables) => {
            toast.success('Interviewer updated successfully');
            queryClient.invalidateQueries({ queryKey: ['interviewers'] });
            queryClient.invalidateQueries({ queryKey: ['interviewers', variables.id] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update interviewer');
        },
    });
};

export const useDeleteInterviewer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Interviewer terminated successfully');
            queryClient.invalidateQueries({ queryKey: ['interviewers'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to terminate interviewer');
        },
    });
};
