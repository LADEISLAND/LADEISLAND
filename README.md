# 🌌 AGI Cosmic - Full Stack Solar System Application

A comprehensive full-stack application featuring an interactive 3D solar system visualization with AI-powered chat functionality.

## 🚀 Features

### Frontend (React + Three.js)
- **3D Solar System Visualization**: Interactive 3D solar system with realistic planet models
- **Real-time Chat Interface**: AI-powered chat with Cosmos, your space guide
- **WebSocket Integration**: Real-time communication with typing indicators
- **Responsive Design**: Modern UI with cosmic theme
- **User Authentication**: Secure login/registration system

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive API for all application features
- **WebSocket Support**: Real-time chat and solar system updates
- **AI Integration**: OpenAI GPT integration with intelligent fallback responses
- **Database**: MongoDB for persistent data storage
- **Authentication**: JWT-based security with bcrypt password hashing
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Joi schema validation

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for Three.js
- **Socket.IO Client** - Real-time communication
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **Helmet** - Security middleware
- **OpenAI API** - AI service integration

## 📁 Project Structure

```
agi-cosmic/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API and socket services
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic services
│   │   ├── socket/         # WebSocket handlers
│   │   └── server.js       # Main server file
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

1. **Clone and setup**:
```bash
git clone <repository-url>
cd agi-cosmic
```

2. **Set environment variables**:
```bash
# Create .env file in root directory
echo "OPENAI_API_KEY=your-openai-api-key-here" > .env
```

3. **Start all services**:
```bash
docker-compose up -d
```

4. **Access the application**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- MongoDB: localhost:27017

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB** (if running locally):
```bash
mongod
```

5. **Start the backend server**:
```bash
# Development
npm run dev

# Production
npm start
```

#### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**:
```bash
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
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

#### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# App Configuration
VITE_APP_NAME=AGI Cosmic
VITE_APP_VERSION=1.0.0
```

## 📡 API Endpoints

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

## 🔌 WebSocket Events

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

## 🗄️ Database Models

### User
- Authentication and user preferences
- Username, email, password (hashed)
- Theme preferences, notification settings
- Last active timestamp

### ChatMessage
- Chat messages with AI responses
- Session management
- Response time and token tracking
- Context information (solar system state, user location)

### SolarSystemData
- Solar system configurations
- Planet data and settings
- Animation and display preferences
- Version control

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate limiting** - Prevent abuse
- **CORS** - Cross-origin resource sharing
- **JWT authentication** - Secure token-based auth
- **Password hashing** - bcrypt with salt
- **Input validation** - Joi schema validation
- **Environment variables** - Secure configuration

## 🚀 Deployment

### Docker Deployment
The application is containerized and ready for deployment:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Cloud Deployment
Ready for deployment on:
- **Heroku** - Easy deployment with add-ons
- **Railway** - Modern deployment platform
- **DigitalOcean** - Droplet deployment
- **AWS** - EC2, ECS, or Lambda
- **Google Cloud** - Cloud Run or Compute Engine

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks
- Jest for testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**ashfiai** - [GitHub](https://github.com/ashfiai) - [Email](mailto:raelei333@gmail.com)

## 🙏 Acknowledgments

- Three.js community for amazing 3D graphics
- React Three Fiber for React integration
- OpenAI for AI capabilities
- MongoDB for database solutions
- All open-source contributors

---

**🌌 Explore the cosmos with AGI Cosmic! 🚀**