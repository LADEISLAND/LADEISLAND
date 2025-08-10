# AGI Cosmic Documentation

## Overview

AGI Cosmic is an AI-powered virtual country management platform where users can define themselves as leaders (e.g., president, scientist, emperor) and manage their own virtual nations with systems like military, trade, economy, and citizens.

## Architecture

### Backend (FastAPI + Python)
- **Framework**: FastAPI with Python 3.11+
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: OpenAI GPT API for natural language processing
- **API Documentation**: Auto-generated with Swagger UI

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors

## Features

### Core Features
1. **User Authentication**
   - Registration with email and username
   - Secure login with JWT tokens
   - Password hashing with bcrypt
   - Protected routes

2. **Virtual Country Management**
   - Create custom countries with unique names
   - Choose leader roles (President, Emperor, Scientist, etc.)
   - Manage multiple systems: Military, Economy, Citizens, Government
   - Track resources, alliances, and technology levels

3. **AI-Powered Commands**
   - Natural language command processing
   - Real-time country state updates
   - Intelligent response generation
   - Historical command tracking

4. **Interactive Dashboard**
   - Real-time country statistics
   - Chat-style command interface
   - Visual resource management
   - Event history and tracking

### Technical Features
- **Responsive Design**: Works on desktop and mobile
- **Real-time Updates**: Dynamic state management
- **Error Handling**: Comprehensive error handling and user feedback
- **Security**: JWT authentication, password hashing, CORS protection
- **Scalability**: Modular architecture for easy expansion

## Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agi-cosmic
   ```

2. **Run the setup script**
   ```bash
   ./setup.sh
   ```

3. **Configure environment variables**
   ```bash
   # Edit backend/.env
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your_secret_key_here
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   source venv/bin/activate
   python run.py

   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:8000/docs

### Docker Deployment

1. **Set environment variables**
   ```bash
   export OPENAI_API_KEY=your_openai_api_key_here
   export SECRET_KEY=your_secret_key_here
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

## API Reference

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### POST /auth/token
Login and get access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

#### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

### Country Management Endpoints

#### POST /country/
Create a new virtual country.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string (optional)",
  "leader_title": "string"
}
```

#### GET /country/
Get current user's country information.

**Headers:** `Authorization: Bearer <token>`

#### POST /country/command
Process a natural language command.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "command": "string"
}
```

**Response:**
```json
{
  "response": "string",
  "country_state": {
    "id": 1,
    "name": "string",
    "leader_title": "string",
    "population": 1000,
    "military_strength": 100,
    "economy_score": 50.0,
    "technology_level": 1,
    "resources": {},
    "alliances": [],
    "military_system": {},
    "trade_system": {},
    "citizen_system": {},
    "government_system": {},
    "history": [],
    "current_events": []
  },
  "events": []
}
```

#### GET /country/history
Get country command history and events.

**Headers:** `Authorization: Bearer <token>`

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);
```

### Countries Table
```sql
CREATE TABLE countries (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    leader_title VARCHAR NOT NULL,
    population INTEGER DEFAULT 1000,
    military_strength INTEGER DEFAULT 100,
    economy_score FLOAT DEFAULT 50.0,
    technology_level INTEGER DEFAULT 1,
    resources JSON,
    alliances JSON,
    military_system JSON,
    trade_system JSON,
    citizen_system JSON,
    government_system JSON,
    history JSON,
    current_events JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## AI Integration

### Command Processing
The AI service processes natural language commands using OpenAI's GPT API:

1. **Context Creation**: Current country state is provided as context
2. **Command Analysis**: AI interprets the user's intent
3. **State Updates**: AI determines which systems need updates
4. **Response Generation**: Natural language response explaining changes
5. **Event Tracking**: Optional events are generated for significant changes

### Example Commands
- "Increase military spending"
- "Build new schools for education"
- "Establish trade routes with neighboring countries"
- "Research new technology"
- "Improve citizen happiness"
- "Declare war on enemy nation"

## Security

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Token-based session management

### Data Protection
- Input validation with Pydantic schemas
- SQL injection prevention with SQLAlchemy
- CORS configuration for frontend access

### Environment Variables
- Sensitive data stored in environment variables
- Separate configuration for development and production
- API keys and secrets not committed to version control

## Development

### Project Structure
```
agi-cosmic/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── config.py        # Configuration
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   ├── run.py              # Startup script
│   └── Dockerfile          # Backend container
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── package.json         # Node.js dependencies
│   └── Dockerfile          # Frontend container
├── docker-compose.yml      # Container orchestration
├── setup.sh               # Setup script
└── README.md              # Project overview
```

### Adding New Features

#### Backend
1. Create database models in `app/models/`
2. Define Pydantic schemas in `app/schemas/`
3. Implement business logic in `app/services/`
4. Add API routes in `app/routes/`
5. Update main app in `app/main.py`

#### Frontend
1. Create TypeScript types in `src/types/`
2. Add API services in `src/services/`
3. Create React components in `src/components/`
4. Update routing in `src/App.tsx`

### Testing
- Backend: Use FastAPI's built-in testing tools
- Frontend: Use React Testing Library
- API: Test endpoints with the auto-generated Swagger UI

## Deployment

### Production Considerations
1. **Database**: Use PostgreSQL or MySQL instead of SQLite
2. **Caching**: Implement Redis for session management
3. **Load Balancing**: Use Nginx for reverse proxy
4. **Monitoring**: Add logging and health checks
5. **Security**: Enable HTTPS and additional security headers

### Environment Variables
```bash
# Required
OPENAI_API_KEY=your_openai_api_key
SECRET_KEY=your_secret_key

# Optional
DATABASE_URL=postgresql://user:pass@localhost/db
HOST=0.0.0.0
PORT=8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the code examples in this documentation