// API Configuration
// In production, set REACT_APP_API_URL environment variable to your backend URL
// Example: REACT_APP_API_URL=https://medico-backend.onrender.com
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

// Med Backend URL (for medical assistant features)
// Set REACT_APP_MED_API_URL in production
// Example: REACT_APP_MED_API_URL=https://medico-med-backend.onrender.com
const MED_API_BASE_URL = process.env.REACT_APP_MED_API_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  LOGIN: `${API_BASE_URL}/api/login`,
  SIGNUP: `${API_BASE_URL}/api/signup`,
  ME: `${API_BASE_URL}/api/me`,
  COMPLETE_ONBOARDING: `${API_BASE_URL}/api/complete-onboarding`,
  DASHBOARD: (userId) => `${API_BASE_URL}/api/user/${userId}/dashboard`,
  CHAT: `${API_BASE_URL}/api/chat`,
  // Med backend endpoints
  MED_BASE: MED_API_BASE_URL,
  MED_CHAT: `${MED_API_BASE_URL}/api/chat`,
  MED_PROXY: `${API_BASE_URL}/api/med`, // Proxy through main backend
};

export default API_ENDPOINTS;
