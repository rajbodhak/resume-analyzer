'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-4"
            style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.15), transparent 70%), #0a0a0a",
            }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
            </div>

            <div className="relative z-10 mt-20 w-full max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-4 flex justify-center"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
                        <Sparkles className="h-4 w-4" />
                        <span>AI-Powered Resume & Cover Letter Tools</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    className="text-center text-4xl font-bold text-white md:text-6xl lg:text-7xl"
                >
                    Transform Your Resume
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        with AI Intelligence
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="mx-auto mt-6 max-w-2xl text-center text-base text-neutral-400 md:text-lg"
                >
                    Get instant AI-powered feedback, ATS optimization, and generate tailored cover letters.
                    Stand out from the crowd and land your dream job faster.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="mx-auto mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Button
                        size="lg"
                        className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-base font-semibold hover:from-blue-600 hover:to-blue-700"
                        onClick={() => window.location.href = '/upload'}
                    >
                        <Upload className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                        Analyze My Resume
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-neutral-700 bg-transparent px-8 py-6 text-base font-semibold hover:bg-neutral-900"
                        onClick={() => window.location.href = '#howItWorks'}
                    >
                        See How It Works
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-500"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>3 Free Analyses</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>ATS Optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                            <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Cover Letters</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;