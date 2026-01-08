'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, FileText, Loader2 } from 'lucide-react';

interface CoverLetterFormProps {
    onGenerate: (formData: any) => void;
    isGenerating: boolean;
    disabled?: boolean;
    prefilledResume?: string;
}

export default function CoverLetterForm({ onGenerate, isGenerating, disabled, prefilledResume }: CoverLetterFormProps) {
    const [formData, setFormData] = useState({
        candidateName: '',
        companyName: '',
        positionTitle: '',
        resumeText: prefilledResume || '',
        jobDescription: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState<string | null>(null);

    useEffect(() => {
        if (prefilledResume) {
            setFormData(prev => ({ ...prev, resumeText: prefilledResume }));
        }
    }, [prefilledResume]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
            setParseError('Please upload a PDF, DOCX, or TXT file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setParseError('File size must be less than 5MB');
            return;
        }

        setResumeFile(file);
        setParseError(null);
        setIsParsing(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('resume', file);

            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to parse resume');
            }

            const data = await response.json();

            setFormData(prev => ({
                ...prev,
                resumeText: data.text || '',
            }));
        } catch (error) {
            console.error('Error parsing resume:', error);
            setParseError('Failed to parse resume. Please try pasting the text manually.');
        } finally {
            setIsParsing(false);
        }
    };

    const removeFile = () => {
        setResumeFile(null);
        setFormData(prev => ({ ...prev, resumeText: '' }));
        setParseError(null);
    };

    const handleSubmit = () => {
        if (!formData.candidateName || !formData.companyName || !formData.positionTitle || !formData.resumeText || !formData.jobDescription) {
            alert('Please fill in all required fields');
            return;
        }

        onGenerate(formData);
    };

    const isFormValid = formData.candidateName && formData.companyName && formData.positionTitle && formData.resumeText && formData.jobDescription;

    return (
        <div className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
                <Label htmlFor="candidateName" className="text-neutral-300 text-sm">
                    Your Name <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="candidateName"
                    name="candidateName"
                    placeholder="John Doe"
                    value={formData.candidateName}
                    onChange={handleChange}
                    disabled={disabled}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400 focus:bg-neutral-800 disabled:bg-neutral-800 disabled:opacity-50"
                />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
                <Label htmlFor="companyName" className="text-neutral-300 text-sm">
                    Company Name <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., Google"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={disabled}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400 focus:bg-neutral-800 disabled:bg-neutral-800 disabled:opacity-50"
                />
            </div>

            {/* Position Title */}
            <div className="space-y-2">
                <Label htmlFor="positionTitle" className="text-neutral-300 text-sm">
                    Position Title <span className="text-red-400">*</span>
                </Label>
                <Input
                    id="positionTitle"
                    name="positionTitle"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.positionTitle}
                    onChange={handleChange}
                    disabled={disabled}
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400 focus:bg-neutral-800 disabled:bg-neutral-800 disabled:opacity-50"
                />
            </div>

            {/* Resume Upload - Simplified */}
            <div className="space-y-2">
                <Label htmlFor="resumeFile" className="text-neutral-300 text-sm">
                    Resume / CV <span className="text-red-400">*</span>
                </Label>

                <div className="flex items-center gap-3 p-3 border border-neutral-700 rounded-lg bg-neutral-800/50">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-neutral-400 truncate">
                            {resumeFile?.name || formData.resumeText ? (resumeFile?.name || 'Resume text loaded') : 'No file chosen'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {(resumeFile || formData.resumeText) && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                                disabled={disabled || isParsing}
                                className=" h-8 px-2"
                            >
                                <X className="w-4 h-4 text-neutral-400" />
                            </Button>
                        )}

                        <Button
                            type="button"
                            size="sm"
                            disabled={disabled || isParsing}
                            className="bg-transparent hover:text-blue-400 hover:bg-transparent border border-blue-500 hover:border-blue-200 text-white h-8 px-3 cursor-pointer"
                            onClick={() => document.getElementById('resumeFile')?.click()}
                        >
                            {isParsing ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    Parsing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload
                                </>
                            )}
                        </Button>
                        <input
                            id="resumeFile"
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            disabled={disabled || isParsing}
                        />
                    </div>
                </div>

                <p className="text-xs text-neutral-500">PDF or DOCX (max 5MB)</p>

                {parseError && (
                    <p className="text-xs text-red-400">{parseError}</p>
                )}

                {!resumeFile && (
                    <div className="mt-3">
                        <Label htmlFor="resumeText" className="text-xs text-neutral-500">
                            Or paste your resume text manually:
                        </Label>
                        <Textarea
                            id="resumeText"
                            name="resumeText"
                            placeholder="Paste your resume content here..."
                            value={formData.resumeText}
                            onChange={handleChange}
                            rows={4}
                            disabled={disabled || isParsing}
                            className="resize-none mt-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400 focus:bg-neutral-800 disabled:bg-neutral-800 disabled:opacity-50"
                        />
                    </div>
                )}
            </div>

            {/* Job Description */}
            <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-neutral-300 text-sm">
                    Job Description <span className="text-red-400">*</span>
                </Label>
                <Textarea
                    id="jobDescription"
                    name="jobDescription"
                    placeholder="Paste the job description here..."
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows={5}
                    disabled={disabled}
                    className="resize-none bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400 focus:bg-neutral-800 disabled:bg-neutral-800 disabled:opacity-50"
                />
            </div>

            {/* Submit Button */}
            <Button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-6"
                disabled={!isFormValid || isGenerating || disabled || isParsing}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Generating...
                    </>
                ) : isParsing ? (
                    <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Parsing Resume...
                    </>
                ) : (
                    <>
                        Generate Cover Letter
                    </>
                )}
            </Button>
        </div>
    );
}