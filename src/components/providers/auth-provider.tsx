'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Session } from 'next-auth';

function AuthSync() {
    const { data: session, status } = useSession();
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
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
            setUser(null);
        }
    }, [session, status, setUser]);

    return null;
}

export default function AuthProvider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: Session | null;
}) {
    return (
        <SessionProvider session={session}>
            <AuthSync />
            {children}
        </SessionProvider>
    );
}