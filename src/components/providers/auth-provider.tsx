'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

function AuthSync() {
    const { data: session, status } = useSession();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (status === 'loading') return;

        if (session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                subscriptionTier: session.user.subscriptionTier,
                creditsRemaining: session.user.creditsRemaining,
                analysesCount: session.user.analysesCount,
            });
        } else {
            setUser(null);
        }
    }, [session, status, setUser]);

    return null;
}

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProvider 
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={true}
        >
            <AuthSync />
            {children}
        </SessionProvider>
    );
}