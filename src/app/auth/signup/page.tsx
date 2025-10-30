'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Chrome, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        setError('');

        try {
            await signIn('google', {
                callbackUrl: '/dashboard',
                redirect: true
            });
        } catch (error) {
            console.error('Sign up error:', error);
            setError('Failed to create account. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-12"
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
                            Create Account
                        </CardTitle>
                        <CardDescription>
                            Get started with AI-powered resume analysis
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
                            onClick={handleGoogleSignUp}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <Chrome className="mr-2 size-4" />
                                    Sign up with Google
                                </>
                            )}
                        </Button>

                        <div className="space-y-3 rounded-lg bg-blue-500/10 p-4">
                            <p className="text-center text-sm font-medium text-blue-400">
                                🎁 What you get for free:
                            </p>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    5 free resume analyses
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    AI-powered insights
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    Job match scoring
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    ATS optimization tips
                                </li>
                            </ul>
                        </div>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/auth/signin" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
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
};

export default SignupPage;