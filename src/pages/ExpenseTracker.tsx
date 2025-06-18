
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RealTimeExpenseTracker } from '@/components/RealTimeExpenseTracker';

const ExpenseTracker = () => {
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-bold text-gray-800">💳 Real-Time Expense Tracker</h1>
            <p className="text-gray-600">Track and manage your expenses in real-time</p>
          </div>
        </div>

        <RealTimeExpenseTracker />
      </div>
    </div>
  );
};

export default ExpenseTracker;
