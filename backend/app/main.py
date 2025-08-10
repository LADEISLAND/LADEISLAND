from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.database import engine, Base
from backend.app.routers import auth, country

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AGI Cosmic API",
    description="AI-powered virtual country management platform",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(country.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to AGI Cosmic - AI-powered virtual country management platform",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)