
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import ExpenseTracker from '@/pages/ExpenseTracker';
import Learn from '@/pages/Learn';
import Tools from '@/pages/Tools';
import Quests from '@/pages/Quests';
import Profile from '@/pages/Profile';
import Auth from '@/pages/Auth';
import UserOnboarding from '@/pages/UserOnboarding';
import { Toaster } from '@/components/ui/toaster';
import { NotificationSystem } from '@/components/NotificationSystem';
import { BottomNavigation } from '@/components/BottomNavigation';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/quests" element={<Quests />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/expense-tracker" element={<ExpenseTracker />} />
              <Route path="/onboarding" element={<UserOnboarding />} />
            </Routes>
            <BottomNavigation />
            <NotificationSystem />
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
