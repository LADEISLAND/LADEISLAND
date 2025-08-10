# AGI Cosmic - Deployment Guide

## Quick Start

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- OpenAI API key

### Setup Instructions

1. **Clone and Setup**
   ```bash
   git clone <your-repo-url>
   cd agi-cosmic
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env file and add your OpenAI API key
   ```

3. **Install Dependencies**
   ```bash
   # Backend dependencies (may require --break-system-packages flag)
   pip3 install fastapi uvicorn sqlalchemy python-dotenv openai python-jose passlib bcrypt python-multipart email-validator
   
   # Frontend dependencies
   cd frontend
   npm install
   cd ..
   ```

4. **Start the Application**
   
   **Option 1: Using startup scripts**
   ```bash
   # Terminal 1 - Backend
   ./start_backend.sh
   
   # Terminal 2 - Frontend
   ./start_frontend.sh
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   export PATH=$PATH:/home/ubuntu/.local/bin
   uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Environment Variables
Required environment variables in `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_for_jwt_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./agi_cosmic.db
```

## Production Deployment

### Docker Deployment
1. Create Dockerfile for backend
2. Create docker-compose.yml for both services
3. Use PostgreSQL instead of SQLite
4. Set up reverse proxy (nginx)
5. Enable HTTPS with SSL certificates

### Cloud Deployment Options
- **Backend**: Deploy on AWS ECS, Google Cloud Run, or Heroku
- **Frontend**: Deploy on Vercel, Netlify, or AWS S3 + CloudFront
- **Database**: Use managed PostgreSQL (AWS RDS, Google Cloud SQL)

### Security Considerations
- Change JWT secret keys for production
- Use environment-specific configurations
- Enable CORS only for allowed domains
- Implement rate limiting
- Use HTTPS in production
- Regular security updates

## Troubleshooting

### Common Issues
1. **Python Dependencies**: Use `--break-system-packages` flag if needed
2. **Missing email-validator**: Run `pip install email-validator`
3. **Path Issues**: Ensure `/home/ubuntu/.local/bin` is in PATH
4. **OpenAI API**: Verify API key is correct and has credits
5. **CORS Errors**: Check frontend URL is in CORS allowed origins

### Development Tips
- Backend auto-reloads on file changes with `--reload` flag
- Frontend hot-reloads automatically with React dev server
- Check backend logs for API errors
- Use browser dev tools for frontend debugging