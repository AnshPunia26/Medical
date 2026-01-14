#!/bin/bash

# Start Backend Server
cd "$(dirname "$0")/medico-med-backend"

echo "🚀 Starting Medical Backend Server..."
echo "📍 Location: $(pwd)"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "   Please create .env file with OPENAI_API_KEY"
    exit 1
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Check if dependencies are installed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "📥 Installing dependencies..."
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    pip install --upgrade pip
    pip install -r requirements.txt
fi

# Start the server
echo "✅ Starting server on http://localhost:8001"
python3 main.py

