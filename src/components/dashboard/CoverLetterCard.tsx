'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CoverLetterCard() {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                    <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                        Generate Cover Letter
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Create a professional, tailored cover letter based on your resume and job description
                    </p>
                    <Link href="/dashboard/cover-letter">
                        <Button className="w-full sm:w-auto">
                            Create Cover Letter
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}