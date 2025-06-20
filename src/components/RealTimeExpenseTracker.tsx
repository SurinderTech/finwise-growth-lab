
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddExpenseForm } from './expense-tracker/AddExpenseForm';
import { ExpenseHistory } from './expense-tracker/ExpenseHistory';
import { AnalyticsDashboard } from './expense-tracker/AnalyticsDashboard';
import { BudgetManagement } from './expense-tracker/BudgetManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from './NotificationSystem';
import { supabase } from '@/integrations/supabase/client';

export const RealTimeExpenseTracker: React.FC = () => {
  const { user } = useAuth();
  const { sendNotification } = useNotifications();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for new expenses
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
        async (payload) => {
          const newExpense = payload.new as any;
          console.log('New expense added:', newExpense);

          // Check for budget alerts
          await checkBudgetAlerts(newExpense);
          
          // Trigger refresh for other components
          setRefreshTrigger(prev => prev + 1);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const checkBudgetAlerts = async (expense: any) => {
    if (!user) return;

    try {
      const currentDate = new Date(expense.date);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      // Get budget for this category and month
      const { data: budgets } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('category', expense.category)
        .eq('month', month)
        .eq('year', year);

      if (!budgets || budgets.length === 0) return;

      const budget = budgets[0];

      // Get total expenses for this category and month
      const firstDayOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', expense.category)
        .gte('date', firstDayOfMonth);

      const totalSpent = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      const percentage = (totalSpent / budget.amount) * 100;

      // Send notifications based on percentage
      if (percentage >= 100) {
        sendNotification(
          'Budget Exceeded!',
          `You've exceeded your ${expense.category} budget by ₹${(totalSpent - budget.amount).toFixed(0)}`,
          'budget'
        );
      } else if (percentage >= 80) {
        sendNotification(
          'Budget Alert!',
          `You've used ${percentage.toFixed(0)}% of your ${expense.category} budget`,
          'budget'
        );
      }
    } catch (error) {
      console.error('Error checking budget alerts:', error);
    }
  };

  const handleExpenseAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="add" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-4">
          <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <ExpenseHistory refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <BudgetManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
