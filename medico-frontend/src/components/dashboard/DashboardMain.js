import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import PatientInfoCards from './PatientInfoCards';
import VitalsGraph from './VitalsGraph';
import AppointmentsTimeline from './AppointmentsTimeline';
import MedicationsSchedule from './MedicationsSchedule';
import LabReportSummary from './LabReportSummary';
import DoctorNotes from './DoctorNotes';
import AISymptomInsights from './AISymptomInsights';

export default function DashboardMain() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId') || '1'; // Get from auth

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // Replace with your actual API endpoint
      const response = await axios.get(
        `${API_ENDPOINTS.BASE || 'http://localhost:8000'}/api/user/${userId}/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Use mock data for now
      setDashboardData(getMockData());
      setLoading(false);
    }
  };

  const getMockData = () => ({
    patient: {
      name: 'John Doe',
      age: 35,
      bloodGroup: 'O+',
      insuranceProvider: 'BlueCross',
      aiHealthRiskScore: 72
    },
    vitals: [
      { date: '2024-01-01', heartRate: 72, bp: '120/80', oxygen: 98, temperature: 98.6 },
      { date: '2024-01-02', heartRate: 75, bp: '122/82', oxygen: 97, temperature: 98.4 },
      { date: '2024-01-03', heartRate: 70, bp: '118/78', oxygen: 99, temperature: 98.7 },
    ],
    appointments: [
      { id: 1, date: '2024-01-15', time: '10:00 AM', doctor: 'Dr. Smith', type: 'Checkup' },
      { id: 2, date: '2024-01-20', time: '2:00 PM', doctor: 'Dr. Johnson', type: 'Follow-up' },
    ],
    medications: [
      { name: 'Aspirin', dosage: '81mg', frequency: 'Daily', time: 'Morning' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice Daily', time: 'Morning & Evening' },
    ],
    labReports: [
      { test: 'Blood Glucose', value: '95 mg/dL', status: 'Normal', date: '2024-01-01' },
      { test: 'Cholesterol', value: '180 mg/dL', status: 'Normal', date: '2024-01-01' },
    ],
    doctorNotes: 'Patient shows improvement in blood pressure. Continue current medication regimen.',
    aiInsights: 'Based on recent vitals, your health metrics are within normal range. Consider maintaining regular exercise.'
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-400 text-xl">Error loading dashboard</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your health overview.</p>
      </div>

      {/* Patient Info Cards */}
      <PatientInfoCards data={dashboardData?.patient} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vitals Graph */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Vitals Overview</h2>
          <VitalsGraph data={dashboardData?.vitals} />
        </div>

        {/* Appointments Timeline */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Appointments</h2>
          <AppointmentsTimeline data={dashboardData?.appointments} />
        </div>

        {/* Medications Schedule */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Medications Schedule</h2>
          <MedicationsSchedule data={dashboardData?.medications} />
        </div>

        {/* Lab Report Summary */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Lab Report Summary</h2>
          <LabReportSummary data={dashboardData?.labReports} />
        </div>
      </div>

      {/* Full Width Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Notes */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Doctor Notes</h2>
          <DoctorNotes notes={dashboardData?.doctorNotes} />
        </div>

        {/* AI Symptom Insights */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">AI Symptom Insights</h2>
          <AISymptomInsights insights={dashboardData?.aiInsights} />
        </div>
      </div>
    </div>
  );
}












