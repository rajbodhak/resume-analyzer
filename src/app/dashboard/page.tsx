'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const router = useRouter();

    console.log("User:", user);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/signin');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 mt-12">
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <Button onClick={() => signOut({ callbackUrl: '/' })} variant="outline">
                        Sign Out
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Credits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-primary">
                                {user.creditsRemaining}
                            </p>
                            <p className="text-sm text-muted-foreground">remaining</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Analyses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-blue-400">
                                {user.analysesCount}
                            </p>
                            <p className="text-sm text-muted-foreground">completed</p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-white">Tier</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold capitalize text-green-400">
                                {user.subscriptionTier}
                            </p>
                            <p className="text-sm text-muted-foreground">subscription</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-white">Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="text-white">{user.name || 'Not set'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="text-white">{user.email}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}