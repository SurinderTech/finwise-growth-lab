
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, DollarSign, Target } from 'lucide-react';
import { toast } from 'sonner';

interface SIP {
  id: string;
  fund_name: string;
  monthly_amount: number;
  start_date: string;
  end_date: string;
  current_value: number;
  invested_amount: number;
  returns: number;
  status: 'active' | 'paused' | 'completed';
  risk_level: 'low' | 'medium' | 'high';
}

interface MutualFund {
  id: string;
  fund_name: string;
  fund_type: string;
  current_nav: number;
  returns_1y: number;
  returns_3y: number;
  risk_level: 'low' | 'medium' | 'high';
  min_investment: number;
  expense_ratio: number;
}

export const SIPManager = () => {
  const { user } = useAuth();
  const [sips, setSips] = useState<SIP[]>([]);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>([]);
  const [showCreateSIP, setShowCreateSIP] = useState(false);
  const [newSIP, setNewSIP] = useState({
    fund_id: '',
    monthly_amount: '',
    duration_months: '12'
  });
  const [totalInvested, setTotalInvested] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    fetchSIPs();
    fetchMutualFunds();
    setupRealtimeUpdates();
  }, []);

  const fetchSIPs = async () => {
    try {
      // Mock SIP data - in real app, this would come from database
      const mockSIPs: SIP[] = [
        {
          id: '1',
          fund_name: 'HDFC Top 100 Fund',
          monthly_amount: 5000,
          start_date: '2024-01-01',
          end_date: '2026-01-01',
          current_value: 65000,
          invested_amount: 60000,
          returns: 8.33,
          status: 'active',
          risk_level: 'medium'
        },
        {
          id: '2',
          fund_name: 'SBI Small Cap Fund',
          monthly_amount: 3000,
          start_date: '2024-06-01',
          end_date: '2027-06-01',
          current_value: 22000,
          invested_amount: 21000,
          returns: 4.76,
          status: 'active',
          risk_level: 'high'
        }
      ];
      
      setSips(mockSIPs);
      
      const invested = mockSIPs.reduce((sum, sip) => sum + sip.invested_amount, 0);
      const value = mockSIPs.reduce((sum, sip) => sum + sip.current_value, 0);
      setTotalInvested(invested);
      setTotalValue(value);
    } catch (error: any) {
      console.error('Error fetching SIPs:', error);
      toast.error('Error loading SIP data');
    }
  };

  const fetchMutualFunds = async () => {
    try {
      // Mock mutual fund data
      const mockFunds: MutualFund[] = [
        {
          id: '1',
          fund_name: 'HDFC Top 100 Fund',
          fund_type: 'Large Cap',
          current_nav: 742.50,
          returns_1y: 12.5,
          returns_3y: 15.2,
          risk_level: 'medium',
          min_investment: 1000,
          expense_ratio: 1.2
        },
        {
          id: '2',
          fund_name: 'SBI Small Cap Fund',
          fund_type: 'Small Cap',
          current_nav: 156.80,
          returns_1y: 25.4,
          returns_3y: 18.7,
          risk_level: 'high',
          min_investment: 1000,
          expense_ratio: 1.8
        },
        {
          id: '3',
          fund_name: 'ICICI Prudential Debt Fund',
          fund_type: 'Debt',
          current_nav: 42.30,
          returns_1y: 6.8,
          returns_3y: 7.2,
          risk_level: 'low',
          min_investment: 1000,
          expense_ratio: 0.8
        }
      ];
      
      setMutualFunds(mockFunds);
    } catch (error: any) {
      console.error('Error fetching mutual funds:', error);
      toast.error('Error loading mutual fund data');
    }
  };

  const setupRealtimeUpdates = () => {
    // Simulate real-time NAV updates
    const interval = setInterval(() => {
      setMutualFunds(prev => prev.map(fund => ({
        ...fund,
        current_nav: fund.current_nav * (1 + (Math.random() - 0.5) * 0.02) // ±1% random change
      })));
      
      // Update SIP values based on NAV changes
      setSips(prev => prev.map(sip => ({
        ...sip,
        current_value: sip.current_value * (1 + (Math.random() - 0.5) * 0.01) // ±0.5% random change
      })));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  };

  const createSIP = async () => {
    if (!newSIP.fund_id || !newSIP.monthly_amount) {
      toast.error('Please fill all required fields');
      return;
    }

    const selectedFund = mutualFunds.find(f => f.id === newSIP.fund_id);
    if (!selectedFund) return;

    const sipData: SIP = {
      id: Date.now().toString(),
      fund_name: selectedFund.fund_name,
      monthly_amount: parseFloat(newSIP.monthly_amount),
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + parseInt(newSIP.duration_months) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      current_value: 0,
      invested_amount: 0,
      returns: 0,
      status: 'active',
      risk_level: selectedFund.risk_level
    };

    setSips(prev => [...prev, sipData]);
    setNewSIP({ fund_id: '', monthly_amount: '', duration_months: '12' });
    setShowCreateSIP(false);
    toast.success('SIP created successfully!');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalReturns = totalValue - totalInvested;
  const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invested</p>
                <p className="text-2xl font-bold">₹{totalInvested.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Returns</p>
                <p className={`text-2xl font-bold ${totalReturns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{totalReturns.toLocaleString()}
                </p>
              </div>
              {totalReturns >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-500" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returns %</p>
                <p className={`text-2xl font-bold ${returnsPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {returnsPercentage.toFixed(2)}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active SIPs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active SIPs</CardTitle>
          <Button onClick={() => setShowCreateSIP(true)}>Start New SIP</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sips.map(sip => (
              <div key={sip.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{sip.fund_name}</h4>
                  <Badge className={getRiskColor(sip.risk_level)}>
                    {sip.risk_level} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Monthly Amount</p>
                    <p className="font-semibold">₹{sip.monthly_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Invested</p>
                    <p className="font-semibold">₹{sip.invested_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Value</p>
                    <p className="font-semibold">₹{sip.current_value.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Returns</p>
                    <p className={`font-semibold ${sip.returns >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {sip.returns.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Mutual Funds */}
      <Card>
        <CardHeader>
          <CardTitle>Available Mutual Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mutualFunds.map(fund => (
              <div key={fund.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold">{fund.fund_name}</h4>
                    <p className="text-sm text-gray-600">{fund.fund_type}</p>
                  </div>
                  <Badge className={getRiskColor(fund.risk_level)}>
                    {fund.risk_level} risk
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">NAV</p>
                    <p className="font-semibold">₹{fund.current_nav.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">1Y Returns</p>
                    <p className="font-semibold text-green-600">{fund.returns_1y}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">3Y Returns</p>
                    <p className="font-semibold text-green-600">{fund.returns_3y}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Min Investment</p>
                    <p className="font-semibold">₹{fund.min_investment}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Expense Ratio</p>
                    <p className="font-semibold">{fund.expense_ratio}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create SIP Modal */}
      {showCreateSIP && (
        <Card className="fixed inset-0 z-50 m-4 max-w-md mx-auto mt-20 h-fit">
          <CardHeader>
            <CardTitle>Start New SIP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Select Mutual Fund</Label>
              <Select value={newSIP.fund_id} onValueChange={(value) => setNewSIP({...newSIP, fund_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a fund" />
                </SelectTrigger>
                <SelectContent>
                  {mutualFunds.map(fund => (
                    <SelectItem key={fund.id} value={fund.id}>
                      {fund.fund_name} - {fund.fund_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Monthly Amount (₹)</Label>
              <Input
                type="number"
                value={newSIP.monthly_amount}
                onChange={(e) => setNewSIP({...newSIP, monthly_amount: e.target.value})}
                placeholder="5000"
                min="1000"
              />
            </div>
            
            <div>
              <Label>Duration (Months)</Label>
              <Select value={newSIP.duration_months} onValueChange={(value) => setNewSIP({...newSIP, duration_months: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                  <SelectItem value="60">60 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={createSIP} className="flex-1">Create SIP</Button>
              <Button variant="outline" onClick={() => setShowCreateSIP(false)} className="flex-1">Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
