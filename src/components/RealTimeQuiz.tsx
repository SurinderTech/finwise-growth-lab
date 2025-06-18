
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Trophy, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface QuizProps {
  quizId: string;
  onComplete: (score: number) => void;
}

export const RealTimeQuiz: React.FC<QuizProps> = ({ quizId, onComplete }) => {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      submitQuiz();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (error) throw error;

      setQuiz(data);
      setTimeLeft(data.time_limit_minutes * 60);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (error: any) {
      console.error('Error fetching quiz:', error);
      toast.error('Error loading quiz');
    }
  };

  const startQuiz = () => {
    setIsActive(true);
    toast.success('Quiz started! Good luck!');
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setIsActive(false);
    
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question: any, index: number) => {
      if (answers[index] === question.correct) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResult(true);

    // Save quiz attempt
    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user?.id,
          quiz_id: quizId,
          answers: answers,
          score: finalScore,
          status: finalScore >= quiz.passing_score ? 'completed' : 'failed',
          completed_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update user stats if passed
      if (finalScore >= quiz.passing_score) {
        const { data: userStats } = await supabase
          .from('user_stats')
          .select('total_xp')
          .eq('user_id', user?.id)
          .single();

        if (userStats) {
          await supabase
            .from('user_stats')
            .update({
              total_xp: userStats.total_xp + 100,
              last_activity_date: new Date().toISOString().split('T')[0]
            })
            .eq('user_id', user?.id);
        }

        toast.success(`Quiz completed! You earned 100 XP!`);
      } else {
        toast.error('Quiz failed. Try again to pass!');
      }

      onComplete(finalScore);
    } catch (error: any) {
      console.error('Error saving quiz attempt:', error);
      toast.error('Error saving quiz results');
    }
  };

  if (!quiz) {
    return <div>Loading quiz...</div>;
  }

  if (showResult) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {score >= quiz.passing_score ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <X className="w-6 h-6 text-red-500" />
            )}
            Quiz {score >= quiz.passing_score ? 'Passed' : 'Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-4xl font-bold">{score}%</div>
          <p>
            You got {quiz.questions.filter((_: any, index: number) => answers[index] === quiz.questions[index].correct).length} out of {quiz.questions.length} questions correct
          </p>
          {score >= quiz.passing_score && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Trophy className="w-5 h-5" />
              <span>+100 XP Earned!</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!isActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>Questions: {quiz.questions.length}</div>
            <div>Time Limit: {quiz.time_limit_minutes} minutes</div>
            <div>Passing Score: {quiz.passing_score}%</div>
            <div>Max Attempts: {quiz.max_attempts}</div>
          </div>
          <Button onClick={startQuiz} className="w-full">
            Start Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Question {currentQuestion + 1} of {quiz.questions.length}</CardTitle>
          <div className="flex items-center gap-2 text-red-600">
            <Clock className="w-4 h-4" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-semibold">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`w-full p-4 text-left rounded-lg border transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <Button 
          onClick={nextQuestion} 
          className="w-full"
          disabled={answers[currentQuestion] === null}
        >
          {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
        </Button>
      </CardContent>
    </Card>
  );
};
