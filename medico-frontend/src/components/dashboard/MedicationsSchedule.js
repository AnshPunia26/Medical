import React from 'react';
import { FiPackage, FiClock } from 'react-icons/fi';

export default function MedicationsSchedule({ data = [] }) {
  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No medications scheduled</p>
      ) : (
        data.map((med, index) => (
          <div
            key={index}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white">{med.name}</p>
                <p className="text-sm text-gray-400">{med.dosage}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                <FiClock className="w-4 h-4" />
                <span>{med.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{med.frequency}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

