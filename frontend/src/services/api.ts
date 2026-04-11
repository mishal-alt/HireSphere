import axios from 'axios';

// Ensure the API URL always ends with /api if it's an absolute URL
const getBaseApiUrl = () => {
    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://98.130.44.82:5000/api';
    if (rawUrl.startsWith('http') && !rawUrl.endsWith('/api')) {
        return `${rawUrl}/api`;
    }
    return rawUrl;
};

const ABSOLUTE_API_URL = getBaseApiUrl();

export const API_URL = typeof window !== 'undefined' ? '/api' : ABSOLUTE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

/**
 * Helper to get a safe URL for uploaded files (images, resumes)
 * Handles proxying to avoid Mixed Content errors in the browser.
 */
export const getFileUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // In the browser, use the proxy root. 
    // On the server, use the absolute backend IP.
    const base = typeof window !== 'undefined' 
        ? '' 
        : ABSOLUTE_API_URL.replace('/api', '');
        
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};


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
