
import { useState } from 'react';
import { Settings, User, Trophy, TrendingUp, Star, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CoinDisplay } from '@/components/CoinDisplay';

const Profile = () => {
  const [userProfile] = useState({
    name: 'Financial Warrior',
    email: 'warrior@example.com',
    avatar: '',
    level: 3,
    xp: 750,
    totalXP: 2450,
    coins: 2450,
    rank: 'Silver Saver',
    joinDate: 'March 2024',
    streak: 12,
  });

  const badges = [
    { id: 'first-saver', name: '🏆 First Saver', unlocked: true, rarity: 'common' },
    { id: 'quiz-master', name: '🧠 Quiz Pro', unlocked: true, rarity: 'rare' },
    { id: 'budget-ninja', name: '🥷 Budget Ninja', unlocked: false, rarity: 'epic' },
    { id: 'fraud-fighter', name: '🛡️ Fraud Fighter', unlocked: false, rarity: 'legendary' },
  ];

  const stats = [
    { label: 'Modules Completed', value: '8/12', icon: Trophy },
    { label: 'Current Streak', value: `${userProfile.streak} days`, icon: Star },
    { label: 'Total XP Earned', value: userProfile.totalXP.toLocaleString(), icon: TrendingUp },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">👤 Profile</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16 border-2 border-white/30">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{userProfile.name}</h2>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
                    <Edit className="w-3 h-3" />
                  </Button>
                </div>
                <p className="opacity-90 text-sm">{userProfile.email}</p>
                <Badge className="bg-white/20 text-white border-white/30 mt-1">
                  {userProfile.rank}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold">Level {userProfile.level}</div>
                <div className="text-xs opacity-75">Since {userProfile.joinDate}</div>
              </div>
              <CoinDisplay coins={userProfile.coins} />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badge Collection */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              🏆 Badge Collection
              <span className="text-sm font-normal text-gray-500">
                ({badges.filter(b => b.unlocked).length}/{badges.length})
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    badge.unlocked
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
                      {badge.name.split(' ')[0]}
                    </div>
                    <div className={`text-xs font-medium mb-1 ${badge.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                      {badge.name.substring(2)}
                    </div>
                    <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <User className="w-5 h-5" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12">
            <Settings className="w-5 h-5" />
            App Settings
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 h-12 text-red-600 border-red-200 hover:bg-red-50">
            <span>🚪</span>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
