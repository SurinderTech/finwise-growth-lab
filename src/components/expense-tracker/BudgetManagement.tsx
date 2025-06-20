
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Target, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Budget {
  id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  spent: number;
  percentage: number;
}

export const BudgetManagement: React.FC = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  const categories = [
    'Food & Dining',
    'Transport',
    'Entertainment',
    'Shopping',
    'Bills & Utilities',
    'Health & Medical',
    'Education',
    'Travel',
    'Groceries',
    'Other'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchBudgets = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      // Fetch budgets for current month
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', currentMonth)
        .eq('year', currentYear);

      if (budgetsError) throw budgetsError;

      // Fetch expenses for current month to calculate spent amounts
      const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user.id)
        .gte('date', firstDayOfMonth);

      if (expensesError) throw expensesError;

      // Group expenses by category
      const expensesByCategory: { [key: string]: number } = {};
      expensesData?.forEach(expense => {
        expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
      });

      // Combine budgets with spent amounts
      const budgetsWithSpent = budgetsData?.map(budget => {
        const spent = expensesByCategory[budget.category] || 0;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
        return {
          ...budget,
          spent,
          percentage: Math.min(percentage, 100)
        };
      }) || [];

      setBudgets(budgetsWithSpent);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [user]);

  const saveBudget = async () => {
    if (!user || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const budgetData = {
        user_id: user.id,
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: formData.month,
        year: formData.year
      };

      if (editingBudget) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update(budgetData)
          .eq('id', editingBudget.id);

        if (error) throw error;
        toast.success('Budget updated successfully!');
      } else {
        // Create new budget
        const { error } = await supabase
          .from('budgets')
          .insert(budgetData);

        if (error) throw error;
        toast.success('Budget created successfully!');
      }

      setFormData({
        category: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      setShowAddForm(false);
      setEditingBudget(null);
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Failed to save budget');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Budget deleted successfully!');
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const editBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      month: budget.month,
      year: budget.year
    });
    setShowAddForm(true);
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <Button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingBudget(null);
            setFormData({
              category: '',
              amount: '',
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear()
            });
          }}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount (₹) *</Label>
                <Input
                  type="number"
                  placeholder="Enter budget amount"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Month</Label>
                <Select 
                  value={formData.month.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, month: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveBudget}>
                {editingBudget ? 'Update Budget' : 'Add Budget'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading budgets...</div>
        ) : budgets.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No budgets set for this month</p>
              <Button onClick={() => setShowAddForm(true)}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Budget
              </Button>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => (
            <Card key={budget.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(budget.percentage)}
                    <h3 className="font-semibold text-lg">{budget.category}</h3>
                    <Badge variant={budget.percentage >= 80 ? 'destructive' : 'secondary'}>
                      {budget.percentage.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editBudget(budget)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBudget(budget.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Progress 
                    value={budget.percentage} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-sm">
                    <span>Spent: ₹{budget.spent.toLocaleString()}</span>
                    <span>Budget: ₹{budget.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Remaining: ₹{Math.max(0, budget.amount - budget.spent).toLocaleString()}</span>
                    <span>{months[budget.month - 1]} {budget.year}</span>
                  </div>
                </div>

                {budget.percentage >= 100 && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    ⚠️ Budget exceeded by ₹{(budget.spent - budget.amount).toLocaleString()}
                  </div>
                )}
                {budget.percentage >= 80 && budget.percentage < 100 && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
                    ⚠️ Approaching budget limit ({budget.percentage.toFixed(0)}% used)
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
