'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Chrome, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    useEffect(() => {
        if (status === 'authenticated' && session) {
            router.push(callbackUrl);
        }
    }, [status, session, callbackUrl, router]);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');

        try {
            await signIn('google', {
                callbackUrl,
                redirect: true,
            });
        } catch (error) {
            console.error('Sign in error:', error);
            setError('Failed to sign in. Please try again.');
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (status === 'authenticated') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
                    <p className="text-white">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4"
            style={{
                background: "linear-gradient(135deg, #0a0a0a 0%, rgba(120, 180, 255, 0.08) 50%, #0a0a0a 100%)",
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-border/50 bg-card/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-3xl font-bold text-white">
                            Welcome Back
                        </CardTitle>
                        <CardDescription>
                            Sign in to analyze your resumes with AI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                                <AlertCircle className="size-4" />
                                {error}
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            size="lg"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Chrome className="mr-2 size-4" />
                                    Sign in with Google
                                </>
                            )}
                        </Button>

                        <div className="rounded-lg bg-blue-500/10 p-4 text-center">
                            <p className="text-sm font-medium text-blue-400">
                                🎁 Get 50 free analyses when you sign in!
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

const LoginPage = () => {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
                <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
};

export default LoginPage;