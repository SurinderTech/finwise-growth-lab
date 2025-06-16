
import { useState } from 'react';
import { Trophy, Clock, CheckCircle, Star, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Quests = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const dailyQuests = [
    {
      id: 'daily-expense',
      title: '💰 Track Today\'s Expenses',
      description: 'Record at least 3 expenses in your tracker',
      progress: 2,
      total: 3,
      reward: 50,
      completed: false,
      timeLeft: '16h',
    },
    {
      id: 'quiz-complete',
      title: '🧠 Complete Learning Quiz',
      description: 'Finish any module quiz with 80%+ score',
      progress: 0,
      total: 1,
      reward: 75,
      completed: false,
      timeLeft: '16h',
    },
    {
      id: 'saving-goal',
      title: '🎯 Update Saving Goal',
      description: 'Add progress to any of your saving goals',
      progress: 1,
      total: 1,
      reward: 40,
      completed: true,
      timeLeft: '16h',
    },
  ];

  const weeklyQuests = [
    {
      id: 'budget-week',
      title: '📊 Weekly Budget Challenge',
      description: 'Stay within budget for 5 out of 7 days',
      progress: 3,
      total: 5,
      reward: 200,
      completed: false,
      timeLeft: '3 days',
    },
    {
      id: 'investment-sim',
      title: '📈 Investment Streak',
      description: 'Make virtual investments for 3 consecutive days',
      progress: 1,
      total: 3,
      reward: 300,
      completed: false,
      timeLeft: '3 days',
    },
  ];

  const achievements = [
    {
      id: 'first-saver',
      title: '🏆 First Saver',
      description: 'Complete your first saving goal',
      unlocked: true,
      rarity: 'common',
    },
    {
      id: 'quiz-master',
      title: '🧠 Quiz Master',
      description: 'Score 100% on 5 different quizzes',
      unlocked: false,
      progress: 3,
      total: 5,
      rarity: 'rare',
    },
    {
      id: 'fraud-fighter',
      title: '🛡️ Fraud Fighter',
      description: 'Complete all fraud detection scenarios',
      unlocked: false,
      progress: 0,
      total: 10,
      rarity: 'epic',
    },
    {
      id: 'budget-ninja',
      title: '🥷 Budget Ninja',
      description: 'Stay under budget for 30 consecutive days',
      unlocked: false,
      progress: 12,
      total: 30,
      rarity: 'legendary',
    },
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

  const handleQuestAction = (questId: string) => {
    console.log(`Starting quest: ${questId}`);
  };

  const totalDailyXP = dailyQuests.reduce((sum, quest) => sum + quest.reward, 0);
  const completedDailyXP = dailyQuests.filter(q => q.completed).reduce((sum, quest) => sum + quest.reward, 0);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏆 Quests & Achievements
          </h1>
          <p className="text-gray-600">Complete challenges and earn rewards</p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Today's Progress</h3>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span className="font-bold">{completedDailyXP}/{totalDailyXP} XP</span>
            </div>
          </div>
          <Progress 
            value={(completedDailyXP / totalDailyXP) * 100} 
            className="h-2 bg-white/30" 
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { id: 'daily', label: 'Daily', icon: Target },
            { id: 'weekly', label: 'Weekly', icon: Clock },
            { id: 'achievements', label: 'Badges', icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all ${
                activeTab === id
                  ? 'bg-white text-green-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>

        {/* Quest Content */}
        <div className="space-y-4">
          {activeTab === 'daily' && (
            <>
              {dailyQuests.map((quest) => (
                <Card key={quest.id} className="border-0 shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          {quest.title}
                          {quest.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </h3>
                        <p className="text-gray-600 text-sm">{quest.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                          <Trophy className="w-3 h-3" />
                          {quest.reward}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {quest.timeLeft}
                        </div>
                      </div>
                    </div>

                    {!quest.completed && (
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{quest.progress}/{quest.total}</span>
                        </div>
                        <Progress value={(quest.progress / quest.total) * 100} className="h-2" />
                      </div>
                    )}

                    <Button
                      onClick={() => handleQuestAction(quest.id)}
                      disabled={quest.completed}
                      className={`w-full ${
                        quest.completed
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'gradient-primary text-white'
                      }`}
                    >
                      {quest.completed ? 'Completed! ✅' : 'Start Quest'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {activeTab === 'weekly' && (
            <>
              {weeklyQuests.map((quest) => (
                <Card key={quest.id} className="border-0 shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{quest.title}</h3>
                        <p className="text-gray-600 text-sm">{quest.description}</p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-yellow-600 font-semibold">
                          <Trophy className="w-3 h-3" />
                          {quest.reward}
                        </div>
                        <div className="text-gray-500">{quest.timeLeft}</div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{quest.progress}/{quest.total}</span>
                      </div>
                      <Progress value={(quest.progress / quest.total) * 100} className="h-2" />
                    </div>

                    <Button
                      onClick={() => handleQuestAction(quest.id)}
                      className="w-full gradient-primary text-white"
                    >
                      Continue Quest
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {activeTab === 'achievements' && (
            <>
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`border-0 shadow-card ${achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-yellow-700' : 'text-gray-400'}`}>
                            {achievement.title}
                          </h3>
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>

                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quests;
