
import { Lightbulb, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DailyTipProps {
  tip: string;
}

export const DailyTip = ({ tip }: DailyTipProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">💡 Today's Smart Tip</h3>
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <p className="text-sm opacity-90 leading-relaxed">{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
