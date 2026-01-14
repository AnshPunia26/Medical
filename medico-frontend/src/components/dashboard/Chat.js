import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { FiSend, FiSun, FiHeart, FiCalendar, FiActivity } from 'react-icons/fi';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user name from email
    const email = localStorage.getItem('userEmail') || '';
    const name = email.split('@')[0] || 'User';
    setUserName(name.charAt(0).toUpperCase() + name.slice(1));
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        API_ENDPOINTS.CHAT,
        { message: textToSend },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorContent = 'Sorry, I encountered an error. Please try again later.';
      
      // Network error - server not running or connection failed
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        errorContent = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:8000';
      } else if (error.response?.status === 404) {
        errorContent = 'Chat endpoint not found. Please make sure the backend server is running and the endpoint is available.';
      } else if (error.response?.status === 401) {
        errorContent = 'Authentication failed. Please log in again.';
      } else if (error.response?.data?.detail) {
        errorContent = `Error: ${error.response.data.detail}`;
      } else if (error.message) {
        errorContent = `Error: ${error.message}`;
      }
      
      const errorMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionCard = (action) => {
    let message = '';
    switch (action) {
      case 'symptoms':
        message = 'I have some symptoms I\'d like to understand better. Can you help me understand when I should see a doctor?';
        break;
      case 'medications':
        message = 'Can you help me understand my medications and when to take them?';
        break;
      case 'appointments':
        message = 'I need help preparing for my upcoming medical appointment. What should I know?';
        break;
      default:
        return;
    }
    handleSendMessage(message);
  };

  const showInitialState = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
        <button className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
          <FiSun className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {showInitialState ? (
          <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">
                Hi {userName}, how can I help you?
              </h2>
              <p className="text-gray-400 text-lg">
                I'm here to assist you with health questions, medication information, appointment preparation, and general wellness support.
              </p>
            </div>

            {/* Input Bar */}
            <div className="w-full max-w-2xl mb-8">
              <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors">
                <input
                  type="text"
                  placeholder="Ask about your health, medications, appointments, or symptoms..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-3 outline-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className="m-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-colors"
                >
                  <FiSend className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {/* Symptoms & Health Questions Card */}
              <div
                onClick={() => handleActionCard('symptoms')}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <FiActivity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Symptoms & Health Questions</h3>
                <p className="text-gray-400 text-sm">
                  Get information about symptoms and understand when you should consult with a healthcare professional.
                </p>
              </div>

              {/* Medications Card */}
              <div
                onClick={() => handleActionCard('medications')}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                  <FiHeart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Medications & Dosage</h3>
                <p className="text-gray-400 text-sm">
                  Get help understanding your medications, dosages, schedules, and potential interactions.
                </p>
              </div>

              {/* Appointments Card */}
              <div
                onClick={() => handleActionCard('appointments')}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <FiCalendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Appointment Preparation</h3>
                <p className="text-gray-400 text-sm">
                  Get guidance on preparing for your medical appointments and what questions to ask your doctor.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.error
                      ? 'bg-red-900/30 text-red-200 border border-red-800'
                      : 'bg-gray-800 text-white border border-gray-700'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar (shown when messages exist) */}
      {!showInitialState && (
        <div className="p-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                placeholder="Ask or find anything from your workspace..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent text-white placeholder-gray-500 px-4 py-3 outline-none"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="m-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-colors"
              >
                <FiSend className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
