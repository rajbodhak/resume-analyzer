import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    subscriptionTier: string;
    creditsRemaining: number;
    analysesCount: number;
}

interface AuthStore {
    user: User | null;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    updateCredits: (credits: number) => void;
    decrementCredit: () => void;
    incrementAnalysisCount: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,

            setUser: (user) => set({ user, isLoading: false }),

            updateCredits: (credits) =>
                set((state) => ({
                    user: state.user ? { ...state.user, creditsRemaining: credits } : null,
                })),

            decrementCredit: () =>
                set((state) => ({
                    user: state.user
                        ? {
                            ...state.user,
                            creditsRemaining: Math.max(0, state.user.creditsRemaining - 1),
                        }
                        : null,
                })),

            incrementAnalysisCount: () =>
                set((state) => ({
                    user: state.user
                        ? { ...state.user, analysesCount: state.user.analysesCount + 1 }
                        : null,
                })),

            logout: () => set({ user: null }),
        }),
        {
            name: 'auth-storage', // localStorage key
        }
    )
);