import React from 'react';
import { FiUser, FiCalendar, FiDroplet, FiShield, FiActivity } from 'react-icons/fi';

export default function PatientInfoCards({ data }) {
  const cards = [
    { 
      label: 'Patient Name', 
      value: data?.name || 'N/A', 
      icon: FiUser, 
      color: 'blue' 
    },
    { 
      label: 'Age', 
      value: data?.age ? `${data.age} years` : 'N/A', 
      icon: FiCalendar, 
      color: 'green' 
    },
    { 
      label: 'Blood Group', 
      value: data?.bloodGroup || 'N/A', 
      icon: FiDroplet, 
      color: 'red' 
    },
    { 
      label: 'Insurance Provider', 
      value: data?.insuranceProvider || 'N/A', 
      icon: FiShield, 
      color: 'purple' 
    },
    { 
      label: 'AI Health Risk Score', 
      value: data?.aiHealthRiskScore ? `${data.aiHealthRiskScore}/100` : 'N/A', 
      icon: FiActivity, 
      color: 'yellow' 
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`bg-gray-800 rounded-xl p-4 border ${colorClasses[card.color]} shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-xs text-gray-400 mb-1">{card.label}</p>
            <p className="text-lg font-semibold text-white">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}












