# AGI Cosmic Backend

A comprehensive backend service for the AGI Cosmic Solar System visualization application.

## Features

- 🌌 **Real-time Chat**: WebSocket-based chat with AI integration
- 🪐 **Solar System API**: Manage and serve solar system data
- 🔐 **Authentication**: JWT-based user authentication
- 🤖 **AI Integration**: OpenAI GPT integration with fallback responses
- 📊 **Database**: MongoDB for persistent data storage
- 🚀 **Real-time Updates**: Socket.IO for live interactions

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **OpenAI API** for AI responses
- **Joi** for request validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/preferences` - Update user preferences
- `GET /api/auth/verify` - Verify JWT token

### Chat
- `POST /api/chat/send` - Send chat message
- `GET /api/chat/history/:sessionId` - Get chat history
- `GET /api/chat/planet/:planetName` - Get planet information
- `GET /api/chat/sessions` - Get user's chat sessions
- `DELETE /api/chat/session/:sessionId` - Clear chat history

### Solar System
- `GET /api/solar-system/default` - Get default solar system data
- `GET /api/solar-system/:id` - Get solar system by ID
- `POST /api/solar-system` - Create new solar system configuration
- `PUT /api/solar-system/:id` - Update solar system configuration
- `GET /api/solar-system/planet/:planetName` - Get planet details
- `GET /api/solar-system/planets/list` - Get all planets list
- `GET /api/solar-system/stats/overview` - Get solar system statistics

### Health
- `GET /api/health` - Health check endpoint

## WebSocket Events

### Client to Server
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `chat-message` - Send chat message
- `solar-system-update` - Update solar system state
- `user-presence` - Update user presence status
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator
- `planet-explore` - Explore a planet

### Server to Client
- `joined-room` - Confirmation of joining room
- `left-room` - Confirmation of leaving room
- `user-message` - User message broadcast
- `ai-response` - AI response to sender
- `ai-message` - AI message broadcast
- `solar-system-state` - Solar system state update
- `user-status` - User presence update
- `user-typing` - Typing indicator
- `planet-info` - Planet information
- `planet-explored` - Planet exploration broadcast
- `user-left` - User left notification
- `error` - Error message

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agi-cosmic

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# AI Service Configuration
OPENAI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):
```bash
mongod
```

4. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Database Models

### User
- User authentication and preferences
- Username, email, password (hashed)
- Theme preferences, notification settings

### ChatMessage
- Chat messages with AI responses
- Session management
- Response time and token tracking
- Context information

### SolarSystemData
- Solar system configurations
- Planet data and settings
- Animation and display preferences
- Version control

## Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration
- **JWT** authentication
- **Password hashing** with bcrypt
- **Input validation** with Joi

## Development

The server runs on port 3001 by default and includes:

- Hot reloading with nodemon in development
- Comprehensive error handling
- Request validation
- Logging and monitoring
- Health check endpoints

## Deployment

The backend is ready for deployment to platforms like:

- Heroku
- Railway
- DigitalOcean
- AWS
- Google Cloud Platform

Make sure to set the appropriate environment variables for production.