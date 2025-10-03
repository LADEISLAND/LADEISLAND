# 🚀 AGI Cosmic - Full Stack Application

A modern full-stack application featuring a 3D solar system visualization with AI-powered chat capabilities, built for aerospace and cosmic exploration enthusiasts.

## 🌟 Features

- **3D Solar System Visualization** - Interactive planetary system using Three.js
- **AI-Powered Chat** - Cosmic and aerospace-focused AI assistant
- **User Authentication** - Secure JWT-based authentication system
- **Real-time Communication** - Seamless frontend-backend integration
- **Responsive Design** - Modern UI with cosmic theming
- **Session Management** - Persistent chat sessions and user data

## 🏗️ Architecture

### Frontend
- **React 18** with modern hooks
- **Three.js & React Three Fiber** for 3D graphics
- **Vite** for fast development and building
- **CSS3** with modern styling and animations

### Backend
- **Node.js & Express** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure access
- **OpenAI Integration** (optional) for enhanced AI responses
- **Winston Logging** for comprehensive monitoring

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <repo-name>
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# Start MongoDB (if running locally)
mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application
Open your browser and go to `http://localhost:5173`

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ChatPanel.jsx    # AI chat interface
│   │   │   ├── SolarSystem.jsx  # 3D solar system
│   │   │   └── Planet.jsx       # Individual planet component
│   │   ├── services/        # API service layer
│   │   │   └── api.js           # Backend API integration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # App entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Main server file
│   ├── logs/                # Application logs
│   ├── package.json
│   └── .env                 # Environment variables
│
└── README.md                # This file
```

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agi-cosmic

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Integration (Optional)
OPENAI_API_KEY=your-openai-api-key-here
AI_MODEL=gpt-3.5-turbo

# CORS
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat System
- `POST /api/chat/sessions` - Create chat session
- `POST /api/chat/sessions/:id/messages` - Send message
- `GET /api/chat/sessions/:id` - Get chat history

### User Management
- `GET /api/users/stats` - User statistics
- `GET /api/users/chat-history` - Chat history

## 🎮 Usage

1. **Explore the Solar System**: Use mouse controls to navigate the 3D space
   - **Rotate**: Left click + drag
   - **Zoom**: Scroll wheel
   - **Pan**: Right click + drag

2. **Chat with AI**: Use the chat panel on the right
   - Ask questions about space, aerospace, or cosmic phenomena
   - Get specialized responses based on context
   - Sessions are automatically saved

3. **User Features** (when authenticated):
   - Persistent chat history
   - User statistics
   - Profile management

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Secure HTTP headers with Helmet

## 🤖 AI Integration

The application supports OpenAI integration for enhanced AI responses:

- **With API Key**: Full GPT-powered responses
- **Without API Key**: Intelligent fallback responses
- **Context Awareness**: Specialized responses for aerospace topics
- **Session Memory**: Maintains conversation context

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
npm run lint   # Run ESLint
```

## 📦 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variable: `VITE_API_URL`

### Backend (Railway/Heroku/DigitalOcean)
1. Set all environment variables
2. Ensure MongoDB is accessible
3. Deploy with: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for 3D graphics capabilities
- React Three Fiber for React integration
- OpenAI for AI capabilities
- MongoDB for database solutions

## 📞 Support

For support, email raelei333@gmail.com or visit [ashfiagi.com](https://www.ashfiagi.com)

---

**Built with ❤️ for space exploration and aerospace technology enthusiasts**