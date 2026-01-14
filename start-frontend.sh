#!/bin/bash

# Start Frontend Server
cd "$(dirname "$0")/medico-frontend"

echo "🚀 Starting Frontend Development Server..."
echo "📍 Location: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
npm start

