# AGI Cosmic 🌍

An AI-powered agent platform where users define themselves as leaders managing their own virtual countries with systems like military, trade, and citizens.

## Features

- **Virtual Country Management**: Create and manage your own virtual nation
- **AI-Powered Simulation**: Natural language commands interpreted by OpenAI GPT
- **Multiple Systems**: Military, trade, economy, citizens, and more
- **User Authentication**: Secure login/registration with JWT tokens
- **Persistent Storage**: SQLite database with SQLAlchemy ORM
- **Interactive Frontend**: React-based chat interface for commands
- **Real-time Updates**: Dynamic country state management

## Architecture

- **Backend**: FastAPI with Python
- **Frontend**: React with TypeScript
- **Database**: SQLite with SQLAlchemy
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: OpenAI GPT API for natural language processing

## Quick Start

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Environment Variables**:
   Create `.env` file in backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SECRET_KEY=your_secret_key
   ```

## Project Structure

```
agi-cosmic/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── public/
└── README.md
```

## License

MIT License - feel free to use this project for educational and commercial purposes.


