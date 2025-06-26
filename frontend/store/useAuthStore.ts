// store/useAuthStore.ts
import axios from '@/lib/axios';
import { create } from 'zustand';
import Cookies from 'js-cookie';

type AuthStore = {
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    showPassword: boolean;
    error: string;
    setError: (isError: string) => void;
    toggleShowPassword: () => void;
    login: () => Promise<boolean>;
    signup: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    username: '',
    password: '',
    showPassword: false,
    toggleShowPassword: () =>
        set((state) => ({ showPassword: !state.showPassword })),
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    login: async () => {
        const { username, password } = get();
        try {
            const response = await axios.post('/login', {
                name: username,
                password,
            });

            if (response.status === 200 && response.data.token) {
                // Simpan token ke cookies
                Cookies.set('token', response.data.token, { expires: 1 });
                // Cookies.set('role', response.data.role, { expires: 1 });
                Cookies.set('user', username, { expires: 1 });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
    signup: async () => {
        const { username, password } = get();
        try {
            const response = await axios.post('/signup', {
                name: username,
                password,
            });

            if (response.status === 201) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
    error: "",
    setError: (error) => set({ error })
}));
