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
    offerLetterUrl?: string;
    atsScore?: number;
    status: string;
    jobId?: {
        _id: string;
        title: string;
    };
    interviews?: any[];
    matchedSkills?: string[];
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
export const useDeleteCandidate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/candidates/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
        },
    });
};

export const useHireCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/candidates/${id}/hire`);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidates', id] });
        }
    });
};

export const useRejectCandidate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/candidates/${id}/reject`);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidates', id] });
        }
    });
};

export const useGenerateOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, salary, joiningDate }: { id: string; salary: number; joiningDate: string }) => {
            const response = await api.post(`/candidates/${id}/generate-offer`, { salary, joiningDate });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidates', variables.id] });
        }
    });
};

export const useSimulateSignature = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.post(`/candidates/${id}/simulate-signature`);
            return response.data;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['candidates'] });
            queryClient.invalidateQueries({ queryKey: ['candidates', id] });
        }
    });
};
