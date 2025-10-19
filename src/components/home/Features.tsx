import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, FileSearch, Target, TrendingUp } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Sparkles className="size-5" />,
            title: "AI-Powered Analysis",
            description: "Advanced algorithms analyze your resume to identify strengths and areas for improvement."
        },
        {
            icon: <FileSearch className="size-5" />,
            title: "ATS Optimization",
            description: "Ensure your resume passes Applicant Tracking Systems with our optimization suggestions."
        },
        {
            icon: <Target className="size-5" />,
            title: "Job Match Score",
            description: "Get a compatibility score showing how well your resume matches specific job descriptions."
        },
        {
            icon: <TrendingUp className="size-5" />,
            title: "Actionable Insights",
            description: "Receive detailed feedback with practical recommendations to improve your resume."
        }
    ];

    return (
        <section className="relative w-full bg-[#0a0a0a] px-4 py-24 md:px-6" id='features'>
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                        Powerful Features
                    </h2>
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        Everything you need to craft a resume that stands out and gets you noticed by recruiters.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80"
                        >
                            <CardHeader>
                                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                <CardDescription className="text-base">
                                    {feature.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;