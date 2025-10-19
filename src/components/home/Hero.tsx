"use client";

import React from 'react';
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const Hero = () => {
    return (
        <div className="h-[80vh] relative flex w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
            style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
            }}
        >
            <div
                className="absolute inset-0 z-0"
            />

            {/* Navbar on top of ripple effect */}
            <div className="relative z-50 w-full">
                <NavbarWrapper />
            </div>

            <div className="mt-40 w-full px-4">
                <h2 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-neutral-800 md:text-4xl lg:text-7xl dark:text-neutral-100">
                    Transform Your Resume with <span className="text-blue-400">AI Intelligence</span>
                </h2>
                <p className="relative z-10 mx-auto mt-6 max-w-2xl text-center text-base md:text-lg text-neutral-800 dark:text-neutral-400">
                    Get instant feedback, ATS optimization, and personalized insights to make your resume stand out. Land your dream job faster with AI-powered analysis.
                </p>
                <div className="relative z-10 mx-auto mt-8 flex justify-center gap-4">
                    <Button
                        size="lg"
                        className="gap-2"
                        onClick={() => window.location.href = '/upload'}
                    >
                        Analyze My Resume
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => window.location.href = '#features'}
                    >
                        Learn More
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default Hero