from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime

from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.models.country import Country
from backend.app.schemas import CountryResponse, CountryUpdate, AICommand, AIResponse
from backend.app.routers.auth import get_current_user
from backend.app.utils.openai_client import CountryAI

router = APIRouter(prefix="/country", tags=["country"])

# Initialize AI client
country_ai = CountryAI()

def get_user_country(db: Session, user: User) -> Country:
    """Get the country associated with the current user"""
    country = db.query(Country).filter(Country.leader_id == user.id).first()
    if not country:
        raise HTTPException(
            status_code=404,
            detail="Country not found. Please contact support."
        )
    return country

@router.get("/", response_model=CountryResponse)
def get_my_country(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current user's country information"""
    country = get_user_country(db, current_user)
    return country

@router.put("/", response_model=CountryResponse)
def update_my_country(
    country_update: CountryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's country information"""
    country = get_user_country(db, current_user)
    
    # Update country fields
    update_data = country_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(country, field, value)
    
    country.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(country)
    
    return country

@router.post("/command", response_model=AIResponse)
def process_ai_command(
    command: AICommand,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process an AI command to manage the country"""
    country = get_user_country(db, current_user)
    
    try:
        # Get current country state as dict
        country_state = country.to_dict()
        
        # Process command with AI
        ai_response, ai_data = country_ai.process_command(
            command.command,
            country_state,
            country.leader_title
        )
        
        # Apply updates to country if any
        updates = ai_data.get("updates", {})
        if updates:
            for field, value in updates.items():
                if hasattr(country, field):
                    setattr(country, field, value)
            
            # Add event to historical events if provided
            event = ai_data.get("event", {})
            if event:
                if not country.historical_events:
                    country.historical_events = []
                
                event["timestamp"] = datetime.utcnow().isoformat()
                country.historical_events.append(event)
            
            # Add command to recent decisions
            if not country.recent_decisions:
                country.recent_decisions = []
            
            country.recent_decisions.append({
                "command": command.command,
                "timestamp": datetime.utcnow().isoformat(),
                "response": ai_response[:200] + "..." if len(ai_response) > 200 else ai_response
            })
            
            # Keep only last 10 decisions
            country.recent_decisions = country.recent_decisions[-10:]
            
            country.last_updated = datetime.utcnow()
            db.commit()
            db.refresh(country)
        
        return AIResponse(
            response=ai_response,
            country_updates=updates,
            success=True
        )
        
    except Exception as e:
        return AIResponse(
            response=f"Error processing command: {str(e)}",
            success=False,
            error=str(e)
        )

@router.get("/description")
def get_country_description(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get an AI-generated description of the country's current state"""
    country = get_user_country(db, current_user)
    
    try:
        description = country_ai.generate_country_description(country.to_dict())
        return {"description": description}
    except Exception as e:
        return {"description": f"A nation of {country.population:,} people awaits your leadership."}

@router.get("/stats")
def get_country_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get summarized country statistics"""
    country = get_user_country(db, current_user)
    
    return {
        "basic_info": {
            "name": country.name,
            "leader_title": country.leader_title,
            "population": country.population,
            "gdp": country.gdp,
            "territory_size": country.territory_size
        },
        "performance_indicators": {
            "happiness_index": country.happiness_index,
            "stability": country.stability,
            "tech_level": country.tech_level,
            "education_index": country.education_index,
            "infrastructure_quality": country.infrastructure_quality,
            "healthcare_quality": country.healthcare_quality
        },
        "economy": {
            "unemployment_rate": country.unemployment_rate,
            "inflation_rate": country.inflation_rate,
            "trade_balance": country.trade_balance
        },
        "military": {
            "military_strength": country.military_strength,
            "military_budget": country.military_budget
        },
        "resources": country.natural_resources,
        "recent_activity": {
            "recent_decisions": country.recent_decisions[-5:] if country.recent_decisions else [],
            "historical_events": country.historical_events[-5:] if country.historical_events else []
        }
    }