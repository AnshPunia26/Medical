import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function VitalsGraph({ data = [] }) {
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Heart Rate': item.heartRate,
    'BP Systolic': parseInt(item.bp.split('/')[0]),
    'Oxygen %': item.oxygen,
    'Temperature': item.temperature
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Legend />
        <Line type="monotone" dataKey="Heart Rate" stroke="#3B82F6" strokeWidth={2} />
        <Line type="monotone" dataKey="BP Systolic" stroke="#10B981" strokeWidth={2} />
        <Line type="monotone" dataKey="Oxygen %" stroke="#EF4444" strokeWidth={2} />
        <Line type="monotone" dataKey="Temperature" stroke="#F59E0B" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}












