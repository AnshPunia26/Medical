# Medico - Medical Health Assistant

A comprehensive medical health assistant application with AI-powered chatbot, patient dashboard, and consultation management.

## Project Structure

This is a monorepo containing:

- **`medico-frontend/`** - React-based frontend application
- **`medico-med-backend/`** - FastAPI backend with AI chatbot and medical consultation engine

## Features

### Frontend
- Modern React UI with Tailwind CSS
- User authentication (Login/Signup)
- Medical dashboard with health metrics
- AI Health Assistant integration
- Patient records management
- Appointment scheduling
- Lab reports and medication tracking

### Backend
- FastAPI REST API
- OpenAI-powered medical chatbot
- Voice and text chat support
- Structured medical consultation flow
- MongoDB integration for patient data
- Multi-language support
- WebSocket support for real-time chat

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- MongoDB (optional, for data persistence)
- OpenAI API key

### Backend Setup

```bash
cd medico-med-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # Edit with your API keys

# Run backend
python main.py
```

Backend runs on `http://localhost:8001`

### Frontend Setup

```bash
cd medico-frontend

# Install dependencies
npm install

# Create .env file (optional)
# REACT_APP_API_URL=http://localhost:8001

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

## Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGINS=http://localhost:3000
ENABLE_QUESTION_FLOW=true
PORT=8001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8001
```

## Deployment

### Backend Deployment
- Configured for Render.com (see `render.yaml`)
- Can be deployed to any Python hosting service
- Requires environment variables to be set

### Frontend Deployment
- Configured for Netlify (see `netlify.toml`)
- Configured for Vercel (see `vercel.json`)
- Can be deployed to any static hosting service

## GitHub Repositories

- Frontend: `https://github.com/KartikMalik958/medico-frontend.git`
- Backend: `https://github.com/KartikMalik958/medico-med-backend.git`

## Recent Fixes

- Fixed undefined `request` variable in voice chat endpoint
- Improved error handling in chatbot engine
- Enhanced question flow engine for structured consultations

## Documentation

See individual README files in each subdirectory for detailed documentation:
- `medico-frontend/README.md` - Frontend documentation
- `medico-med-backend/HOW_TO_RUN.md` - Backend setup guide

## License

Private project - All rights reserved

