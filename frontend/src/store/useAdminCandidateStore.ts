import { create } from 'zustand';
import api from '@/services/api';

interface Candidate {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    experience?: string;
    education?: string;
    resumeUrl?: string;
    status: string;
    profileImage?: string;
    createdAt: string;
}


interface AdminCandidateState {
    candidates: Candidate[];
    selectedCandidate: Candidate | null;
    loading: boolean;
    fetchCandidates: (filters?: { status?: string; search?: string }) => Promise<void>;
    fetchCandidateById: (id: string) => Promise<void>;
    createCandidate: (formData: FormData) => Promise<void>;
}

export const useAdminCandidateStore = create<AdminCandidateState>((set, get) => ({
    candidates: [],
    selectedCandidate: null,
    loading: false,

    fetchCandidates: async (filters) => {
        set((state) => {
            if (state.candidates.length === 0) return { loading: true };
            return {};
        });

        try {
            const params = new URLSearchParams();
            if (filters?.status && filters.status !== 'All') params.append('status', filters.status);
            if (filters?.search) params.append('search', filters.search);

            const response = await api.get(`/candidates?${params.toString()}`);
            set({ candidates: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching candidates:", error);
            set({ loading: false });
        }
    },

    fetchCandidateById: async (id: string) => {
        set({ loading: true });
        try {
            const response = await api.get(`/candidates/${id}`);
            set({ selectedCandidate: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching candidate:", error);
            set({ loading: false });
        }
    },

    createCandidate: async (formData: FormData) => {
        set({ loading: true });
        try {
            await api.post('/candidates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            await get().fetchCandidates();
            set({ loading: false });
        } catch (error) {
            console.error("Error creating candidate:", error);
            set({ loading: false });
            throw error;
        }
    }
}));
