# Running the Project Locally

## Quick Start

### Option 1: Use the Startup Scripts (Easiest)

**Terminal 1 - Backend:**
```bash
cd /Users/anshpunia/Desktop/med
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
cd /Users/anshpunia/Desktop/med
./start-frontend.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd medico-med-backend
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd medico-frontend
npm start
```

## What's Running

- **Backend**: http://localhost:8001
  - FastAPI server with medical chatbot
  - API documentation: http://localhost:8001/docs
  
- **Frontend**: http://localhost:3000
  - React development server
  - Automatically opens in browser

## Environment Variables

### Backend (.env in `medico-med-backend/`)
```env
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=your_mongodb_uri (optional)
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ENABLE_QUESTION_FLOW=true
PORT=8001
```

### Frontend (optional .env in `medico-frontend/`)
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MED_API_URL=http://localhost:8001
```

## Verification

1. **Check Backend**: Open http://localhost:8001/
   - Should see: `{"status":"online","service":"Multilingual Voice Chatbot","version":"1.0.0"}`

2. **Check Frontend**: Open http://localhost:3000/
   - Should see the login/signup page

3. **API Docs**: Open http://localhost:8001/docs
   - Should see FastAPI interactive documentation

## Troubleshooting

### Backend Issues
- **Port 8001 already in use**: Stop the process using that port
  ```bash
  lsof -ti:8001 | xargs kill
  ```
- **Missing dependencies**: Run `pip install -r requirements.txt` in `medico-med-backend/`
- **OPENAI_API_KEY not found**: Check `.env` file exists and has the key

### Frontend Issues
- **Port 3000 already in use**: React will ask to use a different port
- **Missing dependencies**: Run `npm install` in `medico-frontend/`
- **API connection errors**: Verify backend is running on port 8001

## Project Structure

```
med/
├── medico-frontend/      # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── medico-med-backend/   # FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   └── .env
├── start-backend.sh      # Backend startup script
├── start-frontend.sh     # Frontend startup script
└── README.md
```

## Next Steps

1. ✅ Backend dependencies installed
2. ✅ Frontend dependencies installed
3. ✅ Environment variables configured
4. 🚀 Start both services
5. 🌐 Open http://localhost:3000 in your browser

