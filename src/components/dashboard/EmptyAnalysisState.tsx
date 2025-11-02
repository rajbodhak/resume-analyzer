import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function EmptyAnalysisState({ onStartAnalysis }: { onStartAnalysis: () => void }) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                    Start analyzing your resume to get personalized feedback and improve your chances of landing your dream job.
                </p>
                <Button onClick={onStartAnalysis}>
                    <FileText className="w-4 h-4 mr-2" />
                    Start First Analysis
                </Button>
            </CardContent>
        </Card>
    );
}