import { create } from 'zustand';
import api from '@/services/api';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'interviewer' | 'candidate';
    companyId?: string;
    department?: string;
    profileImage?: string;
    notificationPreferences?: {
        interviewAssigned: boolean;
        recruiterMessage: boolean;
        candidateSubmission: boolean;
        candidateApplication: boolean;
        meetingReminders: boolean;
        browserNotifications: boolean;
        emailDigests: boolean;
    };
    interfacePreferences?: {
        darkMode: boolean;
        realTimeUpdates: boolean;
    };
}


interface Company {
    _id: string;
    name: string;
    logoUrl?: string;
    subscriptionPlan?: 'free' | 'basic' | 'premium' | 'pro' | 'enterprise';
    subscriptionStatus?: 'active' | 'inactive' | 'cancelled' | 'expired';
    currentPeriodEnd?: string;
}

interface AuthState {
    user: User | null;
    company: Company | null;
    loading: boolean;
    initialized: boolean;
    checkAuth: () => Promise<void>;
    fetchCompany: () => Promise<void>;
    setUser: (user: User | null) => void;
    login: (credentials: any) => Promise<any>;
    signup: (data: any) => Promise<any>;
    googleLogin: (idToken: string) => Promise<any>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    uploadProfileImage: (file: File) => Promise<string>;
    changePassword: (data: any) => Promise<any>;
    logout: () => void;
    fetchingCompany?: boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    company: null,
    loading: true,
    initialized: false,
    fetchingCompany: false,

    setUser: (user) => set({ user }),

    fetchCompany: async () => {
        const { company, fetchingCompany } = get();
        if (company || fetchingCompany) return; // Skip if already loaded or fetching

        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        set({ fetchingCompany: true });
        try {
            console.log('Fetching company from:', `http://127.0.0.1:5000/api/company/profile`);
            const companyRes = await api.get('/company/profile');
            set({ company: companyRes.data.data });
        } catch (error: any) {
            console.error('Error fetching company:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            if (error.response?.status === 401) {
                get().logout();
            }
        } finally {
            set({ fetchingCompany: false });
        }
    },

    checkAuth: async () => {
        if (get().initialized) return;

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                set({ user: null, company: null, loading: false, initialized: true });
                return;
            }

            // Immediately restore user and set initialized for instantaneous UI load
            const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            const storedUser = userData ? JSON.parse(userData) : null;

            if (storedUser) {
                set({ user: storedUser, loading: false, initialized: true });
                // Background sync
                get().fetchCompany();
            } else {
                set({ loading: true });
                await get().fetchCompany();
                set({ loading: false, initialized: true });
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            set({ user: null, company: null, loading: false, initialized: true });
        }
    },

    updateProfile: async (data) => {
        try {
            const response = await api.put('/users/profile', data);
            const updatedUser = response.data.user;

            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            set({ user: updatedUser });
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    changePassword: async (data: any) => {
        try {
            const response = await api.put('/users/change-password', data);
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    },

    uploadProfileImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.put('/users/profile/image', formData);

            const { profileImage } = response.data;

            const user = get().user;

            if (user) {
                const updatedUser = { ...user, profileImage };
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
                set({ user: updatedUser });
            }

            return profileImage;
        } catch (error) {
            console.error('Error uploading profile image:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            set({ user, initialized: true, loading: false });

            // Wait a micro-task for state to settle
            setTimeout(() => {
                if (user.role === 'admin') window.location.href = '/admin/dashboard';
                else if (user.role === 'interviewer') window.location.href = '/interviewer/dashboard';
                else window.location.href = '/';
            }, 100);

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    signup: async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            const { token, user } = response.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            set({ user, initialized: true, loading: false });

            setTimeout(() => {
                if (user.role === 'admin') window.location.href = '/admin/dashboard';
                else if (user.role === 'interviewer') window.location.href = '/interviewer/dashboard';
                else window.location.href = '/';
            }, 100);

            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    googleLogin: async (idToken: string) => {
        try {
            const response = await api.post('/auth/google', { idToken });
            const { token, user } = response.data;

            if (typeof window !== 'undefined') {
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            set({ user, initialized: true, loading: false });

            setTimeout(() => {
                if (user.role === 'admin') window.location.href = '/admin/dashboard';
                else if (user.role === 'interviewer') window.location.href = '/interviewer/dashboard';
                else window.location.href = '/';
            }, 100);

            return response.data;
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
            set({ user: null, company: null });
        }
    }
}));
