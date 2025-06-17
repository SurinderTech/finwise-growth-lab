
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Tools from "./pages/Tools";
import Quests from "./pages/Quests";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ExpenseTracker from "./pages/ExpenseTracker";
import SavingGoals from "./pages/SavingGoals";
import InvestmentLab from "./pages/InvestmentLab";
import Leaderboard from "./pages/Leaderboard";
import Gamify from "./pages/Gamify";
import FinancialCalculators from "./pages/FinancialCalculators";
import GoalTracking from "./pages/GoalTracking";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/expense-tracker" element={<ExpenseTracker />} />
            <Route path="/saving-goals" element={<SavingGoals />} />
            <Route path="/investment-lab" element={<InvestmentLab />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/gamify" element={<Gamify />} />
            <Route path="/financial-calculators" element={<FinancialCalculators />} />
            <Route path="/goal-tracking" element={<GoalTracking />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNavigation />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
