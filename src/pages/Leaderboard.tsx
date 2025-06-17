
import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, TrendingUp, Crown, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  score: number;
  level: number;
  weeklyXP: number;
  rank: number;
  badge: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([
    { id: '1', name: 'Finance Pro', avatar: '', score: 2850, level: 8, weeklyXP: 450, rank: 1, badge: 'Gold Master' },
    { id: '2', name: 'Money Guru', avatar: '', score: 2650, level: 7, weeklyXP: 420, rank: 2, badge: 'Silver Expert' },
    { id: '3', name: 'Budget King', avatar: '', score: 2400, level: 6, weeklyXP: 380, rank: 3, badge: 'Bronze Pro' },
    { id: '4', name: 'Saver Queen', avatar: '', score: 2200, level: 6, weeklyXP: 350, rank: 4, badge: 'Silver Expert' },
    { id: '5', name: 'Investment Ace', avatar: '', score: 2100, level: 5, weeklyXP: 320, rank: 5, badge: 'Bronze Pro' },
    { id: '6', name: 'Tax Ninja', avatar: '', score: 1950, level: 5, weeklyXP: 300, rank: 6, badge: 'Bronze Pro' },
    { id: '7', name: 'Fraud Fighter', avatar: '', score: 1800, level: 4, weeklyXP: 280, rank: 7, badge: 'Rising Star' },
    { id: '8', name: 'Smart Spender', avatar: '', score: 1650, level: 4, weeklyXP: 260, rank: 8, badge: 'Rising Star' },
    { id: '9', name: 'Goal Achiever', avatar: '', score: 1500, level: 3, weeklyXP: 240, rank: 9, badge: 'Beginner' },
    { id: '10', name: 'Quiz Master', avatar: '', score: 1350, level: 3, weeklyXP: 220, rank: 10, badge: 'Beginner' },
    { id: '11', name: 'You', avatar: '', score: 1200, level: 3, weeklyXP: 180, rank: 12, badge: 'Rising Star' },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboardData(prev => prev.map(user => ({
        ...user,
        score: user.score + Math.floor(Math.random() * 10),
        weeklyXP: user.weeklyXP + Math.floor(Math.random() * 5)
      })).sort((a, b) => b.score - a.score).map((user, index) => ({
        ...user,
        rank: index + 1
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-500" />;
      default: return <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold Master': return 'bg-yellow-100 text-yellow-800';
      case 'Silver Expert': return 'bg-gray-100 text-gray-800';
      case 'Bronze Pro': return 'bg-orange-100 text-orange-800';
      case 'Rising Star': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const currentUser = leaderboardData.find(user => user.name === 'You');

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
            <h1 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h1>
            <p className="text-gray-600">Compete with other learners</p>
          </div>
        </div>

        {/* Your Rank Card */}
        {currentUser && (
          <Card className="border-0 shadow-card bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(currentUser.rank)}
                  <Avatar className="w-12 h-12 border-2 border-white/30">
                    <AvatarFallback className="bg-white/20 text-white font-bold">
                      YOU
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Your Position</h3>
                  <p className="opacity-90">Rank #{currentUser.rank} • {currentUser.score} XP</p>
                  <Badge className="bg-white/20 text-white border-white/30 mt-1">
                    {currentUser.badge}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-75">This Week</p>
                  <p className="text-xl font-bold">+{currentUser.weeklyXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'weekly', label: 'Weekly' },
            { id: 'monthly', label: 'Monthly' },
            { id: 'allTime', label: 'All Time' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                activeTab === id
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <Card key={user.id} className={`border-0 shadow-card text-center ${
              index === 0 ? 'bg-gradient-to-b from-yellow-50 to-yellow-100' :
              index === 1 ? 'bg-gradient-to-b from-gray-50 to-gray-100' :
              'bg-gradient-to-b from-orange-50 to-orange-100'
            }`}>
              <CardContent className="p-3">
                <div className="flex flex-col items-center">
                  {getRankIcon(user.rank)}
                  <Avatar className="w-10 h-10 my-2">
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-xs truncate w-full">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.score} XP</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-gray-800">All Rankings</h3>
          {leaderboardData.map((user) => (
            <Card key={user.id} className={`border-0 shadow-card ${
              user.name === 'You' ? 'bg-green-50 border-2 border-green-200' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(user.rank)}
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={user.name === 'You' ? 'bg-green-100 text-green-700' : ''}>
                        {user.name === 'You' ? 'YOU' : user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{user.name}</h4>
                      {user.name === 'You' && (
                        <Badge className="bg-green-100 text-green-800 text-xs">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getBadgeColor(user.badge)}`}>
                        {user.badge}
                      </Badge>
                      <span className="text-xs text-gray-500">Level {user.level}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">{user.score}</p>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      +{user.weeklyXP}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rewards Info */}
        <Card className="border-0 shadow-card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-bold mb-2">Weekly Rewards!</h3>
            <p className="text-sm opacity-90">
              Top 10 users get bonus coins and exclusive badges. Keep learning to climb up!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
