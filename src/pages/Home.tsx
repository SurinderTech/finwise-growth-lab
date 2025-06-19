
import { useState, useEffect } from 'react';
import { XPBar } from '@/components/XPBar';
import { CoinDisplay } from '@/components/CoinDisplay';
import { DailyTip } from '@/components/DailyTip';
import { ActiveQuest } from '@/components/ActiveQuest';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, BookOpen, Brain, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({
    name: 'Financial Warrior',
    level: 3,
    currentXP: 750,
    nextLevelXP: 1000,
    coins: 2450,
  });

  const [realTimeData, setRealTimeData] = useState({
    thisMonthExpenses: 28450,
    thisMonthInvestment: 15000,
    totalSaved: 45200,
    goalsCompleted: 3,
    totalGoals: 5,
    leaderboardPosition: 12,
    fraudAlertsBlocked: 8,
    tutorialsCompleted: 15,
    knowledgeScore: 85,
    aiInsights: 'Your spending pattern shows 15% increase in food expenses. Consider meal planning to save ₹2,000 monthly.',
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        thisMonthExpenses: prev.thisMonthExpenses + Math.floor(Math.random() * 100),
        leaderboardPosition: Math.max(1, prev.leaderboardPosition + (Math.random() > 0.5 ? 1 : -1)),
        fraudAlertsBlocked: prev.fraudAlertsBlocked + (Math.random() > 0.9 ? 1 : 0),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const dailyTip = "💰 Start small with saving! Even ₹50 per day adds up to ₹18,250 in a year. Consistency beats perfection in building wealth.";

  const activeQuest = {
    id: 'daily-budget',
    title: 'Budget Tracker Challenge',
    description: 'Track your expenses for 3 consecutive days',
    progress: 2,
    total: 3,
    timeLeft: '18h left',
    reward: 150,
  };

  const handleCardClick = (type: string) => {
    console.log(`Navigating to: ${type}`);
    switch (type) {
      case 'expenses':
        navigate('/expense-tracker');
        break;
      case 'investment':
        navigate('/tools');
        break;
      case 'saved':
        navigate('/tools');
        break;
      case 'goals':
        navigate('/quests');
        break;
      case 'leaderboard':
        navigate('/profile');
        break;
      case 'fraud':
        navigate('/learn');
        break;
      case 'tutorials':
        navigate('/learn');
        break;
      case 'knowledge':
        navigate('/learn');
        break;
      default:
        console.log(`Clicked: ${type}`);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Good morning! 🌅
            </h1>
            <p className="text-gray-600">{userStats.name}</p>
          </div>
          <CoinDisplay coins={userStats.coins} animated />
        </div>

        {/* XP Progress */}
        <XPBar 
          currentXP={userStats.currentXP}
          nextLevelXP={userStats.nextLevelXP}
          level={userStats.level}
        />

        {/* Daily Tip */}
        <DailyTip tip={dailyTip} />

        {/* Active Quest */}
        <ActiveQuest 
          quest={activeQuest}
          onContinue={() => navigate('/quests')}
        />

        {/* Real-time Financial Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* This Month Expenses */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('expenses')}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">₹{realTimeData.thisMonthExpenses.toLocaleString()}</p>
            <p className="text-xs text-red-600">This Month +8%</p>
          </div>

          {/* This Month Investment */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('investment')}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Investment</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">₹{realTimeData.thisMonthInvestment.toLocaleString()}</p>
            <p className="text-xs text-blue-600">This Month +12%</p>
          </div>

          {/* Total Saved */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('saved')}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Total Saved</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">₹{realTimeData.totalSaved.toLocaleString()}</p>
            <p className="text-xs text-green-600">Growth +15%</p>
          </div>

          {/* Goals Progress */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('goals')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Goals</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{realTimeData.goalsCompleted}/{realTimeData.totalGoals}</p>
            <p className="text-xs text-purple-600">On track</p>
          </div>
        </div>

        {/* Learning & Security Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Leaderboard Position */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('leaderboard')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Leaderboard</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">#{realTimeData.leaderboardPosition}</p>
            <p className="text-xs text-yellow-600">This Week</p>
          </div>

          {/* Fraud Awareness */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('fraud')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600">Fraud Blocked</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{realTimeData.fraudAlertsBlocked}</p>
            <p className="text-xs text-red-600">This Month</p>
          </div>

          {/* Interactive Tutorials */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('tutorials')}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Tutorials</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{realTimeData.tutorialsCompleted}</p>
            <p className="text-xs text-blue-600">Completed</p>
          </div>

          {/* Knowledge Assessment */}
          <div 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleCardClick('knowledge')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">Knowledge</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{realTimeData.knowledgeScore}%</p>
            <p className="text-xs text-purple-600">Score</p>
          </div>
        </div>

        {/* AI-Driven Insights */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5" />
            <h3 className="font-semibold">🤖 AI Insights</h3>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            {realTimeData.aiInsights}
          </p>
          <Button 
            onClick={() => navigate('/tools')}
            variant="secondary"
            className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold mt-3 text-xs px-3 py-2"
          >
            View Details <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        {/* Financial Education CTA */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Learn? 🚀</h3>
          <p className="text-sm opacity-90 mb-4">
            Continue your financial journey and unlock new achievements
          </p>
          <Button 
            onClick={() => navigate('/learn')}
            variant="secondary"
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
          >
            Financial Education <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
