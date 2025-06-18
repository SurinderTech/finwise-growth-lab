
import React from 'react';
import { InvestmentSimulator } from '@/components/InvestmentSimulator';

const InvestmentLab = () => {
  return (
    <div className="p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">📈 Investment Lab</h1>
          <p className="text-gray-600">Practice trading with virtual money in real-time market simulation</p>
        </div>
        
        <InvestmentSimulator />
      </div>
    </div>
  );
};

export default InvestmentLab;
