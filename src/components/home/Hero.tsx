'use client';

import React from 'react';
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <div className="h-[70vh] relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
            style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #0a0a0a",
            }}
        >
            <div className="absolute inset-0 z-0" />

            {/* Navbar on top of ripple effect */}
            <div className="relative z-50 w-full">
                <NavbarWrapper />
            </div>

            <div className="mt-40 w-full px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100"
                >
                    Transform Your Resume with <span className="text-blue-400">AI Intelligence</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-base md:text-lg text-neutral-800 dark:text-neutral-400"
                >
                    Get instant feedback, ATS optimization, and personalized insights to make your resume stand out. Land your dream job faster with AI-powered analysis.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    className="relative z-10 mx-auto mt-8 flex justify-center gap-4"
                >
                    <Button
                        size="lg"
                        className="gap-2"
                        onClick={() => window.location.href = '/upload'}
                    >
                        <Upload className="size-4" />
                        Analyze My Resume
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => window.location.href = '#features'}
                    >
                        Learn More
                    </Button>
                </motion.div>
            </div>
        </div>
    )
}

export default Hero