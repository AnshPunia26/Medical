import React from 'react';
import { FiCpu } from 'react-icons/fi';

export default function AISymptomInsights({ insights = '' }) {
  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/20">
      <div className="flex items-center space-x-2 mb-4">
        <FiCpu className="w-5 h-5 text-blue-400" />
        <h3 className="font-semibold text-white">AI Analysis</h3>
      </div>
      <p className="text-gray-300 leading-relaxed">
        {insights || 'No AI insights available at the moment.'}
      </p>
    </div>
  );
}












