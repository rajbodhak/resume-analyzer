'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Sparkles, FileCheck, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const steps = [
        {
            icon: <Upload className="h-6 w-6" />,
            step: "01",
            title: "Upload Your Resume",
            description: "Simply drag and drop your resume or click to upload. We support PDF, DOC, and DOCX formats."
        },
        {
            icon: <Sparkles className="h-6 w-6" />,
            step: "02",
            title: "AI Analysis",
            description: "Our advanced AI scans your resume, analyzing structure, keywords, and ATS compatibility in seconds."
        },
        {
            icon: <FileCheck className="h-6 w-6" />,
            step: "03",
            title: "Get Insights",
            description: "Receive a detailed report with actionable feedback, scoring, and personalized improvement suggestions."
        },
        {
            icon: <FileText className="h-6 w-6" />,
            step: "04",
            title: "Generate Cover Letter",
            description: "Create a professional, tailored cover letter that complements your optimized resume perfectly."
        }
    ];

    return (
        <section ref={ref} className="relative w-full bg-[#0a0a0a] px-4 py-24 md:px-6" id='howItWorks'>
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        How It Works
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                        Get your resume analyzed and cover letter generated in four simple steps. Fast, accurate, and designed to help you succeed.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative"
                        >
                            <Card className="group h-full border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-neutral-900/80">
                                <CardHeader className="space-y-4">
                                    {/* Step Number */}
                                    <div className="text-5xl font-bold text-blue-400/20">
                                        {step.step}
                                    </div>
                                    {/* Icon */}
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                        {step.icon}
                                    </div>
                                    <CardTitle className="text-lg text-white">{step.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed text-neutral-400">
                                        {step.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            {/* Connecting Arrow */}
                            {index < steps.length - 1 && (
                                <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 lg:block">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="text-neutral-700"
                                    >
                                        <path
                                            d="M5 12h14m-6-6l6 6-6 6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;