
import { Target, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  timeLeft: string;
  reward: number;
}

interface ActiveQuestProps {
  quest: Quest;
  onContinue: () => void;
}

export const ActiveQuest = ({ quest, onContinue }: ActiveQuestProps) => {
  const progressPercent = (quest.progress / quest.total) * 100;
  
  return (
    <Card className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <h3 className="font-semibold">🎯 Active Quest</h3>
          </div>
          <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>{quest.timeLeft}</span>
          </div>
        </div>
        
        <h4 className="font-bold text-lg mb-1">{quest.title}</h4>
        <p className="text-sm opacity-90 mb-3">{quest.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Progress: {quest.progress}/{quest.total}</span>
            <span>🏆 {quest.reward} coins</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/30" />
        </div>
        
        <Button 
          onClick={onContinue}
          variant="secondary" 
          className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold"
        >
          Continue Quest <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
