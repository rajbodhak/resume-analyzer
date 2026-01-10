import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountOverviewProps {
    subscriptionTier: string;
    creditsRemaining: number;
    analysesCount: number;
}

export default function AccountOverview({
    subscriptionTier,
    creditsRemaining,
    analysesCount
}: AccountOverviewProps) {
    return (
        <Card className="border-neutral-800 bg-neutral-900/50">
            <CardHeader>
                <CardTitle className="text-white">Account Overview</CardTitle>
                <CardDescription className="text-neutral-400">
                    Your subscription and usage information
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                        <p className="text-sm text-neutral-400">Subscription</p>
                        <p className="text-lg font-semibold text-white capitalize">
                            {subscriptionTier}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-neutral-400">Credits Remaining</p>
                        <p className="text-lg font-semibold text-white">
                            {creditsRemaining}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-neutral-400">Total Analyses</p>
                        <p className="text-lg font-semibold text-white">
                            {analysesCount}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}