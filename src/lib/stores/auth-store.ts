import { create } from 'zustand';

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
}

const FREE_CREDITS = 3;

export const useAuthStore = create<AuthStore>()((set, get) => ({
    user: null,
    anonymousCredits: FREE_CREDITS,

    setUser: (user) => {
        set({ user });
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
            return true;
        }
        return state.anonymousCredits > 0;
    },

    getRemainingCredits: () => {
        const state = get();
        if (state.user) {
            return -1;
        }
        return state.anonymousCredits;
    },

    logout: () => set({ user: null, anonymousCredits: FREE_CREDITS }),
}));
