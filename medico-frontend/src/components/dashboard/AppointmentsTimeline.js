import React from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

export default function AppointmentsTimeline({ data = [] }) {
  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No upcoming appointments</p>
      ) : (
        data.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-blue-500 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <FiUser className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-white">{appointment.doctor}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
                <span className="inline-block mt-2 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  {appointment.type}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}












