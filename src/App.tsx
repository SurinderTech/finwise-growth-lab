import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import Onboarding from '@/pages/Onboarding';
import ExpenseTracker from '@/pages/ExpenseTracker';
import FraudTraining from '@/pages/FraudTraining';
import InvestmentSimulator from '@/pages/InvestmentSimulator';
import LearningModules from '@/pages/LearningModules';
import ModuleDetail from '@/pages/ModuleDetail';
import QuizPage from '@/pages/QuizPage';
import { QueryClient } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { NotificationSystem } from '@/components/NotificationSystem';

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClient>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/expense-tracker" element={<ExpenseTracker />} />
              <Route path="/fraud-training" element={<FraudTraining />} />
              <Route path="/investment-simulator" element={<InvestmentSimulator />} />
              <Route path="/learning" element={<LearningModules />} />
              <Route path="/module/:moduleId" element={<ModuleDetail />} />
              <Route path="/quiz/:quizId" element={<QuizPage />} />
            </Routes>
            <NotificationSystem />
          </div>
          <Toaster />
        </QueryClient>
      </AuthProvider>
    </Router>
  );
}

export default App;
