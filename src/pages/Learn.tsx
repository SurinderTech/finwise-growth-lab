
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { LearningModule } from '@/components/LearningModule';
import { RealTimeQuiz } from '@/components/RealTimeQuiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Trophy, Video, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Learn = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningModules();
    fetchUserProgress();
    fetchQuizzes();
  }, [user]);

  const fetchLearningModules = async () => {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) throw error;
      setModules(data || []);
    } catch (error: any) {
      console.error('Error fetching modules:', error);
      toast.error('Error loading learning modules');
    }
  };

  const fetchUserProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setUserProgress(data || []);
    } catch (error: any) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*');

      if (error) throw error;
      setQuizzes(data || []);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching quizzes:', error);
      setLoading(false);
    }
  };

  const startModule = async (moduleId: string) => {
    try {
      // Check if progress exists
      const existingProgress = userProgress.find(p => p.module_id === moduleId);
      
      if (!existingProgress) {
        await supabase
          .from('user_progress')
          .insert({
            user_id: user?.id,
            module_id: moduleId,
            progress_percentage: 25
          });
      } else {
        await supabase
          .from('user_progress')
          .update({
            progress_percentage: Math.min(existingProgress.progress_percentage + 25, 100),
            completed_at: existingProgress.progress_percentage >= 75 ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id);
      }

      // Award XP for starting/continuing module
      const module = modules.find(m => m.id === moduleId);
      if (module) {
        const { data: userStats } = await supabase
          .from('user_stats')
          .select('total_xp')
          .eq('user_id', user?.id)
          .single();

        if (userStats) {
          await supabase
            .from('user_stats')
            .update({
              total_xp: userStats.total_xp + 25,
              last_activity_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user?.id);
        }

        toast.success(`Learning progress updated! +25 XP`);
      }

      fetchUserProgress();
    } catch (error: any) {
      console.error('Error updating progress:', error);
      toast.error('Error updating progress');
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    return {
      completed: progress?.completed_at != null,
      progress: progress?.progress_percentage || 0
    };
  };

  const enrichedModules = modules.map(module => ({
    ...module,
    ...getModuleProgress(module.id)
  }));

  if (loading) {
    return <div className="p-6 pb-20">Loading...</div>;
  }

  if (selectedQuiz) {
    return (
      <div className="p-6 pb-20">
        <RealTimeQuiz 
          quizId={selectedQuiz} 
          onComplete={() => setSelectedQuiz(null)} 
        />
      </div>
    );
  }

  return (
    <div className="p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📚 Financial Education</h1>
          <p className="text-gray-600">Master money management through interactive learning</p>
        </div>

        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learning Modules
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Live Quizzes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules" className="space-y-6 mt-6">
            <div className="grid gap-6">
              {enrichedModules.map((module) => (
                <LearningModule
                  key={module.id}
                  module={{
                    id: module.id,
                    title: module.title,
                    description: module.description || '',
                    duration: `${module.duration_minutes} min`,
                    difficulty: module.difficulty,
                    completed: module.completed,
                    progress: module.progress,
                    xpReward: module.xp_reward
                  }}
                  onStart={startModule}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-6 mt-6">
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{quiz.title}</span>
                      <Trophy className="w-5 h-5 text-yellow-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span>{quiz.questions?.length || 0} Questions</span>
                      <span>{quiz.time_limit_minutes} Minutes</span>
                      <span>Passing: {quiz.passing_score}%</span>
                    </div>
                    <button
                      onClick={() => setSelectedQuiz(quiz.id)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Quiz
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Learn;
