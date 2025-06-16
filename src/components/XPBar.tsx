
import { Progress } from '@/components/ui/progress';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export const XPBar = ({ currentXP, nextLevelXP, level }: XPBarProps) => {
  const progress = (currentXP / nextLevelXP) * 100;
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {level}
          </div>
          <span className="font-semibold text-gray-800">Level {level}</span>
        </div>
        <span className="text-sm text-gray-600">
          {currentXP}/{nextLevelXP} XP
        </span>
      </div>
      <Progress value={progress} className="h-3" />
      <div className="text-xs text-gray-500 mt-1">
        {nextLevelXP - currentXP} XP to next level
      </div>
    </div>
  );
};
