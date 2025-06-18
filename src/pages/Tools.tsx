
import { Calculator, Target, TrendingUp, PieChart, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { InteractiveFinancialGames } from '@/components/InteractiveFinancialGames';

const Tools = () => {
  const navigate = useNavigate();
  
  const tools = [
    {
      id: 'expense-tracker',
      title: '💳 Real-Time Expense Tracker',
      description: 'Track expenses with live budget alerts and notifications',
      icon: PieChart,
      color: 'from-blue-500 to-blue-600',
      comingSoon: false,
      route: '/expense-tracker'
    },
    {
      id: 'saving-goals',
      title: '🎯 Smart Saving Goals',
      description: 'AI-powered goal tracking with progress notifications',
      icon: Target,
      color: 'from-green-500 to-green-600',
      comingSoon: false,
      route: '/saving-goals'
    },
    {
      id: 'investment-lab',
      title: '📊 Live Investment Lab',
      description: 'Real-time market simulation with risk management',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      comingSoon: false,
      route: '/investment-lab'
    },
    {
      id: 'financial-calculators',
      title: '🧮 Smart Calculators',
      description: 'Advanced financial calculators with real-time insights',
      icon: Calculator,
      color: 'from-orange-500 to-orange-600',
      comingSoon: false,
      route: '/financial-calculators'
    },
    {
      id: 'settings',
      title: '⚙️ App Settings',
      description: 'Customize notifications, budgets, and preferences',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      comingSoon: false,
      route: '/settings'
    }
  ];

  const handleToolClick = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool && tool.route) {
      navigate(tool.route);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🛠️ Financial Tools & Games
          </h1>
          <p className="text-gray-600">Hands-on tools and interactive games for financial learning</p>
        </div>

        {/* Interactive Games Section */}
        <InteractiveFinancialGames />

        {/* Tools Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Real-Time Tools</h2>
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
      </div>
    </div>
  );
};

export default Tools;
