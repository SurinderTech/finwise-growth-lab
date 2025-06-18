
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, X, Phone, Mail, Globe, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface FraudScenario {
  id: string;
  title: string;
  description: string;
  scenario_type: string;
  content: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  difficulty: string;
  points: number;
}

export const FraudDetectionGame = () => {
  const { user } = useAuth();
  const [scenarios, setScenarios] = useState<FraudScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<FraudScenario | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
    setupRealtimeSubscription();
  }, []);

  const fetchScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('fraud_scenarios')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
      if (data && data.length > 0) {
        setCurrentScenario(data[0]);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching fraud scenarios:', error);
      toast.error('Error loading fraud scenarios');
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('fraud-scenarios-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'fraud_scenarios'
        },
        (payload) => {
          console.log('New fraud scenario added:', payload);
          toast.info('New fraud scenario available!');
          fetchScenarios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleAnswerSubmit = async () => {
    if (!currentScenario || selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentScenario.content.correct;
    const pointsEarned = isCorrect ? currentScenario.points : 0;

    try {
      // Save progress
      const { error } = await supabase
        .from('fraud_training_progress')
        .upsert({
          user_id: user?.id,
          scenario_id: currentScenario.id,
          user_answer: currentScenario.content.options[selectedAnswer],
          is_correct: isCorrect,
          points_earned: pointsEarned
        });

      if (error) throw error;

      // Update user stats
      if (isCorrect) {
        const { data: userStats } = await supabase
          .from('user_stats')
          .select('total_xp, coins')
          .eq('user_id', user?.id)
          .single();

        if (userStats) {
          await supabase
            .from('user_stats')
            .update({
              total_xp: userStats.total_xp + pointsEarned,
              coins: userStats.coins + Math.floor(pointsEarned / 2),
              last_activity_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user?.id);
        }
      }

      setScore(score + pointsEarned);
      setTotalCompleted(totalCompleted + 1);
      setShowResult(true);

      if (isCorrect) {
        toast.success(`Correct! +${pointsEarned} XP earned!`);
      } else {
        toast.error('Incorrect. Learn from the explanation!');
      }
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error('Error saving progress');
    }
  };

  const nextScenario = () => {
    const currentIndex = scenarios.findIndex(s => s.id === currentScenario?.id);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setCurrentScenario(scenarios[nextIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getScenarioIcon = (type: string) => {
    switch (type) {
      case 'phishing':
        return <Mail className="w-6 h-6" />;
      case 'fake_call':
        return <Phone className="w-6 h-6" />;
      case 'scam_website':
        return <Globe className="w-6 h-6" />;
      case 'suspicious_transaction':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <Shield className="w-6 h-6" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center">Loading fraud detection scenarios...</div>;
  }

  if (!currentScenario) {
    return <div className="text-center">No fraud scenarios available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalCompleted}</div>
            <div className="text-sm text-gray-600">Scenarios Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{scenarios.length}</div>
            <div className="text-sm text-gray-600">Total Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Scenario Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {getScenarioIcon(currentScenario.scenario_type)}
              {currentScenario.title}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(currentScenario.difficulty)}>
                {currentScenario.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentScenario.points} points
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-600">{currentScenario.description}</p>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Scenario:</h4>
                <p className="text-yellow-700">{currentScenario.content.question}</p>
              </div>
            </div>
          </div>

          {!showResult ? (
            <div className="space-y-3">
              <h4 className="font-semibold">How would you respond?</h4>
              {currentScenario.content.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
              
              <Button 
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="w-full mt-4"
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                selectedAnswer === currentScenario.content.correct
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {selectedAnswer === currentScenario.content.correct ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Correct!</h4>
                      <p className="text-green-700">You identified the fraud correctly.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <X className="w-6 h-6 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-800">Incorrect</h4>
                      <p className="text-red-700">The correct answer was: {currentScenario.content.options[currentScenario.content.correct]}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700">{currentScenario.content.explanation}</p>
              </div>

              <Button onClick={nextScenario} className="w-full">
                Next Scenario
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
