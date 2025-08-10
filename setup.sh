#!/bin/bash

echo "🚀 Setting up AGI Cosmic..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Python and Node.js are installed"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your OpenAI API key and secret key"
fi

cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1. Edit backend/.env and add your OpenAI API key:"
echo "   OPENAI_API_KEY=your_openai_api_key_here"
echo "   SECRET_KEY=your_secret_key_here"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && source venv/bin/activate && python run.py"
echo ""
echo "3. In a new terminal, start the frontend:"
echo "   cd frontend && npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 API Documentation will be available at http://localhost:8000/docs"