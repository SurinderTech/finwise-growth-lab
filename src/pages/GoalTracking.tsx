
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'short' | 'long';
  priority: 'high' | 'medium' | 'low';
  type: 'emergency' | 'investment' | 'purchase' | 'education' | 'travel' | 'other';
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

const GoalTracking = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const languages: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const translations = {
    en: {
      title: 'Goal Tracking',
      subtitle: 'Set and monitor financial objectives',
      addGoal: 'Add Goal',
      shortTerm: 'Short-term',
      longTerm: 'Long-term',
      all: 'All Goals',
      emergency: 'Emergency Fund',
      investment: 'Investment',
      purchase: 'Purchase',
      education: 'Education',
      travel: 'Travel',
      other: 'Other',
      progress: 'Progress',
      remaining: 'Remaining',
      highPriority: 'High Priority',
      mediumPriority: 'Medium Priority',
      lowPriority: 'Low Priority'
    },
    hi: {
      title: 'लक्ष्य ट्रैकिंग',
      subtitle: 'वित्तीय उद्देश्य निर्धारित करें और निगरानी करें',
      addGoal: 'लक्ष्य जोड़ें',
      shortTerm: 'अल्पकालिक',
      longTerm: 'दीर्घकालिक',
      all: 'सभी लक्ष्य',
      emergency: 'आपातकालीन फंड',
      investment: 'निवेश',
      purchase: 'खरीदारी',
      education: 'शिक्षा',
      travel: 'यात्रा',
      other: 'अन्य',
      progress: 'प्रगति',
      remaining: 'शेष',
      highPriority: 'उच्च प्राथमिकता',
      mediumPriority: 'मध्यम प्राथमिकता',
      lowPriority: 'कम प्राथमिकता'
    },
    pa: {
      title: 'ਟੀਚਾ ਟਰੈਕਿੰਗ',
      subtitle: 'ਵਿੱਤੀ ਉਦੇਸ਼ ਸੈੱਟ ਅਤੇ ਨਿਗਰਾਨੀ ਕਰੋ',
      addGoal: 'ਟੀਚਾ ਜੋੜੋ',
      shortTerm: 'ਛੋਟੀ ਮਿਆਦ',
      longTerm: 'ਲੰਬੀ ਮਿਆਦ',
      all: 'ਸਾਰੇ ਟੀਚੇ',
      emergency: 'ਐਮਰਜੈਂਸੀ ਫੰਡ',
      investment: 'ਨਿਵੇਸ਼',
      purchase: 'ਖਰੀਦਦਾਰੀ',
      education: 'ਸਿੱਖਿਆ',
      travel: 'ਯਾਤਰਾ',
      other: 'ਹੋਰ',
      progress: 'ਤਰੱਕੀ',
      remaining: 'ਬਾਕੀ',
      highPriority: 'ਉੱਚ ਤਰਜੀਹ',
      mediumPriority: 'ਮੱਧਮ ਤਰਜੀਹ',
      lowPriority: 'ਘੱਟ ਤਰਜੀਹ'
    }
  };

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      description: 'Build emergency fund for 6 months expenses',
      targetAmount: 300000,
      currentAmount: 125000,
      deadline: '2024-12-31',
      category: 'short',
      priority: 'high',
      type: 'emergency'
    },
    {
      id: '2',
      title: 'Retirement Planning',
      description: 'Long-term retirement corpus building',
      targetAmount: 5000000,
      currentAmount: 850000,
      deadline: '2040-12-31',
      category: 'long',
      priority: 'high',
      type: 'investment'
    },
    {
      id: '3',
      title: 'Dream Vacation',
      description: 'Europe trip with family',
      targetAmount: 400000,
      currentAmount: 95000,
      deadline: '2024-10-15',
      category: 'short',
      priority: 'medium',
      type: 'travel'
    }
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: 'short' as 'short' | 'long',
    priority: 'medium' as 'high' | 'medium' | 'low',
    type: 'other' as 'emergency' | 'investment' | 'purchase' | 'education' | 'travel' | 'other'
  });

  const currentLang = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const filteredGoals = selectedCategory === 'all' 
    ? goals 
    : goals.filter(goal => goal.category === selectedCategory);

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category,
        priority: newGoal.priority,
        type: newGoal.type
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: '',
        description: '',
        targetAmount: '',
        deadline: '',
        category: 'short',
        priority: 'medium',
        type: 'other'
      });
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'investment': return '📈';
      case 'purchase': return '🛒';
      case 'education': return '🎓';
      case 'travel': return '✈️';
      default: return '🎯';
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
            <h1 className="text-2xl font-bold text-gray-800">🎯 {currentLang.title}</h1>
            <p className="text-gray-600">{currentLang.subtitle}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowLanguageSelector(!showLanguageSelector)}
            className="p-2"
          >
            <Globe className="w-4 h-4" />
          </Button>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Language Selector */}
        {showLanguageSelector && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-bold mb-3">🌐 Select Language</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "default" : "outline"}
                    onClick={() => {
                      setSelectedLanguage(lang.code);
                      setShowLanguageSelector(false);
                    }}
                    className="justify-start"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: currentLang.all },
            { id: 'short', label: currentLang.shortTerm },
            { id: 'long', label: currentLang.longTerm }
          ].map(({ id, label }) => (
            <Badge
              key={id}
              variant={selectedCategory === id ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap py-2 px-3 ${
                selectedCategory === id 
                  ? 'bg-purple-500 text-white hover:bg-purple-600' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(id)}
            >
              {label}
            </Badge>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{goals.length}</div>
              <div className="text-xs text-gray-500">Total Goals</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-green-600">
                {goals.filter(g => g.currentAmount >= g.targetAmount).length}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-3 text-center">
              <div className="text-xl font-bold text-blue-600">
                ₹{goals.reduce((sum, g) => sum + g.currentAmount, 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total Saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-4">{currentLang.addGoal}</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Goal Title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                
                <textarea
                  placeholder="Description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={2}
                />

                <input
                  type="number"
                  placeholder="Target Amount (₹)"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />

                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value as 'short' | 'long'})}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="short">{currentLang.shortTerm}</option>
                    <option value="long">{currentLang.longTerm}</option>
                  </select>

                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({...newGoal, priority: e.target.value as 'high' | 'medium' | 'low'})}
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="high">{currentLang.highPriority}</option>
                    <option value="medium">{currentLang.mediumPriority}</option>
                    <option value="low">{currentLang.lowPriority}</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddGoal} className="flex-1 bg-purple-500 hover:bg-purple-600">
                    {currentLang.addGoal}
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={goal.id} className={`border-0 shadow-card ${isCompleted ? 'bg-green-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(goal.type)}</span>
                      <div>
                        <h3 className="font-bold text-lg">{goal.title}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority === 'high' ? currentLang.highPriority : 
                             goal.priority === 'medium' ? currentLang.mediumPriority : 
                             currentLang.lowPriority}
                          </Badge>
                          <Badge variant="outline">
                            {goal.category === 'short' ? currentLang.shortTerm : currentLang.longTerm}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {isCompleted && <Star className="w-6 h-6 text-yellow-500" />}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{currentLang.progress}: {Math.round(progress)}%</span>
                      <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-600 font-semibold">
                        ₹{goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-gray-500">
                        ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      {currentLang.remaining}: ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </p>
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

export default GoalTracking;
