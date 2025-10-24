import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string;
            image?: string;
            subscriptionTier: string;
            creditsRemaining: number;
            analysesCount: number;
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string;
        subscriptionTier: string;
        creditsRemaining: number;
        analysesCount: number;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        subscriptionTier: string;
        creditsRemaining: number;
        analysesCount: number;
    }
}