import { create } from 'zustand';
import api from '@/services/api';

interface Candidate {
    _id: string;
    name: string;
    email: string;
    role?: string;
}

interface Interview {
    _id: string;
    candidateId: Candidate;
    status: string;
    scheduledAt: string;
    meetLink: string;
    title?: string;
}

interface Stats {
    totalAssigned: number;
    upcoming: number;
    completed: number;
    avgScore: number;
}

interface InterviewState {
    interviews: Interview[];
    stats: Stats;
    loading: boolean;
    fetchInterviewerInterviews: (interviewerId?: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set) => ({
    interviews: [],
    stats: {
        totalAssigned: 0,
        upcoming: 0,
        completed: 0,
        avgScore: 0
    },
    loading: false,

    fetchInterviewerInterviews: async (interviewerId?: string) => {
        set({ loading: true });
        try {
            const [statsRes, interviewsRes] = await Promise.all([
                api.get('/interviews/interviewer/stats'),
                api.get('/interviews/interviewer/my-interviews')
            ]);
            set({ 
                stats: statsRes.data,
                interviews: interviewsRes.data 
            });
        } catch (error) {
            console.error('Error fetching interviewer data:', error);
        } finally {
            set({ loading: false });
        }
    }
}));
