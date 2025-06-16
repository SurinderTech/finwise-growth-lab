
import { BookOpen, CheckCircle, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completed: boolean;
  progress: number;
  xpReward: number;
}

interface LearningModuleProps {
  module: Module;
  onStart: (moduleId: string) => void;
}

export const LearningModule = ({ module, onStart }: LearningModuleProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            {module.completed && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
        </div>
        
        <h3 className="font-bold text-lg mb-2">{module.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {module.description}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{module.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{module.xpReward} XP</span>
          </div>
        </div>
        
        {module.progress > 0 && !module.completed && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{module.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${module.progress}%` }}
              />
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => onStart(module.id)}
          className="w-full gradient-primary text-white border-0 hover:scale-105 transition-transform"
        >
          {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start Learning'}
        </Button>
      </CardContent>
    </Card>
  );
};
