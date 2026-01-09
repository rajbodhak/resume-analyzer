'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CoverLetterForm from '@/components/upload/CoverLetterForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Copy, Download, CheckCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CoverLetterPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isGenerating, setIsGenerating] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [prefilledResume, setPrefilledResume] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const storedResume = sessionStorage.getItem('resumeForCoverLetter');
        if (storedResume) {
            setPrefilledResume(storedResume);
            sessionStorage.removeItem('resumeForCoverLetter');
        }
    }, []);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin?callbackUrl=/dashboard/cover-letter');
        }
    }, [status, router]);

    const handleGenerate = async (formData: any) => {
        setIsGenerating(true);
        setError(null);
        setCoverLetter('');

        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                const response = await fetch('/api/generate-cover-letter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        candidateName: formData.candidateName || session?.user?.name || '',
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // If 503 (overloaded) and not last retry, wait and retry
                    if (response.status === 503 && retryCount < maxRetries - 1) {
                        retryCount++;
                        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
                        console.log(`🔄 API overloaded. Retrying in ${delay / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue; // Try again
                    }
                    throw new Error(data.error || 'Failed to generate cover letter');
                }

                // Success!
                setCoverLetter(data.coverLetter);
                break;

            } catch (err: any) {
                console.error('Error generating cover letter:', err);

                // If this was the last retry, show error to user
                if (retryCount === maxRetries - 1) {
                    setError(err.message || 'Failed to generate cover letter. Please try again.');
                    break;
                }

                // Not the last retry, continue loop
                retryCount++;
                const delay = Math.pow(2, retryCount) * 1000;
                console.log(`🔄 Retrying in ${delay / 1000}s... (Attempt ${retryCount + 1}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        setIsGenerating(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(coverLetter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([coverLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cover-letter.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] px-4 py-8"
            style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.08), transparent 70%), #0a0a0a",
            }}
        >
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">
                        Generate <span className="text-blue-400">Cover Letter</span>
                    </h1>
                    <p className="text-neutral-400 text-lg">
                        AI-powered cover letters tailored to your resume and job description
                    </p>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-6 bg-neutral-900/50 border-neutral-800 backdrop-blur">
                            <CoverLetterForm
                                onGenerate={handleGenerate}
                                isGenerating={isGenerating}
                                prefilledResume={prefilledResume}
                                disabled={isGenerating}
                            />
                        </Card>
                    </motion.div>

                    {/* Result Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="p-6 bg-neutral-900/50 border-neutral-800 backdrop-blur min-h-[600px] flex flex-col">
                            {error && (
                                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-4">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            {isGenerating && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center">
                                    <div className="relative mb-6">
                                        {/* Animated circle */}
                                        <div className="w-20 h-20 rounded-full border-4 border-blue-500/20 border-t-blue-400 animate-spin" />
                                        {/* Center icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-blue-400" />
                                        </div>
                                    </div>
                                    <p className="text-white font-medium text-lg">Generating your cover letter...</p>
                                    <p className="text-neutral-500 text-sm mt-2">This may take a few seconds</p>
                                </div>
                            )}

                            {!isGenerating && !coverLetter && !error && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
                                        <FileText className="w-10 h-10 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        Ready to Generate
                                    </h3>
                                    <p className="text-neutral-500 text-sm max-w-sm">
                                        Fill out the form and click "Generate Cover Letter" to create your personalized letter
                                    </p>
                                </div>
                            )}

                            {coverLetter && (
                                <>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleCopy}
                                            className="flex-1 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
                                        >
                                            {copied ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleDownload}
                                            className="flex-1 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 text-white"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>

                                    <div className="flex-1 overflow-auto bg-neutral-800/30 rounded-lg border border-neutral-700 p-6">
                                        <div className="prose prose-sm prose-invert max-w-none">
                                            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-neutral-200">
                                                {coverLetter}
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}