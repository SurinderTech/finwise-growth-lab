
import { useState } from 'react';
import { LearningModule } from '@/components/LearningModule';
import { Badge } from '@/components/ui/badge';
import { BookOpen, TrendingUp, Shield, Calculator } from 'lucide-react';

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'budgeting', label: 'Budgeting', icon: Calculator },
    { id: 'investing', label: 'Investing', icon: TrendingUp },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const modules = [
    {
      id: 'budgeting-basics',
      title: '💰 Budgeting Basics',
      description: 'Learn the 50-30-20 rule and create your first budget plan with real expense tracking.',
      duration: '15 min',
      difficulty: 'beginner' as const,
      completed: false,
      progress: 0,
      xpReward: 100,
      category: 'budgeting',
    },
    {
      id: 'smart-saving',
      title: '🏦 Smart Saving Strategies',
      description: 'Discover automated saving techniques and set achievable financial goals.',
      duration: '20 min',
      difficulty: 'beginner' as const,
      completed: true,
      progress: 100,
      xpReward: 150,
      category: 'budgeting',
    },
    {
      id: 'investment-simulator',
      title: '📈 Investment Lab',
      description: 'Practice with ₹10,000 virtual money in our stock market simulator.',
      duration: '30 min',
      difficulty: 'intermediate' as const,
      completed: false,
      progress: 45,
      xpReward: 250,
      category: 'investing',
    },
    {
      id: 'tax-planning',
      title: '📋 Tax Planning 101',
      description: 'Calculate your tax liability and discover 80C, 80D saving opportunities.',
      duration: '25 min',
      difficulty: 'intermediate' as const,
      completed: false,
      progress: 0,
      xpReward: 200,
      category: 'budgeting',
    },
    {
      id: 'fraud-detection',
      title: '🛡️ Fraud Fighter Training',
      description: 'Learn to spot fake SMS, calls, and phishing attempts through interactive scenarios.',
      duration: '18 min',
      difficulty: 'beginner' as const,
      completed: false,
      progress: 0,
      xpReward: 180,
      category: 'security',
    },
  ];

  const filteredModules = selectedCategory === 'all' 
    ? modules 
    : modules.filter(module => module.category === selectedCategory);

  const handleStartModule = (moduleId: string) => {
    console.log(`Starting module: ${moduleId}`);
    // Here you would navigate to the specific module content
  };

  const completedCount = modules.filter(m => m.completed).length;
  const totalXP = modules.filter(m => m.completed).reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎓 Learn & Grow
          </h1>
          <p className="text-gray-600">Master financial skills through interactive lessons</p>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-xl p-4 shadow-card">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{completedCount}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{modules.length - completedCount}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
              <div className="text-xs text-gray-500">XP Earned</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <Badge
              key={id}
              variant={selectedCategory === id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap flex items-center gap-1 py-2 px-3 ${
                selectedCategory === id 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(id)}
            >
              <Icon className="w-3 h-3" />
              {label}
            </Badge>
          ))}
        </div>

        {/* Learning Modules */}
        <div className="space-y-4">
          {filteredModules.map((module) => (
            <LearningModule
              key={module.id}
              module={module}
              onStart={handleStartModule}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No modules found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
