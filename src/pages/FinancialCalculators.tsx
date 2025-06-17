
import { useState } from 'react';
import { ArrowLeft, Calculator, PiggyBank, TrendingUp, Home, CreditCard, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface CalculatorResult {
  principal?: number;
  interest?: number;
  total?: number;
  monthlyPayment?: number;
  maturityAmount?: number;
  taxSaved?: number;
}

const FinancialCalculators = () => {
  const navigate = useNavigate();
  const [activeCalculator, setActiveCalculator] = useState<string>('sip');
  const [result, setResult] = useState<CalculatorResult>({});

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    monthlyAmount: '',
    years: '',
    expectedReturn: '12'
  });

  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    loanAmount: '',
    interestRate: '',
    tenure: ''
  });

  // Tax Calculator State
  const [taxData, setTaxData] = useState({
    annualIncome: '',
    investments80C: '',
    medicalInsurance: ''
  });

  // FD Calculator State
  const [fdData, setFdData] = useState({
    principal: '',
    rate: '',
    tenure: ''
  });

  const calculators = [
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate returns on systematic investment plans',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate loan EMIs and total interest',
      icon: Home,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax and savings',
      icon: Calculator,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'fd',
      title: 'FD Calculator',
      description: 'Calculate fixed deposit maturity amount',
      icon: PiggyBank,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const calculateSIP = () => {
    const P = parseFloat(sipData.monthlyAmount);
    const r = parseFloat(sipData.expectedReturn) / 100 / 12;
    const n = parseFloat(sipData.years) * 12;
    
    if (P && r && n) {
      const maturityAmount = P * (((Math.pow(1 + r, n)) - 1) / r) * (1 + r);
      const totalInvestment = P * n;
      const totalReturns = maturityAmount - totalInvestment;
      
      setResult({
        total: totalInvestment,
        maturityAmount: Math.round(maturityAmount),
        interest: Math.round(totalReturns)
      });
    }
  };

  const calculateEMI = () => {
    const P = parseFloat(emiData.loanAmount);
    const r = parseFloat(emiData.interestRate) / 100 / 12;
    const n = parseFloat(emiData.tenure) * 12;
    
    if (P && r && n) {
      const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - P;
      
      setResult({
        monthlyPayment: Math.round(emi),
        total: Math.round(totalAmount),
        interest: Math.round(totalInterest)
      });
    }
  };

  const calculateTax = () => {
    const income = parseFloat(taxData.annualIncome);
    const investments = parseFloat(taxData.investments80C) || 0;
    const insurance = parseFloat(taxData.medicalInsurance) || 0;
    
    if (income) {
      let taxableIncome = income - Math.min(investments, 150000) - Math.min(insurance, 25000);
      let tax = 0;
      
      if (taxableIncome > 1000000) {
        tax += (taxableIncome - 1000000) * 0.3;
        taxableIncome = 1000000;
      }
      if (taxableIncome > 500000) {
        tax += (taxableIncome - 500000) * 0.2;
        taxableIncome = 500000;
      }
      if (taxableIncome > 250000) {
        tax += (taxableIncome - 250000) * 0.05;
      }
      
      const taxSaved = (Math.min(investments, 150000) + Math.min(insurance, 25000)) * 0.2;
      
      setResult({
        total: Math.round(tax),
        taxSaved: Math.round(taxSaved)
      });
    }
  };

  const calculateFD = () => {
    const P = parseFloat(fdData.principal);
    const r = parseFloat(fdData.rate) / 100;
    const t = parseFloat(fdData.tenure);
    
    if (P && r && t) {
      const maturityAmount = P * Math.pow(1 + r, t);
      const interest = maturityAmount - P;
      
      setResult({
        principal: P,
        maturityAmount: Math.round(maturityAmount),
        interest: Math.round(interest)
      });
    }
  };

  const handleCalculate = () => {
    switch (activeCalculator) {
      case 'sip':
        calculateSIP();
        break;
      case 'emi':
        calculateEMI();
        break;
      case 'tax':
        calculateTax();
        break;
      case 'fd':
        calculateFD();
        break;
    }
  };

  const renderCalculatorForm = () => {
    switch (activeCalculator) {
      case 'sip':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment (₹)</label>
              <input
                type="number"
                value={sipData.monthlyAmount}
                onChange={(e) => setSipData({...sipData, monthlyAmount: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
              <input
                type="number"
                value={sipData.years}
                onChange={(e) => setSipData({...sipData, years: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Return (%)</label>
              <input
                type="number"
                value={sipData.expectedReturn}
                onChange={(e) => setSipData({...sipData, expectedReturn: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="12"
              />
            </div>
          </div>
        );
      
      case 'emi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹)</label>
              <input
                type="number"
                value={emiData.loanAmount}
                onChange={(e) => setEmiData({...emiData, loanAmount: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="1000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={emiData.interestRate}
                onChange={(e) => setEmiData({...emiData, interestRate: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="8.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Years)</label>
              <input
                type="number"
                value={emiData.tenure}
                onChange={(e) => setEmiData({...emiData, tenure: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="20"
              />
            </div>
          </div>
        );

      case 'tax':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
              <input
                type="number"
                value={taxData.annualIncome}
                onChange={(e) => setTaxData({...taxData, annualIncome: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="800000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">80C Investments (₹)</label>
              <input
                type="number"
                value={taxData.investments80C}
                onChange={(e) => setTaxData({...taxData, investments80C: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="150000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Insurance (₹)</label>
              <input
                type="number"
                value={taxData.medicalInsurance}
                onChange={(e) => setTaxData({...taxData, medicalInsurance: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="25000"
              />
            </div>
          </div>
        );

      case 'fd':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Principal Amount (₹)</label>
              <input
                type="number"
                value={fdData.principal}
                onChange={(e) => setFdData({...fdData, principal: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="100000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                value={fdData.rate}
                onChange={(e) => setFdData({...fdData, rate: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="6.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tenure (Years)</label>
              <input
                type="number"
                value={fdData.tenure}
                onChange={(e) => setFdData({...fdData, tenure: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="5"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!Object.keys(result).length) return null;

    return (
      <Card className="border-0 shadow-card bg-gradient-to-r from-gray-50 to-gray-100">
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-4">📊 Calculation Results</h3>
          <div className="space-y-3">
            {result.monthlyPayment && (
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly EMI:</span>
                <span className="font-bold text-blue-600">₹{result.monthlyPayment.toLocaleString()}</span>
              </div>
            )}
            {result.maturityAmount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Maturity Amount:</span>
                <span className="font-bold text-green-600">₹{result.maturityAmount.toLocaleString()}</span>
              </div>
            )}
            {result.total && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-purple-600">₹{result.total.toLocaleString()}</span>
              </div>
            )}
            {result.interest && (
              <div className="flex justify-between">
                <span className="text-gray-600">Interest/Returns:</span>
                <span className="font-bold text-orange-600">₹{result.interest.toLocaleString()}</span>
              </div>
            )}
            {result.taxSaved && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Saved:</span>
                <span className="font-bold text-green-600">₹{result.taxSaved.toLocaleString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
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
            <h1 className="text-2xl font-bold text-gray-800">🧮 Financial Calculators</h1>
            <p className="text-gray-600">Interactive planning and simulation tools</p>
          </div>
        </div>

        {/* Calculator Selector */}
        <div className="grid grid-cols-2 gap-3">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Card
                key={calc.id}
                className={`border-0 shadow-card cursor-pointer transition-all ${
                  activeCalculator === calc.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  setActiveCalculator(calc.id);
                  setResult({});
                }}
              >
                <CardContent className="p-3">
                  <div className={`bg-gradient-to-r ${calc.color} p-2 rounded mb-2`}>
                    <Icon className="w-6 h-6 text-white mx-auto" />
                  </div>
                  <h3 className="font-bold text-sm text-center">{calc.title}</h3>
                  <p className="text-xs text-gray-600 text-center mt-1">{calc.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Calculator Form */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-4">
              {calculators.find(c => c.id === activeCalculator)?.title}
            </h3>
            {renderCalculatorForm()}
            <Button 
              onClick={handleCalculate}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            >
              Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {renderResults()}
      </div>
    </div>
  );
};

export default FinancialCalculators;
