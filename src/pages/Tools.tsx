import { Calculator, Target, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Tools = () => {
  const tools = [
    {
      id: 'expense-tracker',
      title: '💳 Expense Tracker',
      description: 'Track your daily expenses and visualize spending patterns',
      icon: PieChart,
      color: 'from-blue-500 to-blue-600',
      comingSoon: false,
      route: '/expense-tracker'
    },
    {
      id: 'saving-goals',
      title: '🎯 Saving Goals',
      description: 'Set and track your financial goals with progress rings',
      icon: Target,
      color: 'from-green-500 to-green-600',
      comingSoon: false,
      route: '/saving-goals'
    },
    {
      id: 'investment-lab',
      title: '📊 Investment Lab',
      description: 'Practice investing with virtual portfolio simulation',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      comingSoon: false,
      route: '/investment-lab'
    },
    {
      id: 'financial-calculators',
      title: '🧮 Financial Calculators',
      description: 'Interactive tools for financial planning and simulation',
      icon: Calculator,
      color: 'from-orange-500 to-orange-600',
      comingSoon: false,
      route: '/financial-calculators'
    },
    {
      id: 'goal-tracking',
      title: '🎯 Goal Tracking',
      description: 'Advanced goal setting and monitoring system',
      icon: Target,
      color: 'from-pink-500 to-pink-600',
      comingSoon: false,
      route: '/goal-tracking'
    },
    {
      id: 'gamify',
      title: '🎮 Financial Games',
      description: 'Learn finance through interactive games and simulations',
      icon: Calculator,
      color: 'from-indigo-500 to-indigo-600',
      comingSoon: false,
      route: '/gamify'
    }
  ];

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool && tool.route) {
      window.location.href = tool.route;
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛠️ Financial Tools
          </h1>
          <p className="text-gray-600">Practical tools to manage your money</p>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-4 shadow-card">
          <h3 className="font-semibold text-gray-800 mb-3">📊 Your Financial Snapshot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">₹45,200</div>
              <div className="text-xs text-gray-500">Total Saved</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">₹8,450</div>
              <div className="text-xs text-gray-500">This Month</div>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.id} className="border-0 shadow-card hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div className={`bg-gradient-to-r ${tool.color} p-4 rounded-t-xl`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="font-bold text-lg">{tool.title}</h3>
                        {tool.comingSoon && (
                          <span className="text-xs bg-white/30 px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    <Button 
                      onClick={() => handleToolClick(tool.id)}
                      disabled={tool.comingSoon}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      {tool.comingSoon ? 'Coming Soon' : 'Open Tool'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pro Tip */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-4 text-center">
          <h3 className="font-bold text-gray-800 mb-2">💡 Pro Tip</h3>
          <p className="text-sm text-gray-700">
            Use tools regularly to build better financial habits and earn bonus XP!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tools;
