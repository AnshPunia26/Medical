# Frontend-Backend Connection Guide

## ✅ Connection Status

The frontend and backend are now properly connected!

## 🔗 Connection Details

### Backend (Medical API)
- **URL**: `http://localhost:8001`
- **API Endpoint**: `/api/chat/text`
- **CORS**: Configured to allow `http://localhost:3000`
- **Status**: ✅ Running

### Frontend (React App)
- **URL**: `http://localhost:3000`
- **Medical Chat API**: Points to `http://localhost:8001/api/chat/text`
- **Status**: ✅ Running

## 📡 API Endpoints

### Medical Chat Backend (`http://localhost:8001`)

1. **Health Check**
   ```
   GET http://localhost:8001/
   ```

2. **Text Chat**
   ```
   POST http://localhost:8001/api/chat/text
   Body: {
     "message": "Hello",
     "session_id": "session_123",
     "language": "auto",
     "use_question_flow": true,
     "username": "user@example.com"
   }
   ```

3. **Voice Chat**
   ```
   POST http://localhost:8001/api/chat/voice
   Form Data:
     - audio: (file)
     - session_id: "session_123"
     - username: "user@example.com"
   ```

4. **API Documentation**
   ```
   http://localhost:8001/docs
   ```

## 🚀 How to Run

### Option 1: Use the All-in-One Script
```bash
cd /Users/anshpunia/Desktop/med
./start-all.sh
```

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd /Users/anshpunia/Desktop/med/medico-med-backend
source venv/bin/activate
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd /Users/anshpunia/Desktop/med/medico-frontend
npm start
```

## ✅ Verification

1. **Check Backend**: Open http://localhost:8001/
   - Should see: `{"status":"online",...}`

2. **Check Frontend**: Open http://localhost:3000/
   - Should see the login page

3. **Test Connection**: 
   - Login to the app
   - Navigate to Medical Health Assistant
   - Send a message - it should connect to backend

## 🔧 Configuration Files

### Frontend Config
- `medico-frontend/src/config.js` - Main API configuration
- `medico-frontend/src/components/med/MedChatbot.js` - Medical chatbot component

### Backend Config
- `medico-med-backend/main.py` - FastAPI app with CORS settings
- `medico-med-backend/.env` - Environment variables (CORS_ORIGINS, etc.)

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. Check backend is running: `curl http://localhost:8001/`
2. Check CORS settings in `main.py` (should include `http://localhost:3000`)
3. Check browser console for CORS errors

### API calls failing
1. Verify backend endpoint: `http://localhost:8001/api/chat/text`
2. Check backend logs for errors
3. Verify `.env` file has `OPENAI_API_KEY`

### Port already in use
- Backend (8001): `lsof -ti:8001 | xargs kill`
- Frontend (3000): React will ask to use a different port

## 📝 Environment Variables

### Backend (.env)
```env
OPENAI_API_KEY=your_key_here
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENABLE_QUESTION_FLOW=true
PORT=8001
```

### Frontend (optional .env)
```env
REACT_APP_MED_API_URL=http://localhost:8001/api/chat
REACT_APP_MED_BACKEND_DIRECT=http://localhost:8001
```

## 🎯 Next Steps

1. ✅ Backend running on port 8001
2. ✅ Frontend running on port 3000
3. ✅ CORS configured correctly
4. ✅ API endpoints connected
5. 🚀 Ready to use!

Open http://localhost:3000 and start using the Medical Health Assistant!

