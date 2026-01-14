import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import DashboardMain from './dashboard/DashboardMain';
import Chat from './dashboard/Chat';
import MedicalRecords from './dashboard/MedicalRecords';
import Appointments from './dashboard/Appointments';
import AIHealthAssistant from './dashboard/AIHealthAssistant';
import MedChatbot from './med/MedChatbot';
import Doctors from './dashboard/Doctors';
import Settings from './dashboard/Settings';

export default function Dashboard() {
  const [activePage, setActivePage] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardMain />;
      case 'chat':
        return <Chat />;
      case 'medical-records':
        return <MedicalRecords />;
      case 'appointments':
        return <Appointments />;
      case 'ai-assistant':
        return <AIHealthAssistant />;
      case 'med':
        return <MedChatbot />;
      case 'doctors':
        return <Doctors />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}






