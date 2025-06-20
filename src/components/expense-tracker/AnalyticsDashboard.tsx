
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface MonthlyData {
  month: string;
  expenses: number;
  budget: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState(0);
  const [loading, setLoading] = useState(false);

  const categoryColors = {
    'Food & Dining': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Entertainment': '#45B7D1',
    'Shopping': '#FFA07A',
    'Bills & Utilities': '#98D8C8',
    'Health & Medical': '#F7DC6F',
    'Education': '#BB8FCE',
    'Travel': '#85C1E9',
    'Groceries': '#82E0AA',
    'Other': '#D2B4DE'
  };

  const fetchAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch current month expenses
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;
      const firstDayOfMonth = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      
      // Category-wise expenses for current month
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('category, amount')
        .eq('user_id', user.id)
        .gte('date', firstDayOfMonth);

      if (expensesError) throw expensesError;

      // Group by category
      const categoryTotals: { [key: string]: number } = {};
      let monthTotal = 0;

      expensesData?.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        monthTotal += expense.amount;
      });

      const categoryChartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name as keyof typeof categoryColors] || '#CCCCCC'
      }));

      setCategoryData(categoryChartData);
      setCurrentMonthExpenses(monthTotal);

      // Fetch last 6 months data
      const monthsData: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentYear, currentMonth - 1 - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
        const firstDay = `${monthStr}-01`;
        const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

        // Get expenses for this month
        const { data: monthExpenses } = await supabase
          .from('expenses')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', firstDay)
          .lte('date', lastDay);

        const monthTotal = monthExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

        // Get total budget for this month
        const { data: budgets } = await supabase
          .from('budgets')
          .select('amount')
          .eq('user_id', user.id)
          .eq('year', year)
          .eq('month', month);

        const totalBudget = budgets?.reduce((sum, budget) => sum + budget.amount, 0) || 0;

        monthsData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          expenses: monthTotal,
          budget: totalBudget
        });
      }

      setMonthlyData(monthsData);

      // Total expenses for current year
      const { data: yearExpenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', `${currentYear}-01-01`);

      const yearTotal = yearExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
      setTotalExpenses(yearTotal);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-8">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">₹{currentMonthExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Year</p>
                <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg/Month</p>
                <p className="text-2xl font-bold">₹{Math.round(totalExpenses / 12).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No expense data for this month
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#FF6B6B" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="budget" 
                    stroke="#4ECDC4" 
                    strokeWidth={2}
                    name="Budget"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No data available for trend analysis
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Expenses Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Expenses (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="budget" fill="#4ECDC4" name="Budget" />
                <Bar dataKey="expenses" fill="#FF6B6B" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No data available for comparison
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
