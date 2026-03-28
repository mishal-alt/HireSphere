import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface Participant {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'interviewer';
    department?: string;
    isActive: boolean;
    profileImage?: string;
}


export const useChatParticipants = () => {
    return useQuery<Participant[]>({
        queryKey: ['chat-participants'],
        queryFn: async () => {
            const response = await api.get('/users/chat-participants');
            return response.data;
        },
    });
};
