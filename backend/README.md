# AGI Cosmic Backend

A Node.js/Express backend API for the AGI Cosmic full-stack application, featuring AI-powered chat, user authentication, and aerospace-focused content.

## Features

- 🚀 **RESTful API** with Express.js
- 🤖 **AI Chat Integration** with OpenAI GPT (optional)
- 🔐 **JWT Authentication** with user management
- 📊 **MongoDB Database** with Mongoose ODM
- 🛡️ **Security Features** (Helmet, CORS, Rate Limiting)
- 📝 **Comprehensive Logging** with Winston
- 🌌 **Aerospace/Cosmic Context** specialized responses

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Optional: OpenAI API key for enhanced AI responses

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT tokens
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key
   - Other settings as needed

3. **Start MongoDB:**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/deactivate` - Deactivate account

### Chat
- `POST /api/chat/sessions` - Create new chat session
- `POST /api/chat/sessions/:sessionId/messages` - Send message
- `GET /api/chat/sessions/:sessionId` - Get chat session
- `GET /api/chat/sessions` - Get user's chat sessions (auth required)
- `DELETE /api/chat/sessions/:sessionId` - Delete chat session (auth required)

### Users
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/chat-history` - Get chat history
- `GET /api/users/export` - Export user data
- `DELETE /api/users/delete-data` - Delete all user data

### Health Check
- `GET /health` - Server health status

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # MongoDB connection
│   │   └── logger.js        # Winston logger setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── chatController.js    # Chat/AI logic
│   │   └── userController.js    # User management
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   └── errorHandler.js  # Global error handling
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── ChatSession.js   # Chat session schema
│   ├── routes/
│   │   ├── authRoutes.js    # Auth endpoints
│   │   ├── chatRoutes.js    # Chat endpoints
│   │   └── userRoutes.js    # User endpoints
│   └── server.js            # Main server file
├── logs/                    # Application logs
├── .env                     # Environment variables
├── .env.example            # Environment template
└── package.json            # Dependencies and scripts
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/agi-cosmic |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `OPENAI_API_KEY` | OpenAI API key (optional) | - |
| `AI_MODEL` | AI model to use | gpt-3.5-turbo |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `LOG_LEVEL` | Logging level | info |

## Features in Detail

### AI Chat System
- Context-aware responses for aerospace/cosmic topics
- Session management with message history
- Fallback responses when OpenAI API is unavailable
- Multiple conversation contexts (cosmic, aerospace, AI, technical, general)

### User Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- User profile management
- Account deactivation/deletion

### Database Models
- **User**: Authentication, profile, preferences
- **ChatSession**: Conversation history, AI responses, metadata

### Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- Error handling

## Development

### Scripts
- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

### Adding New Features
1. Create controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Update models if needed in `src/models/`
4. Add middleware if required in `src/middleware/`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - Verify network connectivity

2. **JWT Token Issues**
   - Ensure `JWT_SECRET` is set in `.env`
   - Check token expiration settings

3. **CORS Errors**
   - Verify `FRONTEND_URL` matches your frontend URL
   - Check CORS configuration in `server.js`

4. **OpenAI API Errors**
   - Verify `OPENAI_API_KEY` is correct
   - Check API quota and billing
   - Fallback responses will be used if API fails

## License

MIT License - see LICENSE file for details.