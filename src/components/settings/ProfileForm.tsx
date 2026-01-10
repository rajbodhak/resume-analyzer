import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, Briefcase, MapPin, Award } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    phoneNumber: string;
    industry: string;
    targetRole: string;
    experienceLevel: string;
    preferredLocation: string;
}

interface ProfileFormProps {
    profile: UserProfile;
    onInputChange: (field: keyof UserProfile, value: string) => void;
}

export default function ProfileForm({ profile, onInputChange }: ProfileFormProps) {
    return (
        <>
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-neutral-300">
                    <User className="w-4 h-4 text-blue-400" />
                    Full Name
                </Label>
                <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => onInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400"
                />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-neutral-300">
                    <Mail className="w-4 h-4 text-blue-400" />
                    Email
                </Label>
                <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-neutral-800/50 border-neutral-700 text-neutral-400 cursor-not-allowed"
                />
                <p className="text-xs text-neutral-500">
                    Email cannot be changed as it's linked to your authentication
                </p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-neutral-300">
                    <Phone className="w-4 h-4 text-blue-400" />
                    Phone Number
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => onInputChange('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400"
                />
            </div>

            {/* Industry */}
            <div className="space-y-2">
                <Label htmlFor="industry" className="flex items-center gap-2 text-neutral-300">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    Industry
                </Label>
                <Select
                    value={profile.industry}
                    onValueChange={(value) => onInputChange('industry', value)}
                >
                    <SelectTrigger id="industry" className="bg-neutral-800 border-neutral-700 text-white focus:border-blue-400">
                        <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
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
                <Label htmlFor="targetRole" className="flex items-center gap-2 text-neutral-300">
                    <Award className="w-4 h-4 text-blue-400" />
                    Target Role
                </Label>
                <Input
                    id="targetRole"
                    value={profile.targetRole}
                    onChange={(e) => onInputChange('targetRole', e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400"
                />
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
                <Label htmlFor="experienceLevel" className="flex items-center gap-2 text-neutral-300">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    Experience Level
                </Label>
                <Select
                    value={profile.experienceLevel}
                    onValueChange={(value) => onInputChange('experienceLevel', value)}
                >
                    <SelectTrigger id="experienceLevel" className="bg-neutral-800 border-neutral-700 text-white focus:border-blue-400">
                        <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
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
                <Label htmlFor="location" className="flex items-center gap-2 text-neutral-300">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Preferred Location
                </Label>
                <Input
                    id="location"
                    value={profile.preferredLocation}
                    onChange={(e) => onInputChange('preferredLocation', e.target.value)}
                    placeholder="e.g., New York, Remote, San Francisco"
                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-400"
                />
            </div>
        </>
    );
}