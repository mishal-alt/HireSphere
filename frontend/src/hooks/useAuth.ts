import { useAuthStore } from '@/store/useAuthStore';

/**
 * useAuth hook
 * A convenient wrapper around useAuthStore for quick access to authentication state and methods.
 */
export const useAuth = () => {
    const auth = useAuthStore();
    return auth;
};

export default useAuth;
