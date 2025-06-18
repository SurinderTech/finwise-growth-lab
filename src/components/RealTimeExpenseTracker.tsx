
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from './NotificationSystem';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  user_id: string;
  created_at: string;
}

export const RealTimeExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const { sendNotification } = useNotifications();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: ''
  });
  const [monthlyBudget] = useState(50000); // User's monthly budget

  useEffect(() => {
    if (!user) return;

    // Set up real-time expense tracking
    const channel = supabase
      .channel('expenses')
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
          
          // Check for budget alerts
          checkBudgetAlerts([newExpense, ...expenses]);
        }
      )
      .subscribe();

    // Load existing expenses
    fetchExpenses();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchExpenses = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const checkBudgetAlerts = (currentExpenses: Expense[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = currentExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetUsed = (totalSpent / monthlyBudget) * 100;

    if (budgetUsed >= 90) {
      sendNotification(
        '🚨 Budget Alert!',
        `You've used ${budgetUsed.toFixed(1)}% of your monthly budget!`,
        'expense'
      );
    } else if (budgetUsed >= 75) {
      sendNotification(
        '⚠️ Budget Warning',
        `You've used ${budgetUsed.toFixed(1)}% of your monthly budget`,
        'expense'
      );
    }
  };

  const addExpense = async () => {
    if (!user || !newExpense.category || !newExpense.amount || !newExpense.description) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          category: newExpense.category,
          amount: parseFloat(newExpense.amount),
          description: newExpense.description,
          date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      setNewExpense({ category: '', amount: '', description: '' });
      setShowAddForm(false);
      toast.success('Expense added successfully!');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Other'];
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Monthly Budget</h3>
            <Button onClick={() => setShowAddForm(true)} className="bg-green-500 hover:bg-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₹{monthlyBudget.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Spent</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${budgetUsed >= 90 ? 'text-red-600' : budgetUsed >= 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                {budgetUsed.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Used</div>
            </div>
          </div>

          {budgetUsed >= 75 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">
                {budgetUsed >= 90 ? 'Budget limit exceeded!' : 'Approaching budget limit'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Expense Form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
            <div className="space-y-4">
              <Select value={newExpense.category} onValueChange={(value) => setNewExpense({...newExpense, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              />

              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              />

              <div className="flex gap-2">
                <Button onClick={addExpense} className="flex-1">Add Expense</Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Expenses */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Recent Expenses</h3>
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{expense.category}</Badge>
                    <span className="text-xs text-gray-500">{expense.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{expense.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">₹{expense.amount.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
