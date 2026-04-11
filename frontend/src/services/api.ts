import axios from 'axios';

const API_URL = typeof window !== 'undefined' 
    ? '/api' 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://98.130.44.82:5000/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Interceptor for including the token in requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const res = await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
                
                if (res.status === 200) {
                    const { token } = res.data;
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('token', token);
                    }
                    
                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, log out
                console.error('Refresh token failed:', refreshError);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token && typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post('/auth/register', data);
        if (response.data.token && typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
};

export default api;
