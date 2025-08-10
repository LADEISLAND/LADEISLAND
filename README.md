# AGI Cosmic 🌌

An AI-powered virtual country management platform where users become leaders of their own nations, making decisions through natural language commands interpreted by GPT AI.

## Features

### 🎮 Core Gameplay
- **Virtual Country Management**: Control population, economy, military, technology, and more
- **AI-Powered Commands**: Use natural language to give commands to your nation
- **Real-time Updates**: Watch your country's statistics change based on your decisions
- **Multiple Leader Roles**: Choose to be a President, Scientist, King, or other leader types

### 🏛️ Country Systems
- **Economy**: GDP, unemployment, inflation, trade balance
- **Military**: Strength, budget, diplomatic consequences
- **Technology**: Research level, education index
- **Infrastructure**: Quality of healthcare, transportation
- **Resources**: Natural resources (oil, minerals, water, forests, farmland)
- **Government**: Stability, corruption index, government type
- **Population**: Happiness index, population growth

### 🔐 Authentication & Security
- User registration and login
- JWT-based session management
- Secure password hashing with bcrypt
- Persistent user sessions

### 💬 Interactive Chat Interface
- Chat-style command input
- AI responses with detailed explanations
- Real-time country updates
- Command history and recent decisions

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for Python
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Database for development (easily scalable to PostgreSQL)
- **OpenAI GPT**: AI-powered natural language processing
- **Pydantic**: Data validation and settings management
- **JWT**: Secure authentication tokens
- **bcrypt**: Password hashing

### Frontend
- **React**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Styled Components**: CSS-in-JS styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agi-cosmic
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   SECRET_KEY=your_secret_key_for_jwt_here
   ```

4. **Start the backend server**
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## Usage

### Getting Started

1. **Register an Account**
   - Navigate to `http://localhost:3000`
   - Click "Register here" to create a new account
   - Choose a username, email, and password

2. **Create Your Nation**
   - Upon registration, a default country is automatically created
   - You'll be assigned the title "President" (this can be changed later)

3. **Start Managing Your Country**
   - Use the chat interface to give commands in natural language
   - Examples:
     - "Increase military spending by 20%"
     - "Build new schools to improve education"
     - "Negotiate trade deals with neighboring countries"
     - "Launch a space program"
     - "Reduce unemployment through job creation programs"

### Example Commands

Here are some example commands you can try:

**Economic Commands:**
- "Reduce taxes to stimulate economic growth"
- "Invest in renewable energy infrastructure"
- "Create a universal basic income program"

**Military Commands:**
- "Increase military recruitment"
- "Develop new defense technologies"
- "Form an alliance with democratic nations"

**Social Commands:**
- "Improve healthcare system quality"
- "Launch an anti-corruption campaign"
- "Increase funding for scientific research"

**Infrastructure Commands:**
- "Build high-speed rail networks"
- "Modernize the telecommunications infrastructure"
- "Develop smart city initiatives"

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/token` - Get access token
- `GET /auth/me` - Get current user info

### Country Management
- `GET /country/` - Get user's country information
- `PUT /country/` - Update country information
- `POST /country/command` - Process AI command
- `GET /country/description` - Get AI-generated country description
- `GET /country/stats` - Get country statistics

## Architecture

### Backend Architecture
```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── schemas.py           # Pydantic models
│   ├── database/
│   │   └── database.py      # Database configuration
│   ├── models/
│   │   ├── user.py          # User database model
│   │   └── country.py       # Country database model
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   └── country.py       # Country management endpoints
│   └── utils/
│       ├── auth.py          # Authentication utilities
│       └── openai_client.py # OpenAI integration
```

### Frontend Architecture
```
frontend/src/
├── components/
│   ├── Login.tsx            # Login form
│   ├── Register.tsx         # Registration form
│   └── Dashboard.tsx        # Main application interface
├── context/
│   └── AuthContext.tsx      # Authentication state management
├── services/
│   └── api.ts               # API communication layer
├── types/
│   └── index.ts             # TypeScript type definitions
└── App.tsx                  # Main application component
```

## Scaling & Production

### Database Migration
For production, migrate from SQLite to PostgreSQL:

1. Install PostgreSQL dependencies:
   ```bash
   pip install psycopg2-binary
   ```

2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://username:password@localhost/agi_cosmic
   ```

### Security Enhancements
- Use environment-specific secret keys
- Implement rate limiting
- Add HTTPS in production
- Use a reverse proxy (nginx)

### Deployment
- Use Docker for containerization
- Deploy on cloud platforms (AWS, GCP, Azure)
- Use CI/CD for automated deployments
- Implement monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

### Planned Features
- **Multi-agent Interactions**: Countries can interact with each other
- **Economic Simulation**: More complex economic modeling
- **Visual Dashboard**: Charts and graphs for country statistics
- **Historical Analysis**: Detailed country history and decision tracking
- **Mobile App**: React Native mobile application
- **Multiplayer Events**: Global events affecting all countries
- **Custom Scenarios**: Pre-built crisis scenarios and challenges

### Monetization Ideas
- **Premium Subscriptions**: Advanced AI features and faster processing
- **Educational Licenses**: Classroom and university versions
- **Custom Scenarios**: Paid historical or fictional scenarios
- **Analytics Dashboard**: Advanced country performance analytics
- **API Access**: Third-party integrations and custom applications

## Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**AGI Cosmic** - Where artificial intelligence meets global leadership. Build your nation, make your mark on history! 🌍👑


