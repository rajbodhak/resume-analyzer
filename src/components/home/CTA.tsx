'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const CTA = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section
            ref={ref}
            className="relative w-full overflow-hidden bg-[#0a0a0a] px-4 py-32 md:px-6"
            style={{
                background: "linear-gradient(to bottom, #0a0a0a 0%, rgba(120, 180, 255, 0.05) 50%, #0a0a0a 100%)",
            }}
        >
            <div className="container relative z-10 mx-auto max-w-5xl">
                <div className="text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
                    >
                        Ready to Land Your{' '}
                        <span className="text-blue-400">Dream Job?</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mx-auto mb-10 max-w-2xl text-lg text-neutral-400 md:text-xl"
                    >
                        Join thousands of job seekers who've transformed their resumes with AI-powered insights.
                        Start with 3 free analyses—no credit card required.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                    >
                        <Button
                            size="lg"
                            className="group gap-2 px-8 py-6 text-base font-semibold"
                            onClick={() => window.location.href = '/upload'}
                        >

                            Analyze My Resume Now
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="size-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>3 free analyses</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="size-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="size-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Instant results</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CTA;