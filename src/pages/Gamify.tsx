
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Trophy, Target, Shield, Calculator, TrendingUp, PiggyBank, AlertTriangle, Star, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  description: string;
  category: 'budgeting' | 'investing' | 'saving' | 'fraud';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: number;
  completed: boolean;
  icon: any;
  color: string;
}

const Gamify = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userProgress, setUserProgress] = useState({
    totalXP: 2450,
    level: 12,
    rank: 'Gold',
    streak: 7,
    gamesCompleted: 8
  });

  const games: Game[] = [
    {
      id: 'budget-challenge',
      title: '💰 Budget Master Challenge',
      description: 'Manage a virtual family budget for 30 days. Make real decisions on expenses, handle emergencies, and stay within limits.',
      category: 'budgeting',
      difficulty: 'beginner',
      reward: 150,
      completed: false,
      icon: Calculator,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'investment-simulator',
      title: '📈 Stock Market Survivor',
      description: 'Start with ₹1 lakh virtual money. Trade stocks, handle market crashes, and grow your portfolio over 3 months.',
      category: 'investing',
      difficulty: 'intermediate',
      reward: 300,
      completed: true,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'saving-race',
      title: '🏁 Saving Speed Race',
      description: 'Compete with others to reach saving goals fastest. Use different saving strategies and investment options.',
      category: 'saving',
      difficulty: 'beginner',
      reward: 200,
      completed: false,
      icon: PiggyBank,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'fraud-detective',
      title: '🕵️ Fraud Detective Game',
      description: 'Solve real fraud cases. Identify fake calls, SMS, emails, and websites. Learn protection techniques.',
      category: 'fraud',
      difficulty: 'intermediate',
      reward: 250,
      completed: false,
      icon: Shield,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'tax-optimizer',
      title: '📋 Tax Optimization Challenge',
      description: 'Minimize tax liability for different income scenarios. Use 80C, 80D deductions and investment planning.',
      category: 'investing',
      difficulty: 'advanced',
      reward: 400,
      completed: false,
      icon: Target,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'emergency-fund',
      title: '🚨 Emergency Fund Builder',
      description: 'Build emergency fund while handling unexpected expenses. Learn to balance saving vs spending.',
      category: 'saving',
      difficulty: 'intermediate',
      reward: 275,
      completed: true,
      icon: AlertTriangle,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Games', icon: Play },
    { id: 'budgeting', label: 'Budgeting', icon: Calculator },
    { id: 'investing', label: 'Investing', icon: TrendingUp },
    { id: 'saving', label: 'Saving', icon: PiggyBank },
    { id: 'fraud', label: 'Fraud Protection', icon: Shield },
  ];

  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  const handleStartGame = (gameId: string) => {
    console.log(`Starting game: ${gameId}`);
    // Simulate game completion for demo
    const updatedProgress = {
      ...userProgress,
      totalXP: userProgress.totalXP + 50,
      gamesCompleted: userProgress.gamesCompleted + 1
    };
    setUserProgress(updatedProgress);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">🎮 Financial Games</h1>
            <p className="text-gray-600">Learn finance through hands-on experience</p>
          </div>
        </div>

        {/* User Progress */}
        <Card className="border-0 shadow-card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg">Level {userProgress.level} - {userProgress.rank}</h3>
                <p className="text-sm opacity-90">{userProgress.totalXP} XP • {userProgress.streak} day streak</p>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-8 h-8" />
                <span className="text-2xl font-bold">{userProgress.totalXP}</span>
              </div>
            </div>
            <Progress value={75} className="h-2 bg-white/30" />
            <p className="text-xs mt-2 opacity-90">325 XP to next level</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <Badge
              key={id}
              variant={selectedCategory === id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap flex items-center gap-1 py-2 px-3 ${
                selectedCategory === id 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(id)}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
          ))}
        </div>

        {/* Games Grid */}
        <div className="space-y-4">
          {filteredGames.map((game) => {
            const Icon = game.icon;
            return (
              <Card key={game.id} className="border-0 shadow-card hover:shadow-lg transition-all">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${game.color} p-4 rounded-t-xl`}>
                    <div className="flex items-start justify-between text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{game.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(game.difficulty)}>
                              {game.difficulty}
                            </Badge>
                            {game.completed && (
                              <Badge className="bg-white/20 text-white">
                                Completed ✓
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          <span className="font-bold">{game.reward}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {game.description}
                    </p>
                    
                    <Button 
                      onClick={() => handleStartGame(game.id)}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      {game.completed ? 'Play Again' : 'Start Game'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Leaderboard Preview */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">🏆 Weekly Leaderboard</h3>
              <Button variant="outline" size="sm" onClick={() => navigate('/leaderboard')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {[
                { rank: 1, name: 'You', xp: 2450, badge: '🥇' },
                { rank: 2, name: 'Rahul S.', xp: 2380, badge: '🥈' },
                { rank: 3, name: 'Priya M.', xp: 2290, badge: '🥉' },
              ].map((player) => (
                <div key={player.rank} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{player.badge}</span>
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-xs text-gray-500">Level {Math.floor(player.xp / 200)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{player.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Gamify;
