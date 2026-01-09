'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileSearch, Target, TrendingUp, FileText, Zap } from 'lucide-react';
import { motion, useInView } from 'framer-motion';

const Features = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const features = [
        {
            icon: <Sparkles className="h-5 w-5" />,
            title: "AI-Powered Analysis",
            description: "Advanced algorithms analyze your resume to identify strengths and areas for improvement in seconds."
        },
        {
            icon: <FileSearch className="h-5 w-5" />,
            title: "ATS Optimization",
            description: "Ensure your resume passes Applicant Tracking Systems with smart keyword optimization."
        },
        {
            icon: <Target className="h-5 w-5" />,
            title: "Job Match Score",
            description: "Get a compatibility score showing how well your resume matches specific job descriptions."
        },
        {
            icon: <TrendingUp className="h-5 w-5" />,
            title: "Actionable Insights",
            description: "Receive detailed feedback with practical recommendations to improve your resume instantly."
        },
        {
            icon: <FileText className="h-5 w-5" />,
            title: "Cover Letter Generator",
            description: "Create professional, tailored cover letters that complement your resume perfectly."
        },
        {
            icon: <Zap className="h-5 w-5" />,
            title: "Instant Results",
            description: "Get comprehensive analysis and feedback in seconds, not hours or days."
        }
    ];

    return (
        <section ref={ref} className="relative w-full bg-[#0a0a0a] px-4 py-24 md:px-6" id="features">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center"
                >
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Powerful Features
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-neutral-400">
                        Everything you need to craft a resume that stands out and gets you noticed by recruiters
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="group h-full border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all hover:border-neutral-700 hover:bg-neutral-900/80">
                                <CardHeader className="space-y-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 transition-all group-hover:bg-blue-500/20">
                                        {feature.icon}
                                    </div>
                                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                    <CardDescription className="text-base leading-relaxed text-neutral-400">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;