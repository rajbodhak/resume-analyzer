'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Sparkles, FileCheck, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const HowItWorks = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const steps = [
        {
            icon: <Upload className="size-6" />,
            step: "01",
            title: "Upload Your Resume",
            description: "Simply drag and drop your resume or click to upload. We support PDF, DOC, and DOCX formats."
        },
        {
            icon: <Sparkles className="size-6" />,
            step: "02",
            title: "AI Analysis",
            description: "Our advanced AI scans your resume, analyzing structure, keywords, and ATS compatibility in seconds."
        },
        {
            icon: <FileCheck className="size-6" />,
            step: "03",
            title: "Get Insights",
            description: "Receive a detailed report with actionable feedback, scoring, and personalized improvement suggestions."
        },
        {
            icon: <Download className="size-6" />,
            step: "04",
            title: "Optimize & Download",
            description: "Apply our recommendations and download your improved, ATS-optimized resume ready for applications."
        }
    ];

    return (
        <section ref={ref} className="relative w-full bg-[#0a0a0a] px-4 py-24 md:px-6">
            <div className="container mx-auto max-w-6xl">
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
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Get your resume analyzed in four simple steps. Fast, accurate, and designed to help you succeed.
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
                            <Card className="h-full border-border/50 bg-card/30 backdrop-blur-sm transition-all hover:border-border hover:bg-card/50">
                                <CardHeader>
                                    {/* Step Number */}
                                    <div className="mb-3 text-5xl font-bold text-primary/20">
                                        {step.step}
                                    </div>
                                    {/* Icon */}
                                    <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        {step.icon}
                                    </div>
                                    <CardTitle className="text-lg">{step.title}</CardTitle>
                                    <CardDescription className="text-sm leading-relaxed">
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
                                        className="text-primary/30"
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