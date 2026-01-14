import React from 'react';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function LabReportSummary({ data = [] }) {
  return (
    <div className="space-y-3">
      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No lab reports available</p>
      ) : (
        data.map((report, index) => (
          <div
            key={index}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{report.test}</span>
              {report.status === 'Normal' ? (
                <FiCheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <FiAlertCircle className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{report.value}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                report.status === 'Normal' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {report.status}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Date: {report.date}</p>
          </div>
        ))
      )}
    </div>
  );
}












