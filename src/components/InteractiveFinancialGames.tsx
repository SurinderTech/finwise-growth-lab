
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Shield, TrendingUp, Calculator, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from './NotificationSystem';

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'budgeting' | 'saving' | 'investing' | 'fraud';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  icon: React.ReactNode;
  color: string;
}

export const InteractiveFinancialGames: React.FC = () => {
  const { user } = useAuth();
  const { sendNotification } = useNotifications();
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [gameProgress, setGameProgress] = useState(0);
  const [score, setScore] = useState(0);

  const games: Game[] = [
    {
      id: 'budget-master',
      title: '💰 Budget Master',
      description: 'Learn to create and manage budgets effectively',
      category: 'budgeting',
      difficulty: 'beginner',
      xpReward: 100,
      icon: <Calculator className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'saving-champion',
      title: '🏆 Saving Champion',
      description: 'Master the art of saving with smart strategies',
      category: 'saving',
      difficulty: 'intermediate',
      xpReward: 150,
      icon: <Target className="w-6 h-6" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'investment-wizard',
      title: '📈 Investment Wizard',
      description: 'Learn investment principles through real scenarios',
      category: 'investing',
      difficulty: 'advanced',
      xpReward: 200,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'fraud-detective',
      title: '🛡️ Fraud Detective',
      description: 'Identify and prevent financial frauds',
      category: 'fraud',
      difficulty: 'beginner',
      xpReward: 120,
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-red-600'
    }
  ];

  const startGame = (game: Game) => {
    setActiveGame(game);
    setGameProgress(0);
    setScore(0);
    toast.success(`Starting ${game.title}!`);
  };

  const simulateGameplay = () => {
    if (!activeGame) return;

    const interval = setInterval(() => {
      setGameProgress(prev => {
        const newProgress = prev + 10;
        setScore(prev => prev + Math.floor(Math.random() * 20) + 10);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          completeGame();
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  const completeGame = async () => {
    if (!activeGame || !user) return;

    const finalScore = score + Math.floor(Math.random() * 50) + 50;
    
    toast.success(`🎉 Game completed! Score: ${finalScore} | +${activeGame.xpReward} XP`);
    
    // Send achievement notification
    await sendNotification(
      '🏆 Game Completed!',
      `You completed ${activeGame.title} with a score of ${finalScore}!`,
      'achievement'
    );

    setActiveGame(null);
    setGameProgress(0);
    setScore(0);
  };

  if (activeGame) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeGame.icon}
              {activeGame.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span>Progress</span>
                <span>{gameProgress}%</span>
              </div>
              <Progress value={gameProgress} className="w-full" />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-gray-500">Current Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">+{activeGame.xpReward}</div>
                <div className="text-sm text-gray-500">XP Reward</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Game Scenario:</h4>
              <p className="text-sm text-gray-600">
                {activeGame.category === 'budgeting' && "You have ₹50,000 monthly income. Allocate it wisely across needs, wants, and savings..."}
                {activeGame.category === 'saving' && "Your goal is to save ₹1,00,000 in 12 months. Choose the best saving strategies..."}
                {activeGame.category === 'investing' && "You have ₹10,000 to invest. Pick the right mix of stocks, bonds, and mutual funds..."}
                {activeGame.category === 'fraud' && "Identify the red flags in this suspicious investment opportunity..."}
              </p>
            </div>

            <div className="flex gap-2">
              {gameProgress === 0 && (
                <Button onClick={simulateGameplay} className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Playing
                </Button>
              )}
              <Button onClick={() => setActiveGame(null)} variant="outline" className="flex-1">
                Exit Game
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">🎮 Interactive Financial Games</h2>
        <p className="text-gray-600">Learn finance through hands-on gaming experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className={`bg-gradient-to-r ${game.color} p-4 rounded-t-xl`}>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {game.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{game.title}</h3>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {game.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        +{game.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-gray-500">What you'll learn:</div>
                  <div className="text-sm">
                    {game.category === 'budgeting' && "• 50/30/20 rule • Emergency fund planning • Expense tracking"}
                    {game.category === 'saving' && "• Goal setting • Interest calculations • Saving strategies"}
                    {game.category === 'investing' && "• Risk assessment • Portfolio diversification • Market analysis"}
                    {game.category === 'fraud' && "• Scam identification • Safe practices • Red flag detection"}
                  </div>
                </div>

                <Button 
                  onClick={() => startGame(game)}
                  className="w-full"
                >
                  Start Game
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Weekly Challenge</h3>
          <p className="mb-4">Complete all 4 games this week to earn a special badge and bonus XP!</p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Progress: 0/4</Badge>
            <Badge variant="secondary">Bonus: +500 XP</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
