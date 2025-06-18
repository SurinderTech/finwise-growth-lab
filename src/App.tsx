
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { BottomNavigation } from "@/components/BottomNavigation";
import { NotificationSystem } from "@/components/NotificationSystem";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Tools from "./pages/Tools";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ExpenseTracker from "./pages/ExpenseTracker";
import SavingGoals from "./pages/SavingGoals";
import InvestmentLab from "./pages/InvestmentLab";
import Leaderboard from "./pages/Leaderboard";
import Gamify from "./pages/Gamify";
import FinancialCalculators from "./pages/FinancialCalculators";
import GoalTracking from "./pages/GoalTracking";
import UserOnboarding from "./pages/UserOnboarding";
import FraudDetection from "./pages/FraudDetection";
import SIPMutualFunds from "./pages/SIPMutualFunds";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <NotificationSystem />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <UserOnboarding />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/learn" element={
                <ProtectedRoute>
                  <Learn />
                </ProtectedRoute>
              } />
              <Route path="/tools" element={
                <ProtectedRoute>
                  <Tools />
                </ProtectedRoute>
              } />
              <Route path="/quests" element={
                <ProtectedRoute>
                  <Quests />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/expense-tracker" element={
                <ProtectedRoute>
                  <ExpenseTracker />
                </ProtectedRoute>
              } />
              <Route path="/saving-goals" element={
                <ProtectedRoute>
                  <SavingGoals />
                </ProtectedRoute>
              } />
              <Route path="/investment-lab" element={
                <ProtectedRoute>
                  <InvestmentLab />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/gamify" element={
                <ProtectedRoute>
                  <Gamify />
                </ProtectedRoute>
              } />
              <Route path="/financial-calculators" element={
                <ProtectedRoute>
                  <FinancialCalculators />
                </ProtectedRoute>
              } />
              <Route path="/goal-tracking" element={
                <ProtectedRoute>
                  <GoalTracking />
                </ProtectedRoute>
              } />
              <Route path="/fraud-detection" element={
                <ProtectedRoute>
                  <FraudDetection />
                </ProtectedRoute>
              } />
              <Route path="/sip-mutual-funds" element={
                <ProtectedRoute>
                  <SIPMutualFunds />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNavigation />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
