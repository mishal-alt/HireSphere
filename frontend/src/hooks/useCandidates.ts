import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface Candidate {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    experience?: string;
    education?: string;
    resumeUrl?: string;
    status: string;
    jobId?: {
        _id: string;
        title: string;
    };
    createdAt: string;
}

export const useCandidates = (filters?: { status?: string; search?: string }) => {
    return useQuery<Candidate[]>({
        queryKey: ['candidates', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
            if (filters?.search) params.append('search', filters.search);

            const response = await api.get(`/candidates?${params.toString()}`);
            return response.data;
        },
    });
};

export const useCandidate = (id: string) => {
    return useQuery<Candidate>({
        queryKey: ['candidates', id],
        queryFn: async () => {
            const response = await api.get(`/candidates/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
};

export const useCreateCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.post('/candidates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
    });
};
