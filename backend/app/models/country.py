from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Country(Base):
    __tablename__ = "countries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    leader_title = Column(String, nullable=False)  # e.g., "President", "Scientist", "Emperor"
    
    # Country stats
    population = Column(Integer, default=1000)
    military_strength = Column(Integer, default=100)
    economy_score = Column(Float, default=50.0)
    technology_level = Column(Integer, default=1)
    resources = Column(JSON, default=dict)  # Store resources as JSON
    alliances = Column(JSON, default=list)  # Store alliances as JSON
    
    # Systems
    military_system = Column(JSON, default=dict)
    trade_system = Column(JSON, default=dict)
    citizen_system = Column(JSON, default=dict)
    government_system = Column(JSON, default=dict)
    
    # History and events
    history = Column(JSON, default=list)  # Store historical events
    current_events = Column(JSON, default=list)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="country")