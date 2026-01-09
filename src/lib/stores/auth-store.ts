import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
    anonymousCredits: number;
    setUser: (user: User | null) => void;
    updateCredits: (credits: number) => void;
    decrementCredit: () => void;
    decrementAnonymousCredit: () => boolean;
    incrementAnonymousCredit: () => void;
    incrementAnalysisCount: () => void;
    logout: () => void;
    hasCreditsAvailable: () => boolean;
    getRemainingCredits: () => number;
    resetAnonymousCredits: () => void;
}

const FREE_CREDITS = 3;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            anonymousCredits: FREE_CREDITS,

            setUser: (user) => {
                set({ user });
                // Reset anonymous credits when user logs in
                if (user) {
                    set({ anonymousCredits: FREE_CREDITS });
                }
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

            incrementAnonymousCredit: () =>
                set((state) => ({
                    anonymousCredits: Math.min(FREE_CREDITS, state.anonymousCredits + 1),
                })),

            incrementAnalysisCount: () =>
                set((state) => ({
                    user: state.user
                        ? { ...state.user, analysesCount: state.user.analysesCount + 1 }
                        : null,
                })),

            hasCreditsAvailable: () => {
                const state = get();
                if (state.user) {
                    return state.user.creditsRemaining > 0;
                }
                return state.anonymousCredits > 0;
            },

            getRemainingCredits: () => {
                const state = get();
                if (state.user) {
                    return state.user.creditsRemaining;
                }
                return state.anonymousCredits;
            },

            resetAnonymousCredits: () => set({ anonymousCredits: FREE_CREDITS }),

            logout: () => set({ user: null, anonymousCredits: FREE_CREDITS }),
        }),
        {
            name: 'auth-storage', // localStorage key
            storage: createJSONStorage(() => localStorage),
            // Only persist anonymous credits, not user data (that comes from session)
            partialize: (state) => ({
                anonymousCredits: state.anonymousCredits
            }),
        }
    )
);