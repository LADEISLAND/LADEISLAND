# AGI Cosmic - Quick Start Guide

Get up and running with AGI Cosmic in under 5 minutes! 🚀

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- OpenAI API key (get one at https://platform.openai.com/)

## Step 1: Setup

Run the automated setup script:

```bash
./setup.sh
```

This will:
- ✅ Install Python dependencies
- ✅ Install Node.js dependencies
- ✅ Create virtual environment
- ✅ Set up configuration files

## Step 2: Configure

Edit `backend/.env` and add your API keys:

```bash
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here
SECRET_KEY=your-super-secret-key-here-make-it-long-and-random

# Optional (defaults work fine)
DATABASE_URL=sqlite:///./agi_cosmic.db
HOST=0.0.0.0
PORT=8000
```

## Step 3: Start the Application

### Option A: Development Mode (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Option B: Docker (Alternative)

```bash
# Set environment variables
export OPENAI_API_KEY=sk-your-openai-api-key-here
export SECRET_KEY=your-super-secret-key-here

# Start with Docker
docker-compose up --build
```

## Step 4: Access the Application

- 🌐 **Frontend**: http://localhost:3000
- 📚 **API Docs**: http://localhost:8000/docs

## Step 5: Create Your First Country

1. **Register** a new account at http://localhost:3000/register
2. **Login** with your credentials
3. **Create** your virtual country:
   - Choose your leader role (President, Emperor, Scientist, etc.)
   - Optionally name your country (or let AI generate one)
4. **Start commanding** your country with natural language!

## Example Commands to Try

Once you've created your country, try these commands:

- "Increase military spending"
- "Build new schools for education"
- "Establish trade routes with neighboring countries"
- "Research new technology"
- "Improve citizen happiness"
- "Build a navy"
- "Invest in infrastructure"
- "Form alliances with friendly nations"

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check if Python 3.11+ is installed: `python3 --version`
- Ensure virtual environment is activated
- Verify `.env` file exists and has correct API keys

**Frontend won't start:**
- Check if Node.js 18+ is installed: `node --version`
- Ensure you're in the frontend directory
- Try deleting `node_modules` and running `npm install` again

**API errors:**
- Verify OpenAI API key is correct and has credits
- Check if backend is running on port 8000
- Ensure CORS is properly configured

**Database issues:**
- Delete `agi_cosmic.db` file and restart backend
- Check file permissions in backend directory

### Getting Help

- 📖 Read the full [Documentation](DOCUMENTATION.md)
- 🐛 Check the [API Documentation](http://localhost:8000/docs)
- 💬 Create an issue on GitHub

## Next Steps

Now that you're up and running:

1. **Explore the Dashboard** - Check out your country's stats and systems
2. **Try Different Commands** - Experiment with various management strategies
3. **Check the History** - Review your command history and events
4. **Customize Your Country** - Build your unique virtual nation

Happy ruling! 👑