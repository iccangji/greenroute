// store/useAuthStore.ts
import { create } from 'zustand';
type PageStore = {
    username: string;
    setUsername: (username: string) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    alertMsg: string;
    setAlertMsg: (alertMsg: string) => void;
    refreshKey: number;
    setRefreshKey: (refreshKey: number) => void;
    isAdmin: boolean,
    setIsAdmin: (isAdmin: boolean) => void
};

export const usePageStore = create<PageStore>((set) => ({
    username: "",
    isLoading: false,
    alertMsg: "",
    refreshKey: 0,
    isAdmin: false,
    setUsername(username) {
        set({ username });
    },
    setAlertMsg(alertMsg) {
        set({ alertMsg });
    },
    setIsLoading(isLoading) {
        set({ isLoading });
    },
    setRefreshKey(refreshKey) {
        set({ refreshKey });
    },
    setIsAdmin(isAdmin) {
        set({ isAdmin });
    },
}));