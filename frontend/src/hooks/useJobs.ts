import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

export interface Job {
    _id: string;
    title: string;
    department: string;
    description: string;
    status: 'Active' | 'Paused' | 'Closed';
    requiredSkills?: string[];
    createdAt: string;
    applicantCount?: number;
}

export const useJobs = () => {
    return useQuery<Job[]>({
        queryKey: ['jobs'],
        queryFn: async () => {
            const response = await api.get('/jobs');
            return response.data;
        },
    });
};

export const useJob = (id: string) => {
    return useQuery<Job>({
        queryKey: ['jobs', id],
        queryFn: async () => {
            const response = await api.get(`/jobs/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useAddJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post('/jobs', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Job opening published successfully');
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to publish job opening');
        },
    });
};

export const useUpdateJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const response = await api.put(`/jobs/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Job updated successfully');
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update job');
        },
    });
};

export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/jobs/${id}`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Job deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete job');
        },
    });
};
