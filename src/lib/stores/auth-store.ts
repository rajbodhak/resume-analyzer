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
    anonymousCredits: number;
    setUser: (user: User | null) => void;
    updateCredits: (credits: number) => void;
    decrementCredit: () => void;
    decrementAnonymousCredit: () => boolean;
    incrementAnalysisCount: () => void;
    logout: () => void;
    hasCreditsAvailable: () => boolean;
    getRemainingCredits: () => number;
}

const FREE_CREDITS = 3;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: true,
            anonymousCredits: FREE_CREDITS,

            setUser: (user) => {
                set({ user, isLoading: false });
                // Don't reset anonymous credits when logging in
                // User will now have unlimited (rate-limited) access
            },

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

            decrementAnonymousCredit: () => {
                const state = get();
                if (state.anonymousCredits > 0) {
                    set({ anonymousCredits: state.anonymousCredits - 1 });
                    return true;
                }
                return false;
            },

            incrementAnalysisCount: () =>
                set((state) => ({
                    user: state.user
                        ? { ...state.user, analysesCount: state.user.analysesCount + 1 }
                        : null,
                })),

            hasCreditsAvailable: () => {
                const state = get();
                if (state.user) {
                    // Logged-in users have unlimited access (subject to rate limiting)
                    return true;
                }
                return state.anonymousCredits > 0;
            },

            getRemainingCredits: () => {
                const state = get();
                if (state.user) {
                    return -1; // -1 indicates unlimited
                }
                return state.anonymousCredits;
            },

            logout: () => set({ user: null, anonymousCredits: FREE_CREDITS }),
        }),
        {
            name: 'auth-storage',
        }
    )
);