import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiLayout, 
  FiMessageSquare, 
  FiFileText, 
  FiCalendar,
  FiCpu,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';

export default function Sidebar({ activePage, setActivePage }) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'User';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiLayout },
    { id: 'chat', label: 'Chat', icon: FiMessageSquare },
    { id: 'medical-records', label: 'Medical Records', icon: FiFileText },
    { id: 'appointments', label: 'Appointments', icon: FiCalendar },
    { id: 'ai-assistant', label: 'AI Health Assistant', icon: FiCpu },
    { id: 'med', label: 'Medical Health Assistant', icon: FiCpu },
    { id: 'doctors', label: 'Doctors', icon: FiUser },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Medico</h1>
        <p className="text-sm text-gray-400 mt-1">Healthcare Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700">
        <div className="mb-3 px-4 py-2 text-sm text-gray-400">
          {userEmail}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-red-300 transition-all duration-200"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

