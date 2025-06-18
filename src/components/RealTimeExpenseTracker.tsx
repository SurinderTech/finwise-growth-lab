
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, TrendingDown, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from './NotificationSystem';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  user_id: string;
}

interface Budget {
  category: string;
  limit: number;
  spent: number;
  percentage: number;
}

export const RealTimeExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const { sendNotification } = useNotifications();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([
    { category: 'Food', limit: 15000, spent: 0, percentage: 0 },
    { category: 'Transport', limit: 5000, spent: 0, percentage: 0 },
    { category: 'Entertainment', limit: 8000, spent: 0, percentage: 0 },
    { category: 'Shopping', limit: 10000, spent: 0, percentage: 0 },
    { category: 'Bills', limit: 12000, spent: 0, percentage: 0 },
  ]);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const [totalBudget, setTotalBudget] = useState(50000);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchExpenses();
    setupRealTimeSubscription();
  }, [user]);

  useEffect(() => {
    updateBudgets();
  }, [expenses]);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const setupRealTimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'expenses',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newExpense = payload.new as Expense;
          setExpenses(prev => [newExpense, ...prev]);
          toast.success('New expense added!', {
            description: `₹${newExpense.amount} for ${newExpense.category}`,
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const updateBudgets = () => {
    const updatedBudgets = budgets.map(budget => {
      const spent = expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      const percentage = (spent / budget.limit) * 100;
      
      return {
        ...budget,
        spent,
        percentage: Math.min(percentage, 100)
      };
    });

    setBudgets(updatedBudgets);
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalSpent(total);

    // Check for budget alerts
    updatedBudgets.forEach(budget => {
      if (budget.percentage >= 80 && budget.percentage < 100) {
        sendNotification(
          'Budget Alert!',
          `You've used ${budget.percentage.toFixed(0)}% of your ${budget.category} budget`,
          'expense'
        );
      } else if (budget.percentage >= 100) {
        sendNotification(
          'Budget Exceeded!',
          `You've exceeded your ${budget.category} budget by ₹${(budget.spent - budget.limit).toFixed(0)}`,
          'expense'
        );
      }
    });

    // Overall budget check
    const overallPercentage = (total / totalBudget) * 100;
    if (overallPercentage >= 90) {
      sendNotification(
        'Monthly Budget Alert!',
        `You've used ${overallPercentage.toFixed(0)}% of your monthly budget`,
        'expense'
      );
    }
  };

  const addExpense = async () => {
    if (!user || !newExpense.amount || !newExpense.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          amount: parseFloat(newExpense.amount),
          category: newExpense.category,
          description: newExpense.description,
          date: new Date().toISOString().split('T')[0],
          user_id: user.id
        });

      if (error) throw error;

      setNewExpense({ amount: '', category: '', description: '' });
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const getBudgetColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAlertIcon = (percentage: number) => {
    if (percentage >= 100) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (percentage >= 80) return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    return <Target className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Overall Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Monthly Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Spent</span>
              <span className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Budget Limit</span>
              <span className="text-lg">₹{totalBudget.toLocaleString()}</span>
            </div>
            <Progress 
              value={(totalSpent / totalBudget) * 100} 
              className="w-full h-3"
            />
            <div className="flex justify-between text-sm">
              <span>Remaining: ₹{(totalBudget - totalSpent).toLocaleString()}</span>
              <span>{((totalSpent / totalBudget) * 100).toFixed(1)}% used</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="add" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="budgets">Budget Tracking</TabsTrigger>
          <TabsTrigger value="history">Recent Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Add New Expense
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newExpense.category} 
                    onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food & Dining</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Bills">Bills & Utilities</SelectItem>
                      <SelectItem value="Health">Health & Medical</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  placeholder="What was this expense for?"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button onClick={addExpense} className="w-full">
                Add Expense
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4">
            {budgets.map((budget) => (
              <Card key={budget.category}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getAlertIcon(budget.percentage)}
                      <span className="font-medium">{budget.category}</span>
                    </div>
                    <Badge variant={budget.percentage >= 80 ? 'destructive' : 'secondary'}>
                      {budget.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={budget.percentage} 
                    className="mb-2 h-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                    <span>Limit: ₹{budget.limit.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expenses.slice(0, 10).map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{expense.category}</div>
                      <div className="text-sm text-gray-600">{expense.description || 'No description'}</div>
                      <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">-₹{expense.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No expenses recorded yet. Add your first expense above!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
