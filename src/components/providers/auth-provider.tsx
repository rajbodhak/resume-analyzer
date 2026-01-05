'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';

function AuthSync() {
    const { data: session, status } = useSession();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        console.log('AuthSync - Status:', status);
        console.log('AuthSync - Session:', session);

        if (status === 'authenticated' && session?.user) {
            console.log('Setting user in store:', session.user);
            setUser({
                id: session.user.id,
                email: session.user.email ?? '',
                name: session.user.name ?? undefined,
                image: session.user.image ?? undefined,
                subscriptionTier: session.user.subscriptionTier,
                creditsRemaining: session.user.creditsRemaining,
                analysesCount: session.user.analysesCount,
            });
        } else if (status === 'unauthenticated') {
            console.log('User unauthenticated, clearing store');
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
        <SessionProvider>
            <AuthSync />
            {children}
        </SessionProvider>
    );
}