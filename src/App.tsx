
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import ExpenseTracker from '@/pages/ExpenseTracker';
import { Toaster } from '@/components/ui/toaster';
import { NotificationSystem } from '@/components/NotificationSystem';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/expense-tracker" element={<ExpenseTracker />} />
            </Routes>
            <NotificationSystem />
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
