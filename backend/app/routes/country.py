from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..models.database import get_db
from ..models.user import User
from ..models.country import Country
from ..schemas.country import CountryCreate, Country as CountrySchema, CommandRequest, CommandResponse
from ..services.auth import get_current_active_user
from ..services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/", response_model=CountrySchema)
def create_country(
    country: CountryCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new virtual country for the current user."""
    # Check if user already has a country
    existing_country = db.query(Country).filter(Country.user_id == current_user.id).first()
    if existing_country:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has a country"
        )
    
    # Generate country name if not provided
    if not country.name:
        country.name = ai_service.generate_country_name(country.leader_title)
    
    # Create new country with default values
    db_country = Country(
        user_id=current_user.id,
        name=country.name,
        leader_title=country.leader_title,
        population=1000,
        military_strength=100,
        economy_score=50.0,
        technology_level=1,
        resources={"gold": 1000, "food": 500, "materials": 200},
        alliances=[],
        military_system={"army_size": 100, "navy_size": 0, "air_force": 0},
        trade_system={"trade_routes": [], "exports": [], "imports": []},
        citizen_system={"happiness": 70, "education": 50, "health": 60},
        government_system={"stability": 80, "corruption": 10, "efficiency": 60},
        history=[],
        current_events=[]
    )
    
    db.add(db_country)
    db.commit()
    db.refresh(db_country)
    
    return db_country

@router.get("/", response_model=CountrySchema)
def get_country(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the current user's country."""
    country = db.query(Country).filter(Country.user_id == current_user.id).first()
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Country not found"
        )
    return country

@router.post("/command", response_model=CommandResponse)
def process_command(
    command_request: CommandRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Process a natural language command for the user's country."""
    # Get user's country
    country = db.query(Country).filter(Country.user_id == current_user.id).first()
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Country not found"
        )
    
    # Process command with AI
    response_text, updates, events = ai_service.process_command(command_request.command, country)
    
    # Apply updates to country
    update_data = updates.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(country, field, value)
    
    # Add events to history
    if events:
        country.current_events.extend(events)
        # Keep only last 10 events
        country.current_events = country.current_events[-10:]
    
    # Add command to history
    history_entry = {
        "timestamp": "2024-01-01T12:00:00Z",  # In production, use actual timestamp
        "command": command_request.command,
        "response": response_text,
        "effects": update_data
    }
    country.history.append(history_entry)
    
    db.commit()
    db.refresh(country)
    
    return CommandResponse(
        response=response_text,
        country_state=country,
        events=events
    )

@router.get("/history")
def get_country_history(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get the history of commands and events for the user's country."""
    country = db.query(Country).filter(Country.user_id == current_user.id).first()
    if not country:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Country not found"
        )
    
    return {
        "history": country.history,
        "current_events": country.current_events
    }