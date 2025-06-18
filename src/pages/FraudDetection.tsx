
import React from 'react';
import { FraudDetectionGame } from '@/components/FraudDetectionGame';

const FraudDetection = () => {
  return (
    <div className="p-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🛡️ Fraud Detection Training</h1>
          <p className="text-gray-600">Learn to identify and protect yourself from financial frauds</p>
        </div>
        
        <FraudDetectionGame />
      </div>
    </div>
  );
};

export default FraudDetection;
