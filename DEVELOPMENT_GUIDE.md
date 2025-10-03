# 🚀 AGI Cosmic - Complete Development Guide

This comprehensive guide will walk you through developing the entire AGI Cosmic full-stack application from scratch.

## 📋 Table of Contents

1. [Prerequisites & Setup](#prerequisites--setup)
2. [Project Architecture](#project-architecture)
3. [Development Environment](#development-environment)
4. [Backend Development](#backend-development)
5. [Frontend Development](#frontend-development)
6. [Integration & Testing](#integration--testing)
7. [Deployment](#deployment)
8. [Best Practices](#best-practices)

## 🛠️ Prerequisites & Setup

### System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **MongoDB**: v5.0 or higher (local or cloud)
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) with extensions

### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "ms-vscode.vscode-eslint",
    "ms-vscode.vscode-prettier",
    "mongodb.mongodb-vscode",
    "ms-vscode.vscode-thunder-client"
  ]
}
```

### Initial Setup
```bash
# Create project directory
mkdir agi-cosmic-fullstack
cd agi-cosmic-fullstack

# Initialize git repository
git init
git branch -M main

# Create basic project structure
mkdir frontend backend docs assets
```

## 🏗️ Project Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18 with Vite
- **3D Graphics**: Three.js + React Three Fiber
- **Styling**: CSS3 with modern features
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Fetch API with custom service layer

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: OpenAI API (optional)
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

#### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Development**: Nodemon, Vite HMR
- **Testing**: Jest (backend), Vitest (frontend)
- **Linting**: ESLint
- **Formatting**: Prettier

### Application Flow
```
User Browser → Frontend (React/Three.js) → API Layer → Backend (Express) → Database (MongoDB)
                    ↓                                      ↓
              3D Solar System                        AI Chat Service
              Chat Interface                         User Management
```

## 💻 Development Environment

### 1. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Or manually start
mongod --config /usr/local/etc/mongod.conf
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string
4. Whitelist your IP address

### 2. Environment Configuration

Create environment files:

**backend/.env**
```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agi-cosmic
# Or for Atlas: mongodb+srv://username:password@cluster.mongodb.net/agi-cosmic

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# AI Integration (Optional)
OPENAI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

**frontend/.env**
```env
VITE_API_URL=http://localhost:3001/api
```

## 🔧 Backend Development

### 1. Initialize Backend Project
```bash
cd backend

# Initialize npm project
npm init -y

# Install production dependencies
npm install express cors helmet morgan dotenv mongoose bcryptjs jsonwebtoken express-rate-limit express-validator axios winston compression

# Install development dependencies
npm install -D nodemon jest supertest eslint eslint-config-node
```

### 2. Project Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── logger.js        # Winston configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── chatController.js    # Chat/AI functionality
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js          # JWT middleware
│   │   ├── errorHandler.js  # Error handling
│   │   └── validation.js    # Input validation
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── ChatSession.js   # Chat session schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── chatRoutes.js    # Chat endpoints
│   │   └── userRoutes.js    # User endpoints
│   ├── services/
│   │   ├── aiService.js     # AI integration
│   │   └── emailService.js  # Email notifications
│   ├── utils/
│   │   ├── helpers.js       # Utility functions
│   │   └── constants.js     # App constants
│   └── server.js            # Main server file
├── tests/
│   ├── auth.test.js
│   ├── chat.test.js
│   └── setup.js
├── logs/
├── .env
├── .env.example
├── .gitignore
└── package.json
```

### 3. Core Development Steps

#### Step 1: Database Configuration
```javascript
// src/config/database.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### Step 2: User Model
```javascript
// src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [/^\w+@\w+\.\w{2,3}$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  // ... additional fields
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// JWT token generation
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

module.exports = mongoose.model('User', UserSchema);
```

#### Step 3: Authentication Controller
```javascript
// src/controllers/authController.js
const User = require('../models/User');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'User already exists' 
      });
    }

    // Create user
    const user = await User.create({ username, email, password });
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      data: { id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { register, /* other methods */ };
```

### 4. Development Scripts
```json
// package.json scripts
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  }
}
```

## 🎨 Frontend Development

### 1. Initialize Frontend Project
```bash
cd frontend

# Create Vite React project
npm create vite@latest . -- --template react

# Install additional dependencies
npm install three @react-three/fiber @react-three/drei

# Install development dependencies
npm install -D @vitejs/plugin-react
```

### 2. Project Structure
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageInput.jsx
│   │   └── 3d/
│   │       ├── SolarSystem.jsx
│   │       ├── Planet.jsx
│   │       └── Controls.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── storage.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   └── useLocalStorage.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ChatContext.jsx
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── package.json
└── vite.config.js
```

### 3. Core Development Steps

#### Step 1: API Service Layer
```javascript
// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL;
    this.token = localStorage.getItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth methods
  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Chat methods
  async sendMessage(sessionId, message) {
    return this.request(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }
}

export default new ApiService();
```

#### Step 2: 3D Solar System Component
```javascript
// src/components/3d/SolarSystem.jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Planet from './Planet';

const planets = [
  { name: 'Mercury', color: '#8c7853', size: 0.38, distance: 12 },
  { name: 'Venus', color: '#ffc649', size: 0.95, distance: 18 },
  { name: 'Earth', color: '#6b93d6', size: 1.0, distance: 25 },
  // ... more planets
];

export function SolarSystem() {
  return (
    <Canvas camera={{ position: [0, 40, 120], fov: 60 }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={1.5} />
      
      <Suspense fallback={null}>
        <Stars radius={300} depth={60} count={10000} factor={7} />
        {planets.map((planet) => (
          <Planet key={planet.name} {...planet} />
        ))}
      </Suspense>
      
      <OrbitControls enablePan enableZoom enableRotate />
    </Canvas>
  );
}
```

#### Step 3: Chat Component with Backend Integration
```javascript
// src/components/chat/ChatPanel.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

export default function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    try {
      const response = await apiService.createChatSession();
      setSessionId(response.data.sessionId);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await apiService.sendMessage(sessionId, userMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.message 
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: 'Sorry, there was an error processing your message.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-panel">
      {/* Chat UI implementation */}
    </div>
  );
}
```

## 🧪 Integration & Testing

### 1. Backend Testing Setup
```bash
cd backend
npm install -D jest supertest mongodb-memory-server
```

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

### 2. Frontend Testing Setup
```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 3. Integration Testing
Create end-to-end tests to ensure frontend and backend work together:

```javascript
// tests/integration/chat.test.js
describe('Chat Integration', () => {
  test('should create session and send message', async () => {
    // Test full chat flow
  });
});
```

## 🚀 Deployment

### 1. Production Environment Setup

#### Backend Deployment (Railway/Heroku)
```bash
# Build and deploy backend
npm run build
npm start
```

#### Frontend Deployment (Vercel/Netlify)
```bash
# Build frontend
npm run build

# Deploy dist folder
```

### 2. Environment Variables for Production
Update all environment variables for production:
- Use production MongoDB URI
- Set strong JWT secrets
- Configure proper CORS origins
- Set up logging and monitoring

### 3. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and test
        run: |
          cd backend && npm install && npm test
          cd ../frontend && npm install && npm run build
      - name: Deploy
        # Add deployment steps
```

## 📚 Best Practices

### 1. Code Organization
- Use consistent file naming conventions
- Implement proper error handling
- Write comprehensive comments
- Follow REST API conventions

### 2. Security
- Never commit sensitive data
- Use environment variables
- Implement proper validation
- Use HTTPS in production

### 3. Performance
- Implement caching strategies
- Optimize database queries
- Use compression middleware
- Implement proper logging

### 4. Development Workflow
```bash
# Daily development workflow
git pull origin main
npm run dev  # Start both frontend and backend
# Make changes
npm test     # Run tests
git add .
git commit -m "feat: add new feature"
git push origin feature-branch
# Create pull request
```

## 🎯 Next Steps

1. **Complete the basic setup** following this guide
2. **Implement core features** (auth, chat, 3D visualization)
3. **Add advanced features** (user profiles, chat history, AI contexts)
4. **Implement testing** (unit, integration, e2e)
5. **Deploy to production** (staging first, then production)
6. **Monitor and iterate** (analytics, user feedback, improvements)

This guide provides a complete roadmap for developing your AGI Cosmic full-stack application. Follow each section step by step, and you'll have a production-ready application!