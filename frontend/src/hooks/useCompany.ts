import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export interface Company {
    _id: string;
    name: string;
    email: string;
    logoUrl?: string;
    subscriptionPlan: string;
}

export const useCompany = () => {
    return useQuery<Company>({
        queryKey: ['company'],
        queryFn: async () => {
            const response = await api.get('/company/profile');
            return response.data.data;
        },
    });
};

export const useUpdateCompany = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await api.put('/company/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['company'] });
        },
    });
};
