
import React from 'react';
import { SIPManager } from '@/components/SIPManager';

const SIPMutualFunds = () => {
  return (
    <div className="p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">💰 SIP & Mutual Funds</h1>
          <p className="text-gray-600">Invest systematically with SIPs and track your mutual fund portfolio</p>
        </div>
        
        <SIPManager />
      </div>
    </div>
  );
};

export default SIPMutualFunds;
