'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, Briefcase, MapPin, Award, Loader2, Check, AlertCircle } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    industry: string;
    targetRole: string;
    experienceLevel: string;
    preferredLocation: string;
    subscriptionTier: string;
    creditsRemaining: number;
    analysesCount: number;
}

export default function SettingsPage() {
    const { data: session, update: updateSession } = useSession();
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phoneNumber: '',
        industry: '',
        targetRole: '',
        experienceLevel: '',
        preferredLocation: '',
        subscriptionTier: 'free',
        creditsRemaining: 0,
        analysesCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch('/api/user/profile');
            if (!response.ok) throw new Error('Failed to fetch profile');

            const data = await response.json();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                industry: data.industry || '',
                targetRole: data.targetRole || '',
                experienceLevel: data.experienceLevel || '',
                preferredLocation: data.preferredLocation || '',
                subscriptionTier: data.subscriptionTier || 'free',
                creditsRemaining: data.creditsRemaining || 0,
                analysesCount: data.analysesCount || 0,
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            setErrorMessage('Failed to load profile data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
        setSaveStatus('idle');
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    phoneNumber: profile.phoneNumber,
                    industry: profile.industry,
                    targetRole: profile.targetRole,
                    experienceLevel: profile.experienceLevel,
                    preferredLocation: profile.preferredLocation,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update profile');
            }

            const updatedData = await response.json();
            setSaveStatus('success');

            // Update session if name changed
            if (profile.name !== session?.user?.name) {
                await updateSession();
            }

            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to save profile:', error);
            setSaveStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to save profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl md:mt-10">
                <div className="space-y-6">
                    <div className="h-8 bg-muted rounded animate-pulse w-1/3" />
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                                    <div className="h-10 bg-muted rounded animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl md:mt-10">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Account Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Overview</CardTitle>
                        <CardDescription>
                            Your subscription and usage information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Subscription</p>
                                <p className="text-lg font-semibold capitalize">
                                    {profile.subscriptionTier}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Credits Remaining</p>
                                <p className="text-lg font-semibold">
                                    {profile.creditsRemaining}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Analyses</p>
                                <p className="text-lg font-semibold">
                                    {profile.analysesCount}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Update your personal information and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                value={profile.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={profile.email}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed as it's linked to your authentication
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={profile.phoneNumber}
                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        {/* Industry */}
                        <div className="space-y-2">
                            <Label htmlFor="industry" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Industry
                            </Label>
                            <Select
                                value={profile.industry}
                                onValueChange={(value) => handleInputChange('industry', value)}
                            >
                                <SelectTrigger id="industry">
                                    <SelectValue placeholder="Select your industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="technology">Technology</SelectItem>
                                    <SelectItem value="finance">Finance</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                    <SelectItem value="consulting">Consulting</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Target Role */}
                        <div className="space-y-2">
                            <Label htmlFor="targetRole" className="flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Target Role
                            </Label>
                            <Input
                                id="targetRole"
                                value={profile.targetRole}
                                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                                placeholder="e.g., Software Engineer, Product Manager"
                            />
                        </div>

                        {/* Experience Level */}
                        <div className="space-y-2">
                            <Label htmlFor="experienceLevel" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Experience Level
                            </Label>
                            <Select
                                value={profile.experienceLevel}
                                onValueChange={(value) => handleInputChange('experienceLevel', value)}
                            >
                                <SelectTrigger id="experienceLevel">
                                    <SelectValue placeholder="Select your experience level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                    <SelectItem value="junior">Junior (2-4 years)</SelectItem>
                                    <SelectItem value="mid">Mid Level (4-7 years)</SelectItem>
                                    <SelectItem value="senior">Senior (7-10 years)</SelectItem>
                                    <SelectItem value="lead">Lead (10+ years)</SelectItem>
                                    <SelectItem value="executive">Executive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Preferred Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Preferred Location
                            </Label>
                            <Input
                                id="location"
                                value={profile.preferredLocation}
                                onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                                placeholder="e.g., New York, Remote, San Francisco"
                            />
                        </div>

                        {/* Save Button and Status */}
                        <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2">
                                {saveStatus === 'success' && (
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check className="w-4 h-4" />
                                        <span className="text-sm">Profile saved successfully</span>
                                    </div>
                                )}
                                {saveStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">{errorMessage}</span>
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="min-w-[120px]"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}