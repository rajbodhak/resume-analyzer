'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertCircle } from 'lucide-react';
import AccountOverview from '@/components/settings/AccountOverview';
import ProfileForm from '@/components/settings/ProfileForm';
import SettingsPageSkeleton from '@/components/settings/SettingsPageSkeleton';

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

            setSaveStatus('success');

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
        return <SettingsPageSkeleton />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
                    <p className="text-neutral-400 mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>

                {/* Account Overview */}
                <AccountOverview
                    subscriptionTier={profile.subscriptionTier}
                    creditsRemaining={profile.creditsRemaining}
                    analysesCount={profile.analysesCount}
                />

                {/* Profile Information */}
                <Card className="border-neutral-800 bg-neutral-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Profile Information</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Update your personal information and preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <ProfileForm
                            profile={profile}
                            onInputChange={handleInputChange}
                        />

                        {/* Save Button and Status */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                            <div className="flex items-center gap-2">
                                {saveStatus === 'success' && (
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check className="w-4 h-4" />
                                        <span className="text-sm">Profile saved successfully</span>
                                    </div>
                                )}
                                {saveStatus === 'error' && (
                                    <div className="flex items-center gap-2 text-red-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">{errorMessage}</span>
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                                className="min-w-[120px] bg-blue-500 hover:bg-blue-600 text-white"
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