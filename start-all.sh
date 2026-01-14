#!/bin/bash

# Start Both Backend and Frontend
# This script starts both services in the background

echo "🚀 Starting Medical Health Assistant Application..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start Backend
echo "📦 Starting Backend Server (Port 8001)..."
cd "$SCRIPT_DIR/medico-med-backend"
if [ -d "venv" ]; then
    source venv/bin/activate
fi
python3 main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo "   Logs: tail -f backend.log"

# Wait for backend to start
echo "   Waiting for backend to initialize..."
sleep 5

# Check if backend is running
if curl -s http://localhost:8001/ > /dev/null 2>&1; then
    echo "   ✅ Backend is running on http://localhost:8001"
else
    echo "   ⚠️  Backend may not be ready yet. Check backend.log for errors."
fi

# Start Frontend
echo ""
echo "📦 Starting Frontend Server (Port 3000)..."
cd "$SCRIPT_DIR/medico-frontend"
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo "   Logs: tail -f frontend.log"

# Wait for frontend to start
echo "   Waiting for frontend to initialize..."
sleep 10

echo ""
echo "✅ Application Started!"
echo ""
echo "📍 Backend:  http://localhost:8001"
echo "📍 Frontend: http://localhost:3000"
echo "📍 API Docs: http://localhost:8001/docs"
echo ""
echo "📝 View logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait

