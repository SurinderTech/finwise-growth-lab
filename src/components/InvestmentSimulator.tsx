
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { toast } from 'sonner';

// Mock stock data - in real app, you'd use a real API
const MOCK_STOCKS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.75, change: 1.2 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3678.90, change: -0.8 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1587.25, change: 2.1 },
  { symbol: 'INFY', name: 'Infosys', price: 1453.80, change: 0.5 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 945.60, change: 1.8 },
  { symbol: 'ITC', name: 'ITC Limited', price: 267.35, change: -1.2 }
];

export const InvestmentSimulator = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
    fetchInvestments();
    
    // Simulate real-time price updates
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          price: stock.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% random change
          change: (Math.random() - 0.5) * 4 // Random change between -2% and +2%
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPortfolio(data);
      }
    } catch (error: any) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      if (error) throw error;
      
      setInvestments(data || []);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching investments:', error);
      setLoading(false);
    }
  };

  const buyStock = async () => {
    if (!selectedStock || !quantity || !portfolio) return;

    const qty = parseInt(quantity);
    const totalCost = selectedStock.price * qty;

    if (totalCost > portfolio.virtual_balance) {
      toast.error('Insufficient balance!');
      return;
    }

    try {
      // Create investment
      const { data: investment, error: investError } = await supabase
        .from('investments')
        .insert({
          user_id: user?.id,
          portfolio_id: portfolio.id,
          stock_symbol: selectedStock.symbol,
          stock_name: selectedStock.name,
          quantity: qty,
          buy_price: selectedStock.price,
          current_price: selectedStock.price,
          total_amount: totalCost,
          status: 'active'
        })
        .select()
        .single();

      if (investError) throw investError;

      // Create transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          portfolio_id: portfolio.id,
          investment_id: investment.id,
          transaction_type: 'buy',
          stock_symbol: selectedStock.symbol,
          quantity: qty,
          price: selectedStock.price,
          total_amount: totalCost,
          fees: totalCost * 0.001 // 0.1% fees
        });

      // Update portfolio
      await supabase
        .from('portfolios')
        .update({
          virtual_balance: portfolio.virtual_balance - totalCost,
          total_invested: portfolio.total_invested + totalCost
        })
        .eq('id', portfolio.id);

      // Update user XP
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('total_xp')
        .eq('user_id', user?.id)
        .single();

      if (userStats) {
        await supabase
          .from('user_stats')
          .update({
            total_xp: userStats.total_xp + 50,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user?.id);
      }

      toast.success(`Successfully bought ${qty} shares of ${selectedStock.symbol}! +50 XP`);
      
      setSelectedStock(null);
      setQuantity('');
      fetchPortfolio();
      fetchInvestments();
    } catch (error: any) {
      console.error('Error buying stock:', error);
      toast.error('Error placing order');
    }
  };

  const sellStock = async (investment: any) => {
    try {
      const currentStock = stocks.find(s => s.symbol === investment.stock_symbol);
      const currentPrice = currentStock?.price || investment.current_price;
      const totalValue = currentPrice * investment.quantity;
      const profit = totalValue - investment.total_amount;

      // Update investment status
      await supabase
        .from('investments')
        .update({
          status: 'completed',
          current_price: currentPrice,
          sold_at: new Date().toISOString()
        })
        .eq('id', investment.id);

      // Create sell transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          portfolio_id: portfolio.id,
          investment_id: investment.id,
          transaction_type: 'sell',
          stock_symbol: investment.stock_symbol,
          quantity: investment.quantity,
          price: currentPrice,
          total_amount: totalValue,
          fees: totalValue * 0.001
        });

      // Update portfolio
      await supabase
        .from('portfolios')
        .update({
          virtual_balance: portfolio.virtual_balance + totalValue,
          total_profit_loss: portfolio.total_profit_loss + profit
        })
        .eq('id', portfolio.id);

      // Update user XP
      const xpGain = profit > 0 ? 100 : 25;
      const { data: userStats } = await supabase
        .from('user_stats')
        .select('total_xp')
        .eq('user_id', user?.id)
        .single();

      if (userStats) {
        await supabase
          .from('user_stats')
          .update({
            total_xp: userStats.total_xp + xpGain,
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .eq('user_id', user?.id);
      }

      toast.success(`Sold ${investment.quantity} shares of ${investment.stock_symbol}! +${xpGain} XP`);
      
      fetchPortfolio();
      fetchInvestments();
    } catch (error: any) {
      console.error('Error selling stock:', error);
      toast.error('Error selling stock');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ₹{portfolio?.virtual_balance?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Available Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                ₹{portfolio?.total_invested?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Total Invested</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${portfolio?.total_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{portfolio?.total_profit_loss?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600">Total P&L</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Stock Market */}
        <Card>
          <CardHeader>
            <CardTitle>Live Stock Prices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedStock?.symbol === stock.symbol
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedStock(stock)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold">{stock.symbol}</div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{stock.price.toFixed(2)}</div>
                    <div className={`text-sm flex items-center gap-1 ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Buy Order */}
          {selectedStock && (
            <Card>
              <CardHeader>
                <CardTitle>Buy {selectedStock.symbol}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
                {quantity && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>Total Cost:</span>
                      <span className="font-bold">
                        ₹{(selectedStock.price * parseInt(quantity || '0')).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
                <Button 
                  onClick={buyStock} 
                  className="w-full"
                  disabled={!quantity || parseInt(quantity) <= 0}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Buy Stock
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>Your Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {investments.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No investments yet</p>
              ) : (
                investments.map((investment) => {
                  const currentStock = stocks.find(s => s.symbol === investment.stock_symbol);
                  const currentPrice = currentStock?.price || investment.current_price;
                  const currentValue = currentPrice * investment.quantity;
                  const profit = currentValue - investment.total_amount;
                  const profitPercent = (profit / investment.total_amount) * 100;

                  return (
                    <div key={investment.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{investment.stock_symbol}</div>
                          <div className="text-sm text-gray-600">
                            {investment.quantity} shares @ ₹{investment.buy_price.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => sellStock(investment)}
                        >
                          Sell
                        </Button>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current Value: ₹{currentValue.toFixed(2)}</span>
                        <Badge variant={profit >= 0 ? "default" : "destructive"}>
                          {profit >= 0 ? '+' : ''}₹{profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                        </Badge>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
