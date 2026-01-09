'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const CTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-32 md:px-6"
        >
            {/* Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(120, 180, 255, 0.08), transparent 70%)",
                }}
            />

            {/* Animated blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <div className="container relative z-10 mx-auto max-w-5xl">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 flex justify-center"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
                            <Sparkles className="h-4 w-4" />
                            <span>Start Your Journey Today</span>
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                    >
                        Ready to Land Your{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Dream Job?
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 md:text-xl"
                    >
                        Join thousands of job seekers who've transformed their resumes and generated winning cover letters with AI-powered insights.
                        Start with 3 free analyses—no credit card required.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button
                            size="lg"
                            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 text-base font-semibold hover:from-blue-600 hover:to-blue-700"
                            onClick={() => window.location.href = '/upload'}
                        >
                            Analyze My Resume Now
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm"
                    >
                        <div className="flex items-center gap-2 text-neutral-400">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>3 free analyses</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>Instant results</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span>Cover letter generator</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA;