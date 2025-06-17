
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
}

interface Portfolio {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
}

const InvestmentLab = () => {
  const navigate = useNavigate();
  const [virtualBalance, setVirtualBalance] = useState(100000); // ₹1 Lakh virtual money
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  
  const [stocks] = useState<Stock[]>([
    { symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 2450, change: 25, changePercent: 1.03 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', currentPrice: 3680, change: -45, changePercent: -1.21 },
    { symbol: 'INFY', name: 'Infosys Limited', currentPrice: 1520, change: 18, changePercent: 1.20 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', currentPrice: 1680, change: -12, changePercent: -0.71 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', currentPrice: 890, change: 8, changePercent: 0.91 },
    { symbol: 'SBIN', name: 'State Bank of India', currentPrice: 620, change: -5, changePercent: -0.80 },
  ]);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState('');

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update portfolio prices
      setPortfolio(prev => prev.map(item => ({
        ...item,
        currentPrice: stocks.find(s => s.symbol === item.symbol)?.currentPrice || item.currentPrice
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [stocks]);

  const totalInvested = portfolio.reduce((sum, item) => sum + (item.quantity * item.buyPrice), 0);
  const currentValue = portfolio.reduce((sum, item) => sum + (item.quantity * item.currentPrice), 0);
  const totalPnL = currentValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const handleBuyStock = () => {
    if (selectedStock && quantity) {
      const totalCost = selectedStock.currentPrice * parseInt(quantity);
      
      if (totalCost <= virtualBalance) {
        const existingPosition = portfolio.find(p => p.symbol === selectedStock.symbol);
        
        if (existingPosition) {
          // Update existing position
          setPortfolio(portfolio.map(p => 
            p.symbol === selectedStock.symbol
              ? {
                  ...p,
                  quantity: p.quantity + parseInt(quantity),
                  buyPrice: ((p.quantity * p.buyPrice) + totalCost) / (p.quantity + parseInt(quantity))
                }
              : p
          ));
        } else {
          // Add new position
          const newPosition: Portfolio = {
            id: Date.now().toString(),
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            quantity: parseInt(quantity),
            buyPrice: selectedStock.currentPrice,
            currentPrice: selectedStock.currentPrice
          };
          setPortfolio([...portfolio, newPosition]);
        }
        
        setVirtualBalance(virtualBalance - totalCost);
        setSelectedStock(null);
        setQuantity('');
      }
    }
  };

  const handleSellStock = (portfolioItem: Portfolio) => {
    const saleValue = portfolioItem.quantity * portfolioItem.currentPrice;
    setVirtualBalance(virtualBalance + saleValue);
    setPortfolio(portfolio.filter(p => p.id !== portfolioItem.id));
  };

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
            <h1 className="text-2xl font-bold text-gray-800">📊 Investment Lab</h1>
            <p className="text-gray-600">Practice with virtual money</p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-600">Balance</span>
              </div>
              <p className="text-xl font-bold text-gray-800">₹{virtualBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Available to invest</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-600">Portfolio</span>
              </div>
              <p className="text-xl font-bold text-gray-800">₹{currentValue.toLocaleString()}</p>
              <p className={`text-xs ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString()} ({totalPnLPercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Buy Stock Form */}
        {selectedStock && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4">
              <h3 className="font-bold text-lg mb-4">Buy {selectedStock.name}</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Price:</span>
                  <span className="font-semibold">₹{selectedStock.currentPrice}</span>
                </div>
                
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                {quantity && (
                  <div className="flex justify-between text-sm">
                    <span>Total Cost:</span>
                    <span className="font-semibold">₹{(selectedStock.currentPrice * parseInt(quantity || '0')).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleBuyStock}
                    disabled={!quantity || (selectedStock.currentPrice * parseInt(quantity || '0')) > virtualBalance}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Buy Stock
                  </Button>
                  <Button onClick={() => setSelectedStock(null)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Holdings */}
        {portfolio.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800">My Holdings</h3>
            {portfolio.map((item) => {
              const pnl = (item.currentPrice - item.buyPrice) * item.quantity;
              const pnlPercent = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
              
              return (
                <Card key={item.id} className="border-0 shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{item.symbol}</h4>
                        <p className="text-xs text-gray-500">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.currentPrice}</p>
                        <p className={`text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(0)} ({pnlPercent.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleSellStock(item)}
                      variant="outline" 
                      size="sm" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Sell All
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Available Stocks */}
        <div className="space-y-3">
          <h3 className="font-bold text-lg text-gray-800">Available Stocks</h3>
          {stocks.map((stock) => (
            <Card key={stock.symbol} className="border-0 shadow-card cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => setSelectedStock(stock)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{stock.symbol}</h4>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{stock.currentPrice}</p>
                    <div className="flex items-center gap-1">
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      )}
                      <span className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
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

export default InvestmentLab;
