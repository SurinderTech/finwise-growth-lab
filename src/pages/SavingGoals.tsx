
import { useState } from 'react';
import { ArrowLeft, Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const SavingGoals = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 45200,
      deadline: '2024-06-30',
      category: 'Emergency'
    },
    {
      id: '2',
      title: 'New Laptop',
      targetAmount: 80000,
      currentAmount: 25000,
      deadline: '2024-04-15',
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Vacation Trip',
      targetAmount: 50000,
      currentAmount: 12000,
      deadline: '2024-08-01',
      category: 'Travel'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: 'Other'
  });

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: 0,
        deadline: newGoal.deadline,
        category: newGoal.category
      };
      setGoals([...goals, goal]);
      setNewGoal({ title: '', targetAmount: '', deadline: '', category: 'Other' });
      setShowAddForm(false);
    }
  };

  const handleAddMoney = (goalId: string) => {
    if (addAmount) {
      setGoals(goals.map(goal => 
        goal.id === goalId 
          ? { ...goal, currentAmount: Math.min(goal.currentAmount + parseFloat(addAmount), goal.targetAmount) }
          : goal
      ));
      setAddAmount('');
      setSelectedGoal(null);
    }
  };

  const categories = ['Emergency', 'Technology', 'Travel', 'Education', 'Health', 'Investment', 'Other'];

  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length;

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
            <h1 className="text-2xl font-bold text-gray-800">🎯 Saving Goals</h1>
            <p className="text-gray-600">Track your financial goals</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary */}
        <Card className="border-0 shadow-card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Goals Progress</h3>
                <p className="text-2xl font-bold">{completedGoals}/{totalGoals}</p>
                <p className="text-sm opacity-90">Goals Completed</p>
              </div>
              <Target className="w-12 h-12 opacity-80" />
            </div>
          </CardContent>
        </Card>

        {/* Add Goal Form */}
        {showAddForm && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-4">Create New Goal</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Goal Title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
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

                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <Button onClick={handleAddGoal} className="flex-1 bg-purple-500 hover:bg-purple-600">
                    Create Goal
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
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            
            return (
              <Card key={goal.id} className={`border-0 shadow-card ${isCompleted ? 'bg-green-50' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {goal.title}
                        {isCompleted && <span className="text-green-500">✅</span>}
                      </h3>
                      <p className="text-sm text-gray-600">{goal.category}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {goal.deadline}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-purple-600">
                        ₹{goal.currentAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        of ₹{goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>{Math.round(progress)}% Complete</span>
                      <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} left</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {selectedGoal === goal.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Amount to add"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-purple-500"
                      />
                      <Button onClick={() => handleAddMoney(goal.id)} size="sm" className="bg-purple-500 hover:bg-purple-600">
                        Add
                      </Button>
                      <Button onClick={() => setSelectedGoal(null)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => setSelectedGoal(goal.id)}
                      disabled={isCompleted}
                      className="w-full"
                      variant={isCompleted ? "secondary" : "default"}
                    >
                      {isCompleted ? 'Goal Completed! 🎉' : 'Add Money'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavingGoals;
