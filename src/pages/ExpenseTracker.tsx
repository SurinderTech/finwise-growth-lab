
import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  type: 'expense' | 'income';
}

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Food', amount: 450, description: 'Lunch at restaurant', date: '2024-12-17', type: 'expense' },
    { id: '2', category: 'Transport', amount: 120, description: 'Auto fare', date: '2024-12-17', type: 'expense' },
    { id: '3', category: 'Salary', amount: 50000, description: 'Monthly salary', date: '2024-12-15', type: 'income' },
    { id: '4', category: 'Groceries', amount: 1200, description: 'Weekly shopping', date: '2024-12-16', type: 'expense' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
    type: 'expense' as 'expense' | 'income'
  });

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
  const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;

  const handleAddExpense = () => {
    if (newExpense.category && newExpense.amount && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        date: new Date().toISOString().split('T')[0],
        type: newExpense.type
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({ category: '', amount: '', description: '', type: 'expense' });
      setShowAddForm(false);
    }
  };

  const categories = ['Food', 'Transport', 'Groceries', 'Entertainment', 'Bills', 'Healthcare', 'Shopping', 'Salary', 'Freelance', 'Other'];

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
            <h1 className="text-2xl font-bold text-gray-800">💳 Expense Tracker</h1>
            <p className="text-gray-600">Track your income and expenses</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-card bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Income</span>
              </div>
              <p className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Balance */}
        <Card className={`border-0 shadow-card ${balance >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Balance</h3>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{Math.abs(balance).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {balance >= 0 ? 'You\'re doing great!' : 'Consider reducing expenses'}
            </p>
          </CardContent>
        </Card>

        {/* Add Form */}
        {showAddForm && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-4">Add Transaction</h3>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={newExpense.type === 'income' ? 'default' : 'outline'}
                    onClick={() => setNewExpense({...newExpense, type: 'income'})}
                    className="flex-1"
                  >
                    Income
                  </Button>
                  <Button
                    variant={newExpense.type === 'expense' ? 'default' : 'outline'}
                    onClick={() => setNewExpense({...newExpense, type: 'expense'})}
                    className="flex-1"
                  >
                    Expense
                  </Button>
                </div>

                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                />

                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                />

                <div className="flex gap-2">
                  <Button onClick={handleAddExpense} className="flex-1 bg-green-500 hover:bg-green-600">
                    Add Transaction
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions List */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800">Recent Transactions</h3>
          {expenses.map((expense) => (
            <Card key={expense.id} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={expense.type === 'income' ? 'default' : 'secondary'}>
                        {expense.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{expense.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{expense.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      expense.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {expense.type === 'income' ? '+' : '-'}₹{expense.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
