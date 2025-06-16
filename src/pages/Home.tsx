
import { useState } from 'react';
import { XPBar } from '@/components/XPBar';
import { CoinDisplay } from '@/components/CoinDisplay';
import { DailyTip } from '@/components/DailyTip';
import { ActiveQuest } from '@/components/ActiveQuest';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [userStats] = useState({
    name: 'Financial Warrior',
    level: 3,
    currentXP: 750,
    nextLevelXP: 1000,
    coins: 2450,
  });

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
          <CoinDisplay coins={userStats.coins} />
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

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">₹12,450</p>
            <p className="text-xs text-green-600">Saved +15%</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-medium text-gray-600">Goals</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">3/5</p>
            <p className="text-xs text-blue-600">On track</p>
          </div>
        </div>

        {/* Continue Learning CTA */}
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
            Continue Learning <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
